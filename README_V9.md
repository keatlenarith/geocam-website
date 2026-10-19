# GeoCam V9 — Usability & bilingual refinement

Built from V8. Changes:
- About page: bilingual mission, section cards, leadership labels and photo/banner editing via Visual Edit.
- Contact: professional photo remains replaceable in Visual Edit. Contact form now opens the visitor’s email client with prefilled message; user must press Send in the mail app. No fake success or server-side email delivery claims.
- Mining page added to CMS dashboard list.
- Contact email in footer.

## Run
`npm install` then `npm run dev`. Navigate to `/contact`, `/about`, `/mining`, or `/admin/cms`.

## Limitations
LocalStorage CMS is browser-local and insecure for production; Lexicon is embedded via iframe and depends on host permissions; no production backend. This release does not claim exhaustive bilingual translation across every module.
