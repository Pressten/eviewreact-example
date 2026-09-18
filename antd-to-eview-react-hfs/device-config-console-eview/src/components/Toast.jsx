import { createContext, useCallback, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../../assets/shared/icons.js";
import "./toast.css";

// Layer 3: 轻量 Toast — 替代 antd message.success(...)
// 用法: const toast = useToast(); toast("success", "已保存");
const ToastContext = createContext(null);

const TOAST_ICON = {
  success: "circle-check",
  error: "circle-x",
  warning: "triangle-alert",
  info: "circle-info",
};

const TOAST_TTL = 2500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (type, text) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, type: type || "info", text }]);
      window.setTimeout(() => remove(id), TOAST_TTL);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {createPortal(
        <div className="app-toast-wrap" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className={"app-toast app-toast-" + t.type} role="status">
              <span className="app-toast-icon">
                <Icon name={TOAST_ICON[t.type] || "circle-info"} size={16} />
              </span>
              <span className="app-toast-text">{t.text}</span>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const toast = useContext(ToastContext);
  return toast || (() => {});
}
