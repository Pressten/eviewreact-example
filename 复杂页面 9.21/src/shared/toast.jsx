import { createContext, useContext, useState, useCallback } from 'react';
import DivMessage from '@nce/eview-react/DivMessage';

// TODO(eview-react): eview-react 无命令式全局 message API，区域提示用 DivMessage。
// 此处提供页面级轻量 toast（fixed 右上），供表格行操作 / 表单提交回调用。
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [notice, setNotice] = useState(null);

  const notify = useCallback((type, text) => {
    setNotice({ key: Date.now() + Math.random(), type, text });
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={3500}
          onClose={() => setNotice(null)}
          style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, maxWidth: 380 }}
        />
      ) : null}
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  return ctx || { notify: () => {} };
}
