import { createClient } from "@supabase/supabase-js";

// Publishable browser key; all write access is enforced by database policies.
export const supabase = createClient(
  "https://pziwobqfysoadswgnjjm.supabase.co",
  "sb_publishable_nTv_9GZCp9yfDXIasl2D7Q_JsPbHzcc",
);
