import { useState, useRef, useEffect } from "react";

// TODO(eview-react): Dropdown 无对应 Reference，当前手写下拉菜单。
// 契约兼容源项目 antd Dropdown 的 menu 写法：menu={ items:[{key,icon,label,danger,type:'divider'}], onClick:({key})=>{} }
// trigger=['click'] 触发；点击菜单项后自动关闭，并调用 onClick({key})。

export default function Dropdown({ menu, children, trigger = ["click"], placement = "bottomRight" }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const isClick = trigger.includes("click");

  useEffect(() => {
    if (!open) return;
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const handleItemClick = (item) => {
    setOpen(false);
    if (item.type === "divider") return;
    if (menu?.onClick) menu.onClick({ key: item.key });
  };

  const alignStyle =
    placement === "bottomRight"
      ? { right: 0 }
      : placement === "bottomLeft"
      ? { left: 0 }
      : { left: 0 };

  return (
    <span
      ref={wrapRef}
      style={{ position: "relative", display: "inline-flex" }}
      onClick={(e) => {
        if (!isClick) return;
        e.stopPropagation();
        setOpen((v) => !v);
      }}
    >
      {children}
      {open && menu?.items?.length ? (
        <div
          className="app-dropdown-menu"
          style={{
            position: "absolute",
            top: "100%",
            marginTop: "4px",
            zIndex: 1000,
            minWidth: "160px",
            background: "var(--surface-container-highest)",
            color: "var(--on-surface)",
            border: "1px solid var(--divider)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-base)",
            padding: "4px",
            ...alignStyle,
          }}
        >
          {menu.items.map((item, i) =>
            item.type === "divider" ? (
              <div
                key={`d-${i}`}
                style={{ height: "1px", background: "var(--divider)", margin: "4px 0" }}
              />
            ) : (
              <button
                key={item.key || i}
                type="button"
                onClick={() => handleItemClick(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "6px 12px",
                  border: "none",
                  background: "transparent",
                  color: item.danger ? "var(--error)" : "var(--on-surface)",
                  fontSize: "var(--font-size-md)",
                  textAlign: "left",
                  borderRadius: "var(--radius-base)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {item.icon ? <span style={{ flex: "0 0 auto", display: "inline-flex" }}>{item.icon}</span> : null}
                <span style={{ flex: 1 }}>{item.label}</span>
              </button>
            )
          )}
        </div>
      ) : null}
    </span>
  );
}
