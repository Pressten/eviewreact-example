// TODO(eview-react): antd Dropdown 在 eview-react 无 Reference(导出清单中的 DropDown 未提供规格,
// 本工程也无已验证用法),按补位 Pattern 用原生 HTML 手写最小可用版:
// 支持 trigger="click"、placement="bottomLeft|bottomRight"、menu({items, onClick, selectedKeys})、
// divider 与 danger 项、ESC / 点击外部关闭;不支持多级子菜单与右键菜单。
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
        <div className={`app-dropdown-menu placement-${placement}`} role="menu">
          {(menu.items || []).map((item, idx) =>
            item.type === "divider" ? (
              <div className="app-dropdown-divider" key={`d-${idx}`} />
            ) : (
              <button
                type="button"
                key={item.key || idx}
                role="menuitem"
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
