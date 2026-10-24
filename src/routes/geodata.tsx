import LayerManager from "../features/geodata/LayerManager";
import type { MapDataset } from "../features/geodata/import-geodata";
import { ClientOnly, createFileRoute } from "@/lib/spa-router";
import { lazy, Suspense, useState } from "react";
import {
  Container,
  DemoNote,
  PageHeader,
  meta,
} from "@/components/site/Chrome";
import { useI18n } from "@/lib/i18n";
import { useAdmin } from "../admin/Auth";
import { toUtm48N } from "@/lib/utm";
import type { LayerKey, BaseMapKey } from "@/components/site/GeoMap";

const GeoMap = lazy(() => import("@/components/site/GeoMap"));

export const Route = createFileRoute("/geodata")({
  head: () =>
    meta(
      "GeoData",
      "Interactive map of Cambodia with illustrative geology, mineral and structure layers, plus GeoCam’s metadata and download policy.",
    ),
  component: GeoData,
});

const layerInfo: { k: LayerKey; label: string; labelKm: string }[] = [
  { k: "geology", label: "Generalized geology (illustrative)", labelKm: "ភូគព្ភសាស្ត្រទូទៅ (គំរូបង្ហាញ)" },
  { k: "minerals", label: "Mineral occurrences (illustrative)", labelKm: "ទីតាំងរ៉ែ (គំរូបង្ហាញ)" },
  { k: "structures", label: "Structural lineaments (illustrative)", labelKm: "ខ្សែរចនាសម្ព័ន្ធភូគព្ភសាស្ត្រ (គំរូបង្ហាញ)" },
];

