---
title: GeoCam Mineral & Alteration Mapping API
emoji: 🛰️
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# GeoCam Landsat 9 & ASTER Alteration Mapping Engine

Automated mineral exploration, hydrothermal alteration mapping, and prospectivity ranking engine from KMZ boundary uploads.
Built for the Geosciences Society of Cambodia (GeoCam).

### Endpoints:
- `GET /` : Health check & service info
- `POST /api/analyze` : Accepts KMZ boundary, queries Planetary Computer STAC for Landsat 9 Collection 2, runs band math & Crosta PCA, and returns GeoJSON alteration layers and downloadable GIS ZIP package.
