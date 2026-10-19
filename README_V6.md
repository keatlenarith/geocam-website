# GeoCam V6 — Onepage-inspired homepage redesign

This is an ORIGINAL editorial landing-page redesign inspired by modern SaaS/Onepage page composition, not a pixel-for-pixel copy. It preserves the existing V5 website and features, including GeoData, Geopark, Lexicon, bilingual switching, CMS, and the uploaded logo.

## Changes
- Rebuilt homepage hero, feature cards, mission block, research, news/events, and membership CTA.
- Added English and Khmer copy for every new homepage section.
- Retained all existing routes, images, logo, and existing visual CMS.
- Hero and mission images have `data-cms-id` identifiers for CMS editing.

## Run
`npm.cmd install` then `npm.cmd run dev` (Windows PowerShell). Open http://localhost:3000.

## Known limitations
- Browser-local CMS only; edits do not persist across devices.
- Existing news/research data may still include English-only descriptions.
- Lexicon integration is unchanged from V5 and is not a direct database integration.
- External tile services and iframe policies are outside the package.
- Do not overwrite the live site without build and visual QA.
