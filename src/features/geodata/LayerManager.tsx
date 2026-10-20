import { useEffect, useState } from "react";
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
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    let current = true;
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
    onLayers(layers.filter((layer) => !hidden.includes(layer.id)));
  }, [layers, hidden, onLayers]);
  const upload = async (file?: File) => {
    if (!file || !admin) return;
    setBusy(true);
    setMessage("Reading geodata…");
    let path = "";
    try {
      const parsed = await importGeodata(file);
      const id = crypto.randomUUID();
      path = id + "/" + file.name.replace(/[^a-z\d._-]/gi, "_");
      setMessage("Uploading a private draft…");
      const stored = await supabase.storage
        .from("geocam-geodata")
        .upload(path, file, { contentType: "application/octet-stream" });
      if (stored.error) throw stored.error;
      const layer: MapDataset = {
        id,
        name: file.name.replace(/\.(kmz|kml|geojson|json)$/i, ""),
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
      setLayers((values) => [...values, layer]);
      setMessage(
        `Uploaded ${parsed.data.features.length} features as a private draft. Check the map, then publish. ${parsed.warnings.join(" ")}`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message ||
              "Upload failed. Please try again.",
      );
    } finally {
      setBusy(false);
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
        .update({ name: layer.name, settings: layer.settings, status })
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
      <h2 className="text-lg font-semibold">Uploaded geodata</h2>
      {admin && (
        <label className="mt-3 block text-sm font-semibold">
          Upload geodata
          <input
            aria-label="Upload geodata"
            className="mt-2 block w-full text-xs"
            type="file"
            accept=".kmz,.kml,.geojson,.json"
            disabled={busy}
            onChange={(event) => {
              void upload(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        KMZ, KML or GeoJSON · WGS84 · up to 20 MB per file.{" "}
        {admin ? "Uploads start as private drafts." : ""}
      </p>
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
      {layers.map((layer) => {
        const style = { ...defaultStyle, ...layer.settings };
        return (
          <fieldset key={layer.id} className="mt-5 rounded-lg border p-3">
            <legend className="max-w-full break-words px-1 text-sm font-semibold">
              {layer.name}
              {admin && layer.status === "draft" ? " · Draft" : ""}
            </legend>
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
