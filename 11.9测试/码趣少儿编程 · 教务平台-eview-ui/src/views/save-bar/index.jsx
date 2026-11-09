import { useState } from "react";
import Button from "eview-ui/Button";
import Dialog from "eview-ui/Dialog";
import message from "@/shared/message";
import Icon from "@/shared/Icon";
import "./index.css";

export default function SaveBar({ isDirty, onSave, onCancel }) {
  const [cancelOpen, setCancelOpen] = useState(false);

  const handleSave = () => {
    onSave();
    message.success("设置已保存，所有更改已生效");
  };

  const handleCancelClick = () => {
    if (!isDirty) {
      message.info("当前没有未保存的更改");
      return;
    }
    setCancelOpen(true);
  };

  const handleCancelConfirm = () => {
    onCancel();
    setCancelOpen(false);
    message.info("已放弃未保存的更改");
  };

  return (
    <>
      <div className="save-bar">
        <div className="save-bar__hint">
          {isDirty ? (
            <>
              <Icon name="circle-alert" size="0.875rem" />
              <span>有未保存的更改</span>
            </>
          ) : (
            <>
              <Icon name="circle-check-big" size="0.875rem" />
              <span>所有更改均已保存</span>
            </>
          )}
        </div>
        <div className="save-bar__actions">
          <Button text="取消" onClick={handleCancelClick} />
          <Button status="primary" disabled={!isDirty} text="保存" onClick={handleSave} />
        </div>
      </div>

      <Dialog
        isOpen={cancelOpen}
        title="放弃未保存的更改？"
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
    </>
  );
}
