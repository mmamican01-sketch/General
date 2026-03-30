"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";
import { DashboardShell } from "@/components/DashboardShell";
import { LivePreview } from "@/components/LivePreview";
import { MediaPicker } from "@/components/MediaPicker";
import { getAstroSiteUrl } from "@/lib/astro-url";

type Slot = { type: string; value: string; note?: string };
type SeoData = { title?: string; description?: string; image?: string };
type PageDoc = {
  routeKey: string;
  route: string;
  generatedAt?: string;
  slots: Record<string, Slot>;
  seo?: SeoData;
};

type SlotDef = { key: string; type: string };

type HeroTitleItem = { text: string; start: number; end: number };

function HeroTitlesField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  let items: HeroTitleItem[] = [];
  try {
    items = JSON.parse(value || "[]");
    if (!Array.isArray(items)) items = [];
  } catch {
    items = [];
  }
  const update = (next: HeroTitleItem[]) => onChange(JSON.stringify(next));

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h4 style={{ margin: "0 0 12px", fontSize: 14 }}>Hero Titles (توقيت ظهور النص على الفيديو)</h4>
      <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12 }}>
        أضف نصوص متعددة مع وقت البداية والنهاية (بالثواني) لكل نص
      </p>
      {items.map((item, i) => (
        <div key={i} style={{ padding: 12, marginBottom: 8, border: "1px solid var(--line)", borderRadius: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px auto", gap: 8, alignItems: "center" }}>
            <input
              className="input"
              placeholder="النص"
              value={item.text}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...next[i], text: e.target.value };
                update(next);
              }}
            />
            <input
              className="input"
              type="number"
              min={0}
              placeholder="من (ث)"
              value={item.start}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...next[i], start: Number(e.target.value) || 0 };
                update(next);
              }}
            />
            <input
              className="input"
              type="number"
              min={0}
              placeholder="إلى (ث)"
              value={item.end}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...next[i], end: Number(e.target.value) || 0 };
                update(next);
              }}
            />
            <button
              type="button"
              className="button secondary"
              onClick={() => update(items.filter((_, j) => j !== i))}
            >
              حذف
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="button secondary"
        onClick={() => update([...items, { text: "", start: 0, end: 5 }])}
      >
        + إضافة Hero Title
      </button>
    </div>
  );
}

