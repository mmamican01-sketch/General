"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";

type MediaItem = { name: string; path: string };

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  async function load() {
    const res = await fetch("/api/media");
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Failed to load media");
      return;
    }
    setItems(data.files || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
    setStatus("");
    const res = await fetch("/api/media", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setStatus(data.error || "Upload failed");
      return;
    }
    setStatus(`Uploaded: ${data.file.path}`);
    await load();
  }

  async function copy(p: string) {
    await navigator.clipboard.writeText(p);
    setStatus(`Copied: ${p}`);
  }

  return (
    <DashboardShell breadcrumbs={["Media"]}>
      <div className="container">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
          <h1 className="title" style={{ margin: 0 }}>
            Media
          </h1>
          <Link className="button secondary" href="/">
            Back
          </Link>
        </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <label
          className="button"
          style={{
            cursor: uploading ? "wait" : "pointer",
            display: "inline-block",
            opacity: uploading ? 0.7 : 1,
          }}
        >
          <input type="file" onChange={onUpload} style={{ display: "none" }} accept="image/*" disabled={uploading} />
          {uploading ? "Uploading..." : "Upload"}
        </label>
        {status ? <p className="muted" style={{ marginTop: 10 }}>{status}</p> : null}
      </div>

      <div className="card">
        <ul className="list">
          {items.map((item) => (
            <li key={item.name}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span>{item.path}</span>
                <button className="button secondary" onClick={() => copy(item.path)}>
                  Copy path
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </DashboardShell>
  );
}
