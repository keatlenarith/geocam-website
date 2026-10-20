export const categories = [
  { id: "geology", label: "Geology" },
  { id: "faults", label: "Faults" },
  { id: "trends", label: "Trends" },
  { id: "minerals", label: "Minerals" },
  { id: "geosites", label: "Geosites" },
  { id: "potential-zones", label: "Potential zones" },
  { id: "other", label: "Other data" },
] as const;
export type DatasetCategory = (typeof categories)[number]["id"];
