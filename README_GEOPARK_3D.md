# GeoCam 3D Geopark Explorer (V4 concept integration)

Open `/geopark`, or follow the link from `/geodata`. Original Lovable pages and existing 2D GeoData basemaps are preserved.

Features: MapLibre GL terrain mesh with Terrarium DEM, satellite/topo/hillshade/terrain basemap selection, 2D/3D toggle, camera pitch, coordinate HUD, geosite directory, fly-to, Visitor / Geoscientist information modes, EN/KM site descriptions.

**Data integrity:** The two records are **illustrative** from the supplied HTML prototype, NOT verified real geosites; their ages, coordinates, elevations, trails and stories must be verified before publishing. No invented measured elevation profile is displayed. Actual transect calculation requires DEM sampling.

**CMS:** This is a new front-end module; verified geosite CRUD, image uploads, access roles and publishing need a real backend. The existing localStorage CMS is not secure production storage.

**External providers:** Esri basemap services and public AWS Terrarium tiles require connectivity and are subject to their respective usage terms. Terrain rendering may be unavailable on browsers lacking WebGL support.

Run: `npm install` then `npm run dev`.
