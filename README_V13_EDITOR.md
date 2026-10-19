# GeoCam V13 — WordPress-style local writing studio

Open `/admin/editor` or use **Write articles / pages** from `/admin/cms`.

- Create and edit draft articles with separate English and Khmer content.
- Rich text: bold, italic, underline, strike, headings, font sizes, alignments, lists, links, image insertion, tables, undo and redo.
- Preview content before saving or publishing.
- Published news appears on `/news`, and opens in a full article reader at `/articles/read?id=...`.
- Information-page type is stored and editable in the dashboard, but it does not automatically generate a public route.
- **Important:** this is a localStorage-only demonstration, not a secure authenticated CMS. Publishing only affects the current browser; storage quota is limited and uploaded images are embedded as data URLs. Do not use it as a public production admin interface.
- For real publication, implement server authentication, database storage, persistent media uploads, revision history and permissions.
- Editor uses browser `execCommand` for wide compatibility; this legacy API should be replaced with TipTap/ProseMirror for a long-term production editor.
