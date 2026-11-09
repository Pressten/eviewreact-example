// TODO(eview-ui): 命令式通知，待内网确认 eview-ui 是否有对应 API
// antd message.success/info/warning/error 命令式通知 shim
// eview-ui 的 DivMessage 是受控组件（非命令式）、MessageDialog 是弹窗（非 toast）
// 暂用 DOM 手写轻量 toast 实现，保留 antd message API 签名以便业务代码零改动
let containerEl = null;
const TOAST_DURATION = 3000;

function ensureContainer() {
  if (containerEl && document.body.contains(containerEl)) return containerEl;
  containerEl = document.createElement("div");
  containerEl.className = "ev-message-shim-container";
  containerEl.setAttribute("data-ev-message-shim", "");
  Object.assign(containerEl.style, {
    position: "fixed",
    top: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "9999",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    pointerEvents: "none",
  });
  document.body.appendChild(containerEl);
  return containerEl;
}

const TYPE_COLOR = {
  success: "var(--color-success, #62B42E)",
  info: "var(--color-info-primary, #2070F3)",
  warning: "var(--color-warning, #FCC800)",
  error: "var(--color-error, #E02128)",
};

function open(type, content, duration = TOAST_DURATION) {
  const root = ensureContainer();
  const toast = document.createElement("div");
  Object.assign(toast.style, {
    background: "var(--color-bg-2, #FFFFFF)",
    color: "var(--color-text-primary, #191919)",
    borderLeft: `3px solid ${TYPE_COLOR[type] || TYPE_COLOR.info}`,
    borderRadius: "4px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    maxWidth: "80vw",
    pointerEvents: "auto",
    transition: "opacity 0.2s ease",
  });
  toast.textContent = String(content);
  root.appendChild(toast);
  const close = () => {
    toast.style.opacity = "0";
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 200);
  };
  if (duration > 0) setTimeout(close, duration);
  return { close };
}

const message = {
  success: (content, duration) => open("success", content, duration),
  info: (content, duration) => open("info", content, duration),
  warning: (content, duration) => open("warning", content, duration),
  error: (content, duration) => open("error", content, duration),
  loading: (content, duration) => open("info", content, duration ?? 0),
  open: ({ type = "info", content, duration } = {}) => open(type, content, duration),
};

export default message;
