import { useState, useCallback, useEffect, useRef } from "react";

// useConfirm — Modal.confirm 的 shim，保持源项目调用风格（open(opts) 触发，确认走 onOk）。
// eview-react 的 MessageDialog 走渲染式 + isOpen 受控；此 hook 返回 [openConfirm, ConfirmDialog]。
// ConfirmDialog 渲染在调用组件内，样式用源项目 CSS 变量，不写死色值。

export function useConfirm() {
  const [state, setState] = useState(null);
  const okRef = useRef(null);

  const open = useCallback((opts) => {
    okRef.current = opts.onOk;
    setState({
      title: opts.title,
      content: opts.content,
      icon: opts.icon,
      okText: opts.okText || "确定",
      cancelText: opts.cancelText || "取消",
      danger: opts.okButtonProps?.danger || opts.danger || false,
    });
  }, []);

  const close = useCallback(() => {
    okRef.current = null;
    setState(null);
  }, []);

  const handleOk = useCallback(() => {
    const fn = okRef.current;
    setState(null);
    okRef.current = null;
    if (typeof fn === "function") fn();
  }, []);

  const dialog = state ? (
    <ConfirmDialogView {...state} onOk={handleOk} onCancel={close} />
  ) : null;

  return [open, dialog];
}

function ConfirmDialogView({ title, content, icon, okText, cancelText, danger, onOk, onCancel }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      ref={wrapRef}
      className="app-confirm-mask"
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--scrim)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === wrapRef.current) onCancel();
      }}
    >
      <div
        className="app-confirm-dialog"
        style={{
          width: "420px",
          maxWidth: "calc(100vw - 32px)",
          background: "var(--surface-container-highest)",
          color: "var(--on-surface)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-modal)",
          padding: "20px 24px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          {icon ? <span style={{ flex: "0 0 auto", lineHeight: 0 }}>{icon}</span> : null}
          <div style={{ flex: 1, minWidth: 0 }}>
            {title ? (
              <div style={{ font: "var(--font-headline-m)", fontWeight: "var(--font-weight-semibold)", marginBottom: "8px" }}>
                {title}
              </div>
            ) : null}
            {content ? (
              <div style={{ font: "var(--font-body-m)", color: "var(--on-surface-variant)" }}>{content}</div>
            ) : null}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "20px" }}>
          <button
            type="button"
            onClick={onCancel}
            style={btnStyle("default")}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onOk}
            style={btnStyle(danger ? "risk" : "primary")}
          >
            {okText}
          </button>
        </div>
      </div>
    </div>
  );
}

function btnStyle(status) {
  const base = {
    height: "32px",
    padding: "0 16px",
    borderRadius: "var(--radius-base)",
    fontSize: "var(--font-size-md)",
    cursor: "pointer",
    border: "1px solid var(--color-border)",
    background: "transparent",
    color: "var(--on-surface)",
  };
  if (status === "primary") {
    return { ...base, background: "var(--primary)", color: "var(--on-primary)", borderColor: "var(--primary)" };
  }
  if (status === "risk") {
    return { ...base, background: "var(--error)", color: "var(--on-error)", borderColor: "var(--error)" };
  }
  return base;
}
