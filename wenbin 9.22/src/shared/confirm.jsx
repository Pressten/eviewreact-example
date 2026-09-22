import { useSyncExternalStore } from "react";
import Dialog from "@nce/eview-react/Dialog";

// useModal shim — 桥接 antd 的 Modal.useModal() + modal.confirm() 命令式 API。
// 用法与 antd 一致：
//   const [modal, contextHolder] = useModal();
//   modal.confirm({ title, icon, content, okText, okButtonProps:{danger}, onOk });
// onOk 可返回 Promise；reject 时保持弹窗打开（与 antd 一致）。
// ConfirmContainer 在根（app.jsx）渲染一次即可消费命令式调用。

let listeners = new Set();
let queue = [];
let seq = 0;

function emit() {
  queue = queue.slice();
  for (const l of listeners) l();
}
function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() {
  return queue;
}

function open(opts) {
  const id = ++seq;
  queue = [...queue, { id, opts, loading: false }];
  emit();
}
function update(id, patch) {
  queue = queue.map((t) => (t.id === id ? { ...t, ...patch } : t));
  emit();
}
function close(id) {
  queue = queue.filter((t) => t.id !== id);
  emit();
}

export function useModal() {
  const contextHolder = null; // 占位；实际渲染由根级 ConfirmContainer 负责
  const modal = {
    confirm(opts) {
      open(opts);
    },
  };
  return [modal, contextHolder];
}

export function ConfirmContainer() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return (
    <>
      {list.map(({ id, opts, loading }) => {
        const danger = opts.okButtonProps && opts.okButtonProps.danger;
        const handleOk = () => {
          const ret = opts.onOk && opts.onOk();
          if (ret && typeof ret.then === "function") {
            update(id, { loading: true });
            ret.then(() => close(id), () => update(id, { loading: false }));
          } else {
            close(id);
          }
        };
        const handleCancel = () => close(id);
        return (
          <Dialog
            key={id}
            isOpen={true}
            onClose={handleCancel}
            title={opts.title}
            size="small"
            buttons={[
              { text: opts.cancelText || "取消", onClick: handleCancel },
              {
                text: opts.okText || "确定",
                status: danger ? "risk" : "primary",
                disabled: loading,
                onClick: handleOk,
              },
            ]}
          >
            <div className="app-confirm-body">
              {opts.icon ? <span className="app-confirm-icon">{opts.icon}</span> : null}
              <div className="app-confirm-content">{opts.content}</div>
            </div>
          </Dialog>
        );
      })}
    </>
  );
}
