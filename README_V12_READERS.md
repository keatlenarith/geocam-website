# GeoCam V12 — Clickable content and PDF reader

- `/news`: click a news card for `/news/item?id=n1`. Shows available summary with an explicit sample disclaimer. No fabricated full articles.
- `/research`: click a theme for `/research/topic?id=Tectonics`. Shows theme overview and related sample publication links.
- `/publications`: click any publication for `/publications/view?id=p1`. Embedded browser PDF reader; if no PDF is attached, clearly shows missing-document state.
- PDF source: optional `pdfUrl` property on `Publication` in `src/lib/data.ts` (use local `/publications/file.pdf` after adding the PDF to `public/`, or a CORS/embedding-permitted HTTPS PDF URL).
- PDF local preview: choose a PDF from your device on its detail page; object URL is ephemeral and is revoked on page unmount. It is not uploaded, saved, or shared.
- Browser's built-in PDF iframe controls provide zoom/print/download when supported.
- No production CMS file storage or verified article bodies are present; those need a backend.
