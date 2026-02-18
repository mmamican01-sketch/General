"use client";

import { useMemo, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const callbackUrl = useMemo(() => {
    if (typeof window === "undefined") return "/";
    const params = new URLSearchParams(window.location.search);
    return params.get("callbackUrl") || "/";
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (!result?.ok) {
      setError("Invalid username or password");
      return;
    }
    window.location.href = callbackUrl;
  }

  return (
    <div className="container" style={{ maxWidth: 460 }}>
      <div className="card">
        <h1 className="title">Dashboard Login</h1>
        <p className="muted" style={{ marginBottom: 16 }}>
          Sign in to manage content-store pages, globals, and media.
        </p>

        <form onSubmit={onSubmit} className="grid">
          <input
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error ? <p style={{ color: "#b91c1c", margin: 0 }}>{error}</p> : null}
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
