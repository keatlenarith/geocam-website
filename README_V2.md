# GeoCam AI Studio V2 — visual fidelity repair

This package starts from the earlier Google AI Studio-compatible GeoCam prototype and restores the original Lovable font loading in `index.html`. Original Lovable CSS, homepage, page components, hero/outcrop images, and site chrome are preserved. The visual CMS draft records are now separated by English and Khmer (`/route::en`, `/route::km`).

## Windows

1. Install Node.js LTS (includes npm).
2. Extract this ZIP into a **new** folder, not over the previous prototype.
3. Open PowerShell in the extracted folder.
4. `npm.cmd install`
5. `npm.cmd run dev`
6. Open `http://localhost:3000` and `http://localhost:3000/admin/cms`.

## Known limits

- This is a React/Vite adaptation, not a byte-for-byte runtime equivalent of TanStack Start; visual equivalence must be verified in a browser.
- The CMS stores edits in browser localStorage; there is no shared database, authentication, server-side media library or production publishing.
- The Lexicon is linked/embedded as an external app; it is not integrated with the real Lexicon database.
- The GeoData map remains the original illustrative map; no official data are claimed.
- CMS editing uses browser DOM instrumentation and is a **prototype**. Do not use for production publishing. React-managed interactive components should be edited through a future field-based content model.
- This version does not silently alter the original Lovable project or your live websites.

## Comparison checklist

Compare desktop and mobile homepage, header, footer, Fraunces headings, Manrope body text, Noto Khmer fonts, banner images, links, language switching, GeoData map, and CMS edit/preview flows. If browser screenshots differ, repair the affected component before deploying.
