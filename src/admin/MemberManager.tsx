import React, { useState, useEffect, useMemo } from "react";
import {
  getMembers,
  saveMember,
  updateMemberLevel,
  updateMemberStatus,
  toggleDirectoryVisibility,
  deleteMember,
  resetMembers,
  getApplications,
  approveApplication,
  rejectApplication,
  deleteApplication,
  resetApplications,
  subscribeMembers,
  MEMBER_LEVELS,
  MEMBER_STATUSES,
  type Member,
  type MemberLevel,
  type MemberStatus,
  type Application,
} from "@/lib/member-service";
import { useI18n } from "@/lib/i18n";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Search,
  Filter,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Download,
  RotateCcw,
  GraduationCap,
  Briefcase,
  Award,
  Building2,
  Crown,
  FileCheck2,
  Mail,
  Calendar,
  Building,
  AlertTriangle,
} from "lucide-react";

export function MemberManager() {
  const { lang } = useI18n();
  const km = lang === "km";

  // Data state
  const [members, setMembers] = useState<Member[]>(() => getMembers());
  const [applications, setApplications] = useState<Application[]>(() => getApplications());

  // Navigation & filters
  const [activeTab, setActiveTab] = useState<"roster" | "applications">("roster");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Notification banners
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<Member> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [appTargetToApprove, setAppTargetToApprove] = useState<{ app: Application; level: MemberLevel } | null>(null);

  // Sync data with storage events
  useEffect(() => {
    const unsub = subscribeMembers(() => {
      setMembers(getMembers());
      setApplications(getApplications());
    });
    return unsub;
  }, []);

  const showNotice = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Filter members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (selectedLevel !== "ALL" && m.level !== selectedLevel) return false;
      if (selectedStatus !== "ALL" && m.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = m.name?.toLowerCase().includes(q) || m.nameKm?.includes(q);
        const matchEmail = m.email?.toLowerCase().includes(q);
        const matchAff = m.affiliation?.toLowerCase().includes(q) || m.affiliationKm?.includes(q);
        const matchField = m.field?.toLowerCase().includes(q) || m.fieldKm?.includes(q);
        return matchName || matchEmail || matchAff || matchField;
      }
      return true;
    });
  }, [members, searchQuery, selectedLevel, selectedStatus]);

  // Metric counts
  const metrics = useMemo(() => {
    const total = members.length;
    const active = members.filter((m) => m.status === "Active" || !m.status).length;
    const pendingApps = applications.filter((a) => a.status === "pending").length;
    const byLevel: Record<string, number> = {};
    MEMBER_LEVELS.forEach((l) => {
      byLevel[l.id] = members.filter((m) => m.level === l.id).length;
    });
    return { total, active, pendingApps, byLevel };
  }, [members, applications]);

  // Level badge helper
  const getLevelInfo = (level?: MemberLevel) => {
    const found = MEMBER_LEVELS.find((l) => l.id === level);
    return (
      found || {
        id: "Professional" as MemberLevel,
        en: "Professional",
        km: "អ្នកជំនាញ",
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
        descriptionEn: "",
        descriptionKm: "",
      }
    );
  };

  const getStatusInfo = (status?: MemberStatus) => {
    const found = MEMBER_STATUSES.find((s) => s.id === status);
    return (
      found || {
        id: "Active" as MemberStatus,
        en: "Active",
        km: "សកម្ម",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-300",
      }
    );
  };

  // Handler: Level Change via inline tool
  const handleQuickLevelChange = (id: string, newLevel: MemberLevel) => {
    const updated = updateMemberLevel(id, newLevel);
    if (updated) {
      setMembers(getMembers());
      showNotice(
        km
          ? `បានប្តូរកម្រិតសមាជិកភាពរបស់ ${updated.name} ទៅជា «${getLevelInfo(newLevel).km}»`
          : `Updated ${updated.name}'s membership level to "${newLevel}"`
      );
    }
  };

  // Handler: Status Change
  const handleToggleStatus = (member: Member) => {
    const newStatus: MemberStatus = member.status === "Active" || !member.status ? "Inactive" : "Active";
    const updated = updateMemberStatus(member.id, newStatus);
    if (updated) {
      setMembers(getMembers());
      showNotice(
        km
          ? `បានប្តូរស្ថានភាព ${updated.name} ទៅជា ${newStatus === "Active" ? "សកម្ម" : "អសកម្ម"}`
          : `Toggled ${updated.name} to ${newStatus}`
      );
    }
  };

  // Handler: Directory Visibility
  const handleToggleDirectory = (id: string) => {
    const updated = toggleDirectoryVisibility(id);
    if (updated) {
      setMembers(getMembers());
      showNotice(
        km
          ? `បានកែសម្រួលការបង្ហាញក្នុងបញ្ជីសាធារណៈសម្រាប់ ${updated.name}`
          : `Directory visibility updated for ${updated.name}`
      );
    }
  };

  // Handler: Remove Member
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const ok = deleteMember(deleteTarget.id);
    if (ok) {
      setMembers(getMembers());
      showNotice(
        km ? `បានលុបសមាជិក ${deleteTarget.name} ចេញពីបញ្ជី` : `Removed ${deleteTarget.name} from members roster`
      );
    }
    setDeleteTarget(null);
  };

  // Handler: Save Member (Add or Edit)
  const handleSaveMemberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMember?.name || !editingMember?.email) {
      showNotice(km ? "សូមបំពេញឈ្មោះ និងអ៊ីមែល" : "Name and email are required", "error");
      return;
    }

    const saved = saveMember({
      id: editingMember.id,
      name: editingMember.name,
      nameKm: editingMember.nameKm,
      email: editingMember.email,
      phone: editingMember.phone,
      level: editingMember.level || "Professional",
      status: editingMember.status || "Active",
      affiliation: editingMember.affiliation || "Independent Geoscientist",
      affiliationKm: editingMember.affiliationKm,
      field: editingMember.field || "Geosciences",
      fieldKm: editingMember.fieldKm,
      showInDirectory: editingMember.showInDirectory !== undefined ? editingMember.showInDirectory : true,
      joinedDate: editingMember.joinedDate || new Date().toISOString().split("T")[0],
      expiryDate: editingMember.expiryDate,
      notes: editingMember.notes,
    });

    setMembers(getMembers());
    setIsModalOpen(false);
    setEditingMember(null);
    showNotice(
      km
        ? `បានរក្សាទុកព័ត៌មានសមាជិក ${saved.name} ដោយជោគជ័យ`
        : `Successfully saved member details for ${saved.name}`
    );
  };

  // Handler: Approve Application
  const handleApproveApplication = (app: Application, targetLevel?: MemberLevel) => {
    const res = approveApplication(app.id, targetLevel);
    if (res) {
      setApplications(getApplications());
      setMembers(getMembers());
      showNotice(
        km
          ? `បានអនុម័តពាក្យស្នើសុំរបស់ ${res.member.name} និងបានបញ្ចូលជាសមាជិកកម្រិត «${getLevelInfo(res.member.level).km}»`
          : `Approved application for ${res.member.name} and enrolled as ${res.member.level}`
      );
    }
    setAppTargetToApprove(null);
  };

  // Handler: Reject Application
  const handleRejectApplication = (id: string) => {
    const res = rejectApplication(id);
    if (res) {
      setApplications(getApplications());
      showNotice(km ? `បានបដិសេធពាក្យស្នើសុំ #${id}` : `Rejected application #${id}`, "info");
    }
  };

  // Handler: Delete Application
  const handleDeleteApplication = (id: string) => {
    const ok = deleteApplication(id);
    if (ok) {
      setApplications(getApplications());
      showNotice(km ? "បានលុបកំណត់ត្រាពាក្យស្នើសុំ" : "Application record deleted");
    }
  };

  // Handler: Reset demo data
  const handleResetData = () => {
    if (
      window.confirm(
        km
          ? "តើអ្នកពិតជាចង់កំណត់ទិន្នន័យសមាជិកទៅជាទម្រង់ដើមវិញឬទេ?"
          : "Are you sure you want to reset members and applications to the original demo roster?"
      )
    ) {
      const defM = resetMembers();
      const defA = resetApplications();
      setMembers(defM);
      setApplications(defA);
      showNotice(km ? "បានកំណត់ទិន្នន័យសមាជិកឡើងវិញ" : "Reset to default membership dataset");
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Khmer Name",
      "Email",
      "Phone",
      "Level",
      "Status",
      "Affiliation",
      "Field",
      "Directory Listing",
      "Joined Date",
      "Expiry Date",
    ];
    const rows = members.map((m) => [
      `"${m.id}"`,
      `"${m.name || ""}"`,
      `"${m.nameKm || ""}"`,
      `"${m.email || ""}"`,
      `"${m.phone || ""}"`,
      `"${m.level || "Professional"}"`,
      `"${m.status || "Active"}"`,
      `"${m.affiliation || ""}"`,
      `"${m.field || ""}"`,
      m.showInDirectory ? "Yes" : "No",
      `"${m.joinedDate || ""}"`,
      `"${m.expiryDate || ""}"`,
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GeoCam_Members_Roster_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice(km ? "បានទាញយកបញ្ជីសមាជិកជា CSV" : "Exported member roster to CSV");
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              {km ? "ការគ្រប់គ្រងសមាជិក និងកម្រិតសិទ្ធិ" : "Members Directory & Access Management"}
            </h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              GeoCam Registry
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {km
              ? "គ្រប់គ្រងសមាជិកសមាគម កំណត់កម្រិតសមាជិកភាព ពិនិត្យពាក្យស្នើសុំ និងកំណត់ការបង្ហាញលើបញ្ជីសាធារណៈ។"
              : "Manage member roster, set membership tiers/levels, review applicant submissions, and configure directory visibility."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setEditingMember({
                level: "Professional",
                status: "Active",
                showInDirectory: true,
                joinedDate: new Date().toISOString().split("T")[0],
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
          >
            <UserPlus size={16} />
            <span>{km ? "+ បន្ថែមសមាជិកថ្មី" : "+ Add New Member"}</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition"
            title="Export CSV"
          >
            <Download size={15} />
            <span className="hidden sm:inline">{km ? "នាំចេញ CSV" : "Export CSV"}</span>
          </button>
          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
            title="Reset to default demo data"
          >
            <RotateCcw size={15} />
            <span className="hidden md:inline">{km ? "កំណត់ឡើងវិញ" : "Reset Demo"}</span>
          </button>
        </div>
      </div>

      {/* 2. Notification Toast */}
      {notification && (
        <div
          role="status"
          className={`flex items-center gap-2.5 rounded-lg border p-3.5 text-sm font-medium transition ${
            notification.type === "error"
              ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300"
              : notification.type === "info"
                ? "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
                : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
          }`}
        >
          {notification.type === "error" ? (
            <AlertTriangle size={18} className="shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* 3. Metric KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">{km ? "សមាជិកសរុប" : "Total Members"}</span>
            <Users size={16} className="text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{metrics.total}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {metrics.active} {km ? "សកម្ម" : "active"}
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 shadow-2xs dark:border-blue-900/60 dark:bg-blue-950/20">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-300">
            <span className="text-xs font-semibold">{km ? "និស្សិត" : "Students"}</span>
            <GraduationCap size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-900 dark:text-blue-100">
            {metrics.byLevel["Student"] || 0}
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400">
            {km ? "បរិញ្ញាបត្រ & ក្រោយ" : "Undergrad & Postgrad"}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 shadow-2xs dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
            <span className="text-xs font-semibold">{km ? "អ្នកជំនាញ" : "Professionals"}</span>
            <Briefcase size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-900 dark:text-emerald-100">
            {metrics.byLevel["Professional"] || 0}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
            {km ? "អ្នកភូគព្ភវិទ្យា & វិស្វករ" : "Practising Geologists"}
          </div>
        </div>

        <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-3.5 shadow-2xs dark:border-teal-900/60 dark:bg-teal-950/20">
          <div className="flex items-center justify-between text-teal-700 dark:text-teal-300">
            <span className="text-xs font-semibold">{km ? "សហការ & អង្គការ" : "Associates"}</span>
            <Building2 size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold text-teal-900 dark:text-teal-100">
            {metrics.byLevel["Associate"] || 0}
          </div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400">
            {km ? "អ្នកស្រាវជ្រាវ & GIS" : "Researchers & GIS"}
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 shadow-2xs dark:border-amber-900/60 dark:bg-amber-950/20">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-300">
            <span className="text-xs font-semibold">{km ? "កិត្តិយស & ថ្នាក់ដឹកនាំ" : "Fellows & Exec"}</span>
            <Crown size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-900 dark:text-amber-100">
            {(metrics.byLevel["Honorary Fellow"] || 0) + (metrics.byLevel["Executive"] || 0)}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400">
            {km ? "ឥស្សរជន & គណៈកម្មាធិការ" : "Senior & Board"}
          </div>
        </div>

        <div
          onClick={() => setActiveTab("applications")}
          className={`cursor-pointer rounded-xl border p-3.5 shadow-2xs transition ${
            metrics.pendingApps > 0
              ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40 hover:bg-amber-100/70"
              : "border-border bg-card hover:bg-muted/50"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">{km ? "ពាក្យស្នើសុំ" : "Applications"}</span>
            <FileCheck2 size={16} className={metrics.pendingApps > 0 ? "text-amber-600" : "text-muted-foreground"} />
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{metrics.pendingApps}</div>
          <div
            className={`text-[11px] font-semibold ${
              metrics.pendingApps > 0 ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"
            }`}
          >
            {metrics.pendingApps > 0 ? (km ? "រង់ចាំការពិនិត្យ →" : "Pending review →") : km ? "គ្មានរង់ចាំ" : "All reviewed"}
          </div>
        </div>
      </div>

      {/* 4. Tab Navigation */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("roster")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === "roster"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users size={16} />
          <span>{km ? "បញ្ជីសមាជិកផ្លូវការ" : "Members Roster"}</span>
          <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
            {members.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("applications")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === "applications"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileCheck2 size={16} />
          <span>{km ? "ពាក្យស្នើសុំសមាជិកភាព" : "Membership Applications"}</span>
          {metrics.pendingApps > 0 && (
            <span className="ml-1 rounded-full bg-amber-500 text-white px-2 py-0.5 text-xs font-bold animate-pulse">
              {metrics.pendingApps}
            </span>
          )}
        </button>
      </div>

      {/* =========================================================
          VIEW A: MEMBERS ROSTER
          ========================================================= */}
      {activeTab === "roster" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  km ? "ស្វែងរកតាមឈ្មោះ អ៊ីមែល ស្ថាប័ន ឬជំនាញឯកទេស…" : "Search by name, email, affiliation or field…"
                }
                className="w-full rounded-lg border border-border bg-background py-1.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Filter size={14} className="text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">{km ? "កម្រិត៖" : "Level:"}</span>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium focus:border-primary focus:outline-none"
                >
                  <option value="ALL">{km ? "គ្រប់កម្រិតទាំងអស់" : "All Levels"}</option>
                  {MEMBER_LEVELS.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {km ? lvl.km : lvl.en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">{km ? "ស្ថានភាព៖" : "Status:"}</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium focus:border-primary focus:outline-none"
                >
                  <option value="ALL">{km ? "គ្រប់ស្ថានភាព" : "All Statuses"}</option>
                  {MEMBER_STATUSES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {km ? st.km : st.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-2xs">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">{km ? "សមាជិក / អត្តសញ្ញាណ" : "Member / Identity"}</th>
                  <th className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span>{km ? "កម្រិតសមាជិក (កែសម្រួល)" : "Member Level (Edit Tool)"}</span>
                      <Edit3 size={13} className="text-primary" />
                    </div>
                  </th>
                  <th className="px-4 py-3">{km ? "ស្ថាប័ន & ជំនាញឯកទេស" : "Affiliation & Expertise"}</th>
                  <th className="px-4 py-3">{km ? "ស្ថានភាព / បង្ហាញ" : "Status / Directory"}</th>
                  <th className="px-4 py-3 text-right">{km ? "សកម្មភាព" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      <Users size={32} className="mx-auto mb-2 opacity-40" />
                      <p className="font-medium">
                        {km ? "រកមិនឃើញសមាជិកដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ" : "No members match your criteria"}
                      </p>
                      <p className="text-xs mt-1 text-muted-foreground">
                        {km ? "សូមផ្លាស់ប្តូរពាក្យស្វែងរក ឬបន្ថែមសមាជិកថ្មី" : "Try clearing filters or add a new member"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => {
                    const levelInfo = getLevelInfo(member.level);
                    const statusInfo = getStatusInfo(member.status);
                    return (
                      <tr key={member.id} className="hover:bg-muted/30 transition">
                        {/* 1. Identity */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary text-sm">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-1.5">
                                <span>{member.name}</span>
                                {member.nameKm && (
                                  <span className="text-xs text-muted-foreground font-normal">({member.nameKm})</span>
                                )}
                              </div>
                              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <a
                                  href={`mailto:${member.email}`}
                                  className="flex items-center gap-1 hover:text-primary transition"
                                >
                                  <Mail size={12} />
                                  <span>{member.email}</span>
                                </a>
                                {member.phone && <span>· {member.phone}</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Level with Interactive Quick-Edit Tool */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-1.5 max-w-[200px]">
                            {/* Inline quick-edit dropdown */}
                            <select
                              aria-label={`Change level for ${member.name}`}
                              value={member.level || "Professional"}
                              onChange={(e) => handleQuickLevelChange(member.id, e.target.value as MemberLevel)}
                              className={`rounded-md border px-2 py-1 text-xs font-semibold transition cursor-pointer shadow-2xs focus:ring-2 focus:ring-primary focus:outline-none ${levelInfo.badgeClass}`}
                            >
                              {MEMBER_LEVELS.map((lvl) => (
                                <option key={lvl.id} value={lvl.id} className="bg-background text-foreground font-normal">
                                  {km ? lvl.km : lvl.en}
                                </option>
                              ))}
                            </select>
                            <span className="text-[10px] text-muted-foreground line-clamp-1">
                              {km ? levelInfo.descriptionKm : levelInfo.descriptionEn}
                            </span>
                          </div>
                        </td>

                        {/* 3. Affiliation & Expertise */}
                        <td className="px-4 py-3.5">
                          <div className="text-xs">
                            <div className="font-medium text-foreground flex items-center gap-1">
                              <Building size={12} className="text-muted-foreground shrink-0" />
                              <span className="line-clamp-1">{km && member.affiliationKm ? member.affiliationKm : member.affiliation}</span>
                            </div>
                            <div className="mt-1 flex items-center gap-1">
                              <span className="inline-block rounded-md bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground font-medium">
                                {km && member.fieldKm ? member.fieldKm : member.field}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 4. Status & Directory Visibility */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-1 text-xs">
                            <div className="flex items-center gap-2">
                              {/* Status button toggle */}
                              <button
                                onClick={() => handleToggleStatus(member)}
                                title={km ? "ចុចដើម្បីប្តូរស្ថានភាព" : "Click to toggle status"}
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold transition hover:opacity-85 ${statusInfo.badgeClass}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${member.status === "Inactive" ? "bg-slate-400" : "bg-emerald-500"}`} />
                                {km ? statusInfo.km : statusInfo.en}
                              </button>

                              {/* Directory toggle */}
                              <button
                                onClick={() => handleToggleDirectory(member.id)}
                                title={
                                  member.showInDirectory
                                    ? km
                                      ? "បង្ហាញក្នុងបញ្ជីសាធារណៈ (ចុចដើម្បីលាក់)"
                                      : "Visible in public directory (click to hide)"
                                    : km
                                      ? "លាក់ពីបញ្ជីសាធារណៈ (ចុចដើម្បីបង្ហាញ)"
                                      : "Hidden from public directory (click to show)"
                                }
                                className={`rounded p-1 transition ${
                                  member.showInDirectory
                                    ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                    : "text-muted-foreground hover:bg-muted"
                                }`}
                              >
                                {member.showInDirectory ? <Eye size={15} /> : <EyeOff size={15} />}
                              </button>
                            </div>
                            {member.joinedDate && (
                              <span className="text-[10px] text-muted-foreground">
                                {km ? "ចូលរួម៖ " : "Joined: "}
                                {member.joinedDate}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 5. Actions */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingMember(member);
                                setIsModalOpen(true);
                              }}
                              className="rounded-md border border-border p-1.5 text-foreground hover:bg-muted hover:border-primary/50 transition"
                              title={km ? "កែសម្រួលព័ត៌មានលម្អិត" : "Edit details"}
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(member)}
                              className="rounded-md border border-red-200 p-1.5 text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:hover:bg-red-950/40 transition"
                              title={km ? "លុបសមាជិក" : "Remove member"}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW B: MEMBERSHIP APPLICATIONS
          ========================================================= */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              {km ? "ពាក្យស្នើសុំចូលជាសមាជិកដែលបានដាក់តាមគេហទំព័រ" : "Incoming Membership Applications from Website"}
            </h2>
            <span className="text-xs text-muted-foreground">
              {applications.length} {km ? "ពាក្យស្នើសុំសរុប" : "total submissions"}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-2xs">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">{km ? "ឈ្មោះបេក្ខជន" : "Applicant Name"}</th>
                  <th className="px-4 py-3">{km ? "អ៊ីមែល" : "Email"}</th>
                  <th className="px-4 py-3">{km ? "កម្រិតដែលស្នើសុំ" : "Requested Tier"}</th>
                  <th className="px-4 py-3">{km ? "កាលបរិច្ឆេទ & ចំណាំ" : "Date & Notes"}</th>
                  <th className="px-4 py-3">{km ? "ស្ថានភាព" : "Status"}</th>
                  <th className="px-4 py-3 text-right">{km ? "សកម្មភាពពិនិត្យ" : "Review Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-muted-foreground">
                      {km ? "មិនមានពាក្យស្នើសុំសមាជិកភាពឡើយ" : "No membership applications found"}
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-muted/30 transition">
                      <td className="px-4 py-3.5 font-semibold text-foreground">{app.name}</td>
                      <td className="px-4 py-3.5">
                        <a href={`mailto:${app.email}`} className="text-xs text-primary hover:underline">
                          {app.email}
                        </a>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                          {app.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        <div>{app.submitted}</div>
                        {app.notes && <div className="text-[11px] text-muted-foreground/80 mt-0.5 line-clamp-1">{app.notes}</div>}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            app.status === "approved"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : app.status === "rejected"
                                ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {app.status === "approved"
                            ? km ? "បានអនុម័ត" : "Approved"
                            : app.status === "rejected"
                              ? km ? "បានបដិសេធ" : "Rejected"
                              : km ? "រង់ចាំពិនិត្យ" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {app.status === "pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                const defLevel: MemberLevel = app.category.toLowerCase().includes("student")
                                  ? "Student"
                                  : app.category.toLowerCase().includes("associate")
                                    ? "Associate"
                                    : "Professional";
                                setAppTargetToApprove({ app, level: defLevel });
                              }}
                              className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                            >
                              {km ? "អនុម័ត & បញ្ចូល" : "Approve & Enroll"}
                            </button>
                            <button
                              onClick={() => handleRejectApplication(app.id)}
                              className="rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900 transition"
                            >
                              {km ? "បដិសេធ" : "Reject"}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDeleteApplication(app.id)}
                            className="rounded p-1 text-muted-foreground hover:text-red-600 transition"
                            title="Delete application record"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: ADD / EDIT MEMBER
          ========================================================= */}
      {isModalOpen && editingMember && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-foreground">
                  {editingMember.id
                    ? km ? "កែសម្រួលព័ត៌មានសមាជិក" : "Edit Member Details"
                    : km ? "បន្ថែមសមាជិកថ្មី" : "Add New Member"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingMember(null);
                }}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMemberSubmit} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    {km ? "ឈ្មោះពេញ (អង់គ្លេស) *" : "Full Name (English) *"}
                  </label>
                  <input
                    required
                    value={editingMember.name || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    placeholder="e.g. Dara Sok"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    {km ? "ឈ្មោះពេញ (ខ្មែរ)" : "Full Name (Khmer)"}
                  </label>
                  <input
                    value={editingMember.nameKm || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, nameKm: e.target.value })}
                    placeholder="e.g. សុខ ដារ៉ា"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    {km ? "អ៊ីមែល *" : "Email Address *"}
                  </label>
                  <input
                    type="email"
                    required
                    value={editingMember.email || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                    placeholder="name@example.org"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    {km ? "លេខទូរស័ព្ទ" : "Phone Number"}
                  </label>
                  <input
                    value={editingMember.phone || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    placeholder="+855 12 345 678"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Member Level Selector */}
                <div>
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Award size={14} className="text-primary" />
                    <span>{km ? "កម្រិតសមាជិកភាព (Membership Level) *" : "Membership Level *"}</span>
                  </label>
                  <select
                    value={editingMember.level || "Professional"}
                    onChange={(e) => setEditingMember({ ...editingMember, level: e.target.value as MemberLevel })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold focus:border-primary focus:outline-none"
                  >
                    {MEMBER_LEVELS.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.en} ({lvl.km})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {getLevelInfo(editingMember.level).descriptionEn}
                  </p>
                </div>

                {/* Status Selector */}
                <div>
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-primary" />
                    <span>{km ? "ស្ថានភាព (Status) *" : "Membership Status *"}</span>
                  </label>
                  <select
                    value={editingMember.status || "Active"}
                    onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value as MemberStatus })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium focus:border-primary focus:outline-none"
                  >
                    {MEMBER_STATUSES.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.en} ({st.km})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    {km ? "ស្ថាប័ន / អង្គភាព (EN)" : "Affiliation / Organization"}
                  </label>
                  <input
                    value={editingMember.affiliation || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, affiliation: e.target.value })}
                    placeholder="e.g. Institute of Technology of Cambodia"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    {km ? "ស្ថាប័ន (ភាសាខ្មែរ)" : "Affiliation (Khmer)"}
                  </label>
                  <input
                    value={editingMember.affiliationKm || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, affiliationKm: e.target.value })}
                    placeholder="e.g. វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    {km ? "ជំនាញឯកទេស (Field of Expertise)" : "Field of Expertise (EN)"}
                  </label>
                  <input
                    value={editingMember.field || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, field: e.target.value })}
                    placeholder="e.g. Structural Geology"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    {km ? "ជំនាញឯកទេស (ភាសាខ្មែរ)" : "Field of Expertise (Khmer)"}
                  </label>
                  <input
                    value={editingMember.fieldKm || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, fieldKm: e.target.value })}
                    placeholder="e.g. ភូគព្ភវិទ្យាសម្ព័ន្ធ"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    {km ? "កាលបរិច្ឆេទចូលរួម" : "Joined Date"}
                  </label>
                  <input
                    type="date"
                    value={editingMember.joinedDate || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, joinedDate: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    {km ? "កាលបរិច្ឆេទផុតកំណត់ / បន្ត" : "Renewal / Expiry Date"}
                  </label>
                  <input
                    type="date"
                    value={editingMember.expiryDate || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, expiryDate: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editingMember.showInDirectory !== false}
                  onChange={(e) => setEditingMember({ ...editingMember, showInDirectory: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span>
                  {km
                    ? "បង្ហាញក្នុងបញ្ជីសមាជិកសាធារណៈ (ឈ្មោះ ស្ថាប័ន និងជំនាញ — អ៊ីមែលមិនត្រូវបានបង្ហាញជាសាធារណៈឡើយ)"
                    : "Display in public member directory (name, affiliation, and field; email remains protected)"}
                </span>
              </label>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  {km ? "កំណត់ចំណាំផ្ទៃក្នុងរបស់អ្នកគ្រប់គ្រង" : "Internal Admin Notes"}
                </label>
                <textarea
                  rows={2}
                  value={editingMember.notes || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, notes: e.target.value })}
                  placeholder="e.g. Student ID verified, dues paid, certificate issued..."
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingMember(null);
                  }}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  {km ? "បោះបង់" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-xs"
                >
                  {km ? "រក្សាទុកសមាជិក" : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: CONFIRM DELETE
          ========================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold">
                {km ? "បញ្ជាក់ការលុបសមាជិក" : "Confirm Member Removal"}
              </h3>
            </div>
            <p className="mt-3 text-sm text-foreground">
              {km
                ? `តើអ្នកពិតជាចង់លុបសមាជិក «${deleteTarget.name}» (${deleteTarget.email}) ចេញពីបញ្ជីសមាជិកភាពមែនឬទេ?`
                : `Are you sure you want to remove ${deleteTarget.name} (${deleteTarget.email}) from the active members registry?`}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {km ? "សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។" : "This action cannot be undone."}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {km ? "បោះបង់" : "Cancel"}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 shadow-xs"
              >
                {km ? "បាទ/ចាស លុបចេញ" : "Yes, Remove Member"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: APPROVE APPLICATION WITH LEVEL SELECTION
          ========================================================= */}
      {appTargetToApprove && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={22} />
              <h3 className="text-lg font-bold text-foreground">
                {km ? "អនុម័តពាក្យស្នើសុំ & កំណត់កម្រិតសមាជិក" : "Approve & Set Member Level"}
              </h3>
            </div>
            <div className="mt-3 text-sm space-y-1.5 text-foreground bg-muted/40 p-3 rounded-lg border border-border">
              <div><strong>{km ? "ឈ្មោះ៖ " : "Applicant: "}</strong>{appTargetToApprove.app.name}</div>
              <div><strong>{km ? "អ៊ីមែល៖ " : "Email: "}</strong>{appTargetToApprove.app.email}</div>
              <div><strong>{km ? "ប្រភេទដែលបានស្នើ៖ " : "Requested Category: "}</strong>{appTargetToApprove.app.category}</div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-foreground">
                {km ? "ជ្រើសរើសកម្រិតសមាជិកភាពផ្លូវការ (Assign Member Level):" : "Assign Official Membership Level:"}
              </label>
              <select
                value={appTargetToApprove.level}
                onChange={(e) => setAppTargetToApprove({ ...appTargetToApprove, level: e.target.value as MemberLevel })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold focus:border-primary focus:outline-none"
              >
                {MEMBER_LEVELS.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>
                    {lvl.en} ({lvl.km})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setAppTargetToApprove(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {km ? "បោះបង់" : "Cancel"}
              </button>
              <button
                onClick={() => handleApproveApplication(appTargetToApprove.app, appTargetToApprove.level)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 shadow-xs"
              >
                {km ? "បញ្ជាក់ការអនុម័ត" : "Confirm & Enroll"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
