import { useState, useEffect, useRef } from "react";

// 手写 Dropdown —— antd Dropdown 在 eview-react 无对应组件（PopUpMenu 未覆盖），按 fallback-handwrite 手写。
// 点击 trigger 切换菜单；点击菜单项 onSelect(key, item)；点击外部关闭。
// items: [{ key, label }] | [{ type: "divider" }] | [{ key, label, danger }]
export default function Dropdown({ trigger, items, onSelect, selectedKey, align = "right", menuStyle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const handleSelect = (item) => {
    if (item.type === "divider") return;
    onSelect && onSelect(item.key, item);
    setOpen(false);
  };

  return (
    <div className="app-dropdown" ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <span className="app-dropdown__trigger" style={{ display: "inline-flex" }} onClick={() => setOpen((v) => !v)}>
        {trigger}
      </span>
      {open && (
        <div
          className="app-dropdown__menu"
          style={{
            position: "absolute",
            top: "100%",
            [align]: 0,
            marginTop: "0.25rem",
            background: "var(--surface-container-highest)",
            border: "1px solid var(--outline-variant)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-base)",
            padding: "0.25rem 0",
            minWidth: "8rem",
            zIndex: 1000,
            ...menuStyle,
          }}
        >
          {items.map((item, i) =>
            item.type === "divider" ? (
              <div key={`div-${i}`} style={{ height: 1, background: "var(--outline-variant)", margin: "0.25rem 0" }} />
            ) : (
              <div
                key={item.key}
                className="app-dropdown__item"
                onClick={() => handleSelect(item)}
                style={{
                  padding: "0.375rem 0.875rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: item.danger ? "var(--error)" : "var(--on-surface)",
                  background: selectedKey === item.key ? "var(--surface-variant)" : "transparent",
                  fontWeight: selectedKey === item.key ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-variant)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = selectedKey === item.key ? "var(--surface-variant)" : "transparent"; }}
              >
                {item.label}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