function SlotField({
  slotKey,
  slotType,
  value,
  onChange,
}: {
  slotKey: string;
  slotType: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const label = slotKey.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  if (slotType === "hero-titles") {
    return <HeroTitlesField value={value} onChange={onChange} />;
  }
  if (slotType === "image") {
    return (
      <div className="card" style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>{label}</label>
        <MediaPicker value={value} onChange={onChange} />
      </div>
    );
  }
  if (slotType === "video") {
    return (
      <div className="card" style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>{label}</label>
        <input
          className="input"
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="YouTube, Vimeo, or direct .mp4 URL"
        />
        <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
          YouTube (youtube.com/watch?v=... or youtu.be/...), Vimeo, or direct video URL (.mp4, .webm)
        </p>
      </div>
    );
  }
  if (slotType === "link" || slotType === "href") {
    return (
      <div className="card" style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>{label}</label>
        <input
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/en/..."
        />
      </div>
    );
  }
  const isLong = slotType === "richtext" || slotKey.includes("body") || slotKey.includes("description");
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>{label}</label>
      <textarea
        className="textarea"
        rows={isLong ? 4 : 2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function PageEditor() {
  const params = useParams<{ key: string }>();
  const key = params?.key ?? "";

  const [doc, setDoc] = useState<PageDoc | null>(null);
  const [slotsMeta, setSlotsMeta] = useState<SlotDef[]>([]);
  const [status, setStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string>("");

  const previewPath = key === "index" ? "/en/" : `/en/${key.replace(/__/g, "/")}`;
  const previewUrl = `${getAstroSiteUrl()}${previewPath}`;

  const load = useCallback(() => {
    if (!key) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/content?page=${encodeURIComponent(key)}&locale=en`),
      fetch("/api/index"),
    ])
      .then(async ([contentRes, indexRes]) => {
        const content = await contentRes.json();
        const index = await indexRes.json();
        setDoc(content);
        const pageMeta = (index.pages || []).find((p: { key: string }) => p.key === key);
        setSlotsMeta(pageMeta?.slots || []);
      })
      .finally(() => setLoading(false));
  }, [key]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async () => {
    if (!doc || !key) return;
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch(`/api/content?page=${encodeURIComponent(key)}&locale=en`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      });
      if (res.ok) {
        setStatus("saved");
        setSavedAt(new Date().toLocaleTimeString());
      } else {
        const data = await res.json().catch(() => ({}));
        const errMsg = Array.isArray(data.error) ? data.error.join("; ") : (data.error || data.message || `Save failed (${res.status})`);
        setStatus("unsaved");
        setError(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
      }
    } catch (err) {
      setStatus("unsaved");
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }, [doc, key]);

  const updateSlot = useCallback((slotKey: string, value: string) => {
    setDoc((d) => {
      if (!d) return null;
      const slotDef = slotsMeta.find((s) => s.key === slotKey);
      const type = slotDef?.type ?? d.slots?.[slotKey]?.type ?? "text";
      return {
        ...d,
        slots: {
          ...d.slots,
          [slotKey]: { ...d.slots[slotKey], type, value },
        },
      };
    });
    setStatus("unsaved");
    setError(null);
  }, [slotsMeta]);

  const allSlotKeys = Array.from(
    new Set([...Object.keys(doc?.slots || {}), ...slotsMeta.map((s) => s.key)])
  );

  if (!key) return null;

  return (
    <DashboardShell
      breadcrumbs={["Pages", key]}
      status={status}
      previewUrl={previewPath}
    >
      <div className="editor-layout">
        <div className="editor-form">
          <div className="container" style={{ padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <Link className="button secondary" href="/pages">
                ← Back
              </Link>
            </div>

            {loading ? (
              <div className="card">Loading…</div>
            ) : doc ? (
              <>
                {error && (
                  <div className="save-error">{error}</div>
                )}
                <Tabs.Root defaultValue="content">
                  <Tabs.List className="editor-tabs">
                    <Tabs.Trigger value="content" className="editor-tab">
                      Content
                    </Tabs.Trigger>
                    <Tabs.Trigger value="seo" className="editor-tab">
                      SEO
                    </Tabs.Trigger>
                    <Tabs.Trigger value="media" className="editor-tab">
                      Media
                    </Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content value="content">
                    {allSlotKeys
                      .filter((k) => {
                        const t = slotsMeta.find((s) => s.key === k)?.type ?? doc.slots?.[k]?.type ?? "text";
                        return t !== "image";
                      })
                      .map((slotKey) => {
                        const slotDef = slotsMeta.find((s) => s.key === slotKey);
                        const slotType = slotDef?.type ?? doc.slots?.[slotKey]?.type ?? "text";
                        const value = doc.slots?.[slotKey]?.value ?? "";
                        return (
                          <SlotField
                            key={slotKey}
                            slotKey={slotKey}
                            slotType={slotType}
                            value={value}
                            onChange={(v) => updateSlot(slotKey, v)}
                          />
                        );
                      })}
                  </Tabs.Content>

                  <Tabs.Content value="seo">
                    <div className="card" style={{ marginBottom: 16 }}>
                      <label className="field-label" htmlFor="page-seo-title">Meta Title</label>
                      <input
                        id="page-seo-title"
                        className="input"
                        value={doc.seo?.title ?? ""}
                        onChange={(e) => { setDoc((d) => d ? { ...d, seo: { ...d.seo, title: e.target.value } } : null); setStatus("unsaved"); setError(null); }}
                      />
                    </div>
                    <div className="card" style={{ marginBottom: 16 }}>
                      <label className="field-label" htmlFor="page-seo-desc">Meta Description</label>
                      <textarea
                        id="page-seo-desc"
                        className="textarea"
                        rows={3}
                        value={doc.seo?.description ?? ""}
                        onChange={(e) => { setDoc((d) => d ? { ...d, seo: { ...d.seo, description: e.target.value } } : null); setStatus("unsaved"); setError(null); }}
                      />
                    </div>
                    <div className="card" style={{ marginBottom: 16 }}>
                      <label className="field-label">OG Image</label>
                      <MediaPicker
                        value={doc.seo?.image ?? ""}
                        onChange={(v) => { setDoc((d) => d ? { ...d, seo: { ...d.seo, image: v } } : null); setStatus("unsaved"); setError(null); }}
                      />
                    </div>
                  </Tabs.Content>

                  <Tabs.Content value="media">
                    {allSlotKeys
                      .filter((k) => {
                        const t = slotsMeta.find((s) => s.key === k)?.type ?? doc.slots?.[k]?.type ?? "";
                        return t === "image";
                      })
                      .map((slotKey) => {
                        const value = doc.slots?.[slotKey]?.value ?? "";
                        return (
                          <SlotField
                            key={slotKey}
                            slotKey={slotKey}
                            slotType="image"
                            value={value}
                            onChange={(v) => updateSlot(slotKey, v)}
                          />
                        );
                      })}
                  </Tabs.Content>
                </Tabs.Root>

                <div className="editor-save">
                  <button
                    className={`button${status === "saving" ? " button-saving" : ""}`}
                    onClick={save}
                    disabled={status === "saving" || status === "saved"}
                    style={{ width: "100%" }}
                  >
                    {status === "saving" ? "Saving…" : "Save"}
                  </button>
                  <p className="editor-note">
                    التغييرات تُنشر على الموقع فقط عند الضغط على Save. بعد الحفظ، انتظر ~15 ثانية لإعادة البناء.
                  </p>
                  {savedAt && <p className="save-meta">Last saved at {savedAt}</p>}
                </div>
                <button
                  type="button"
                  className="button secondary preview-toggle"
                  onClick={() => setShowPreview((v) => !v)}
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
              </>
            ) : (
              <div className="card">Failed to load page.</div>
            )}
          </div>
        </div>

        <div className="editor-preview" style={{ display: showPreview ? undefined : "none" }}>
          <div className="preview-frame">
            <div className="preview-header">Live Preview</div>
            <LivePreview url={previewUrl} currentRoute={key} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
