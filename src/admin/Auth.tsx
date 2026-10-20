import React, { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

const Context = createContext({
  session: null as Session | null,
  admin: false,
  loading: true,
  error: "",
});
export const useAdmin = () => useContext(Context);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!next) {
        setAdmin(false);
        setError("");
      }
      if (_event !== "TOKEN_REFRESHED") setLoading(true);
      setSession(next);
      if (!next) setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session) return;
    let current = true;
    supabase.rpc("geocam_is_admin").then(({ data, error }) => {
      if (!current) return;
      setAdmin(!error && data === true);
      setError(
        error
          ? "Unable to verify administrator access. Please try signing in again."
          : "",
      );
      setLoading(false);
    });
    return () => {
      current = false;
    };
  }, [session]);
  return (
    <Context.Provider value={{ session, admin, loading, error }}>
      {children}
    </Context.Provider>
  );
}

export function AdminGate({ children }: { children: React.ReactNode }) {
  const { admin, session, loading, error } = useAdmin();
  if (loading)
    return (
      <p className="mx-auto max-w-3xl px-5 py-20" role="status">
        Checking administrator access…
      </p>
    );
  if (!admin)
    return (
      <section className="mx-auto max-w-3xl px-5 py-20">
        <h1 className="text-3xl font-bold">Administrator access required</h1>
        <p className="my-5">
          {error ||
            (session
              ? "This account does not have editing permission."
              : "Sign in to manage GeoCam content.")}
        </p>
        <a className="btn btn-primary" href="/admin/login">
          Admin sign in
        </a>
      </section>
    );
  return <>{children}</>;
}
