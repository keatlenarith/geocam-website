import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAdmin } from "./Auth";

export default function Login() {
  const { session, admin, loading, error: accessError } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "setup" | "reset" | "password">(
    location.hash.includes("type=recovery") ? "password" : "login",
  );
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("password");
    });
    return () => subscription.unsubscribe();
  }, []);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const redirect = location.origin + "/admin/login";
      if (mode === "password") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setPassword("");
        setMode("login");
        setMessage("Password updated. You can now open the dashboard.");
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        setPassword("");
      } else if (mode === "setup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: redirect },
        });
        if (error) throw error;
        setPassword("");
        setMessage(
          "Check your email to confirm the account, then sign in. Only the approved administrator receives editing access.",
        );
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo: redirect },
        );
        if (error) throw error;
        setMessage(
          "If the account exists, a password-reset email has been sent.",
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to complete this request. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="mx-auto max-w-lg px-5 py-16">
      <p className="eyebrow">GeoCam administration</p>
      <h1 className="my-4 text-3xl font-bold">
        {mode === "setup"
          ? "Set up administrator account"
          : mode === "reset"
            ? "Reset password"
            : mode === "password"
              ? "Choose a new password"
              : "Admin sign in"}
      </h1>
      {mode !== "password" && session ? (
        <div>
          <p role="status" className="my-5">
            {loading
              ? "Checking access…"
              : admin
                ? "You are signed in as an administrator."
                : accessError ||
                  "This account does not have editing permission. Confirm your administrator email before signing in again."}
          </p>
          {admin && (
            <a className="btn btn-primary" href="/admin/cms">
              Open dashboard
            </a>
          )}
          <button
            className="btn btn-outline ml-2"
            onClick={async () => {
              await supabase.auth.signOut();
            }}
          >
            Sign out
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-4">
          {mode !== "password" && (
            <label>
              Email address
              <input
                className="field mt-2 w-full"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          )}
          {mode !== "reset" && (
            <label>
              {mode === "password" ? "New password" : "Password"}
              <input
                className="field mt-2 w-full"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                minLength={mode === "login" ? undefined : 12}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          )}
          <button className="btn btn-primary" disabled={busy}>
            {busy
              ? "Please wait…"
              : mode === "setup"
                ? "Create account"
                : mode === "reset"
                  ? "Send reset email"
                  : mode === "password"
                    ? "Save password"
                    : "Sign in"}
          </button>
        </form>
      )}
      {message && (
        <p role="status" className="my-5 rounded-lg border p-4">
          {message}
        </p>
      )}
      {!session && (
        <div className="mt-6 flex flex-wrap gap-4 text-sm underline">
          <button
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
          >
            Sign in
          </button>
          <button
            onClick={() => {
              setMode("setup");
              setMessage("");
            }}
          >
            First-time account setup
          </button>
          <button
            onClick={() => {
              setMode("reset");
              setMessage("");
            }}
          >
            Forgot password?
          </button>
        </div>
      )}
      <p className="mt-8 text-sm text-muted-foreground">
        Administrator access is granted separately from account creation.
        Visitors cannot edit or publish content.
      </p>
    </section>
  );
}
