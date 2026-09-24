// TODO(eview-react): Dropdown 未覆盖，当前手写下拉操作菜单
// 触发器用 IconButton（满足"可点击图标按钮走 IconButton"硬约束）；菜单项为原生 button（手写组件内部）。
import { useState, useRef, useEffect } from "react";
import IconButton from "@nce/eview-react/IconButton";
import { Icon } from "../../shared/icon.jsx";

function ActionMenu({ items, onAction, tipText = "更多" }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const handleItem = (item) => {
    setOpen(false);
    onAction(item.key);
  };

  return (
    <span className="action-menu" ref={wrapRef}>
      <IconButton
        iconName={<Icon name="ellipsis" size={15} />}
        tipText={tipText}
        size="small"
        onClick={() => setOpen((o) => !o)}
      />
      {open ? (
        <div className="action-menu__panel">
          {items.map((item, index) =>
            item.type === "divider" ? (
              <div key={"d" + index} className="action-menu__divider" />
            ) : (
              <button
                key={item.key}
                type="button"
                className={"action-menu__item" + (item.danger ? " action-menu__item--danger" : "")}
                onClick={() => handleItem(item)}
              >
                {item.icon ? <span className="action-menu__item-icon">{item.icon}</span> : null}
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>
      ) : null}
    </span>
  );
}

export default ActionMenu;
