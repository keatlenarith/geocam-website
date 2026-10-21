import { createClient } from "@supabase/supabase-js";

// Publishable browser key; all write access is enforced by database policies.
export const supabase = createClient(
  "https://pziwobqfysoadswgnjjm.supabase.co",
  "sb_publishable_nTv_9GZCp9yfDXIasl2D7Q_JsPbHzcc",
  {
    global: {
      fetch: (input, init) => {
        const smallInlineSave =
          String(input).includes("/rpc/geocam_update_page_field") &&
          typeof init?.body === "string" &&
          new TextEncoder().encode(init.body).length < 50000;
        return fetch(
          input,
          smallInlineSave ? { ...init, keepalive: true } : init,
        );
      },
    },
  },
);
