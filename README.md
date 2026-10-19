# GeoCam website and research library

React + Vite + TypeScript website for Cambodian geoscience, extracted from the original V14 project ZIP.

## Run

Requires Node.js 22.12+ or a newer supported Node release.

```sh
npm ci
npm run dev
npm run check
npm test
npm run build
```

The publications library is at `/publications`. It contains 50 catalog entries and 45 collected documents (44 PDFs and one Word document), with search, subject/year/availability filters, inline PDF reading, document downloads and publisher links. Documents load only when opened. The collection was assembled on 19 October 2026; it is a targeted collection, not an exhaustive systematic review.

## Research records

- `src/lib/research-library.json`: public catalog; no workstation paths.
- `public/research/documents`: 45 documents with stable, ASCII filenames. Approximately 538 MB total; the largest file is about 78 MB.
- `public/research/catalog.csv` and `catalog.json`: downloadable catalog.
- `public/research/references.ris`: citations for the 14 internet references.

Three recent references overlap the local collection and are represented once. The English and Khmer cave guide editions share one record. Preprints, technical guidelines, regional references and unverified local bibliographic records are labelled. Years are left unverified when they have not been established; check original documents for authors and complete citations. No authors or dates were invented. Files were copied without altering their contents. Copyright and licence terms remain with the original rights holders.

## Google AI Studio

Create a new app using the plus menu in Build, choose **Import from GitHub**, and select `keatlenarith/geocam-website` on `main`. Import the extracted source, not the original legacy ZIP. This is a Vite React application and does not require a Gemini API key. AI Studio imports are a separate copy; the import screen states that imported code does not stay synced automatically.

If the full binary collection exceeds an import limit, use the supplied lightweight AI Studio ZIP, which reads research files from the public GitHub repository. The full GitHub project remains self-contained.

## Checks

`npm test` verifies catalog integrity, unique records, public-safe paths and local document existence. With the development server running, `node scripts/verify-site.mjs` checks search, year/access filters, empty results, PDF/source pages, missing references, mobile layout and every document URL. This browser check uses Playwright with the installed Chrome browser.

## Existing prototype features

The original home, research, membership, maps, mining, geopark, news, editor and bilingual navigation remain. News/events/membership records and admin/editor actions are still demonstrations; the admin is not an authenticated production CMS. This update adds a static research repository, not a server-backed upload service.
