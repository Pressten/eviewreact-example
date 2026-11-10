// TODO(eview-ui): antd 命令式 message 在 eview-ui 无对应，按 migration-workflow.md §7.3
// 用受控 DivMessage 浮层替代。type 映射：success→success / info→default（无 info 枚举）/
// warning→warn / error→error。
//
// 焦点竞争规避：DivMessage 触发父组件重渲染会打掉 TextField/Select 等输入组件焦点
// （已知焦点竞争问题）。本 ToastProvider 把通知浮层抽离为独立组件（ToastLayer）+ 自己的 state，
// notify() 通过模块级 emitter 投递消息，不触发 Provider 重渲染——调用 notify 的视图及其输入组件
// 不受影响。disposeTimeOut 自动消失。
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import DivMessage from "@cloudsop/eview-ui/DivMessage";

const ToastContext = createContext(null);
// 模块级监听器集合：把 notify() 投递与 Provider/视图渲染解耦，避免输入组件失焦。
const listeners = new Set();
function emit(message) {
  listeners.forEach((fn) => fn(message));
}

function ToastLayer() {
  const [toast, setToast] = useState(null);
  useEffect(() => {
    const handler = (message) => setToast(message);
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);
  // dismiss 后清空，便于 disposeTimeOut 自动隐藏后不留 DOM
  const handleClose = () => setToast(null);
  return (
    <div
      className="app-toast-layer"
      style={{
        position: "fixed",
        top: "3.75rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2000,
        pointerEvents: "auto",
        maxWidth: "40rem",
      }}
    >
      {toast && (
        <DivMessage
          key={toast.key}
          display
          type={toast.type}
          text={toast.text}
          disposeTimeOut={3000}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export function ToastProvider({ children }) {
  // notify 引用稳定：不持有消息 state，因此 Provider 永不因消息重渲染——children 不受影响
  const notify = useCallback((type, text) => {
    emit({ type, text, key: Date.now() + Math.random() });
  }, []);
  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <ToastLayer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  return ctx ? ctx.notify : () => {};
}
