import { useState, useRef, useEffect, useCallback } from "react";
import "./Dropdown.css";

// antd Dropdown 兼容手写件（eview-react 无直接对应；PopUpMenu API 差异过大）。
// 支持 antd 用法：
//   <Dropdown menu={{ items, onClick, selectable, selectedKeys }} trigger={["click"]} placement="bottomRight">
//     <触发元素 />
//   </Dropdown>
//   <Dropdown open={open} dropdownRender={() => <自定义面板/>} trigger={[]}>…</Dropdown>
// click 触发：点击触发元素切换显隐；点击外部关闭。
// open 受控：传 open 时由外部控制显隐（trigger 仍可切换，调 onOpenChange）。
export default function Dropdown({
  menu,
  trigger = ["click"],
  placement = "bottomLeft",
  open: openProp,
  onOpenChange,
  dropdownRender,
  children,
  overlayClassName,
  overlayStyle,
}) {
  const internalOpen = useState(false);
  const [internal, setInternal] = internalOpen;
  const controlled = typeof openProp === "boolean";
  const isOpen = controlled ? openProp : internal;

  const wrapRef = useRef(null);
  const setOpen = useCallback(
    (next) => {
      if (controlled) {
        if (onOpenChange) onOpenChange(next);
      } else {
        setInternal(next);
        if (onOpenChange) onOpenChange(next);
      }
    },
    [controlled, onOpenChange, setInternal]
  );

  // 点击外部关闭
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, setOpen]);

  const clickTrigger = trigger.includes("click");
  const handleTriggerClick = (e) => {
    if (clickTrigger) {
      e.stopPropagation();
      setOpen(!isOpen);
    }
  };

  // 菜单项渲染
  const renderMenu = () => {
    if (!menu) return null;
    const items = menu.items || [];
    const handleItemClick = (item) => {
      if (item.type === "divider") return;
      if (menu.onClick) menu.onClick({ key: item.key, item });
      if (!menu.selectable) setOpen(false);
    };
    return (
      <ul className={`app-dropdown-menu ${overlayClassName || ""}`} style={overlayStyle} role="menu">
        {items.map((item, idx) => {
          if (item.type === "divider") {
            return <li key={`d-${idx}`} className="app-dropdown-divider" role="separator" />;
          }
          const selected = menu.selectable && menu.selectedKeys && menu.selectedKeys.includes(item.key);
          return (
            <li
              key={item.key ?? idx}
              className={`app-dropdown-item${selected ? " is-selected" : ""}${item.danger ? " is-danger" : ""}`}
              role="menuitem"
              onClick={() => handleItemClick(item)}
            >
              {item.icon != null && <span className="app-dropdown-item-icon">{item.icon}</span>}
              <span className="app-dropdown-item-label">{item.label}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  const posClass = `app-dropdown-placement-${placement}`;

  return (
    <span className="app-dropdown-wrapper" ref={wrapRef} style={{ display: "inline-flex", position: "relative" }}>
      <span className="app-dropdown-trigger" onClick={handleTriggerClick}>
        {children}
      </span>
      {isOpen && (
        <div className={`app-dropdown-overlay ${posClass}`}>
          {dropdownRender ? dropdownRender() : renderMenu()}
        </div>
      )}
    </span>
  );
}
