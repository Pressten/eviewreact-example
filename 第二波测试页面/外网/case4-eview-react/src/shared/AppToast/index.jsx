import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DivMessage from "@nce/eview-react/DivMessage";

// antd message 命令式 API → eview DivMessage 渲染式组件
// 用模块级单例 + 一次性挂载的 AppToastContainer（createPortal 到 document.body，
// 独立 state，不参与任何输入组件的渲染树，避免焦点竞争）。
// 调用侧：import { toast } from "@/shared/AppToast"; toast.success("...");
// 入口挂载一次：<AppToastContainer />

// antd message 类型 → DivMessage 类型（DivMessage 仅 default/success/error/warn）
function toDivType(type) {
  if (type === "success") return "success";
  if (type === "error") return "error";
  if (type === "warning" || type === "warn") return "warn";
  return "default"; // info / 其它 → default
}

let setNoticeFn = null;

export const toast = {
  success: (text) => setNoticeFn && setNoticeFn({ type: "success", text, key: Date.now() }),
  info: (text) => setNoticeFn && setNoticeFn({ type: "info", text, key: Date.now() }),
  warning: (text) => setNoticeFn && setNoticeFn({ type: "warning", text, key: Date.now() }),
  warn: (text) => setNoticeFn && setNoticeFn({ type: "warning", text, key: Date.now() }),
  error: (text) => setNoticeFn && setNoticeFn({ type: "error", text, key: Date.now() }),
};

export default function AppToastContainer() {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    setNoticeFn = setNotice;
    return () => {
      setNoticeFn = null;
    };
  }, []);

  if (!notice) return null;

  return createPortal(
    <div
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
        type={toDivType(notice.type)}
        text={notice.text}
        onClose={() => setNotice(null)}
      />
    </div>,
    document.body
  );
}
