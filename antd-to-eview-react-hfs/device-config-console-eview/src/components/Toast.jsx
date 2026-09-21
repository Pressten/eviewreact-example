// TODO(eview-react): antd message.success() 是命令式 API,eview-react 无对应命令式方法,
// 只能渲染 DivMessage 组件。这里用 ToastProvider 暴露 useToast().success(text),
// 内部维护单条 {text,key} 并渲染 DivMessage;display 控制,换 key 重挂以重置自动消失计时。
import { createContext, useContext, useRef, useState } from "react";
import DivMessage from "@nce/eview-react/DivMessage";
import "./toast.css";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ text: "", key: 0, display: false });
  const keyRef = useRef(0);

  const success = (text) => {
    keyRef.current += 1;
    setToast({ text, key: keyRef.current, display: true });
  };

  return (
    <ToastContext.Provider value={{ success }}>
      {children}
      {toast.display ? (
        <div className="app-toast">
          <DivMessage key={toast.key} display type="success" disposeTimeOut={3000}>
            {toast.text}
          </DivMessage>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { success: () => {} };
  }
  return ctx;
}
