import { useState, useRef, useEffect } from "react";

export function SimpleProgress({ percent, status = "normal", size, showInfo = true }) {
  const color =
    status === "exception" || status === "error"
      ? "var(--error, #E02128)"
      : status === "success"
      ? "var(--success, #62B42E)"
      : "var(--primary, #0067D1)";
  const p = Math.min(100, Math.max(0, percent || 0));
  const h = size === "small" ? 6 : 8;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
      <div
        style={{
          flex: 1,
          height: h,
          background: "var(--surface-variant, rgba(0,0,0,0.06))",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${p}%`,
            height: "100%",
            background: color,
            transition: "width .3s",
          }}
        />
      </div>
      {showInfo && (
        <span style={{ color: "var(--on-surface-variant, #777)", minWidth: 36, textAlign: "right", fontSize: 12 }}>
          {p}%
        </span>
      )}
    </div>
  );
}

export function Segmented({ value, onChange, options }) {
  return (
    <div className="app-segmented">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`app-segmented-item${value === opt.value ? " active" : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function AppAvatar({ text, src, size = 32, style }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          ...style,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--primary-container, #E6F2FD)",
        color: "var(--primary-fixed, #0067D1)",
        fontSize: size * 0.4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      {text}
    </div>
  );
}

export function KeyValueList({ items, columns = 2, bordered = true }) {
  return (
    <dl
      className="app-kv-list"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: bordered ? 1 : 0,
        margin: 0,
        background: bordered ? "var(--divider, #e0e0e0)" : "transparent",
        borderRadius: bordered ? 4 : 0,
        overflow: "hidden",
      }}
    >
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            gridColumn: `span ${it.span || 1}`,
            display: "grid",
            gridTemplateColumns: "minmax(100px, auto) 1fr",
            background: "var(--surface-container-highest, #fff)",
          }}
        >
          <dt
            style={{
              padding: "8px 12px",
              background: "var(--surface-container-low, #f7f7f7)",
              color: "var(--on-surface-variant, #777)",
              whiteSpace: "nowrap",
            }}
          >
            {it.label}
          </dt>
          <dd style={{ margin: 0, padding: "8px 12px", color: "var(--on-surface, #191919)" }}>
            {it.value ?? "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Dropdown({ trigger, items, onSelect, placement = "bottomRight" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const pos =
    placement === "bottomRight"
      ? { right: 0, top: "100%", marginTop: 4 }
      : { left: 0, top: "100%", marginTop: 4 };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <span onClick={() => setOpen((v) => !v)} style={{ display: "inline-flex", cursor: "pointer" }}>
        {trigger}
      </span>
      {open && (
        <div className="app-dropdown-menu" style={{ position: "absolute", zIndex: 1000, minWidth: 160, ...pos }}>
          {items.map((it, i) =>
            it.divider ? (
              <div key={i} className="app-dropdown-divider" style={{ height: 1, background: "var(--divider, #e0e0e0)", margin: "4px 0" }} />
            ) : (
              <button
                key={it.key || i}
                type="button"
                className={`app-dropdown-item${it.danger ? " danger" : ""}`}
                onClick={() => {
                  setOpen(false);
                  onSelect(it.key);
                }}
              >
                {it.icon}
                {it.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
