// Layer 3: 全局轻提示 — DivMessage 渲染式封装,替代 antd message.success() 命令式 API
// 用法: <ToastProvider> 包住需要发提示的区域,子组件 const toast = useToast(); toast("success", "已保存")
import { createContext, useCallback, useContext, useState } from "react";
import DivMessage from "@nce/eview-react/DivMessage";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [notice, setNotice] = useState(null);

  const notify = useCallback((type, text) => {
    setNotice({ key: Date.now(), type: type, text: text });
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      {notice ? (
        <DivMessage
          key={notice.key}
          className="app-toast"
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={3000}
          onClose={() => setNotice(null)}
        />
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
