import { useState } from "react";
import { createPortal } from "react-dom";
import DivMessage from "@nce/eview-react/DivMessage";

// message.xxx() 命令式 → 声明式 DivMessage（createPortal 到 document.body，脱离父树避免 eview 输入失焦）
// type: 'default' | 'success' | 'error' | 'warn'（message.info→default、message.warning→warn）
export function useNotice() {
  const [notice, setNotice] = useState(null);

  const notify = (type, text) => setNotice({ key: Date.now() + Math.random(), type, text });

  const noticeNode = notice
    ? createPortal(
        <div
          style={{
            position: "fixed",
            top: "4.5rem",
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
            onClose={() => setNotice(null)}
          />
        </div>,
        document.body
      )
    : null;

  return { notify, noticeNode, setNotice };
}
