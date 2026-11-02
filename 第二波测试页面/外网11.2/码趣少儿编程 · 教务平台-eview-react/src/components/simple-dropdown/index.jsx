import { useState, useRef, useEffect } from "react";
import "./index.css";

export default function SimpleDropdown({ items, onSelect, children, placement = "bottomLeft", className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleItemClick = (item) => {
    if (item.type === "divider") return;
    setOpen(false);
    if (onSelect && item.key !== undefined) onSelect(item.key);
  };

  return (
    <div ref={ref} className={`simple-dropdown ${className}`}>
      <div className="simple-dropdown__trigger" onClick={() => setOpen((o) => !o)}>
        {children}
      </div>
      {open && (
        <div className={`simple-dropdown__menu simple-dropdown__menu--${placement}`}>
          {items.map((item, idx) =>
            item.type === "divider" ? (
              <div key={`divider-${idx}`} className="simple-dropdown__divider" />
            ) : (
              <button
                key={item.key}
                type="button"
                className={`simple-dropdown__item${item.danger ? " is-danger" : ""}`}
                onClick={() => handleItemClick(item)}
              >
                {item.icon && <span className="simple-dropdown__item-icon">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
