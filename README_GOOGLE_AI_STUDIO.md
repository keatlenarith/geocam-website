# GeoCam — Google AI Studio compatible conversion

This project is a React + Vite + TypeScript SPA converted from the supplied original Lovable `geo-cambodia-hub-main.zip`.

## Local development

- Node 22+; run `npm install` then `npm run dev` and open http://localhost:3000.
- Run `npm run build` for a production bundle.
- Upload/import the project source in Google AI Studio as supported by its current import UI. A ZIP is supplied for convenience; compatibility with AI Studio's import UI is not verified.

## What is preserved

- Original Lovable page components, original CSS and assets, original English/Khmer translations and illustrative Leaflet GeoData.
- Routes for home, about, research, publications, events, membership, geodata, news, contact, dashboard, admin.
- No changes made to the original source ZIP or live websites.

## Visual CMS prototype

- Visit `/admin/cms`; choose a page, open it, and click `Visual edit (local)`.
- Click text to change English or Khmer wording. Click images to upload replacements (local demo limit 2 MB per image).
- Drafts persist in browser localStorage. Publish stores a *separate local published snapshot*. Export/import JSON backups. Restore drafts from the last locally published version.
- Layout CSS and React component structure are not editable through the CMS.

### IMPORTANT limitations

This is NOT a secure production CMS: no login, roles, database, cross-device synchronization, server-side file storage, collaborative editing, or real public publishing yet. localStorage has limited capacity and is tied to one browser. Do not publish this admin dashboard publicly as a real content-management system. The visual editor currently keys text/image elements by order on each page; dynamic content or UI changes can change that order, so this must be replaced by stable field IDs before production.

The external real GeoCam Lexicon is linked from the dashboard. It has NOT been connected to its private database/API because schema and access are not provided. Existing GeoData layers are illustrative, not official.

The SPA replaces TanStack Start routing with a small client router for AI Studio compatibility. SSR, server actions and original TanStack-specific behaviors are not included. Test every page and workflow before use.
