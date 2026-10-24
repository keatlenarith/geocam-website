import {
  members as seedMembers,
  applications as seedApplications,
  type Member,
  type MemberLevel,
  type MemberStatus,
  type Application,
} from "./data.ts";

export type { Member, MemberLevel, MemberStatus, Application };

const MEMBERS_STORAGE_KEY = "geocam_members_registry_v1";
const APPLICATIONS_STORAGE_KEY = "geocam_membership_applications_v1";
const CHANGE_EVENT = "geocam:members-registry-changed";

export interface MemberLevelInfo {
  id: MemberLevel;
  en: string;
  km: string;
  badgeClass: string;
  descriptionEn: string;
  descriptionKm: string;
}

export const MEMBER_LEVELS: MemberLevelInfo[] = [
  {
    id: "Student",
    en: "Student",
    km: "និស្សិត",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    descriptionEn: "Enrolled undergraduate & postgraduate geoscience students",
    descriptionKm: "និស្សិតកំពុងសិក្សាថ្នាក់បរិញ្ញាបត្រ ឬក្រោយបរិញ្ញាបត្រផ្នែកភូគព្ភវិទ្យា",
  },
  {
    id: "Professional",
    en: "Professional",
    km: "អ្នកជំនាញ",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    descriptionEn: "Practising geoscientists, geologists, and geotechnical engineers",
    descriptionKm: "អ្នកភូគព្ភវិទ្យា និងវិស្វករកំពុងប្រកបវិជ្ជាជីវៈ",
  },
  {
    id: "Associate",
    en: "Associate",
    km: "សមាជិកសហការ",
    badgeClass: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800",
    descriptionEn: "Educators, allied environmental scientists, and GIS analysts",
    descriptionKm: "អ្នកអប់រំ អ្នកវិទ្យាសាស្ត្របរិស្ថាន និងអ្នកវិភាគ GIS",
  },
  {
    id: "Honorary Fellow",
    en: "Honorary Fellow",
    km: "សមាជិកកិត្តិយស",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    descriptionEn: "Distinguished senior researchers & lifetime contributors",
    descriptionKm: "អ្នកស្រាវជ្រាវជាន់ខ្ពស់ និងឥស្សរជនឆ្នើមផ្នែកភូគព្ភវិទ្យា",
  },
  {
    id: "Corporate",
    en: "Corporate",
    km: "សាជីវកម្ម",
    badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800",
    descriptionEn: "Mining corporations, engineering consultancies, and survey institutions",
    descriptionKm: "ក្រុមហ៊ុនរ៉ែ ក្រុមហ៊ុនប្រឹក្សាយោបល់ និងស្ថាប័នអង្កេត",
  },
  {
    id: "Executive",
    en: "Executive / Board",
    km: "គណៈប្រតិបត្តិ",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    descriptionEn: "Society executive committee & scientific advisory council",
    descriptionKm: "គណៈកម្មាធិការប្រតិបត្តិ និងក្រុមប្រឹក្សាវិទ្យាសាស្ត្រសមាគម",
  },
];

export interface MemberStatusInfo {
  id: MemberStatus;
  en: string;
  km: string;
  badgeClass: string;
}

export const MEMBER_STATUSES: MemberStatusInfo[] = [
  {
    id: "Active",
    en: "Active",
    km: "សកម្ម",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  },
  {
    id: "Inactive",
    en: "Inactive",
    km: "អសកម្ម",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  },
  {
    id: "Pending",
    en: "Pending Review",
    km: "រង់ចាំការពិនិត្យ",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  },
  {
    id: "Expired",
    en: "Expired",
    km: "ផុតកំណត់",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
  },
];

function notifySubscribers() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  }
}

/**
 * Retrieve all registered members from localStorage (falling back to initial seed data).
 */
export function getMembers(): Member[] {
  if (typeof window === "undefined") return seedMembers;
  try {
    const raw = localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(seedMembers));
      return seedMembers;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(seedMembers));
      return seedMembers;
    }
    return parsed;
  } catch {
    return seedMembers;
  }
}

/**
 * Retrieve single member by ID.
 */
