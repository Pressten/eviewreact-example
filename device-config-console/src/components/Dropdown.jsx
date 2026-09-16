// TODO(eview-react): antd Dropdown 在 eview-react 无直接对应,当前手写补位
// 支持: trigger=click、placement=bottomRight/bottomLeft、menu({items,onClick,selectedKeys})
import { useEffect, useRef, useState } from "react";
import "./dropdown.css";

export default function Dropdown({ menu, trigger = "click", placement = "bottomLeft", children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const handleTriggerClick = (e) => {
    if (trigger !== "click") return;
    e.stopPropagation();
    setOpen((v) => !v);
  };

  const handleItemClick = (key) => {
    menu.onClick && menu.onClick({ key });
    setOpen(false);
  };

  return (
    <span className={`app-dropdown ${open ? "is-open" : ""}`} ref={ref}>
      <span className="app-dropdown-trigger" onClick={handleTriggerClick}>
        {children}
      </span>
      {open ? (
        <div className={`app-dropdown-menu placement-${placement}`}>
          {(menu.items || []).map((item, idx) =>
            item.type === "divider" ? (
              <div className="app-dropdown-divider" key={`d-${idx}`} />
            ) : (
              <button
                type="button"
                key={item.key || idx}
                className={`app-dropdown-item ${item.danger ? "is-danger" : ""} ${
                  menu.selectedKeys && menu.selectedKeys.indexOf(item.key) >= 0 ? "is-selected" : ""
                }`}
                onClick={() => handleItemClick(item.key)}
              >
                {item.icon ? <span className="app-dropdown-item-icon">{item.icon}</span> : null}
                <span className="app-dropdown-item-label">{item.label}</span>
              </button>
            )
          )}
        </div>
      ) : null}
    </span>
  );
}
