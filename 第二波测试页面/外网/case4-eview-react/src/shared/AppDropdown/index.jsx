import { useEffect, useRef, useState } from "react";
import "./AppDropdown.css";

// antd Dropdown 无 eview 对应组件，手写最小可用下拉菜单。
// 兼容 antd 调用形态：<AppDropdown menu={{ items, onClick, selectedKeys }} placement="bottomRight" trigger={["click"]}>{trigger}</AppDropdown>
// 也支持扁平 props：items / onClick / selectedKeys。
// items: { key, label, icon?, danger?, type?: 'divider', onClick? }
// placement: 仅 bottomRight（本项目所有调用点），弹出层右对齐、位于触发器下方。
export default function AppDropdown({
  menu,
  items: itemsProp,
  onClick: onClickProp,
  selectedKeys: selectedKeysProp,
  placement = "bottomRight",
  trigger = ["click"],
  children,
}) {
  const items = (menu && menu.items) || itemsProp || [];
  const onMenuClick = (menu && menu.onClick) || onClickProp;
  const selectedKeys = (menu && menu.selectedKeys) || selectedKeysProp || [];
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

  const handleItemClick = (item) => {
    if (item.type === "divider") return;
    setOpen(false);
    if (typeof item.onClick === "function") item.onClick(item);
    if (typeof onMenuClick === "function") onMenuClick({ key: item.key, item });
  };

  return (
    <span className="app-dropdown" ref={ref}>
      <span
        className="app-dropdown-trigger"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {children}
      </span>
      {open && (
        <span className={`app-dropdown-popup app-dropdown-${placement}`}>
          {items.map((item, idx) => {
            if (item && item.type === "divider") {
              return <span className="app-dropdown-divider" key={`d-${idx}`} />;
            }
            const selected = selectedKeys.includes(item.key);
            return (
              <button
                type="button"
                key={item.key ?? idx}
                className={`app-dropdown-item ${selected ? "app-dropdown-item-selected" : ""} ${
                  item.danger ? "app-dropdown-item-danger" : ""
                }`}
                onClick={() => handleItemClick(item)}
              >
                {item.icon ? <span className="app-dropdown-item-icon">{item.icon}</span> : null}
                <span className="app-dropdown-item-label">{item.label}</span>
              </button>
            );
          })}
        </span>
      )}
    </span>
  );
}
