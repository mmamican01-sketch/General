"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";

type Slot = { type: string; value: string; note?: string };
type GlobalDoc = { routeKey: string; route: string; slots: Record<string, Slot> };

const ASTRO_SITE_URL = "http://localhost:4321";

export default function GlobalEditor() {
  const params = useParams<{ key: string }>();
  const [key, setKey] = useState("");
  const [doc, setDoc] = useState<GlobalDoc | null>(null);
  const [selected, setSelected] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  const [error, setError] = useState("");

  useEffect(() => {
    setKey(params?.key || "");
  }, [params]);

  useEffect(() => {
    if (!key) return;
    setError("");
    (async () => {
      const res = await fetch(`/api/globals/${key}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load global");
        return;
      }
      setDoc(data);
      const first = Object.keys(data.slots || {})[0] || "";
      setSelected(first);
      setValue(first ? data.slots[first]?.value ?? "" : "");
    })();
  }, [key]);

  const keys = useMemo(() => Object.keys(doc?.slots || {}), [doc]);

  useEffect(() => {
    if (selected && doc) setValue(doc.slots[selected]?.value ?? "");
  }, [selected, doc]);

  const save = useCallback(async () => {
    if (!doc || !selected || !key) return;
    setStatus("saving");
    const next = {
      ...doc,
      slots: {
        ...doc.slots,
        [selected]: { ...doc.slots[selected], value },
      },
    };
    const res = await fetch(`/api/globals/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus("unsaved");
      setError(data.error || "Save failed");
      return;
    }
    setDoc(next);
    setStatus("saved");
    setError("");
  }, [doc, key, selected, value]);

  const previewUrl = key ? `/en/` : undefined;

  return (
    <DashboardShell
      breadcrumbs={["Globals", key]}
      status={status}
      previewUrl={previewUrl}
    >
      <div className="container" style={{ padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Link className="button secondary" href="/globals">
            ← Back
          </Link>
        </div>

        {error ? <p className="muted" style={{ color: "#b91c1c", marginBottom: 16 }}>{error}</p> : null}

        {doc ? (
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Slots</h3>
              <ul className="list">
                {keys.map((k) => (
                  <li key={k}>
                    <button
                      className="button secondary"
                      style={{
                        width: "100%",
                        textAlign: "left",
                        borderColor: selected === k ? "var(--brand)" : "var(--line)",
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
                  <textarea
                    className="textarea"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      setStatus("unsaved");
                    }}
                  />
                  <div className="row" style={{ marginTop: 12 }}>
                    <button className="button" onClick={save}>
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <p className="muted">No editable slots detected.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="card">Loading...</div>
        )}
      </div>
    </DashboardShell>
  );
}
