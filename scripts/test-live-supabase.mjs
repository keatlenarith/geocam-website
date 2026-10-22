import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://pziwobqfysoadswgnjjm.supabase.co",
  "sb_publishable_nTv_9GZCp9yfDXIasl2D7Q_JsPbHzcc"
);

console.log("Checking live Supabase published content…");
const { data: pubData, error: pubErr } = await supabase
  .from("geocam_published")
  .select("id, updated_at")
  .eq("id", "site")
  .single();

console.log("Published check:", { pubData, pubErr });

console.log("Checking live Supabase drafts content…");
const { data: draftData, error: draftErr } = await supabase
  .from("geocam_drafts")
  .select("id, updated_at")
  .eq("id", "site")
  .single();

console.log("Draft check:", { draftData, draftErr });
