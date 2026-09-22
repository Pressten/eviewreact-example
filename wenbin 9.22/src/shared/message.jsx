import { useState, useEffect, useRef, useSyncExternalStore } from "react";

// message shim — 桥接 antd 命令式 message.success/info/warning/error。
// eview-react 的 DivMessage 无命令式 API，这里用模块级订阅 + 手写 toast 容器实现。
// 调用点保持 `message.success("...")` 不变，仅改 import 路径。

const TONE = {
  success: { color: "var(--success)", bg: "var(--success-container)" },
  info: { color: "var(--info)", bg: "var(--info-container)" },
  warning: { color: "var(--warning)", bg: "var(--warning-container)" },
  error: { color: "var(--error)", bg: "var(--error-container)" },
};

let listeners = new Set();
let toasts = [];
let seq = 0;

function emit() {
  toasts = toasts.slice();
  for (const l of listeners) l();
}

function push(type, content) {
  const id = ++seq;
  toasts = [...toasts, { id, type, content }];
  emit();
  setTimeout(() => remove(id), 3000);
  return id;
}

function remove(id) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() {
  return toasts;
}

export const message = {
  success: (c) => push("success", c),
  info: (c) => push("info", c),
  warning: (c) => push("warning", c),
  error: (c) => push("error", c),
};

export function MessageContainer() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return (
    <div className="app-toast-wrap">
      {list.map((t) => {
        const tone = TONE[t.type] || TONE.info;
        return (
          <div
            key={t.id}
            className="app-toast"
            style={{ background: tone.bg, borderColor: tone.color }}
          >
            <span className="app-toast-dot" style={{ background: tone.color }} />
            <span className="app-toast-text">{t.content}</span>
          </div>
        );
      })}
    </div>
  );
}
