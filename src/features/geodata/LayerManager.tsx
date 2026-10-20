import { UploadCloud, Layers3, LogOut, LayoutDashboard } from "lucide-react";
import { categories, type DatasetCategory } from "./categories";
import { useEffect, useState, useRef } from "react";
import { useAdmin } from "../../admin/Auth";
import { supabase } from "../../lib/supabase";
import {
  defaultStyle,
  importGeodata,
  type MapDataset,
  type MapStyle,
} from "./import-geodata";

export default function LayerManager({
  onLayers,
}: {
  onLayers: (layers: MapDataset[]) => void;
}) {
  const { admin, loading, session } = useAdmin();
  const [layers, setLayers] = useState<MapDataset[]>([]),
    [hidden, setHidden] = useState<string[]>([]),
    [uploading, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const [batchBusy, setBatchBusy] = useState(false);
  const busy = uploading || batchBusy;
  const [uploadCategory, setUploadCategory] =
    useState<DatasetCategory>("geology");
  const [filter, setFilter] = useState("all");
  const [progress, setProgress] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const accessVersion = useRef(0);
  const visibleLayers = layers.filter(
    (layer) => filter === "all" || (layer.category || "other") === filter,
  );
  useEffect(() => {
    let current = true;
    accessVersion.current++;
    setProgress("");
    setMessage("");
    setLayers([]);
    setHidden([]);
    if (loading) return;
    const load = async () => {
      const { data, error } = await supabase
        .from("geocam_map_layers")
        .select("*")
        .order("created_at");
      if (!current) return;
      if (error) {
        setMessage("Could not load uploaded layers. Please reload.");
        return;
      }
      setLayers((data || []) as MapDataset[]);
    };
    void load();
    return () => {
      current = false;
    };
  }, [admin, loading, session?.user.id]);
  useEffect(() => {
    onLayers(
      layers.filter(
        (layer) =>
          !hidden.includes(layer.id) &&
          (filter === "all" || (layer.category || "other") === filter),
      ),
    );
  }, [layers, hidden, filter, onLayers]);
  const upload = async (file?: File) => {
    if (!file || !admin) return;
    const version = accessVersion.current;
    setBusy(true);
    setMessage("Reading geodata…");
    let path = "";
    try {
      const parsed = await importGeodata(file);
      if (version !== accessVersion.current) return false;
      const id = crypto.randomUUID();
      path = id + "/" + file.name.replace(/[^a-z\d._-]/gi, "_");
      setMessage("Uploading a private draft…");
      const stored = await supabase.storage
        .from("geocam-geodata")
        .upload(path, file, { contentType: "application/octet-stream" });
      if (stored.error) throw stored.error;
      const layer: MapDataset = {
        id,
        name: file.name.slice(0, 150),
        category: uploadCategory,
        filename: file.name,
        source_path: path,
        data: parsed.data,
        settings: { ...defaultStyle },
        status: "draft",
      };
      const result = await supabase.from("geocam_map_layers").insert(layer);
      if (result.error) {
        await supabase.storage.from("geocam-geodata").remove([path]);
        throw result.error;
      }
      if (version !== accessVersion.current) return false;
      setLayers((values) => [...values, layer]);
      setMessage(
        `Uploaded ${parsed.data.features.length} features as a private draft. Check the map, then publish. ${parsed.warnings.join(" ")}`,
      );
      return true;
    } catch (error) {
      if (version !== accessVersion.current) return false;
      setMessage(
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message ||
              "Upload failed. Please try again.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  };
  const uploadFiles = async (files: File[]) => {
    if (!files.length || !admin || busy) return;
    if (files.length > 20) {
      setMessage(
        "Choose up to 20 files at a time. Each file becomes a separate layer.",
      );
      return;
    }
    const version = accessVersion.current;
    setBatchBusy(true);
    let success = 0;
    const failed: string[] = [];
    try {
      for (let index = 0; index < files.length; index++) {
        setProgress(
          `File ${index + 1} of ${files.length}: ${files[index].name}`,
        );
        if (version !== accessVersion.current) return;
        if (await upload(files[index])) success++;
        else failed.push(files[index].name);
        if (version !== accessVersion.current) return;
      }
      if (files.length > 1)
        setMessage(
          `Uploaded ${success} of ${files.length} files as separate private draft layers. ${files.length - success ? `Failed: ${failed.join(", ")}. Check their format and size before retrying.` : ""}`,
        );
    } finally {
      setBatchBusy(false);
      setProgress("");
    }
  };
  const change = (id: string, patch: Partial<MapStyle>) =>
    setLayers((values) =>
      values.map((layer) =>
        layer.id === id
          ? {
              ...layer,
              settings: { ...defaultStyle, ...layer.settings, ...patch },
            }
          : layer,
      ),
    );
  const update = async (layer: MapDataset, status = layer.status) => {
    setBusy(true);
    try {
      const { error } = await supabase
        .from("geocam_map_layers")
        .update({
          name: layer.name,
          category: layer.category || "other",
          settings: layer.settings,
          status,
        })
        .eq("id", layer.id)
        .select("id")
        .single();
      if (error) throw error;
      setLayers((values) =>
        values.map((value) =>
          value.id === layer.id ? { ...value, status } : value,
        ),
      );
      setMessage(
        status === "published"
          ? "Layer and styling published for all visitors."
          : "Draft saved. Only administrators can see it.",
      );
    } catch (error) {
      setMessage(
        (error as { message?: string })?.message || "Unable to save layer.",
      );
    } finally {
      setBusy(false);
    }
  };
  const remove = async (layer: MapDataset) => {
    if (!confirm("Delete this layer and its uploaded source file?")) return;
    setBusy(true);
    try {
      const { error } = await supabase
        .from("geocam_map_layers")
        .delete()
        .eq("id", layer.id)
        .select("id")
        .single();
      if (error) throw error;
      setLayers((values) => values.filter((value) => value.id !== layer.id));
      const stored = await supabase.storage
        .from("geocam-geodata")
        .remove([layer.source_path]);
      setMessage(
        stored.error
          ? "Layer removed. Source cleanup failed; retry from Supabase Storage."
          : "Layer and source removed.",
      );
    } catch (error) {
      setMessage(
        (error as { message?: string })?.message || "Unable to delete layer.",
      );
    } finally {
      setBusy(false);
    }
  };
  const download = async (layer: MapDataset) => {
    try {
      const { data, error } = await supabase.storage
        .from("geocam-geodata")
        .download(layer.source_path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = layer.filename;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setMessage("Source download failed. Please retry.");
    }
  };
  return (
    <section className="card-surface p-5" aria-label="Uploaded geodata">
      <div className="flex items-center gap-2">
        <Layers3 size={21} className="text-primary" />
        <h2 className="text-lg font-semibold">Layer library</h2>
        <span className="ml-auto rounded-full bg-muted px-2 py-1 text-xs">
          {layers.length} layers
        </span>
      </div>
      {admin ? (
        <div
          className="mt-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            if (!busy) void uploadFiles(Array.from(event.dataTransfer.files));
          }}
        >
          <UploadCloud className="mb-3 text-primary" size={30} />
          <h3 className="font-semibold">Add geoscience layers</h3>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Choose a category, then select or drop your files. Each file is
            saved separately using its uploaded filename.
          </p>
          <label className="mt-4 block text-xs font-semibold">
            Dataset category
            <select
              className="field mt-2 w-full"
              value={uploadCategory}
              disabled={busy}
              onChange={(event) =>
                setUploadCategory(event.target.value as DatasetCategory)
              }
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
          <input
            ref={input}
            aria-label="Upload geodata"
            className="sr-only"
            type="file"
            accept=".kmz,.kml,.geojson,.json"
            multiple
            disabled={busy}
            onChange={(event) => {
              void uploadFiles(Array.from(event.target.files || []));
              event.target.value = "";
            }}
          />
          <button
            type="button"
            className="btn btn-primary mt-4 w-full gap-2"
            disabled={busy}
            onClick={() => input.current?.click()}
          >
            <UploadCloud size={18} />
            {busy ? "Uploading layers…" : "Upload layers"}
          </button>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            KMZ · KML · GeoJSON
            <br />
            20 MB per file · up to 20 files at once · WGS84
          </p>
          <p className="mt-2 text-xs">
            Files start as private drafts. Preview, symbolize, then publish.
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-xl bg-muted/50 p-4">
          <p className="text-sm">
            Explore published geology, faults, trends, minerals, geosites and
            potential zones.
          </p>
          <a
            className="btn btn-primary mt-3 w-full text-sm"
            href="/admin/login"
          >
            <UploadCloud size={16} />
            Sign in to upload layers
          </a>
          <p className="mt-2 text-xs text-muted-foreground">
            Administrator access required to upload or publish.
          </p>
        </div>
      )}
      {admin && (
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <a
            className="inline-flex items-center gap-1 underline"
            href="/admin/cms"
          >
            <LayoutDashboard size={13} />
            Admin dashboard
          </a>
          <button
            className="inline-flex items-center gap-1 underline"
            onClick={() => supabase.auth.signOut()}
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      )}
      <label className="mt-5 block text-sm font-semibold">
        Filter layers
        <select
          className="field mt-2 w-full"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All categories ({layers.length})</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label} (
              {
                layers.filter(
                  (layer) => (layer.category || "other") === category.id,
                ).length
              }
              )
            </option>
          ))}
        </select>
      </label>
      {progress && (
        <p aria-live="polite" className="mt-3 break-words text-xs">
          {progress}
        </p>
      )}
      {message && (
        <p className="my-3 text-sm" role="status">
          {message}
        </p>
      )}
      {!layers.length && (
        <p className="mt-3 text-sm text-muted-foreground">
          No uploaded layers available.
        </p>
      )}
      {layers.length > 0 && visibleLayers.length === 0 && (
        <p className="mt-3 text-sm text-muted-foreground">
          No layers in this category.
        </p>
      )}
      {visibleLayers.map((layer) => {
        const style = { ...defaultStyle, ...layer.settings };
        return (
          <fieldset key={layer.id} className="mt-5 rounded-lg border p-3">
            <legend className="max-w-full break-words px-1 text-sm font-semibold">
              {layer.name}
              {admin && layer.status === "draft" ? " · Draft" : ""}
            </legend>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
              {
                categories.find(
                  (category) => category.id === (layer.category || "other"),
                )?.label
              }
            </p>
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={!hidden.includes(layer.id)}
                onChange={(event) =>
                  setHidden((values) =>
                    event.target.checked
                      ? values.filter((id) => id !== layer.id)
                      : [...values, layer.id],
                  )
                }
              />
              Show layer
            </label>
            <p className="my-2 text-xs">
              {layer.data.features.length} features · {layer.filename}
            </p>
            <button
              type="button"
              className="text-sm underline"
              onClick={() => download(layer)}
            >
              Download source
            </button>
            {admin && (
              <div className="mt-3 grid gap-3 text-sm">
                <label>
                  Layer category
                  <select
                    className="field mt-1 w-full"
                    value={layer.category || "other"}
                    disabled={busy}
                    onChange={(event) =>
                      setLayers((values) =>
                        values.map((value) =>
                          value.id === layer.id
                            ? {
                                ...value,
                                category: event.target.value as DatasetCategory,
                              }
                            : value,
                        ),
                      )
                    }
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Layer name
                  <input
                    className="field mt-1 w-full"
                    maxLength={150}
                    value={layer.name}
                    disabled={busy}
                    onChange={(event) =>
                      setLayers((values) =>
                        values.map((value) =>
                          value.id === layer.id
                            ? { ...value, name: event.target.value }
                            : value,
                        ),
                      )
                    }
                  />
                </label>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={style.original}
                    disabled={busy}
                    onChange={(event) =>
                      change(layer.id, { original: event.target.checked })
                    }
                  />
                  Use original KML styles
                </label>
                <label>
                  Point symbol
                  <select
                    className="field mt-1 w-full"
                    disabled={busy || style.original}
                    value={style.symbol}
                    onChange={(event) =>
                      change(layer.id, {
                        symbol: event.target.value as MapStyle["symbol"],
                      })
                    }
                  >
                    {["circle", "square", "triangle", "star"].map((symbol) => (
                      <option key={symbol}>{symbol}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Symbol size (pixels)
                  <input
                    className="field mt-1 w-full"
                    type="number"
                    min={4}
                    max={128}
                    value={style.size}
                    disabled={busy || style.original}
                    onChange={(event) =>
                      change(layer.id, { size: Number(event.target.value) })
                    }
                  />
                </label>
                <label className="flex items-center justify-between">
                  Colour
                  <input
                    type="color"
                    value={style.color}
                    disabled={busy || style.original}
                    onChange={(event) =>
                      change(layer.id, { color: event.target.value })
                    }
                  />
                </label>
                <label>
                  Line width (pixels)
                  <input
                    className="field mt-1 w-full"
                    type="number"
                    min={1}
                    max={20}
                    value={style.width}
                    disabled={busy || style.original}
                    onChange={(event) =>
                      change(layer.id, { width: Number(event.target.value) })
                    }
                  />
                </label>
                <label>
                  Polygon opacity
                  <input
                    className="mt-1 w-full"
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={style.opacity}
                    disabled={busy || style.original}
                    onChange={(event) =>
                      change(layer.id, { opacity: Number(event.target.value) })
                    }
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={busy || !layer.name.trim()}
                    className="btn btn-outline !px-2 !py-1"
                    onClick={() => update(layer)}
                  >
                    Save style
                  </button>
                  <button
                    disabled={busy || !layer.name.trim()}
                    className="btn btn-primary !px-2 !py-1"
                    onClick={() => {
                      const status =
                        layer.status === "published" ? "draft" : "published";
                      if (
                        confirm(
                          status === "published"
                            ? "Publish this layer for all visitors?"
                            : "Hide this layer from public visitors?",
                        )
                      )
                        void update(layer, status);
                    }}
                  >
                    {layer.status === "published"
                      ? "Unpublish"
                      : "Publish layer"}
                  </button>
                  <button
                    disabled={busy}
                    className="btn btn-outline !px-2 !py-1"
                    onClick={() => remove(layer)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </fieldset>
        );
      })}
    </section>
  );
}
