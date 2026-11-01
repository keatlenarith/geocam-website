# Listed Companies Data Guide

The listed companies ticker strip displays publicly traded companies and joint ventures with operating or exploration assets in Cambodia.

## File Location
`data/listed-companies.json`

## Schema and Fields
Each item in `data/listed-companies.json` contains the following fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `exchange` | string | Stock exchange name (e.g. `ASX`, `TSXV`, `HKEX`, `SET`) |
| `ticker` | string | Stock symbol / ticker code (e.g. `EMR`, `UM1`, `ANK`, `06655`) |
| `status` | string | `"producing"` (green), `"exploration"` / `"development"` (amber), or `"historical"` (grey) |
| `text_en` | string | Exact English ticker line string (rendered left-to-right) |
| `text_kh` | string | Exact Khmer ticker line string |
| `company_en` | string | Full company name in English |
| `company_kh` | string | Full company name in Khmer |
| `asset_en` | string | Asset and project details in English |
| `asset_kh` | string | Asset and project details in Khmer |
| `province` | string | Province or jurisdiction in Cambodia |
| `commodity` | string | Primary resource or commodity (e.g. `Gold (Au)`, `Cement / Limestone`) |
| `unverified` | boolean | *(Optional)* Set to `true` to display the `[Unverified]` badge in the ticker strip and modal |
| `note` | string | *(Optional)* Summary note shown in the detail card |
| `sourceUrl` | string | Official website or exchange filing reference URL |
| `lastChecked` | string | Verification date in ISO format (`YYYY-MM-DD`) |

## Adding or Editing a Company
1. Open `data/listed-companies.json`.
2. To edit an existing record, update the relevant fields (e.g., `lastChecked`, `status`, `text_en`, `text_kh`).
3. To add a new company, append a new JSON object conforming to the schema above.
4. **Mandatory Constraint**: Do not include any Thai or Lao characters (`[\u0E00-\u0E7F\u0E80-\u0EFF]`). Use English or Khmer only.
5. Save the file and run `npm test` to verify the JSON structure and constraints.