export function getMemberById(id: string): Member | undefined {
  return getMembers().find((m) => m.id === id);
}

/**
 * Save (create or update) a member record in persistent storage.
 */
export function saveMember(item: Partial<Member> & { name: string; email: string }): Member {
  const current = getMembers();
  const now = new Date().toISOString().split("T")[0];

  let savedMember: Member;

  if (item.id) {
    const idx = current.findIndex((m) => m.id === item.id);
    if (idx >= 0) {
      savedMember = {
        ...current[idx],
        ...item,
        name: item.name.trim(),
        email: item.email.trim().toLowerCase(),
        level: item.level || current[idx].level || "Professional",
        status: item.status || current[idx].status || "Active",
        showInDirectory: item.showInDirectory !== undefined ? item.showInDirectory : current[idx].showInDirectory,
      };
      current[idx] = savedMember;
    } else {
      savedMember = {
        id: item.id,
        name: item.name.trim(),
        nameKm: item.nameKm?.trim(),
        email: item.email.trim().toLowerCase(),
        affiliation: item.affiliation || "Independent Geoscientist",
        affiliationKm: item.affiliationKm,
        field: item.field || "Geosciences",
        fieldKm: item.fieldKm,
        showInDirectory: item.showInDirectory !== undefined ? item.showInDirectory : true,
        level: item.level || "Professional",
        status: item.status || "Active",
        joinedDate: item.joinedDate || now,
        expiryDate: item.expiryDate,
        phone: item.phone,
        notes: item.notes,
      };
      current.unshift(savedMember);
    }
  } else {
    const newId = "mem-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6);
    savedMember = {
      id: newId,
      name: item.name.trim(),
      nameKm: item.nameKm?.trim(),
      email: item.email.trim().toLowerCase(),
      affiliation: item.affiliation || "Independent Geoscientist",
      affiliationKm: item.affiliationKm,
      field: item.field || "Geosciences",
      fieldKm: item.fieldKm,
      showInDirectory: item.showInDirectory !== undefined ? item.showInDirectory : true,
      level: item.level || "Professional",
      status: item.status || "Active",
      joinedDate: item.joinedDate || now,
      expiryDate: item.expiryDate,
      phone: item.phone,
      notes: item.notes,
    };
    current.unshift(savedMember);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(current));
  }
  notifySubscribers();
  return savedMember;
}

/**
 * Edit tool to specifically set / change a member's level.
 */
export function updateMemberLevel(id: string, level: MemberLevel): Member | null {
  const current = getMembers();
  const idx = current.findIndex((m) => m.id === id);
  if (idx < 0) return null;

  current[idx] = {
    ...current[idx],
    level,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(current));
  }
  notifySubscribers();
  return current[idx];
}

/**
 * Update a member's status (Active, Inactive, Expired, Pending).
 */
export function updateMemberStatus(id: string, status: MemberStatus): Member | null {
  const current = getMembers();
  const idx = current.findIndex((m) => m.id === id);
  if (idx < 0) return null;

  current[idx] = {
    ...current[idx],
    status,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(current));
  }
  notifySubscribers();
  return current[idx];
}

/**
 * Toggle directory visibility for a member.
 */
export function toggleDirectoryVisibility(id: string): Member | null {
  const current = getMembers();
  const idx = current.findIndex((m) => m.id === id);
  if (idx < 0) return null;

  current[idx] = {
    ...current[idx],
    showInDirectory: !current[idx].showInDirectory,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(current));
  }
  notifySubscribers();
  return current[idx];
}

/**
 * Remove / Delete a member from the registry.
 */
export function deleteMember(id: string): boolean {
  const current = getMembers();
  const filtered = current.filter((m) => m.id !== id);
  if (filtered.length === current.length) return false;

  if (typeof window !== "undefined") {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(filtered));
  }
  notifySubscribers();
  return true;
}

/**
 * Reset member registry to default seed roster.
 */
export function resetMembers(): Member[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(seedMembers));
  }
  notifySubscribers();
  return seedMembers;
}

/**
 * Retrieve membership applications from persistent storage.
 */
