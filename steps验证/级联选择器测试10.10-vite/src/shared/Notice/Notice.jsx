import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import DivMessage from "@nce/eview-react/DivMessage";

const TYPE_MAP = {
  info: "default",
  success: "success",
  error: "error",
  warn: "warn",
  warning: "warn",
};

let listeners = [];

export function notify(level, text) {
  const type = TYPE_MAP[level] || "default";
  const payload = {
    type,
    text,
    key: Date.now() + Math.random(),
    persistent: level === "error",
  };
  listeners.forEach((fn) => fn(payload));
}

export default function NoticeLayer() {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    listeners.push(setNotice);
    return () => {
      listeners = listeners.filter((fn) => fn !== setNotice);
    };
  }, []);

  if (!notice) return null;

  return createPortal(
    <div
      className="app-notice"
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1050,
      }}
    >
      <DivMessage
        key={notice.key}
        display
        type={notice.type}
        text={notice.text}
        disposeTimeOut={notice.persistent ? undefined : 3000}
        enableDisposeTimeOut={!notice.persistent}
        onClose={() => setNotice(null)}
      />
    </div>,
    document.body
  );
}
