# GeoCam parallel development handoff

Codex work is isolated on `codex/publishing-safeguards` in
`D:\9-Database Information\GeoCam Website\geocam-publishing-safeguards`.
The original `geocam-website` checkout remains available for Antigravity's UI work.

## Integration contract

- Authentication must always use the verified `geocam_is_admin` RPC. Never
  bypass AdminGate based on localhost or `admin_preview` query parameters.
- Post drafts live in `geocam_post_drafts`; visitors read `geocam_post_public`.
  Saving a draft must not overwrite a previously published snapshot. The news
  service compatibility API uses Supabase, with an in-memory cache, not localStorage.
- Seed news is demonstration content. Create a copy with a UUID before editing;
  short seed IDs cannot be inserted into the UUID database columns.
- PostManager owns the unsaved-post modal and native exit warning. Dashboard
  section changes and sign-out must dispatch cancelable
  `geocam:request-navigation` with `{proceed}` and honor `defaultPrevented`.
- English owns source text. Khmer is a translation override. Updating English
  invalidates its old Khmer override. Khmer must never overwrite English text.
- Images have one canonical English field, shared by both languages. Do not
  duplicate base64 images in base/English/Khmer stores: this quickly hits the
  content-size limit. Earlier Khmer uploads have been preserved in English storage.
- Page publishing uses `geocam_publish_page_changes({p_changes})`, atomically
  applying changed fields to the current live snapshot. This preserves unrelated
  concurrent edits and approved typography.
- Appearance uses `geocam_update_fonts({p_english,p_khmer,p_publish})`. Drafts
  are private until explicit approval. Page publication cannot change fonts.
- On dynamic pages, visual CMS edits require stable `data-cms-id` fields. Do not
  capture result counts, filtered record lists, or map controls as static copy.
- Current maintained page-editor bindings are in WordPressAdmin's `pageFields`.
  Avoid arbitrary `hero:*` keys that have no public-page consumer.

## UI work reserved for Antigravity

Continue readability, larger default text, font-size controls, placeholders,
and visual editor layout improvements. Extend the settings schema and validation
when adding approved font sizes; CSS-only previews must not silently publish.

The research-entry dialog currently saves to localStorage and is not a real
public research upload. It needs database/storage persistence and a public
reader before it can accurately claim publication. Do not mark new entries as
verified or peer-reviewed without evidence.

## Verification

Run `npm run check`, `npm test`, and `npm run build`.
Run the admin, posts, fonts, Khmer and GeoData scripts with `SITE_URL` pointing
at the checkout under test. Browser scripts mock authentication and storage;
authorization and the atomic functions were also tested against Supabase in
rollback-only SQL transactions. Migrations 202610210006 and 202610210007 have
already been applied to project `pziwobqfysoadswgnjjm`.
