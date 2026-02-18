"use client";

import { useEffect, useState } from "react";

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
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <h1 className="title" style={{ margin: 0 }}>
          Media
        </h1>
        <a className="button secondary" href="/">
          Back
        </a>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row">
          <input className="input" type="file" onChange={onUpload} />
          <button className="button" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
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
  );
}
