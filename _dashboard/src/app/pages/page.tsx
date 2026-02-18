"use client";

import { useEffect, useState } from "react";

type PageItem = { key: string; file: string };

export default function PagesListPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [newKey, setNewKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/pages");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load pages");
      setLoading(false);
      return;
    }
    setPages(data.pages || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function createPage() {
    if (!newKey.trim()) return;
    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: newKey.trim() }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to create page");
      return;
    }
    setNewKey("");
    await load();
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <h1 className="title" style={{ margin: 0 }}>
          Pages
        </h1>
        <a className="button secondary" href="/">
          Back
        </a>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row">
          <input
            className="input"
            placeholder="new-page-key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
          <button className="button" onClick={createPage}>
            Create
          </button>
        </div>
      </div>

      <div className="card">
        {loading ? <p>Loading...</p> : null}
        {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
        {!loading && !error ? (
          <ul className="list">
            {pages.map((p) => (
              <li key={p.key}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div>
                    <strong>{p.key}</strong>
                    <div className="muted">{p.file}</div>
                  </div>
                  <a className="button secondary" href={`/pages/${p.key}`}>
                    Edit
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
