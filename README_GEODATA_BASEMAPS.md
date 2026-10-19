# GeoCam V3 — GeoData basemap selector

The GeoData page now has four selectable basemaps:
- DEM / Terrain: Esri World Terrain Base (terrain visualization only; NOT a numeric DEM raster)
- Topographic: Esri World Topographic Map
- Hillshade: Esri World Hillshade
- Satellite: Esri World Imagery

All tiles are streamed from Esri ArcGIS Online public tile endpoints; internet access is required. Service access and reuse are governed by Esri/provider terms. Attribution appears on the map. The illustrative geology/mineral/structure overlays are not official exploration data.

## Windows
1. Extract this archive to a NEW folder.
2. Open PowerShell in that folder.
3. `npm.cmd install`
4. `npm.cmd run dev`
5. Open http://localhost:3000/geodata

## Scope
This is a targeted GeoData map change. It does not add elevation sampling, slope/aspect, offline tiles, or file upload of georeferenced DEMs. For those features, a DEM data backend is required.

## Verification
Source-level change completed. Dependency installation did not finish within the available execution window, so a full build has NOT been verified.
