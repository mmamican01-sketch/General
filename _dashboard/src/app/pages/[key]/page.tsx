"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Slot = { type: string; value: string; note?: string };
type PageDoc = {
  routeKey: string;
  route: string;
  generatedAt?: string;
  slots: Record<string, Slot>;
};

export default function PageEditor() {
  const params = useParams<{ key: string }>();
  const [key, setKey] = useState("");
  const [doc, setDoc] = useState<PageDoc | null>(null);
  const [selected, setSelected] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setKey(params?.key || "");
  }, [params]);

  async function load(targetKey: string) {
    const res = await fetch(`/api/pages/${targetKey}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load page");
      return;
    }
    setDoc(data);
    const first = Object.keys(data.slots || {})[0] || "";
    setSelected(first);
    setValue(first ? (data.slots[first]?.value ?? "") : "");
  }

  useEffect(() => {
    if (key) void load(key);
  }, [key]);

  const slotKeys = useMemo(() => Object.keys(doc?.slots || {}), [doc]);

  useEffect(() => {
    if (!selected || !doc) return;
    setValue(doc.slots[selected]?.value ?? "");
  }, [selected, doc]);

  async function save() {
    if (!doc || !selected) return;
    const next: PageDoc = {
      ...doc,
      slots: {
        ...doc.slots,
        [selected]: {
          ...doc.slots[selected],
          value,
        },
      },
    };
    const res = await fetch(`/api/pages/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(`Save failed: ${data.error || "unknown error"}`);
      return;
    }
    setDoc(next);
    setStatus("Saved");
  }

  async function remove() {
    if (!confirm(`Delete page "${key}"?`)) return;
    const res = await fetch(`/api/pages/${key}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setStatus(`Delete failed: ${data.error || "unknown error"}`);
      return;
    }
    window.location.href = "/pages";
  }

  if (!key) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <h1 className="title" style={{ margin: 0 }}>
          Page Editor: {key}
        </h1>
        <div className="row">
          <a className="button secondary" href="/pages">
            Back
          </a>
          <button className="button secondary" onClick={remove}>
            Delete
          </button>
        </div>
      </div>

      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}

      {doc ? (
        <div className="grid" style={{ gridTemplateColumns: "280px 1fr" }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Slots</h3>
            <ul className="list">
              {slotKeys.map((k) => (
                <li key={k}>
                  <button
                    className="button secondary"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      borderColor: selected === k ? "#111827" : "#e5e7eb",
                    }}
                    onClick={() => setSelected(k)}
                  >
                    {k}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Value</h3>
            {selected ? (
              <>
                <p className="muted" style={{ marginBottom: 8 }}>
                  Type: {doc.slots[selected]?.type}
                </p>
                <textarea className="textarea" value={value} onChange={(e) => setValue(e.target.value)} />
                <div className="row" style={{ marginTop: 12 }}>
                  <button className="button" onClick={save}>
                    Save
                  </button>
                  {status ? <span className="muted">{status}</span> : null}
                </div>
              </>
            ) : (
              <p className="muted">No slots found in this page JSON.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="card">Loading page content...</div>
      )}
    </div>
  );
}
