// 全局轻量提示浮层（替代 antd message 命令式 API）
// antd message.success/info() 是命令式；eview DivMessage 只能声明式渲染。
// 这里用 createPortal 到 document.body + 独立 useState，使浮层脱离业务组件渲染树，
// 避免 DivMessage 重渲染导致同树输入组件（TextField/Select）失焦（硬约束#10）。
// 业务侧仍以 message.success/info(...) 调用，调用点零改动。
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DivMessage from "@nce/eview-react/DivMessage";

let listeners = [];
let counter = 0;

function emit(type, text) {
  const notice = { key: ++counter, type, text };
  listeners.forEach((fn) => fn(notice));
}

// 暴露与 antd message 同名的命令式接口，供业务调用点零改动复用
export const message = {
  success: (text) => emit("success", text),
  // antd info 在 eview DivMessage 无 info 类型，映射为 default
  info: (text) => emit("default", text),
  warning: (text) => emit("warn", text),
  error: (text) => emit("error", text),
};

export default function Notice() {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const handler = (n) => setNotice(n);
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((fn) => fn !== handler);
    };
  }, []);

  if (!notice) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: "1rem",
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
        onClose={() => setNotice(null)}
      />
    </div>,
    document.body
  );
}
