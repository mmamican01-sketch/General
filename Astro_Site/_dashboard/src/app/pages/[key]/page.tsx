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
    const res = await fetch(`/api/content?page=${encodeURIComponent(key)}&locale=en`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doc),
    });
    if (res.ok) {
      setStatus("saved");
    } else {
      setStatus("unsaved");
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
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div style={{ flex: "0 0 420px", overflow: "auto", borderRight: "1px solid var(--line)" }}>
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
                <Tabs.Root defaultValue="content">
                  <Tabs.List style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                    <Tabs.Trigger value="content" style={{ padding: "8px 16px", border: "1px solid var(--line)", background: "transparent", borderRadius: 6, cursor: "pointer" }}>
                      Content
                    </Tabs.Trigger>
                    <Tabs.Trigger value="seo" style={{ padding: "8px 16px", border: "1px solid var(--line)", background: "transparent", borderRadius: 6, cursor: "pointer" }}>
                      SEO
                    </Tabs.Trigger>
                    <Tabs.Trigger value="media" style={{ padding: "8px 16px", border: "1px solid var(--line)", background: "transparent", borderRadius: 6, cursor: "pointer" }}>
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
                      <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>Meta Title</label>
                      <input
                        className="input"
                        value={doc.seo?.title ?? ""}
                        onChange={(e) => { setDoc((d) => d ? { ...d, seo: { ...d.seo, title: e.target.value } } : null); setStatus("unsaved"); }}
                      />
                    </div>
                    <div className="card" style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>Meta Description</label>
                      <textarea
                        className="textarea"
                        rows={3}
                        value={doc.seo?.description ?? ""}
                        onChange={(e) => { setDoc((d) => d ? { ...d, seo: { ...d.seo, description: e.target.value } } : null); setStatus("unsaved"); }}
                      />
                    </div>
                    <div className="card" style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>OG Image</label>
                      <MediaPicker
                        value={doc.seo?.image ?? ""}
                        onChange={(v) => { setDoc((d) => d ? { ...d, seo: { ...d.seo, image: v } } : null); setStatus("unsaved"); }}
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

                <button className="button" onClick={save} style={{ marginTop: 16, width: "100%" }}>
                  Save
                </button>
                <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
                  التغييرات تُنشر على الموقع فقط عند الضغط على Save. بعد الحفظ، انتظر ~15 ثانية لإعادة البناء.
                </p>
              </>
            ) : (
              <div className="card">Failed to load page.</div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0, padding: 16 }}>
          <LivePreview url={previewUrl} currentRoute={key} />
        </div>
      </div>
    </DashboardShell>
  );
}
