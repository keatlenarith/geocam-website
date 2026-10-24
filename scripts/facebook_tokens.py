"""Facebook token management. Secrets are never printed or included in errors."""
from __future__ import annotations

import argparse
import getpass
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests
from dotenv import load_dotenv


class TokenError(RuntimeError):
    """A sanitized configuration, transport, or Graph API error."""


class FacebookTokenManager:
    REQUIRED_SCOPES = {"pages_show_list", "pages_read_engagement", "pages_manage_posts"}

    def __init__(self, app_id: str, app_secret: str, page_id: str | None = None,
                 version: str = "v25.0", session=None):
        if not app_id or not app_secret:
            raise TokenError("Set FB_APP_ID and FB_APP_SECRET in your environment file.")
        if not re.fullmatch(r"v\d+\.\d+", version):
            raise TokenError("API version must look like v25.0.")
        self.app_id, self.app_secret, self.page_id = app_id, app_secret, page_id
        self.base_url = f"https://graph.facebook.com/{version}"
        self.session = session or requests.Session()
        self.tokens = {}

    def _get(self, endpoint, params=None, bearer=None):
        try:
            response = self.session.get(
                f"{self.base_url}/{endpoint.lstrip('/')}", params=params or {},
                headers={"Authorization": f"Bearer {bearer}"} if bearer else {},
                timeout=(10, 45), allow_redirects=False,
            )
        except requests.RequestException:
            raise TokenError("Graph API connection failed. Check network access and retry.") from None
        try:
            data = response.json()
        except ValueError:
            raise TokenError(f"Graph API returned non-JSON content (HTTP {response.status_code}).") from None
        if not isinstance(data, dict):
            raise TokenError("Graph API returned an unexpected response.")
        if not response.ok or response.is_redirect or data.get("error"):
            error = data.get("error") or {}
            code = error.get("code")
            if code == 190:
                detail = "Invalid or expired token, or invalid app credentials. Generate a new user token for this app."
            elif code in (10, 200, 294):
                detail = "Permission denied. Check Page tasks, app access/review, and pages_show_list, pages_read_engagement, pages_manage_posts."
            elif code in (4, 17, 32, 613):
                detail = "Rate limit reached. Wait before retrying."
            elif code == 101:
                detail = "Invalid app credentials. Check FB_APP_ID and FB_APP_SECRET."
            else:
                detail = "Request rejected. Check app credentials, permissions, and API version."
            # Do not echo Meta messages: they may contain submitted credentials.
            raise TokenError(f"{detail} (HTTP {response.status_code}, code {code})")
        return data

    def inspect_token(self, token):
        """Return Meta's validity, expiry, scopes and granular Page grants."""
        result = self._get("debug_token", {"input_token": token},
                           bearer=f"{self.app_id}|{self.app_secret}")
        data = result.get("data")
        if not isinstance(data, dict):
            raise TokenError("Token inspection returned no metadata.")
        return data

    def _validate(self, metadata, token_type=None, check_scopes=False):
        if not metadata.get("is_valid"):
            raise TokenError("Token is invalid or expired. Generate a new user token in Graph API Explorer.")
        if str(metadata.get("app_id")) != str(self.app_id):
            raise TokenError("Token belongs to a different Meta app.")
        if token_type and metadata.get("type") != token_type:
            raise TokenError(f"Expected a {token_type} token.")
        for key in ("expires_at", "data_access_expires_at"):
            expiration = metadata.get(key)
            if expiration and expiration <= time.time():
                raise TokenError(f"Token {key} has expired. Reauthorize the app.")
        if check_scopes:
            missing = self.REQUIRED_SCOPES - set(metadata.get("scopes", []))
            if missing:
                raise TokenError("Reauthorize with missing permissions: " + ", ".join(sorted(missing)))

    def exchange_for_long_lived_user_token(self, short_token):
        """Exchange a user token; use expires_in returned by Meta, not a fixed TTL."""
        result = self._get("oauth/access_token", {
            "grant_type": "fb_exchange_token", "client_id": self.app_id,
            "client_secret": self.app_secret, "fb_exchange_token": short_token,
        })
        if not result.get("access_token"):
            raise TokenError("Meta did not return a long-lived user token.")
        self.tokens["user"] = result
        return result["access_token"]

    def get_page_access_tokens(self, long_lived_user_token):
        """Fetch all Pages, following cursors without trusting paging URLs."""
        pages, seen = [], set()
        params = {"fields": "id,name,access_token,tasks", "limit": 100}
        while True:
            result = self._get("me/accounts", params, bearer=long_lived_user_token)
            batch = result.get("data")
            if not isinstance(batch, list):
                raise TokenError("Page listing returned an unexpected response.")
            for page in batch:
                if self.page_id and str(page.get("id")) != self.page_id:
                    continue
                if not page.get("access_token"):
                    raise TokenError("A Page has no access token. Check Page permissions and tasks.")
                metadata = self.inspect_token(page["access_token"])
                self._validate(metadata, token_type="PAGE", check_scopes=True)
                if metadata.get("profile_id") and str(metadata["profile_id"]) != str(page["id"]):
                    raise TokenError("Returned Page token does not match the requested Page.")
                pages.append({**page, "inspection": metadata,
                              "no_scheduled_expiration": metadata.get("expires_at") == 0})
            paging = result.get("paging") or {}
            if not paging.get("next"):
                break
            cursor = (paging.get("cursors") or {}).get("after")
            if not cursor or cursor in seen:
                raise TokenError("Page pagination returned a missing or repeated cursor.")
            seen.add(cursor)
            params = {**params, "after": cursor}
        if not pages:
            raise TokenError("No matching Pages found. Check FB_PAGE_ID, Page access, and pages_show_list grants.")
        self.tokens["pages"] = pages
        return pages

    def run(self, short_token):
        self.tokens = {}
        initial = self.inspect_token(short_token)
        self._validate(initial, token_type="USER", check_scopes=True)
        token = self.exchange_for_long_lived_user_token(short_token)
        metadata = self.inspect_token(token)
        self._validate(metadata, token_type="USER", check_scopes=True)
        self.tokens["user"]["inspection"] = metadata
        self.get_page_access_tokens(token)
        self.tokens["generated_at"] = datetime.now(timezone.utc).isoformat()
        return self.tokens

    def save_tokens(self, filepath):
        """Create a new private output file; refuse overwrites and symlinks.

        POSIX: mode 0600. Windows: inherits directory ACLs; use a private folder.
        App secret and original short-lived token are never exported.
        """
        if not self.tokens.get("pages") or not self.tokens.get("user"):
            raise TokenError("Run the conversion pipeline before saving tokens.")
        path = Path(filepath)
        if path.suffix == ".json":
            content = json.dumps(self.tokens, indent=2) + "\n"
        elif path.name.endswith(".env.local"):
            values = {"FB_LONG_LIVED_USER_ACCESS_TOKEN": self.tokens["user"]["access_token"]}
            for page in self.tokens["pages"]:
                if not str(page["id"]).isdigit():
                    raise TokenError("Cannot export a Page with an invalid ID.")
                values[f"FB_PAGE_{page['id']}_ACCESS_TOKEN"] = page["access_token"]
            if len(self.tokens["pages"]) == 1:
                page = self.tokens["pages"][0]
                values.update(FB_PAGE_ID=page["id"], FB_PAGE_ACCESS_TOKEN=page["access_token"])
            values["FB_TOKEN_METADATA_JSON"] = json.dumps(self.tokens_metadata(), separators=(",", ":"))
            def quote(value):
                return "'" + str(value).replace("\\", "\\\\").replace("'", "\\'") + "'"
            content = "\n".join(f"{key}={quote(value)}" for key, value in values.items()) + "\n"
        else:
            raise TokenError("Output must be .json or end with .env.local.")
        try:
            fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
            with os.fdopen(fd, "w", encoding="utf-8") as stream:
                stream.write(content)
        except FileExistsError:
            raise TokenError("Output already exists; choose a new filename to avoid overwriting secrets.") from None
        except OSError:
            raise TokenError("Could not save output. Check the destination directory and permissions.") from None
        return path

    def tokens_metadata(self):
        return {"generated_at": self.tokens.get("generated_at"),
                "user": self.tokens["user"].get("inspection"),
                "pages": [{k: v for k, v in page.items() if k != "access_token"}
                          for page in self.tokens["pages"]]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--env-file", default=".env")
    parser.add_argument("--output", default=".facebook-tokens.env.local")
    parser.add_argument("--page-id", help="Overrides FB_PAGE_ID; omit both to fetch all Pages")
    parser.add_argument("--api-version", default=None, help="Overrides FB_GRAPH_API_VERSION (default v25.0)")
    parser.add_argument("--prompt", action="store_true", help="Paste a token using a hidden prompt")
    args = parser.parse_args()
    load_dotenv(args.env_file, override=False)
    try:
        manager = FacebookTokenManager(os.getenv("FB_APP_ID", ""), os.getenv("FB_APP_SECRET", ""),
                                       args.page_id or os.getenv("FB_PAGE_ID"),
                                       args.api_version or os.getenv("FB_GRAPH_API_VERSION", "v25.0"))
        short_token = "" if args.prompt else os.getenv("FB_USER_ACCESS_TOKEN", "").strip()
        if not short_token:
            if not sys.stdin.isatty():
                raise TokenError("Set FB_USER_ACCESS_TOKEN in the environment, or run from an interactive terminal.")
            short_token = getpass.getpass("Short-lived Facebook user token (hidden): ").strip()
        if not short_token:
            raise TokenError("A user token is required.")
        manager.run(short_token)
        saved = manager.save_tokens(args.output)
        print(f"Saved tokens for {len(manager.tokens['pages'])} Page(s) to {saved}.")
        print("Page tokens may have no scheduled expiry but remain revocable. No posts were published.")
        return 0
    except TokenError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    except (KeyboardInterrupt, EOFError):
        print("Cancelled.", file=sys.stderr)
        return 130


if __name__ == "__main__":
    raise SystemExit(main())
