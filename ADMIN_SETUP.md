# GeoCam administration

Admin sign-in: https://geocam-website.vercel.app/admin/login

First use: choose **First-time account setup**, enter the approved email address and a unique password of at least 12 characters, and confirm the email received from Supabase. Return to the sign-in page and open the dashboard.

Only the verified account for `keatlenarith@gmail.com` is authorized. Creating another account does not grant editing access. Passwords are managed by Supabase Auth; never put one in Git or share it in chat. Use **Forgot password?** to reset a password.

Open a page from the dashboard, choose **Visual edit**, and click text or an image. English and Khmer are edited separately. **Save draft** stores changes privately in Supabase. **Publish** updates the version served to all visitors, without a Vercel deployment. Reopen or refresh a public page to see the new version. Existing open pages also reload published content when the window regains focus. Images must be PNG, JPEG, WebP or GIF, under 1.5 MB; the complete content document has a 10 MB database limit.

This editor manages existing text and images on Home, About, Research, Membership and Contact. Dynamic research records and filtered map/listing pages are excluded to prevent one record’s edits affecting another. Adding research papers, new page layouts, and new article structures continues through the source repository. Prototype article/member administration is not enabled.

## Geodata uploads

Sign in, open **Upload and manage geodata** in the dashboard, or visit `/geodata`. Choose a dataset category (Geology, Faults, Trends, Minerals, Geosites, Potential zones or Other data), then use **Upload layers** or drop files into the upload area. Select up to 20 `.kmz`, `.kml`, `.geojson` or GeoJSON `.json` files at once. Each file is stored as a separate layer named after the original filename, with a unique storage path, so repeated filenames do not overwrite each other. Filter the library by category; edit a layer’s category or name and use **Save style** to persist changes. Files must be WGS84 longitude/latitude, at most 20 MB, with up to 20,000 vector features. KMZ archives must contain a main `doc.kml`, or one unambiguous KML file. ZIP64 and archives declaring more than 50 MB of expanded content are rejected. Converted data including embedded icons must fit within 8 MB. Simplify or split large layers before uploading.

Points, lines, polygons and multi-geometries are supported. Common KML colours, opacity, line widths and icon scales are imported. Package PNG/JPEG/GIF/WebP icons in the KMZ; icons above 250 KB are replaced with default symbols. External HTTPS icons remain external. Google Earth-specific hotspot/tint, labels, 3D models, raster overlays and network links are not reproduced. Network links are not fetched. Check the preview; web styling may differ from Google Earth.

Uploads are private drafts visible only to the administrator. Use **Show layer** to toggle preview visibility. Uncheck **Use original KML styles** to choose a circle, square, triangle or star, point size (4–128 pixels), colour, line width (1–20 pixels), and polygon opacity. **Save style** saves the layer's styling. Saving a published layer updates its public styling immediately. **Publish layer** makes it public; **Unpublish** hides it. Public visitors can view published layers and download their original source files. Upload, style, publish and delete controls require administrator access.

Layers and geometry are stored in `geocam_map_layers`; original source files use the private `geocam-geodata` Storage bucket. Database and Storage policies hide drafts from visitors. Do not upload confidential data to a layer you intend to publish. Store source, licence and accuracy information in the dataset's accompanying documentation.

Supabase project: `pziwobqfysoadswgnjjm`. The browser uses a publishable key. RLS protects drafts and publishing, with a private authorization function checking the current verified Auth identity against the private email allowlist. The function does not trust editable user metadata. Public visitors can only read the published row. Private draft data is not stored in browser localStorage. Auth sessions use the Supabase client's session storage.

Supabase Authentication URL configuration must use Site URL `https://geocam-website.vercel.app` and allow redirect URL `https://geocam-website.vercel.app/admin/login`. Email confirmation must remain enabled. Custom SMTP may be needed if the project's built-in email delivery rejects the recipient or reaches its rate limit.

Database schema is recorded under `supabase/migrations/`. The private allowlist intentionally has no client RLS policies or table grants; it is accessible only to the authorization function and database administrator.

## Environmental monitoring

The public page `/environmental-monitoring` embeds the supplied live Mining Monitoring Dashboard from Google Earth Engine. It is linked under Geoscience & Data. Use **Full screen**, **Reload dashboard**, or **Open original dashboard**. GeoCam does not copy the app’s private source code or duplicate its monitoring calculations; the original Earth Engine app continues to manage those.
