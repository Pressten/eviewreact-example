import { useState, useRef, useEffect } from "react";
import "./index.css";

// TODO(eview-react): antd Dropdown 无对应组件，手写下拉菜单
// menu.items 保留源数据结构（{ key, label, icon, danger, type:'divider' }），icon 由调用方传入 <Icon name/> 原样透传
export default function Dropdown({ trigger, placement = "bottomRight", menu, children, arrow }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const items = (menu && menu.items) || [];

  const handleItemClick = (item) => {
    if (!item || item.type === "divider") return;
    setOpen(false);
    if (typeof item.onClick === "function") item.onClick(item);
  };

  return (
    <div className={`app-dropdown${arrow ? " app-dropdown-arrow" : ""}`} ref={ref}>
      <div className="app-dropdown-trigger" onClick={() => setOpen((o) => !o)}>
        {trigger || children}
      </div>
      {open ? (
        <div className={`app-dropdown-menu app-dropdown-menu-${placement}`}>
          {items.map((item, i) =>
            item && item.type === "divider" ? (
              <div className="app-dropdown-divider" key={`d-${i}`} />
            ) : (
              <button
                type="button"
                key={item.key || i}
                className={`app-dropdown-item${item.danger ? " app-dropdown-item-danger" : ""}`}
                onClick={() => handleItemClick(item)}
              >
                {item.icon ? <span className="app-dropdown-item-icon">{item.icon}</span> : null}
                <span className="app-dropdown-item-label">{item.label}</span>
              </button>
            )
          )}
        </div>
      ) : null}
    </div>
  );
}
