import { useState } from "react";
import { IconPlusIcPublicAlert, IconPlusIcDigitalPowerDpCheck } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import Dialog from "@nce/eview-react/Dialog";
import DivMessage from "@nce/eview-react/DivMessage";
import "./index.css";

// Layer 4: 底部保存栏
// 保存（主按钮，含成功反馈）；取消（有改动时确认放弃）。
export default function SaveBar({ isDirty, onSave, onCancel }) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleSave = () => {
    onSave();
    setNotice({ type: "success", text: "设置已保存，所有更改已生效" });
  };

  const handleCancelClick = () => {
    if (!isDirty) {
      setNotice({ type: "default", text: "当前没有未保存的更改" });
      return;
    }
    setCancelOpen(true);
  };

  const handleCancelConfirm = () => {
    onCancel();
    setCancelOpen(false);
    setNotice({ type: "default", text: "已放弃未保存的更改" });
  };

  return (
    <>
      <div className="save-bar">
        <div className="save-bar__hint">
          {isDirty ? (
            <>
              <IconPlusIcPublicAlert iconSize="0.875rem" iconColor={['currentcolor']} />
              <span>有未保存的更改</span>
            </>
          ) : (
            <>
              <IconPlusIcDigitalPowerDpCheck iconSize="0.875rem" iconColor={['currentcolor']} />
              <span>所有更改均已保存</span>
            </>
          )}
        </div>
        <div className="save-bar__actions">
          <Button text="取消" onClick={handleCancelClick} />
          <Button status="primary" text="保存" disabled={!isDirty} onClick={handleSave} />
        </div>
      </div>

      <Dialog
        isOpen={cancelOpen}
        title="放弃未保存的更改？"
        size={[420, "auto"]}
        onClose={() => setCancelOpen(false)}
        buttons={[
          { text: "继续编辑", onClick: () => setCancelOpen(false) },
          { text: "放弃更改", status: "risk", onClick: handleCancelConfirm },
        ]}
      >
        <p className="save-bar__modal-text">
          当前存在未保存的更改，放弃后所有自上次保存以来的改动将不可恢复。
        </p>
      </Dialog>

      {notice ? (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage
            key={notice.text}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
    </>
  );
}
