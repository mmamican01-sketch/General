"use client";

import { MediaPicker } from "./MediaPicker";

type SchemaFormFieldProps = {
  fieldKey: string;
  fieldType: string;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
};

function parseFieldType(typeStr: string): { base: string; hint?: string } {
  const lower = (typeStr || "string").toLowerCase();
  if (lower.includes("array<")) {
    if (lower.includes("label") && lower.includes("value")) return { base: "specs", hint: "label,value" };
    return { base: "array-string", hint: "string" };
  }
  if (lower.includes("url") || lower.includes("image")) return { base: "image" };
  if (lower.includes("richtext") || lower.includes("detail") || lower.includes("overview") || lower.includes("body")) return { base: "textarea" };
  return { base: "text" };
}

export function SchemaFormField({ fieldKey, fieldType, value, onChange, disabled }: SchemaFormFieldProps) {
  const { base } = parseFieldType(fieldType);
  const label = fieldKey.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  if (base === "image") {
    return (
      <div className="card" style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>{label}</label>
        <MediaPicker
          value={typeof value === "string" ? value : ""}
          onChange={(v) => onChange(v)}
        />
      </div>
    );
  }

  if (base === "specs") {
    const arr = Array.isArray(value) ? value : [];
    const specs = arr as Array<{ label?: string; value?: string }>;
    return (
      <div className="card" style={{ marginBottom: 16 }}>
        <h4 style={{ margin: "0 0 8px" }}>{label}</h4>
        {specs.map((s, i) => (
          <div key={i} className="row" style={{ marginBottom: 8 }}>
            <input
              className="input"
              placeholder="Label"
              value={s?.label ?? ""}
              onChange={(e) => {
                const next = [...specs];
                next[i] = { ...next[i], label: e.target.value };
                onChange(next);
              }}
              style={{ flex: 1 }}
              disabled={disabled}
            />
            <input
              className="input"
              placeholder="Value"
              value={s?.value ?? ""}
              onChange={(e) => {
                const next = [...specs];
                next[i] = { ...next[i], value: e.target.value };
                onChange(next);
              }}
              style={{ flex: 1 }}
              disabled={disabled}
            />
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                const next = specs.filter((_, j) => j !== i);
                onChange(next);
              }}
              disabled={disabled}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="button secondary"
          onClick={() => onChange([...specs, {}])}
          disabled={disabled}
        >
          + Add
        </button>
      </div>
    );
  }

  if (base === "array-string") {
    const arr = Array.isArray(value) ? value : [];
    const strings = arr as string[];
    return (
      <div className="card" style={{ marginBottom: 16 }}>
        <h4 style={{ margin: "0 0 8px" }}>{label}</h4>
        {strings.map((s, i) => (
          <div key={i} className="row" style={{ marginBottom: 8 }}>
            <input
              className="input"
              value={s}
              onChange={(e) => {
                const next = [...strings];
                next[i] = e.target.value;
                onChange(next);
              }}
              style={{ flex: 1 }}
              disabled={disabled}
            />
            <button
              type="button"
              className="button secondary"
              onClick={() => onChange(strings.filter((_, j) => j !== i))}
              disabled={disabled}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="button secondary"
          onClick={() => onChange([...strings, ""])}
          disabled={disabled}
        >
          + Add
        </button>
      </div>
    );
  }

  if (base === "textarea") {
    return (
      <div className="card" style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>{label}</label>
        <textarea
          className="textarea"
          rows={4}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>{label}</label>
      <input
        className="input"
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
