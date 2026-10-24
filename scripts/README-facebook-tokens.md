# Facebook token CLI

From the website directory in PowerShell:

```powershell
python -m venv .facebook-token-venv
.\.facebook-token-venv\Scripts\python.exe -m pip install -r scripts/requirements-facebook.txt
Copy-Item scripts/facebook-tokens.env.example .env.facebook
```

Edit `.env.facebook` privately with your Meta app ID and secret. Add the initial
user token there, or leave it empty and use the hidden prompt:

```powershell
.\.facebook-token-venv\Scripts\python.exe scripts/facebook_tokens.py --env-file .env.facebook --prompt
```

Omit `--prompt` to read `FB_USER_ACCESS_TOKEN` from the environment file. Existing
process environment variables take precedence. Set `FB_PAGE_ID` to select a Page,
or remove it to retrieve all authorized Pages. The template selects GeoCam.
Use `--output .facebook-tokens.json` for JSON with all metadata, or the default
`.facebook-tokens.env.local` for environment variables plus metadata JSON.
Output must not already exist. Custom JSON filenames must also be added to your
ignore rules; never commit an output file.

The user token must belong to the configured app and grant `pages_show_list`,
`pages_read_engagement`, and `pages_manage_posts`. Page access, granted Page
targets, app mode and any required review also affect what Meta returns.
The CLI cannot grant missing permissions or generate the initial login token.

User token lifetime is taken from Meta's response rather than assumed to be
exactly 60 days. Each returned Page token is inspected. `expires_at: 0` means
no scheduled token expiry, not immunity from revocation or data access limits.
The API version defaults to v25.0 and is configurable through
`FB_GRAPH_API_VERSION` or `--api-version`.

Files use exclusive creation and POSIX mode 0600. Windows uses inherited folder
ACLs: save inside a private user directory. Exports are plaintext credentials.
App secrets and original short-lived tokens are never exported. Do not enable
HTTP wire logging: OAuth GET request query strings contain credentials.

This CLI only obtains and saves tokens. It does not configure Vercel, save a token
in browser storage, or publish a test post. A single-Page env export provides
`FB_PAGE_ACCESS_TOKEN` and `FB_PAGE_ID` for server configuration.

Offline checks:

```powershell
.\.facebook-token-venv\Scripts\python.exe -m unittest discover -s scripts -p test_facebook_tokens.py -v
```

Meta references:
- https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived/
- https://developers.facebook.com/docs/graph-api/reference/debug_token/
- https://developers.facebook.com/docs/graph-api/reference/user/accounts/
