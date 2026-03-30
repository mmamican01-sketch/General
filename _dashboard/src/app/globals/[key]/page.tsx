"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";
import { MediaPicker } from "@/components/MediaPicker";
import { getAstroSiteUrl } from "@/lib/astro-url";

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
  const [savedAt, setSavedAt] = useState<string>("");

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
    setSavedAt(new Date().toLocaleTimeString());
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

        {error ? <p className="muted" style={{ color: "var(--color-error)", marginBottom: 16 }}>{error}</p> : null}

        {doc ? (
          <div className="globals-grid">
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
                      onClick={() => {
                        if (selected !== k) {
                          const isDirty = value !== (doc?.slots[selected]?.value ?? "");
                          if (isDirty && !window.confirm("You have unsaved changes to this slot. Switch anyway?")) {
                            return;
                          }
                          setStatus("saved");
                          setSavedAt("");
                        }
                        setSelected(k);
                      }}
                    >
                      {k === "header-logo" ? "الشعار / Logo (560×184px)" : k === "footer-logo" ? "شعار الفوتر / Footer Logo (560×184px)" : k.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Value</h3>
              {selected ? (
                <>
                  {doc.slots[selected]?.type === "image" ? (
                    <div style={{ marginBottom: 12 }}>
                      {(selected === "header-logo" || selected === "footer-logo") ? (
                        <p className="muted" style={{ marginBottom: 8, fontSize: 12 }}>ارفع الشعار (المقاس المثالي: 560×184px، نسبة 3:1)</p>
                      ) : null}
                      <MediaPicker
                        value={value}
                        onChange={(v) => {
                          setValue(v);
                          setStatus("unsaved");
                        }}
                        label={selected === "footer-logo" ? "اختر شعار الفوتر" : "اختر الشعار"}
                      />
                      {value ? (
                        <div style={{ marginTop: 8 }}>
                          <img src={value.startsWith("http") ? value : `${getAstroSiteUrl()}${value.startsWith("/") ? "" : "/"}${value}`} alt="Preview" style={{ maxWidth: 200, maxHeight: 80, objectFit: "contain" }} />
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <textarea
                      className="textarea"
                      value={value}
                      onChange={(e) => {
                        setValue(e.target.value);
                        setStatus("unsaved");
                      }}
                    />
                  )}
                  <div className="editor-save">
                    <button
                      className={`button${status === "saving" ? " button-saving" : ""}`}
                      onClick={save}
                      disabled={status === "saving" || status === "saved"}
                    >
                      {status === "saving" ? "Saving…" : "Save"}
                    </button>
                    {savedAt && <p className="save-meta">Last saved at {savedAt}</p>}
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
