import { useState, useRef, useEffect } from "react";
import "./index.css";

// 手写下拉菜单（eview 无 antd Dropdown 直接对应；PopUpMenu 的 serialno 契约过重且版本边界未验，
// 按 fallback-handwrite.md 用 div + 状态控制实现，类名用业务前缀 app-）。
// items: [{ key, label, icon?, disabled?, isDivider? }]（兼容 antd 的 { type: "divider" }）
// onMenuClick: (key) => void
// children: 触发元素（Button / button 等）
// placement: "bottomLeft" | "bottomRight"，默认 bottomLeft
export default function ActionMenu({ items = [], onMenuClick, children, placement = "bottomLeft", className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <span className={`app-action-menu ${className || ""}`} ref={ref}>
      <span className="app-action-menu__trigger" onClick={() => setOpen((o) => !o)}>
        {children}
      </span>
      {open ? (
        <ul className={`app-action-menu__list app-action-menu__list--${placement}`} role="menu">
          {items.map((it, idx) =>
            it.isDivider || it.type === "divider" ? (
              <li key={`d${idx}`} className="app-action-menu__divider" role="separator" />
            ) : (
              <li
                key={it.key || idx}
                className={`app-action-menu__item ${it.disabled ? "is-disabled" : ""}`}
                role="menuitem"
                onClick={() => {
                  if (it.disabled) return;
                  setOpen(false);
                  onMenuClick && onMenuClick(it.key);
                }}
              >
                {it.icon ? <span className="app-action-menu__item-icon">{it.icon}</span> : null}
                <span className="app-action-menu__item-text">{it.label}</span>
              </li>
            )
          )}
        </ul>
      ) : null}
    </span>
  );
}
