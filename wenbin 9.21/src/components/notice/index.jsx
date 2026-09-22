import { createContext, useCallback, useContext, useRef, useState } from "react";
import DivMessage from "@nce/eview-react/DivMessage";
import "./index.css";

// 替代 antd 的命令式 message.success/info/warning/error。
// eview-react 的 DivMessage 只能渲染式使用，这里包一层 Provider 暴露 notify()，
// 内部渲染一条固定在顶部居中的 DivMessage，换 key 重挂以重置自动消失计时。
const NoticeContext = createContext(null);

export function NoticeProvider({ children }) {
  const [notice, setNotice] = useState(null);
  const timerRef = useRef(null);

  const notify = useCallback((type, text, title) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotice({ key: Date.now() + Math.random(), type, text, title });
    timerRef.current = setTimeout(() => setNotice(null), 3200);
  }, []);

  return (
    <NoticeContext.Provider value={{ notify }}>
      {children}
      {notice ? (
        <div className="notice-toast">
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            title={notice.title}
            disposeTimeOut={3000}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
    </NoticeContext.Provider>
  );
}

export function useNotice() {
  const ctx = useContext(NoticeContext);
  if (!ctx) {
    // 降级：未包裹 Provider 时返回空函数，避免运行时报错
    return { notify: () => {} };
  }
  return ctx;
}
