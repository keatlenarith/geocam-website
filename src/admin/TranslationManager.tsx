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
  FileText,
  CheckCircle2,
  Filter,
  ExternalLink,
  Edit2,
  X,
  UploadCloud,
} from "lucide-react";
import {
  getAllTranslations,
  saveCustomTranslation,
  deleteCustomTranslation,
  getCustomTranslations,
  translateText,
} from "../lib/translation";
import { useCms } from "../visual-cms/VisualCms";

interface TranslationRow {
  english: string;
  khmer: string;
  isCustom: boolean;
}

export default function TranslationManager() {
  const {
    draft,
    published,
    setEntry,
    acceptFieldTranslation,
    approveFieldTranslation,
    publish,
    dirty,
    busy,
  } = useCms();

  // Top-level tab: 'glossary' (technical dictionary) vs 'pages' (page content translations & review)
  const [activeTab, setActiveTab] = useState<"glossary" | "pages">("glossary");

  // ---------------------------------------------------------------------------
  // TAB 1: TECHNICAL GLOSSARY STATE
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // TAB 2: PAGE CONTENT TRANSLATIONS & STATUS REVIEW
  // ---------------------------------------------------------------------------
  const [contentStatusFilter, setContentStatusFilter] = useState<
    "all" | "review" | "approved" | "draft"
  >("all");
  const [contentPageFilter, setContentPageFilter] = useState<string>("all");
  const [contentSearch, setContentSearch] = useState<string>("");
  const [editingContentKey, setEditingContentKey] = useState<string | null>(null);
  const [editingContentValue, setEditingContentValue] = useState<string>("");

  const pageContentRows = useMemo(() => {
    const rows: Array<{
      page: string;
      key: string;
      enValue: string;
      kmValue: string;
      status: "Draft" | "Needs Review" | "Approved";
      suggestedValue: string;
      sourceValue: string;
      manuallyEdited: boolean;
    }> = [];

    const activeStore = (draft && Object.keys(draft).length > 0) ? draft : (published || {});
    const basePages = new Set<string>();
    Object.keys(activeStore).forEach((p) => {
      if (p.startsWith("__")) return;
      basePages.add(p.replace(/::(en|km)$/, ""));
    });

    Array.from(basePages)
      .sort()
      .forEach((basePage) => {
        const enFields = activeStore[`${basePage}::en`] || {};
        const kmFields = activeStore[`${basePage}::km`] || {};
        const allKeys = new Set([...Object.keys(enFields), ...Object.keys(kmFields)]);

        allKeys.forEach((key) => {
          if (key.startsWith("__")) return;
          const enEntry = enFields[key];
          const kmEntry = kmFields[key];

          // Text content only
          if (enEntry?.kind === "image" || kmEntry?.kind === "image") return;

          const enVal = enEntry?.value || "";
          const kmVal = kmEntry?.value || (enVal ? translateText(enVal) : "");
          const status =
            kmEntry?.status ||
            (kmEntry?.manuallyEdited
              ? "Approved"
              : kmEntry?.value
              ? "Approved"
              : "Draft");
          const suggestedValue =
            kmEntry?.suggestedValue || (enVal ? translateText(enVal) : "");
          const sourceValue = kmEntry?.sourceValue || enVal;
          const manuallyEdited = kmEntry?.manuallyEdited || false;

          rows.push({
            page: basePage,
            key,
            enValue: enVal,
            kmValue: kmVal,
            status,
            suggestedValue,
            sourceValue,
            manuallyEdited,
          });
        });
      });

    return rows;
  }, [draft, published]);

  const uniquePages = useMemo(() => {
    const set = new Set<string>();
    pageContentRows.forEach((r) => set.add(r.page));
    return Array.from(set).sort();
  }, [pageContentRows]);

  const filteredContentRows = useMemo(() => {
    const q = contentSearch.trim().toLowerCase();
    return pageContentRows.filter((r) => {
      if (contentStatusFilter === "review" && r.status !== "Needs Review")
        return false;
      if (contentStatusFilter === "approved" && r.status !== "Approved")
        return false;
      if (contentStatusFilter === "draft" && r.status !== "Draft")
        return false;
      if (contentPageFilter !== "all" && r.page !== contentPageFilter)
        return false;
      if (!q) return true;
      return (
        r.page.toLowerCase().includes(q) ||
        r.key.toLowerCase().includes(q) ||
        r.enValue.toLowerCase().includes(q) ||
        r.kmValue.toLowerCase().includes(q)
      );
    });
  }, [pageContentRows, contentStatusFilter, contentPageFilter, contentSearch]);

  const totalReviewsCount = useMemo(
    () => pageContentRows.filter((r) => r.status === "Needs Review").length,
    [pageContentRows],
  );
  const totalApprovedCount = useMemo(
    () => pageContentRows.filter((r) => r.status === "Approved").length,
    [pageContentRows],
  );
  const totalDraftCount = useMemo(
    () => pageContentRows.filter((r) => r.status === "Draft").length,
    [pageContentRows],
  );

  const handleSaveKhmerContent = (page: string, key: string) => {
    if (!editingContentValue.trim()) return;
    // Allow administrators to edit and save Khmer independently, WITHOUT modifying English:
    setEntry(`${page}::km`, key, {
      kind: "text",
      value: editingContentValue.trim(),
      status: "Approved",
      manuallyEdited: true,
      suggestedValue: undefined,
    });
    setEditingContentKey(null);
    setEditingContentValue("");
    setSavedNotice(`Saved Khmer translation for "${page} -> ${key}"`);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleApproveAllReviews = () => {
    const reviewItems = pageContentRows.filter((r) => r.status === "Needs Review");
    reviewItems.forEach((r) => {
      approveFieldTranslation(r.page, r.key);
    });
    setSavedNotice(`Approved ${reviewItems.length} Khmer translations as current.`);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleAcceptAllSuggestions = () => {
    const reviewItems = pageContentRows.filter((r) => r.status === "Needs Review");
    reviewItems.forEach((r) => {
      acceptFieldTranslation(r.page, r.key);
    });
    setSavedNotice(
      `Accepted glossary suggestions for ${reviewItems.length} Khmer translations.`,
    );
    setTimeout(() => setSavedNotice(null), 3000);
  };

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
          marginBottom: "16px",
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
            <span>Translation & Bilingual Management (English ↔ Khmer)</span>
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "13px",
              color: "var(--wp-text-muted, #64748b)",
            }}
          >
            English is the source language. Preserves manually corrected Khmer
            translations, tracks translation statuses, and allows independent
            bilingual editing.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {activeTab === "glossary" && (
            <>
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
            </>
          )}

          {activeTab === "pages" && dirty && (
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                try {
                  await publish();
                  setSavedNotice("Published all translation changes live to website!");
                  setTimeout(() => setSavedNotice(null), 4000);
                } catch {
                  setSavedNotice("Publish failed. Please try again.");
                }
              }}
              className="button button-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 16px",
                fontSize: "13px",
                fontWeight: 700,
                backgroundColor: "#059669",
              }}
            >
              <UploadCloud size={16} />
              <span>Publish Translation Changes Live</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "2px solid #e2e8f0",
          marginBottom: "16px",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("glossary")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            fontSize: "14px",
            fontWeight: 700,
            background: "none",
            border: "none",
            borderBottom:
              activeTab === "glossary"
                ? "3px solid #059669"
                : "3px solid transparent",
            color: activeTab === "glossary" ? "#059669" : "#64748b",
            cursor: "pointer",
            marginBottom: "-2px",
            transition: "all 0.15s ease",
          }}
        >
          <Languages size={18} />
          <span>Technical Glossary Dictionary</span>
          <span
            style={{
              fontSize: "11px",
              padding: "2px 7px",
              borderRadius: "999px",
              background: activeTab === "glossary" ? "#d1fae5" : "#f1f5f9",
              color: activeTab === "glossary" ? "#065f46" : "#64748b",
              fontWeight: 700,
            }}
          >
            {translations.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pages")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            fontSize: "14px",
            fontWeight: 700,
            background: "none",
            border: "none",
            borderBottom:
              activeTab === "pages"
                ? "3px solid #059669"
                : "3px solid transparent",
            color: activeTab === "pages" ? "#059669" : "#64748b",
            cursor: "pointer",
            marginBottom: "-2px",
            transition: "all 0.15s ease",
          }}
        >
          <FileText size={18} />
          <span>Page Content Translations & Status Review</span>
          {totalReviewsCount > 0 && (
            <span
              style={{
                fontSize: "11px",
                padding: "2px 7px",
                borderRadius: "999px",
                background: "#fef3c7",
                color: "#92400e",
                fontWeight: 800,
                border: "1px solid #fcd34d",
              }}
            >
              ⚠️ {totalReviewsCount} Review
            </span>
          )}
          <span
            style={{
              fontSize: "11px",
              padding: "2px 7px",
              borderRadius: "999px",
              background: activeTab === "pages" ? "#d1fae5" : "#f1f5f9",
              color: activeTab === "pages" ? "#065f46" : "#64748b",
              fontWeight: 700,
            }}
          >
            {pageContentRows.length}
          </span>
        </button>
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

      {/* =====================================================================
          TAB 1: TECHNICAL GLOSSARY (DICTIONARY)
         ===================================================================== */}
      {activeTab === "glossary" && (
        <>
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
              Showing <strong>{filteredTranslations.length}</strong> translation
              pairs
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
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "var(--wp-bg-surface, #f8fafc)",
                    borderBottom: "1px solid var(--wp-border, #e2e8f0)",
                    color: "var(--wp-text-muted, #64748b)",
                  }}
                >
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
                          borderBottom: "1px solid var(--wp-border, #f1f5f9)",
                          background: item.isCustom ? "rgba(16, 185, 129, 0.12)" : "transparent",
                        }}
                      >
                        {/* English Column */}
                        <td
                          style={{
                            padding: "10px 14px",
                            verticalAlign: "middle",
                            fontWeight: 600,
                            color: "var(--wp-text-primary, #1e293b)",
                          }}
                        >
                          <span>{item.english}</span>
                          {item.isCustom && (
                            <span
                              style={{
                                marginLeft: "8px",
                                background: "#dcfce7",
                                color: "#15803d",
                                fontSize: "11px",
                                fontWeight: 700,
                                padding: "2px 6px",
                                borderRadius: "4px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                            >
                              <Sparkles size={11} /> Custom
                            </span>
                          )}
                        </td>

                        {/* Khmer Column */}
                        <td
                          style={{
                            padding: "10px 14px",
                            verticalAlign: "middle",
                            fontFamily:
                              "var(--font-khmer, 'Kantumruy Pro', 'Hanuman', sans-serif)",
                            fontSize: "14px",
                            color: "var(--wp-text-primary, #0f172a)",
                          }}
                        >
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleSaveEdit(item.english);
                                if (e.key === "Escape") setEditingKey(null);
                              }}
                              style={{
                                width: "100%",
                                padding: "6px 8px",
                                borderRadius: "4px",
                                border: "1px solid #059669",
                                fontSize: "14px",
                                fontFamily: "inherit",
                              }}
                            />
                          ) : (
                            <span>{item.khmer}</span>
                          )}
                        </td>

                        {/* Actions Column */}
                        <td
                          style={{
                            padding: "10px 14px",
                            verticalAlign: "middle",
                            textAlign: "right",
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
                                  padding: "4px 10px",
                                  fontSize: "12px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                <Save size={13} /> Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingKey(null)}
                                className="button"
                                style={{ padding: "4px 10px", fontSize: "12px" }}
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
                                style={{ padding: "4px 10px", fontSize: "12px" }}
                              >
                                Edit
                              </button>
                              {item.isCustom && (
                                <button
                                  type="button"
                                  onClick={() => handleResetDefault(item.english)}
                                  className="button"
                                  title="Reset to system default translation"
                                  style={{
                                    padding: "4px 8px",
                                    fontSize: "12px",
                                    color: "#64748b",
                                  }}
                                >
                                  <RotateCcw size={13} />
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
                        padding: "36px",
                        textAlign: "center",
                        color: "#94a3b8",
                      }}
                    >
                      <AlertCircle
                        size={28}
                        style={{ margin: "0 auto 8px", opacity: 0.6 }}
                      />
                      <p style={{ margin: 0 }}>
                        No translations match your search criteria.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* =====================================================================
          TAB 2: PAGE CONTENT TRANSLATIONS & STATUS REVIEW
         ===================================================================== */}
      {activeTab === "pages" && (
        <div>
          {/* Status Breakdown & Filter Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "14px",
              background: "var(--wp-bg-card, #fff)",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid var(--wp-border, #e2e8f0)",
            }}
          >
            {/* Filter Pills */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <button
                type="button"
                onClick={() => setContentStatusFilter("all")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border:
                    contentStatusFilter === "all"
                      ? "1px solid #059669"
                      : "1px solid #cbd5e1",
                  background:
                    contentStatusFilter === "all" ? "#ecfdf5" : "#f8fafc",
                  color: contentStatusFilter === "all" ? "#065f46" : "#475569",
                }}
              >
                All Content ({pageContentRows.length})
              </button>

              <button
                type="button"
                onClick={() => setContentStatusFilter("review")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                  border:
                    contentStatusFilter === "review"
                      ? "1px solid #f59e0b"
                      : "1px solid #fde68a",
                  background:
                    contentStatusFilter === "review" ? "#fef3c7" : "#fffbeb",
                  color: "#92400e",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <span>⚠️ Needs Review</span>
                <span
                  style={{
                    background: "#f59e0b",
                    color: "#fff",
                    padding: "1px 6px",
                    borderRadius: "999px",
                    fontSize: "11px",
                  }}
                >
                  {totalReviewsCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setContentStatusFilter("approved")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border:
                    contentStatusFilter === "approved"
                      ? "1px solid #10b981"
                      : "1px solid #cbd5e1",
                  background:
                    contentStatusFilter === "approved" ? "#ecfdf5" : "#f8fafc",
                  color:
                    contentStatusFilter === "approved" ? "#065f46" : "#475569",
                }}
              >
                ✓ Approved ({totalApprovedCount})
              </button>

              <button
                type="button"
                onClick={() => setContentStatusFilter("draft")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border:
                    contentStatusFilter === "draft"
                      ? "1px solid #38bdf8"
                      : "1px solid #cbd5e1",
                  background:
                    contentStatusFilter === "draft" ? "#f0f9ff" : "#f8fafc",
                  color: contentStatusFilter === "draft" ? "#0369a1" : "#475569",
                }}
              >
                ✎ Draft ({totalDraftCount})
              </button>

              <span
                style={{
                  height: "20px",
                  width: "1px",
                  background: "#e2e8f0",
                  margin: "0 4px",
                }}
              />

              {/* Page Filter Dropdown */}
              <select
                value={contentPageFilter}
                onChange={(e) => setContentPageFilter(e.target.value)}
                style={{
                  height: "30px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px",
                  padding: "0 8px",
                }}
              >
                <option value="all">All Pages ({uniquePages.length})</option>
                {uniquePages.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Action Buttons */}
            {totalReviewsCount > 0 && (
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={handleApproveAllReviews}
                  className="button"
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "4px 10px",
                  }}
                >
                  ✓ Keep Current & Approve All
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAllSuggestions}
                  className="button button-primary"
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "4px 12px",
                    background: "#d97706",
                  }}
                >
                  ✨ Accept All Suggestions ({totalReviewsCount})
                </button>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: "12px", position: "relative" }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "10px",
                top: "10px",
                color: "#94a3b8",
              }}
            />
            <input
              type="search"
              placeholder="Filter page content by page, element key, English text, or Khmer translation..."
              value={contentSearch}
              onChange={(e) => setContentSearch(e.target.value)}
              style={{
                paddingLeft: "32px",
                height: "34px",
                width: "100%",
                borderRadius: "6px",
                border: "1px solid var(--wp-input-border, #cbd5e1)",
                fontSize: "12px",
                background: "var(--wp-input-bg, #fff)",
                color: "var(--wp-input-text, #0f172a)",
              }}
            />
          </div>

          {/* Page Content Table */}
          <div
            style={{
              background: "var(--wp-bg-card, #fff)",
              border: "1px solid var(--wp-border, #e2e8f0)",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <table
              className="wp-list-table widefat fixed striped"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "var(--wp-bg-surface, #f8fafc)",
                    borderBottom: "1px solid var(--wp-border, #e2e8f0)",
                    color: "var(--wp-text-muted, #64748b)",
                  }}
                >
                  <th
                    style={{
                      width: "16%",
                      padding: "10px 12px",
                      textAlign: "left",
                      fontWeight: 700,
                    }}
                  >
                    Page & Key
                  </th>
                  <th
                    style={{
                      width: "12%",
                      padding: "10px 12px",
                      textAlign: "left",
                      fontWeight: 700,
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      width: "32%",
                      padding: "10px 12px",
                      textAlign: "left",
                      fontWeight: 700,
                    }}
                  >
                    English Source
                  </th>
                  <th
                    style={{
                      width: "28%",
                      padding: "10px 12px",
                      textAlign: "left",
                      fontWeight: 700,
                    }}
                  >
                    Khmer Translation
                  </th>
                  <th
                    style={{
                      width: "12%",
                      padding: "10px 12px",
                      textAlign: "right",
                      fontWeight: 700,
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContentRows.length > 0 ? (
                  filteredContentRows.map((row) => {
                    const rowId = `${row.page}::${row.key}`;
                    const isEditing = editingContentKey === rowId;
                    const isReview = row.status === "Needs Review";

                    return (
                      <tr
                        key={rowId}
                        style={{
                          borderBottom: "1px solid var(--wp-border, #f1f5f9)",
                          background: isReview
                            ? "rgba(245, 158, 11, 0.12)"
                            : row.manuallyEdited
                            ? "rgba(16, 185, 129, 0.08)"
                            : "transparent",
                        }}
                      >
                        {/* Page & Key */}
                        <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                          <span
                            style={{
                              display: "inline-block",
                              background: "#f1f5f9",
                              color: "#0f172a",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontFamily: "monospace",
                              fontWeight: 700,
                              marginBottom: "3px",
                            }}
                          >
                            {row.page}
                          </span>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#64748b",
                              fontFamily: "monospace",
                              wordBreak: "break-all",
                            }}
                          >
                            {row.key}
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                          {row.status === "Needs Review" ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                background: "#fef3c7",
                                color: "#92400e",
                                border: "1px solid #fcd34d",
                                padding: "2px 8px",
                                borderRadius: "999px",
                                fontSize: "11px",
                                fontWeight: 800,
                              }}
                            >
                              ⚠️ Needs Review
                            </span>
                          ) : row.status === "Approved" ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                background: "#dcfce7",
                                color: "#166534",
                                border: "1px solid #86efac",
                                padding: "2px 8px",
                                borderRadius: "999px",
                                fontSize: "11px",
                                fontWeight: 700,
                              }}
                            >
                              ✓ Approved
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                background: "#f0f9ff",
                                color: "#0369a1",
                                border: "1px solid #bae6fd",
                                padding: "2px 8px",
                                borderRadius: "999px",
                                fontSize: "11px",
                                fontWeight: 600,
                              }}
                            >
                              ✎ Draft
                            </span>
                          )}

                          {row.manuallyEdited && (
                            <div
                              style={{
                                fontSize: "10px",
                                color: "#059669",
                                fontWeight: 600,
                                marginTop: "3px",
                              }}
                            >
                              Manual correction
                            </div>
                          )}
                        </td>

                        {/* English Source */}
                        <td
                          style={{
                            padding: "10px 12px",
                            verticalAlign: "top",
                            color: "var(--wp-text-primary, #1e293b)",
                            fontSize: "12px",
                          }}
                        >
                          <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                            {row.enValue || (
                              <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
                                (Empty)
                              </span>
                            )}
                          </div>
                          {row.sourceValue && row.sourceValue !== row.enValue && (
                            <div
                              style={{
                                fontSize: "10px",
                                color: "#64748b",
                                marginTop: "4px",
                              }}
                            >
                              Previous source: {row.sourceValue}
                            </div>
                          )}
                        </td>

                        {/* Khmer Translation */}
                        <td
                          style={{
                            padding: "10px 12px",
                            verticalAlign: "top",
                            fontFamily:
                              "var(--font-khmer, 'Kantumruy Pro', 'Hanuman', sans-serif)",
                            fontSize: "13px",
                            color: "var(--wp-text-primary, #0f172a)",
                          }}
                        >
                          {isEditing ? (
                            <div>
                              <textarea
                                value={editingContentValue}
                                onChange={(e) =>
                                  setEditingContentValue(e.target.value)
                                }
                                rows={3}
                                style={{
                                  width: "100%",
                                  padding: "6px 8px",
                                  borderRadius: "6px",
                                  border: "1px solid #059669",
                                  fontSize: "13px",
                                  fontFamily: "inherit",
                                }}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  gap: "6px",
                                  marginTop: "6px",
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSaveKhmerContent(row.page, row.key)
                                  }
                                  className="button button-primary"
                                  style={{
                                    fontSize: "11px",
                                    padding: "3px 8px",
                                  }}
                                >
                                  Save Khmer
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingContentKey(null)}
                                  className="button"
                                  style={{
                                    fontSize: "11px",
                                    padding: "3px 8px",
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div
                                style={{ maxHeight: "100px", overflowY: "auto" }}
                              >
                                {row.kmValue}
                              </div>

                              {isReview && row.suggestedValue && (
                                <div
                                  style={{
                                    marginTop: "6px",
                                    padding: "6px 8px",
                                    background: "#fef3c7",
                                    borderRadius: "4px",
                                    border: "1px solid #fde68a",
                                    fontSize: "12px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: 800,
                                      color: "#b45309",
                                      display: "block",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    Technical Glossary Suggestion:
                                  </span>
                                  <span style={{ color: "#78350f" }}>
                                    {row.suggestedValue}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td
                          style={{
                            padding: "10px 12px",
                            verticalAlign: "top",
                            textAlign: "right",
                          }}
                        >
                          {!isEditing && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                                alignItems: "flex-end",
                              }}
                            >
                              {isReview && row.suggestedValue && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    acceptFieldTranslation(row.page, row.key)
                                  }
                                  className="button button-primary"
                                  style={{
                                    fontSize: "11px",
                                    padding: "3px 8px",
                                    background: "#d97706",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "3px",
                                  }}
                                >
                                  <Sparkles size={12} /> Accept Suggestion
                                </button>
                              )}

                              {row.status !== "Approved" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    approveFieldTranslation(row.page, row.key)
                                  }
                                  className="button"
                                  style={{
                                    fontSize: "11px",
                                    padding: "3px 8px",
                                    color: "#166534",
                                    borderColor: "#86efac",
                                    background: "#f0fdf4",
                                  }}
                                >
                                  ✓ Approve Current
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingContentKey(rowId);
                                  setEditingContentValue(row.kmValue);
                                }}
                                className="button"
                                style={{ fontSize: "11px", padding: "3px 8px" }}
                              >
                                Edit Khmer
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "36px",
                        textAlign: "center",
                        color: "#94a3b8",
                      }}
                    >
                      <AlertCircle
                        size={28}
                        style={{ margin: "0 auto 8px", opacity: 0.6 }}
                      />
                      <p style={{ margin: 0 }}>
                        No page content entries match your filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Card at Bottom */}
      <div
        className="postbox"
        style={{
          marginTop: "24px",
          padding: "16px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          fontSize: "12px",
          color: "#475569",
        }}
      >
        <h4
          style={{
            margin: "0 0 6px",
            fontSize: "13px",
            fontWeight: 700,
            color: "#1e293b",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <HelpCircle size={15} style={{ color: "#059669" }} />
          <span>Bilingual Storage & Translation Status Guidelines</span>
        </h4>
        <ul style={{ margin: "4px 0 0", paddingLeft: "20px", lineHeight: "1.7" }}>
          <li>
            <strong>Source Language:</strong> English is always the master
            source. Updating English automatically flags corresponding Khmer
            translations with <em>Needs Review</em> and provides updated
            technical glossary suggestions.
          </li>
          <li>
            <strong>Preservation of Manual Corrections:</strong> When English
            changes, any manually edited or approved Khmer translation is{" "}
            <strong>NEVER deleted or overwritten</strong>. It is preserved safely
            and flagged for administrator review.
          </li>
          <li>
            <strong>Independent Khmer Editing:</strong> Administrators can modify
            Khmer translations at any time without altering English content.
          </li>
          <li>
            <strong>Shared Layout & Design:</strong> Images and block dimensions
            are shared synchronously across both languages, while text content
            is kept completely separate.
          </li>
        </ul>
      </div>
    </div>
  );
}
