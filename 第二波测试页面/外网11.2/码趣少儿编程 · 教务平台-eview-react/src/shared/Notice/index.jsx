import { useState, useCallback, useRef, useEffect } from "react";
import DivMessage from "@nce/eview-react/DivMessage";

// antd message.xxx() 命令式 API 的声明式替代（DivMessage 无命令式 API）。
// 用法：
//   const notify = useNotice();
//   notify.success("已保存");
//   notify.info("...");
//   notify.warning("...");   // 映射到 type="warn"
//   notify.error("...");     // 错误常驻（不自动消失），需 notify.close() 关
// 顶部居中浮层（position:fixed），复刻 antd message 视觉位置。
// 同一时刻只显示最新一条；自动消失后 state 自动清空。
export function useNotice() {
  const [notice, setNotice] = useState(null);
  const keyRef = useRef(0);

  const notify = useCallback((type, text, opts = {}) => {
    keyRef.current += 1;
    setNotice({ key: keyRef.current, type, text, persistent: opts.persistent });
  }, []);

  const close = useCallback(() => setNotice(null), []);

  const api = useRef(null);
  if (!api.current) {
    api.current = {
      success: (text, opts) => notify("success", text, opts),
      info: (text, opts) => notify("default", text, opts),
      warning: (text, opts) => notify("warn", text, opts),
      warn: (text, opts) => notify("warn", text, opts),
      error: (text, opts) => notify("error", text, { persistent: true, ...opts }),
      loading: (text, opts) => notify("default", text, { persistent: true, ...opts }),
      close,
    };
  }
  return [api.current, notice, setNotice];
}

// 顶层浮层渲染：放在组件树顶部（main.jsx 的 IntlProvider 下或 App 根）。
export function NoticeLayer({ notice, onClose }) {
  if (!notice) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1050,
      }}
    >
      <DivMessage
        key={notice.key}
        display
        type={notice.type}
        text={notice.text}
        enableDisposeTimeOut={!notice.persistent}
        onClose={onClose}
      />
    </div>
  );
}

// 提供给未接入 useNotice 的命令式调用点的兼容渲染器：
// 业务侧自己持有 notice state 时直接用 <NoticeHost notice={...} onClose={...} />。
export function NoticeHost({ notice, onClose }) {
  return <NoticeLayer notice={notice} onClose={onClose} />;
}
