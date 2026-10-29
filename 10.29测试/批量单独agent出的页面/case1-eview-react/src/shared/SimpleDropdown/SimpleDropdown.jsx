import { useState, useRef, useEffect } from "react";
import "./SimpleDropdown.css";

// SimpleDropdown — 手写下拉菜单
// antd Dropdown 在 eview-react 无直接对应（PopUpMenu 仅支持 text 菜单项，
// 无法承载富 JSX 标签如通知卡片/自定义内容）。
// 点击触发器切换显隐，点击外部关闭，点击菜单项后自动关闭（事件冒泡到 panel）。
export default function SimpleDropdown({ trigger, children, panelClassName, align = "left" }) {
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
    <div className={`sd-wrapper sd-align-${align}`} ref={ref}>
      <div className="sd-trigger" onClick={() => setOpen((o) => !o)}>
        {trigger}
      </div>
      {open ? (
        <div
          className={`sd-panel ${panelClassName || ""}`}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
