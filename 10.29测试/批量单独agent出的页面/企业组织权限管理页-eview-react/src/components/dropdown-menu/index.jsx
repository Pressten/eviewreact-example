import { useState, useRef, useEffect } from "react";
import "./index.css";

// 手写下拉菜单 — antd Dropdown 无 eview 对应（见 handwrite-templates.md）。
// items: [{ key, label, icon }] 或 [{ type: "divider" }]；onSelect(key)；children 为触发器。
export default function DropdownMenu({ items, onSelect, children, placement = "bottomRight" }) {
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

  return (
    <span className={`app-dropdown ${open ? "is-open" : ""}`} ref={ref}>
      <span className="app-dropdown__trigger" onClick={() => setOpen((o) => !o)}>
        {children}
      </span>
      {open && (
        <div className={`app-dropdown__menu app-dropdown__menu--${placement}`}>
          {items.map((it, i) =>
            it.type === "divider" ? (
              <div key={i} className="app-dropdown__divider" />
            ) : (
              <button
                key={it.key}
                type="button"
                className="app-dropdown__item"
                onClick={() => {
                  setOpen(false);
                  if (onSelect) onSelect(it.key);
                }}
              >
                {it.icon}
                <span>{it.label}</span>
              </button>
            )
          )}
        </div>
      )}
    </span>
  );
}