function GeoData() {
  const { t, lang } = useI18n();
  const km = lang === "km";
  const { admin } = useAdmin();
  const [datasets, setDatasets] = useState<MapDataset[]>([]);
  const [active, setActive] = useState<Record<LayerKey, boolean>>({
    geology: true,
    minerals: true,
    structures: true,
  });
  const [baseMap, setBaseMap] = useState<BaseMapKey>("topo");
  const [pt, setPt] = useState<{ lat: number; lon: number } | null>(null);
  const utm = pt ? toUtm48N(pt.lat, pt.lon) : null;
  const Fallback = (
    <div className="flex h-[520px] items-center justify-center rounded-xl border border-border bg-muted">
      Loading map…
    </div>
  );
  return (
    <>
      <PageHeader
        eyebrow={t("geodata")}
        title={t("geodata")}
        sub={
          admin
            ? "Explore published geodata and demonstration layers. Upload KMZ, KML or GeoJSON as an administrator. Source coordinates use WGS84 (EPSG:4326)."
            : "Explore published geodata and demonstration layers. Source coordinates use WGS84 (EPSG:4326)."
        }
      />
      <Container>
        <a
          href="/geopark"
          className="mb-5 inline-flex rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-muted"
        >
          {km ? "ស្វែងយល់ពីឧទ្យានភូគព្ភសាស្ត្រ 3D →" : "Explore 3D Geopark →"}
        </a>
        <DemoNote>
          The built-in geology, mineral and structure layers are illustrative.
          {admin
            ? " Uploaded layers are contributed separately; check each dataset’s source and licence before use."
            : " Published layers are contributed separately; check each dataset’s source and licence before use."}
        </DemoNote>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          <ClientOnly fallback={Fallback}>
            <Suspense fallback={Fallback}>
              <GeoMap
                datasets={datasets}
                active={active}
                baseMap={baseMap}
                onPick={(lat, lon) => setPt({ lat, lon })}
              />
            </Suspense>
          </ClientOnly>
          <aside className="space-y-5">
            <LayerManager onLayers={setDatasets} />
            <fieldset className="card-surface p-5">
              <legend className="px-1 font-display text-lg font-semibold text-primary">
                {km ? "ផែនទីមូលដ្ឋាន" : "Base map"}
              </legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(
                  [
                    ["dem", km ? "ទម្រង់ដី (DEM)" : "DEM / Terrain"],
                    ["topo", km ? "ភូមិសាស្ត្រ" : "Topographic"],
                    ["hillshade", km ? "ស្រមោលកម្ពស់ដី" : "Hillshade"],
                    ["satellite", km ? "ផ្កាយរណប" : "Satellite"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={baseMap === key}
                    onClick={() => setBaseMap(key)}
                    className={`rounded-lg border px-2 py-3 text-xs font-semibold transition-colors ${baseMap === key ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {km
                  ? "ទម្រង់ដី (DEM) បង្ហាញរូបភាពសណ្ឋានដី មិនមែនជាតម្លៃកម្ពស់សម្រាប់ទាញយកទេ។ ក្រឡារូបភាពផែនទីត្រូវការអ៊ីនធឺណិត និងស្ថិតក្រោមលក្ខខណ្ឌរបស់អ្នកផ្ដល់សេវា។"
                  : "DEM / Terrain displays relief imagery, not downloadable elevation values. Map tiles require internet access and are subject to provider terms."}
              </p>
            </fieldset>
            <fieldset className="card-surface p-5">
              <legend className="px-1 font-display text-lg font-semibold text-primary">
                {t("layers")}
              </legend>
              {layerInfo.map((l) => (
                <label
                  key={l.k}
                  className="mt-2 flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={active[l.k]}
                    onChange={(e) =>
                      setActive({ ...active, [l.k]: e.target.checked })
                    }
                  />{" "}
                  {km ? l.labelKm : l.label}
                </label>
              ))}
            </fieldset>
            <div className="card-surface p-5 text-sm">
              <p className="font-display text-lg font-semibold text-primary">
                {km ? "កូអរដោនេ" : "Coordinates"}
              </p>
              {pt && utm ? (
                <dl className="mt-2 space-y-1 font-mono text-xs">
                  <div>
                    <dt className="inline font-semibold">EPSG:4326 </dt>
                    <dd className="inline">
                      {pt.lat.toFixed(5)}°, {pt.lon.toFixed(5)}°
                    </dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold">EPSG:32648 </dt>
                    <dd className="inline">
                      E {utm.easting.toFixed(1)} m, N {utm.northing.toFixed(1)}{" "}
                      m
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-2 text-muted-foreground">
                  {km ? "ចុចលើផែនទីដើម្បីអានតម្លៃកូអរដោនេ។" : "Click the map to read a coordinate."}
                </p>
              )}
            </div>
            {admin && (
              <p className="text-xs text-muted-foreground">
                Use Download source on an uploaded layer to retrieve its original
                file.
              </p>
            )}
          </aside>
        </div>

        <section className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="card-surface p-7">
            <h2 className="text-2xl font-semibold text-primary">
              {t("dataPolicy")}
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                {km
                  ? "សំណុំទិន្នន័យនីមួយៗមានទិន្នន័យមេតាស្របតាមទម្រង់ ISO 19115៖ ចំណងជើង សេចក្តីសង្ខេប ប្រភព ប្រព័ន្ធកូអរដោនេ (CRS) មាត្រដ្ឋាន អាជ្ញាបណ្ណ ទំនាក់ទំនង និងកាលបរិច្ឆេទ។"
                  : "Every dataset carries ISO 19115-style metadata: title, abstract, lineage, CRS, scale, licence, contact, date."}
              </li>
              <li>
                {km
                  ? "សំណុំទិន្នន័យដែលបានផ្ទុកឡើងគឺជាសេចក្តីព្រាងឯកជន រហូតដល់អ្នកគ្រប់គ្រងផ្សព្វផ្សាយជាសាធារណៈ។"
                  : "Uploaded datasets are private drafts until an administrator publishes them for public access."}
              </li>
              <li>
                {km
                  ? "ការផ្ទុកឡើងឯកសារ KMZ/KML និង GeoJSON ត្រូវប្រើប្រព័ន្ធកូអរដោនេ WGS84 (EPSG:4326)។ ការទាញយកនឹងរក្សាទុកឯកសារប្រភពដើមដែលបានផ្ទុកឡើង។"
                  : "KMZ/KML and GeoJSON uploads must use WGS84 longitude/latitude (EPSG:4326). Downloads preserve the uploaded source file."}
              </li>
              <li>
                {km
                  ? "GeoCam ផ្ទុកតែទិន្នន័យដែលសមាជិករួមចំណែក ឬមានអាជ្ញាបណ្ណបើកចំហប៉ុណ្ណោះ។ មិនមានការផ្ទុកទិន្នន័យសម្ងាត់របស់រាជរដ្ឋាភិបាលឡើយ។"
                  : "GeoCam hosts only member-contributed or openly licensed data. No confidential government datasets are hosted."}
              </li>
              <li>
                {km
                  ? "អ្នកប្រើប្រាស់ត្រូវបញ្ជាក់ប្រភព និងអាជ្ញាបណ្ណ។ ការនាំចូលបច្ចុប្បន្នបង្ហាញវត្ថុវ៉ិចទ័រ; តំណបណ្តាញ រូបភាពរ៉ាស្ទ័រ និងគំរូ 3D មិនត្រូវបានបង្ហាញទេ។"
                  : "Users must cite the source and licence. Import currently displays vector features; network links, raster overlays and 3D models are not displayed."}
              </li>
            </ul>
          </div>
          <div className="card-surface p-7 text-sm">
            <h2 className="text-2xl font-semibold text-primary">
              {km ? "កំណត់ត្រាទិន្នន័យមេតាគំរូ" : "Sample metadata record"}
            </h2>
            <dl className="mt-3 grid grid-cols-[120px_1fr] gap-y-2">
              <dt className="font-semibold">{km ? "ចំណងជើង" : "Title"}</dt>
              <dd>{km ? "ភូគព្ភសាស្ត្រទូទៅគំរូ" : "Illustrative generalized geology"}</dd>
              <dt className="font-semibold">{km ? "ស្ថានភាព" : "Status"}</dt>
              <dd>{km ? "គំរូបង្ហាញសាកល្បង" : "Demo / illustrative"}</dd>
              <dt className="font-semibold">{km ? "ប្រព័ន្ធកូអរដោនេបង្ហាញ" : "Display CRS"}</dt>
              <dd>EPSG:4326</dd>
              <dt className="font-semibold">{km ? "ប្រព័ន្ធកូអរដោនេនាំចេញ" : "Export CRS"}</dt>
              <dd>EPSG:32648</dd>
              <dt className="font-semibold">{km ? "សិទ្ធិចូលប្រើ" : "Access"}</dt>
              <dd>{km ? "សាធារណៈ" : "Public"}</dd>
              <dt className="font-semibold">{km ? "អាជ្ញាបណ្ណ" : "Licence"}</dt>
              <dd>{km ? "CC BY 4.0 (គំរូ)" : "CC BY 4.0 (example)"}</dd>
            </dl>
          </div>
        </section>
      </Container>
    </>
  );
}
