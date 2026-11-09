import { useState } from "react";
import { Button, Modal, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// Layer 4: 底部保存栏
// 保存（主按钮，含成功反馈）；取消（有改动时确认放弃）。
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
          <Button onClick={handleCancelClick}>取消</Button>
          <Button type="primary" disabled={!isDirty} onClick={handleSave}>
            保存
          </Button>
        </div>
      </div>

      <Modal
        open={cancelOpen}
        title="放弃未保存的更改？"
        okText="放弃更改"
        cancelText="继续编辑"
        okButtonProps={{ danger: true }}
        onOk={handleCancelConfirm}
        onCancel={() => setCancelOpen(false)}
      >
        <p className="save-bar__modal-text">
          当前存在未保存的更改，放弃后所有自上次保存以来的改动将不可恢复。
        </p>
      </Modal>
    </>
  );
}
