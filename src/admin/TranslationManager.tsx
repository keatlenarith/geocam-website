import React, { useState, useEffect, useMemo } from "react";
import {
  Languages,
  Search,
  Plus,
  Save,
  RotateCcw,
  Download,
  Check,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import {
  getAllTranslations,
  saveCustomTranslation,
  deleteCustomTranslation,
  getCustomTranslations,
} from "../lib/translation";

interface TranslationRow {
  english: string;
  khmer: string;
  isCustom: boolean;
}

export default function TranslationManager() {
  const [translations, setTranslations] = useState<TranslationRow[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "custom" | "builtin">("all");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // New translation form state
  const [newEnglish, setNewEnglish] = useState("");
  const [newKhmer, setNewKhmer] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Refresh translations list
  const refresh = () => {
    setTranslations(getAllTranslations());
  };

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener("geocam:translations-updated", handleUpdate);
    return () =>
      window.removeEventListener("geocam:translations-updated", handleUpdate);
  }, []);

  const filteredTranslations = useMemo(() => {
    const s = search.trim().toLowerCase();
    return translations.filter((item) => {
      if (filter === "custom" && !item.isCustom) return false;
      if (filter === "builtin" && item.isCustom) return false;
      if (!s) return true;
      return (
        item.english.toLowerCase().includes(s) ||
        item.khmer.toLowerCase().includes(s)
      );
    });
  }, [translations, search, filter]);

  const handleStartEdit = (item: TranslationRow) => {
    setEditingKey(item.english);
    setEditingValue(item.khmer);
  };

  const handleSaveEdit = (english: string) => {
    if (!editingValue.trim()) return;
    saveCustomTranslation(english, editingValue.trim());
    setEditingKey(null);
    setEditingValue("");
    setSavedNotice(`Updated translation for "${english}"`);
    setTimeout(() => setSavedNotice(null), 3000);
    refresh();
  };

  const handleResetDefault = (english: string) => {
    deleteCustomTranslation(english);
    setSavedNotice(`Reset "${english}" to system default`);
    setTimeout(() => setSavedNotice(null), 3000);
    refresh();
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnglish.trim() || !newKhmer.trim()) return;
    saveCustomTranslation(newEnglish.trim(), newKhmer.trim());
    setNewEnglish("");
    setNewKhmer("");
    setShowAddForm(false);
    setSavedNotice("Added new custom translation!");
    setTimeout(() => setSavedNotice(null), 3000);
    refresh();
  };

  const handleExportJson = () => {
    const fullDict: Record<string, string> = {};
    translations.forEach((t) => {
      fullDict[t.english] = t.khmer;
    });
    const blob = new Blob([JSON.stringify(fullDict, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "public-km.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const customCount = translations.filter((t) => t.isCustom).length;

  return (
    <div className="translation-manager" style={{ padding: "0 20px 40px" }}>
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              margin: 0,
              fontSize: "24px",
              fontWeight: 800,
            }}
          >
            <Languages size={26} style={{ color: "var(--wp-primary, #059669)" }} />
            <span>Translation Manager (English ↔ Khmer)</span>
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "13px",
              color: "var(--wp-text-muted, #64748b)",
            }}
          >
            Review, correct, and customize translations. Changes apply
            immediately in real time across the entire site.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="button button-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <Plus size={16} />
            <span>Add Translation</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="button"
            title="Download full dictionary JSON (public-km.json)"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              fontSize: "13px",
            }}
          >
            <Download size={15} />
            <span>Export Dictionary JSON</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedNotice && (
        <div
          style={{
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#065f46",
            padding: "10px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <Check size={16} />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Add New Translation Form Modal/Collapse */}
      {showAddForm && (
        <div
          className="postbox"
          style={{
            marginBottom: "20px",
            border: "2px solid var(--wp-primary, #059669)",
            borderRadius: "8px",
            padding: "18px",
            background: "#fff",
          }}
        >
          <h3 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: 700 }}>
            Add Custom Translation Pair
          </h3>
          <form onSubmit={handleAddNew}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  English Source Text:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Earthquake Monitoring"
                  value={newEnglish}
                  onChange={(e) => setNewEnglish(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  Khmer Translation:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ការតាមដានការរញ្ជួយដី"
                  value={newKhmer}
                  onChange={(e) => setNewKhmer(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                className="button button-primary"
                style={{ padding: "6px 14px", fontSize: "13px", fontWeight: 600 }}
              >
                Save Translation
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="button"
                style={{ padding: "6px 14px", fontSize: "13px" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="tablenav top"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ position: "relative", width: "280px" }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "10px",
                top: "9px",
                color: "#94a3b8",
              }}
            />
            <input
              type="search"
              placeholder="Search English or Khmer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: "32px",
                height: "32px",
                width: "100%",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "12px",
              }}
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            style={{
              height: "32px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "12px",
            }}
          >
            <option value="all">All ({translations.length})</option>
            <option value="custom">Custom Overrides ({customCount})</option>
            <option value="builtin">
              Built-in Dictionary ({translations.length - customCount})
            </option>
          </select>
        </div>

        <span style={{ fontSize: "12px", color: "#64748b" }}>
          Showing <strong>{filteredTranslations.length}</strong> translation pairs
        </span>
      </div>

      {/* Translations Table */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <table
          className="wp-list-table widefat fixed striped"
          style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}
        >
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <th
                style={{
                  width: "40%",
                  padding: "12px 14px",
                  textAlign: "left",
                  fontWeight: 700,
                }}
              >
                English Text (Source)
              </th>
              <th
                style={{
                  width: "42%",
                  padding: "12px 14px",
                  textAlign: "left",
                  fontWeight: 700,
                }}
              >
                Khmer Translation
              </th>
              <th
                style={{
                  width: "18%",
                  padding: "12px 14px",
                  textAlign: "right",
                  fontWeight: 700,
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTranslations.length > 0 ? (
              filteredTranslations.map((item) => {
                const isEditing = editingKey === item.english;

                return (
                  <tr
                    key={item.english}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      background: item.isCustom ? "#f0fdf4" : undefined,
                    }}
                  >
                    {/* English Column */}
                    <td
                      style={{
                        padding: "10px 14px",
                        verticalAlign: "middle",
                        fontWeight: 600,
                        color: "#1e293b",
                      }}
                    >
                      <span>{item.english}</span>
                      {item.isCustom && (
                        <span
                          style={{
                            marginLeft: "8px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "1px 6px",
                            borderRadius: "10px",
                            background: "#dcfce7",
                            color: "#166534",
                            border: "1px solid #bbf7d0",
                          }}
                        >
                          <Sparkles size={9} /> Custom Override
                        </span>
                      )}
                    </td>

                    {/* Khmer Column */}
                    <td style={{ padding: "10px 14px", verticalAlign: "middle" }}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(item.english);
                            if (e.key === "Escape") setEditingKey(null);
                          }}
                          autoFocus
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: "4px",
                            border: "2px solid #059669",
                            fontSize: "13px",
                          }}
                        />
                      ) : (
                        <span style={{ color: "#0f172a", fontSize: "14px" }}>
                          {item.khmer}
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td
                      style={{
                        padding: "10px 14px",
                        textAlign: "right",
                        verticalAlign: "middle",
                      }}
                    >
                      {isEditing ? (
                        <div
                          style={{
                            display: "inline-flex",
                            gap: "6px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(item.english)}
                            className="button button-primary"
                            style={{
                              padding: "2px 8px",
                              fontSize: "11px",
                              height: "auto",
                              fontWeight: 700,
                            }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingKey(null)}
                            className="button"
                            style={{
                              padding: "2px 8px",
                              fontSize: "11px",
                              height: "auto",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "inline-flex",
                            gap: "6px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            className="button"
                            style={{
                              padding: "2px 8px",
                              fontSize: "11px",
                              height: "auto",
                            }}
                          >
                            Edit
                          </button>

                          {item.isCustom && (
                            <button
                              type="button"
                              onClick={() => handleResetDefault(item.english)}
                              className="button"
                              title="Reset back to system default translation"
                              style={{
                                padding: "2px 8px",
                                fontSize: "11px",
                                height: "auto",
                                color: "#b91c1c",
                              }}
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={3}
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#94a3b8",
                  }}
                >
                  No translation pairs match your search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Instructions & Help Card */}
      <div
        className="postbox"
        style={{
          marginTop: "24px",
          borderRadius: "8px",
          padding: "18px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
        }}
      >
        <h4
          style={{
            margin: "0 0 10px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          <HelpCircle size={16} style={{ color: "#059669" }} />
          How Translation and Corrections Work
        </h4>
        <ul
          style={{
            margin: 0,
            paddingLeft: "20px",
            fontSize: "13px",
            color: "#475569",
            lineHeight: "1.7",
          }}
        >
          <li>
            <strong>How to correct a wrong translation:</strong> Simply find the
            phrase above, click <strong>"Edit"</strong>, type the correct Khmer
            text, and click <strong>"Save"</strong>. The entire website updates
            immediately!
          </li>
          <li>
            <strong>Automatic Bidirectional Translation:</strong> When you edit
            content in the English page, it automatically translates and updates
            the Khmer page. When you edit in Khmer, it reverse-translates and
            updates the English page.
          </li>
          <li>
            <strong>Strict Language Separation:</strong> English pages will never
            display un-translated Khmer glyphs. If a custom Khmer text lacks an
            English translation, it falls back cleanly to the original English
            text.
          </li>
          <li>
            <strong>Permanent Codebase Sync:</strong> You can click{" "}
            <strong>"Export Dictionary JSON"</strong> to download{" "}
            <code>public-km.json</code> and commit it to git so that your custom
            corrections become permanent defaults in the repository.
          </li>
        </ul>
      </div>
    </div>
  );
}
