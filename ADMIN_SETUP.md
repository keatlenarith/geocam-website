# GeoCam administration

Admin sign-in: https://geocam-website.vercel.app/admin/login

First use: choose **First-time account setup**, enter the approved email address and a unique password of at least 12 characters, and confirm the email received from Supabase. Return to the sign-in page and open the dashboard.

Only the verified account for `keatlenarith@gmail.com` is authorized. Creating another account does not grant editing access. Passwords are managed by Supabase Auth; never put one in Git or share it in chat. Use **Forgot password?** to reset a password.

Open a page from the dashboard, choose **Visual edit**, and click text or an image. English and Khmer are edited separately. **Save draft** stores changes privately in Supabase. **Publish** updates the version served to all visitors, without a Vercel deployment. Reopen or refresh a public page to see the new version. Existing open pages also reload published content when the window regains focus. Images must be PNG, JPEG, WebP or GIF, under 1.5 MB; the complete content document has a 10 MB database limit.

This editor manages existing text and images on Home, About, Research, Membership and Contact. Dynamic research records and filtered map/listing pages are excluded to prevent one record’s edits affecting another. Adding research files, new page layouts, and new article structures continues through the source repository. Prototype article/member administration is not enabled.

Supabase project: `pziwobqfysoadswgnjjm`. The browser uses a publishable key. RLS protects drafts and publishing, with a private authorization function checking the current verified Auth identity against the private email allowlist. The function does not trust editable user metadata. Public visitors can only read the published row. Private draft data is not stored in browser localStorage. Auth sessions use the Supabase client's session storage.

Supabase Authentication URL configuration must use Site URL `https://geocam-website.vercel.app` and allow redirect URL `https://geocam-website.vercel.app/admin/login`. Email confirmation must remain enabled. Custom SMTP may be needed if the project's built-in email delivery rejects the recipient or reaches its rate limit.

Database schema is recorded under `supabase/migrations/`. The private allowlist intentionally has no client RLS policies or table grants; it is accessible only to the authorization function and database administrator.
