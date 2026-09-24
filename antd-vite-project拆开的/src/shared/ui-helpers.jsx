import { useState, useEffect, useRef, useCallback } from "react";
import DivMessage from "@nce/eview-react/DivMessage";
import MessageDialog from "@nce/eview-react/MessageDialog";

// ---- message.success/info/warning/error → DivMessage ----
// antd 的 message.xxx() 是命令式，eview-react 只能渲染 <DivMessage>。
// useNotice 返回 notice state + notify(type, text) + clear；配合 <NoticeBar> 渲染。

export function NoticeBar({ notice, onClose }) {
  if (!notice) return null;
  return (
    <DivMessage
      key={notice.key}
      display
      type={notice.type}
      text={notice.text}
      title={notice.title}
      disposeTimeOut={4000}
      enableDisposeTimeOut={notice.type !== "error"}
      onClose={onClose}
      style={{ marginBottom: 12 }}
    />
  );
}

export function useNotice() {
  const [notice, setNotice] = useState(null);
  const notify = useCallback((type, text, title) => {
    setNotice({ key: Date.now(), type, text, title });
  }, []);
  const clear = useCallback(() => setNotice(null), []);
  return { notice, notify, clear };
}

// ---- Modal.confirm → MessageDialog ----
// antd 的 modal.confirm({ title, content, onOk, okText, okButtonProps:{danger} })
// useConfirm 返回 confirm state + requestConfirm(cfg) + closeConfirm；配合 <ConfirmDialog>。

export function ConfirmDialog({ confirm, onClose }) {
  return (
    <MessageDialog
      type={confirm?.danger ? "risk" : "confirm"}
      isOpen={!!confirm}
      iconLocation="title"
      title={confirm?.title}
      content={confirm?.content}
      detail={confirm?.detail}
      onClose={onClose}
      buttons={{
        cancel: { text: confirm?.cancelText || "取消", onClick: onClose },
        ok: {
          text: confirm?.okText || "确定",
          onClick: () => {
            if (confirm?.onOk) confirm.onOk();
            onClose();
          },
        },
      }}
    />
  );
}

export function useConfirm() {
  const [confirm, setConfirm] = useState(null);
  const requestConfirm = useCallback((cfg) => {
    setConfirm({ key: Date.now(), ...cfg });
  }, []);
  const closeConfirm = useCallback(() => setConfirm(null), []);
  return { confirm, requestConfirm, closeConfirm };
}

// ---- Avatar 手写（eview-react 无对应） ----
export function AppAvatar({ text, src, size = 32, style, className = "" }) {
  if (src) {
    return (
      <img
        src={src}
        width={size}
        height={size}
        alt=""
        className={className}
        style={{ borderRadius: "50%", objectFit: "cover", ...style }}
      />
    );
  }
  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: `${Math.round(size * 0.4)}px`,
        ...style,
      }}
    >
      {text}
    </div>
  );
}

// ---- Descriptions 手写 → KeyValueList ----
export function KeyValueList({ items, columns = 2, className = "", title, bordered = true }) {
  return (
    <div className={`app-kv-list ${className}`.trim()}>
      {title ? (
        <div className="app-kv-title" style={{ fontWeight: 600, padding: "8px 12px", borderBottom: bordered ? "1px solid var(--divider, #e0e0e0)" : "none" }}>{title}</div>
      ) : null}
      <dl
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: 0,
          margin: 0,
        }}
      >
        {items.map((it, i) => (
          <div
            key={i}
            className="app-kv-cell"
            style={{
              display: "flex",
              gridColumn: it.span ? `span ${it.span}` : undefined,
              borderBottom: bordered ? "1px solid var(--divider, #e0e0e0)" : "none",
              borderRight: bordered ? "1px solid var(--divider, #e0e0e0)" : "none",
              padding: "8px 12px",
            }}
          >
            <dt style={{ color: "var(--on-surface-variant, #777)", whiteSpace: "nowrap", minWidth: 80, marginRight: 12 }}>{it.label}</dt>
            <dd style={{ margin: 0, color: "var(--on-surface, #191919)", flex: 1 }}>{it.value ?? "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// ---- Dropdown 手写（eview-react 无对应） ----
export function AppDropdown({ items, onSelect, children, placement = "right" }) {
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
    <div ref={ref} className="app-dropdown" style={{ position: "relative", display: "inline-block" }}>
      <span style={{ display: "inline-block", cursor: "pointer" }} onClick={() => setOpen((o) => !o)}>
        {children}
      </span>
      {open && (
        <div
          className="app-dropdown-menu"
          style={{
            position: "absolute",
            [placement]: 0,
            top: "100%",
            minWidth: 160,
            background: "var(--surface-container-highest, #fff)",
            border: "1px solid var(--divider, #e0e0e0)",
            borderRadius: "var(--radius-container, 8px)",
            boxShadow: "var(--shadow-popover, 0 2px 12px rgba(0,0,0,0.12))",
            zIndex: 1050,
            padding: "4px 0",
          }}
        >
          {items.map((item, i) =>
            item.type === "divider" ? (
              <div key={i} style={{ height: 1, background: "var(--divider, #e0e0e0)", margin: "4px 0" }} />
            ) : (
              <button
                key={item.key}
                type="button"
                className={`app-dropdown-item${item.danger ? " danger" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  color: item.danger ? "var(--error, #E02128)" : "var(--on-surface, #191919)",
                  fontSize: 14,
                }}
                onClick={() => {
                  setOpen(false);
                  if (onSelect) onSelect(item.key);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ---- Progress 手写（eview-react 无对应） ----
export function SimpleProgress({ percent, status = "normal", showInfo = true }) {
  const color =
    status === "exception"
      ? "var(--error, #E02128)"
      : status === "success"
      ? "var(--success, #62B42E)"
      : "var(--primary, #0067D1)";
  const p = Math.min(100, Math.max(0, percent || 0));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 8,
          background: "var(--hover, rgba(0,0,0,0.05))",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div style={{ width: `${p}%`, height: "100%", background: color, transition: "width .2s" }} />
      </div>
      {showInfo && (
        <span style={{ color: "var(--on-surface-variant, #777)", minWidth: 36, textAlign: "right", fontSize: 12 }}>{p}%</span>
      )}
    </div>
  );
}

// ---- Tag.CheckableTag 手写（eview-react Tag 无 closable/checkable） ----
export function CheckableTag({ checked, onChange, children }) {
  return (
    <button
      type="button"
      onClick={() => onChange && onChange(!checked)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 12,
        cursor: "pointer",
        border: checked ? "1px solid var(--primary, #0067D1)" : "1px solid var(--divider, #e0e0e0)",
        background: checked ? "var(--primary-container, #E6F2FD)" : "transparent",
        color: checked ? "var(--primary, #0067D1)" : "var(--on-surface-variant, #777)",
      }}
    >
      {children}
    </button>
  );
}