export function getApplications(): Application[] {
  if (typeof window === "undefined") return seedApplications;
  try {
    const raw = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(seedApplications));
      return seedApplications;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedApplications;
    return parsed;
  } catch {
    return seedApplications;
  }
}

/**
 * Submit or save a new membership application.
 */
export function submitApplication(item: {
  name: string;
  email: string;
  category: string;
  affiliation?: string;
  field?: string;
  showInDirectory?: boolean;
}): Application {
  const apps = getApplications();
  const newApp: Application = {
    id: "app-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6),
    name: item.name.trim(),
    email: item.email.trim().toLowerCase(),
    category: item.category,
    submitted: new Date().toISOString().split("T")[0],
    status: "pending",
    notes: [
      item.affiliation ? `Affiliation: ${item.affiliation}` : null,
      item.field ? `Field: ${item.field}` : null,
      item.showInDirectory ? "Requested public directory listing" : null,
    ]
      .filter(Boolean)
      .join(" | "),
  };

  apps.unshift(newApp);
  if (typeof window !== "undefined") {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(apps));
  }
  notifySubscribers();
  return newApp;
}

/**
 * Approve application: marks status as approved and automatically enrolls
 * the applicant into the official Members registry with their selected level.
 */
export function approveApplication(
  id: string,
  targetLevel?: MemberLevel
): { application: Application; member: Member } | null {
  const apps = getApplications();
  const appIdx = apps.findIndex((a) => a.id === id);
  if (appIdx < 0) return null;

  const app = apps[appIdx];
  apps[appIdx] = { ...app, status: "approved" };

  if (typeof window !== "undefined") {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(apps));
  }

  // Derive level from category if not explicitly provided
  let level: MemberLevel = targetLevel || "Professional";
  if (!targetLevel) {
    const catLower = app.category.toLowerCase();
    if (catLower.includes("student")) level = "Student";
    else if (catLower.includes("associate")) level = "Associate";
    else if (catLower.includes("corporate")) level = "Corporate";
    else if (catLower.includes("fellow") || catLower.includes("honorary")) level = "Honorary Fellow";
    else if (catLower.includes("executive")) level = "Executive";
    else level = "Professional";
  }

  // Extract affiliation and field if stored in notes
  let affiliation = "Geosciences Society of Cambodia";
  let field = "Geosciences";
  let showInDirectory = true;

  if (app.notes) {
    const affMatch = app.notes.match(/Affiliation:\s*([^|]+)/i);
    if (affMatch && affMatch[1]) affiliation = affMatch[1].trim();

    const fieldMatch = app.notes.match(/Field:\s*([^|]+)/i);
    if (fieldMatch && fieldMatch[1]) field = fieldMatch[1].trim();
  }

  const member = saveMember({
    name: app.name,
    email: app.email,
    level,
    status: "Active",
    affiliation,
    field,
    showInDirectory,
    notes: `Enrolled via approved application #${app.id}`,
  });

  notifySubscribers();
  return { application: apps[appIdx], member };
}

/**
 * Reject application.
 */
export function rejectApplication(id: string, notes?: string): Application | null {
  const apps = getApplications();
  const appIdx = apps.findIndex((a) => a.id === id);
  if (appIdx < 0) return null;

  apps[appIdx] = {
    ...apps[appIdx],
    status: "rejected",
    notes: notes ? `${apps[appIdx].notes || ""} (Rejected: ${notes})`.trim() : apps[appIdx].notes,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(apps));
  }
  notifySubscribers();
  return apps[appIdx];
}

/**
 * Delete application record.
 */
export function deleteApplication(id: string): boolean {
  const apps = getApplications();
  const filtered = apps.filter((a) => a.id !== id);
  if (filtered.length === apps.length) return false;

  if (typeof window !== "undefined") {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(filtered));
  }
  notifySubscribers();
  return true;
}

/**
 * Reset applications to initial seed state.
 */
export function resetApplications(): Application[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(seedApplications));
  }
  notifySubscribers();
  return seedApplications;
}

/**
 * Subscribe to changes in members or applications.
 */
export function subscribeMembers(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
