import { createContext, useContext, useRef, useState, useCallback } from "react";
import DivMessage from "@nce/eview-react/DivMessage";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  const timers = useRef(new Map());

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const tm = timers.current.get(id);
    if (tm) {
      clearTimeout(tm);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback((type, text) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, type, text }]);
    const tm = setTimeout(() => remove(id), 3500);
    timers.current.set(id, tm);
  }, [remove]);

  const toast = {
    success: (t) => show("success", t),
    info: (t) => show("default", t),
    warning: (t) => show("warn", t),
    error: (t) => show("error", t),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="app-toast-stack">
        {toasts.map((t) => (
          <DivMessage
            key={t.id}
            display
            type={t.type}
            text={t.text}
            disposeTimeOut={3500}
            onClose={() => remove(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) {
    const noop = () => {};
    return { success: noop, info: noop, warning: noop, error: noop };
  }
  return toast;
}
