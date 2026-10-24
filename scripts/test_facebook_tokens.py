import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock

import requests
from dotenv import dotenv_values
from facebook_tokens import FacebookTokenManager, TokenError


class TokenTests(unittest.TestCase):
    def setUp(self):
        self.manager = FacebookTokenManager("123", "secret")

    def metadata(self, kind="USER"):
        return {"is_valid": True, "app_id": "123", "type": kind, "expires_at": 0,
                "scopes": sorted(self.manager.REQUIRED_SCOPES)}

    def test_pipeline_and_exports(self):
        self.manager._get = Mock(side_effect=[
            {"data": self.metadata()}, {"access_token": "long", "expires_in": 5184000},
            {"data": self.metadata()},
            {"data": [{"id": "1", "name": "Page", "access_token": "page-secret"}]},
            {"data": self.metadata("PAGE")},
        ])
        result = self.manager.run("short")
        self.assertTrue(result["pages"][0]["no_scheduled_expiration"])
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "tokens.env.local"
            self.manager.save_tokens(path)
            values = dotenv_values(path)
            self.assertEqual(values["FB_PAGE_ACCESS_TOKEN"], "page-secret")
            self.assertNotIn("page-secret", values["FB_TOKEN_METADATA_JSON"])
            self.assertNotIn("FB_APP_SECRET", values)
            with self.assertRaises(TokenError):
                self.manager.save_tokens(path)

    def test_expired_wrong_app_and_missing_scopes(self):
        for change in ({"is_valid": False}, {"expires_at": 1}, {"app_id": "other"}, {"scopes": []}):
            with self.subTest(change=change), self.assertRaises(TokenError):
                self.manager._validate({**self.metadata(), **change}, check_scopes=True)

    def test_pagination_filters_specific_page(self):
        self.manager.page_id = "2"
        self.manager._get = Mock(side_effect=[
            {"data": [{"id": "1"}], "paging": {"next": "https://untrusted/", "cursors": {"after": "cursor"}}},
            {"data": [{"id": "2", "access_token": "page"}]},
            {"data": self.metadata("PAGE")},
        ])
        self.assertEqual(self.manager.get_page_access_tokens("long")[0]["id"], "2")
        self.assertEqual(self.manager._get.call_args_list[1].args[0], "me/accounts")
        self.assertEqual(self.manager._get.call_args_list[1].args[1]["after"], "cursor")

    def test_transport_error_does_not_leak_token(self):
        self.manager.session.get = Mock(side_effect=requests.ConnectionError("secret URL token"))
        with self.assertRaises(TokenError) as caught:
            self.manager.inspect_token("token")
        self.assertNotIn("secret", str(caught.exception))

    def test_api_error_does_not_leak_token(self):
        response = Mock(ok=False, is_redirect=False, status_code=400)
        response.json.return_value = {"error": {"code": 190, "message": "secret token"}}
        self.manager.session.get = Mock(return_value=response)
        with self.assertRaises(TokenError) as caught:
            self.manager.inspect_token("token")
        self.assertNotIn("secret", str(caught.exception))


if __name__ == "__main__":
    unittest.main()
