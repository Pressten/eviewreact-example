import { useState, useCallback } from "react";
import DivMessage from "@nce/eview-react/DivMessage";
import MessageDialog from "@nce/eview-react/MessageDialog";

// useToast — 替代 antd 的 message.success/info/warning/error 命令式 API。
// eview-react 的 DivMessage 只能渲染式使用（无命令式 API），这里封装成 hook。
//
// 用法：
//   const [toast, notify] = useToast();
//   notify.success("文本"); notify.info("文本"); notify.warn("文本"); notify.error("文本");
//   // 把 {toast} 放在组件返回 JSX 的稳定位置（如最外层容器第一个子节点）
//
// 说明：DivMessage 是区域内提示条（inline），默认自动消失；error 类型常驻直到关闭。
export function useToast() {
  const [notice, setNotice] = useState(null);
  const fire = useCallback((type, text) => {
    setNotice({ key: Date.now() + Math.random(), type, text });
  }, []);
  const close = useCallback(() => setNotice(null), []);
  const node = notice ? (
    <DivMessage
      key={notice.key}
      display
      type={notice.type}
      text={notice.text}
      disposeTimeOut={4000}
      enableDisposeTimeOut={notice.type !== "error"}
      onClose={close}
      style={{ marginBottom: 8 }}
    />
  ) : null;
  const notify = {
    success: (t) => fire("success", t),
    info: (t) => fire("default", t),
    warning: (t) => fire("warn", t),
    warn: (t) => fire("warn", t),
    error: (t) => fire("error", t),
  };
  return [node, notify];
}

// useConfirmDialog — 替代 antd 的 Modal.useModal() + modal.confirm({...}) 命令式 API。
// eview-react 的 MessageDialog 是受控组件，这里封装成 hook。
//
// 用法：
//   const [confirmNode, confirm] = useConfirmDialog();
//   confirm({ title, content, okText, cancelText, danger: true, onOk: () => {...} });
//   // 把 {confirmNode} 放在组件返回 JSX 末尾
//
// 说明：onOk 可同步或返回 Promise；Promise resolve 后关窗，reject 则保持打开。
export function useConfirmDialog() {
  const [pending, setPending] = useState(null);
  const fire = useCallback((opts) => {
    setPending({ ...opts, key: Date.now() + Math.random() });
  }, []);
  const close = useCallback(() => setPending(null), []);
  const node = pending ? (
    <MessageDialog
      type={pending.danger ? "risk" : "confirm"}
      isOpen
      title={pending.title}
      content={pending.content}
      iconLocation="title"
      onClose={close}
      buttons={{
        cancel: { text: pending.cancelText || "取消", onClick: close },
        ok: {
          text: pending.okText || "确定",
          focused: true,
          onClick: async () => {
            try {
              if (pending.onOk) await pending.onOk();
              setPending(null);
            } catch (e) {
              // onOk 失败时保持对话框打开
            }
          },
        },
      }}
    />
  ) : null;
  return [node, fire];
}
