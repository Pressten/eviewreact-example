import { useSyncExternalStore } from "react";

// message shim — 命令式 API（message.success/info/warning/error），保持源项目调用点零改动。
// eview-react 的 DivMessage 只能渲染式使用，无命令式 API；此 shim 在内部维护 toast 列表并渲染。
// 样式全部用源项目 CSS 变量，不写死色值。

let toasts = [];
let listeners = new Set();
let seq = 0;

function emit() {
  listeners.forEach((l) => l());
}

function add(type, text, duration = 3000) {
  const id = ++seq;
  toasts = [...toasts, { id, type, text }];
  emit();
  if (duration > 0) {
    setTimeout(() => remove(id), duration);
  }
  return id;
}

function remove(id) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export const message = {
  success: (t) => add("success", t),
  info: (t) => add("info", t),
  warning: (t) => add("warning", t),
  warn: (t) => add("warning", t),
  error: (t) => add("error", t),
  remove,
};

function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return toasts;
}

const TONE = {
  success: "var(--success)",
  info: "var(--info)",
  warning: "var(--warning)",
  error: "var(--error)",
};
const TONE_BG = {
  success: "var(--color-message-bg-success)",
  info: "var(--color-message-bg-info)",
  warning: "var(--color-message-bg-warning)",
  error: "var(--color-message-bg-error)",
};

export function ToastContainer() {
  const list = useSyncExternalStore(subscribe, getSnapshot);
  if (!list.length) return null;
  return (
    <div className="app-toast-wrap">
      {list.map((t) => (
        <div
          key={t.id}
          className="app-toast"
          style={{
            background: "var(--surface-container-highest)",
            color: "var(--on-surface)",
            border: `1px solid var(--divider)`,
            borderLeft: `3px solid ${TONE[t.type]}`,
            borderRadius: "var(--radius-base)",
            boxShadow: "var(--shadow-card)",
            padding: "8px 14px",
            fontSize: "var(--font-size-md)",
            marginTop: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: "240px",
            maxWidth: "420px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: TONE[t.type],
              flex: "0 0 auto",
            }}
          />
          <span style={{ background: TONE_BG[t.type] }}>{t.text}</span>
        </div>
      ))}
    </div>
  );
}
