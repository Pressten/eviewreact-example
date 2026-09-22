import { useState, useRef, useEffect } from "react";

// TODO(eview-react): Dropdown 无对应组件，手写下拉菜单。
// 兼容 antd 调用：<Dropdown menu={{items, onClick}} trigger={["click"]}>{trigger}</Dropdown>
// items: [{ key, icon, label, danger, type:'divider' }]
export default function AppDropdown({ menu, children, placement = "bottomRight" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const items = (menu && menu.items) || [];
  const onClick = (menu && menu.onClick) || (() => {});

  return (
    <span className="app-dropdown" ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <span className="app-dropdown-trigger" onClick={() => setOpen((v) => !v)}>
        {children}
      </span>
      {open ? (
        <div className="app-dropdown-menu" data-placement={placement}>
          {items.map((it, idx) => {
            if (it.type === "divider") {
              return <div key={`d-${idx}`} className="app-dropdown-divider" />;
            }
            return (
              <button
                key={it.key}
                type="button"
                className={`app-dropdown-item${it.danger ? " danger" : ""}`}
                onClick={() => {
                  setOpen(false);
                  onClick({ key: it.key });
                }}
              >
                {it.icon ? <span className="app-dropdown-item-icon">{it.icon}</span> : null}
                <span>{it.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </span>
  );
}
