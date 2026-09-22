import { createContext, useContext, useState, useCallback } from "react";
import MessageDialog from "@nce/eview-react/MessageDialog";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [pending, setPending] = useState(null);

  const confirm = useCallback((opts) => {
    setPending({ ...opts, id: Date.now() });
  }, []);

  const close = useCallback(() => setPending(null), []);

  const handleOk = useCallback(() => {
    const fn = pending?.onOk;
    setPending(null);
    if (typeof fn === "function") fn();
  }, [pending]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <MessageDialog
        type={pending?.danger ? "risk" : "confirm"}
        isOpen={!!pending}
        iconLocation="title"
        title={pending?.title}
        content={pending?.content}
        detail={pending?.detail}
        onClose={close}
        buttons={{
          cancel: { text: pending?.cancelText || "取消", onClick: close },
          ok: {
            text: pending?.okText || "确定",
            focused: true,
            onClick: handleOk,
          },
        }}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const confirm = useContext(ConfirmContext);
  if (!confirm) return () => {};
  return confirm;
}
