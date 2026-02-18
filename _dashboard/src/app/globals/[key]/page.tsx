"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Slot = { type: string; value: string; note?: string };
type GlobalDoc = { routeKey: string; route: string; slots: Record<string, Slot> };

export default function GlobalEditor() {
  const params = useParams<{ key: string }>();
  const [key, setKey] = useState("");
  const [doc, setDoc] = useState<GlobalDoc | null>(null);
  const [selected, setSelected] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setKey(params?.key || "");
  }, [params]);

  useEffect(() => {
    if (!key) return;
    (async () => {
      const res = await fetch(`/api/globals/${key}`);
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Failed to load global");
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

  async function save() {
    if (!doc || !selected) return;
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
      setStatus(data.error || "Save failed");
      return;
    }
    setDoc(next);
    setStatus("Saved");
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <h1 className="title" style={{ margin: 0 }}>
          Global Editor: {key}
        </h1>
        <a className="button secondary" href="/globals">
          Back
        </a>
      </div>

      {status ? <p className="muted">{status}</p> : null}

      {doc ? (
        <div className="grid" style={{ gridTemplateColumns: "280px 1fr" }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Slots</h3>
            <ul className="list">
              {keys.map((k) => (
                <li key={k}>
                  <button className="button secondary" style={{ width: "100%", textAlign: "left" }} onClick={() => setSelected(k)}>
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
                <textarea className="textarea" value={value} onChange={(e) => setValue(e.target.value)} />
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
  );
}
