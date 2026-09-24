import { createContext, useContext, useCallback, useState } from "react";
import DivMessage from "@nce/eview-react/DivMessage";

// Toast — 基于 DivMessage 的轻量提示（替代 antd message.success/warning 命令式 API）
// 单实例：同一时间只显示最新一条，换 key 重挂重置自动消失计时
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [notice, setNotice] = useState(null);

  const notify = useCallback((type, text) => {
    setNotice({ key: Date.now(), type, text });
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="app-toast">
        {notice ? (
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            disposeTimeOut={3000}
            onClose={() => setNotice(null)}
          />
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { notify: () => {} };
  }
  return ctx;
}
