import { useState, useEffect } from "react";
import { Modal, Select, Input, Button, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

const DURATION_OPTIONS = [
  { value: "30m", label: "30 分钟" },
  { value: "1h", label: "1 小时" },
  { value: "2h", label: "2 小时" },
  { value: "4h", label: "4 小时" },
  { value: "24h", label: "24 小时" },
];
const SCOPE_OPTIONS = [
  { value: "object", label: "仅当前对象" },
  { value: "strategy", label: "同策略全部告警" },
  { value: "service", label: "同服务全部告警" },
];

// 告警静默配置弹窗（纯 H5 表单骨架 + antd 输入组件受控）
// target 预填对象（来自告警行）；objectOptions 可选对象列表
export default function SilenceModal({ open, target, objectOptions, onClose, onConfirm }) {
  const [object, setObject] = useState(undefined);
  const [duration, setDuration] = useState("1h");
  const [scope, setScope] = useState("object");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setObject(target || (objectOptions[0] ? objectOptions[0] : undefined));
      setDuration("1h");
      setScope("object");
      setReason("");
      setErrors({});
    }
  }, [open, target, objectOptions]);

  const submit = () => {
    const next = {};
    if (!object) next.object = "请选择静默对象";
    if (!duration) next.duration = "请选择静默时长";
    if (!reason.trim()) next.reason = "请填写静默原因";
    else if (reason.trim().length < 4) next.reason = "原因至少 4 个字符";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onConfirm({ object, duration, scope, reason: reason.trim() });
    message.success(`已对「${object}」静默 ${DURATION_OPTIONS.find((d) => d.value === duration)?.label}`);
    onClose();
  };

  return (
    <Modal
      title={
        <div className="silence-modal-title">
          <Icon name="bell-off" size="1rem" />
          <span>告警静默</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={480}
      destroyOnClose
      footer={
        <div className="silence-modal-foot">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={submit}>确认静默</Button>
        </div>
      }
    >
      <form className="silence-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <div className="silence-field">
          <label className="form-label required" htmlFor="sf-object">静默对象</label>
          <div className="form-field">
            <Select
              id="sf-object"
              size="middle"
              style={{ width: "100%" }}
              placeholder="选择告警对象"
              value={object}
              onChange={(v) => { setObject(v); setErrors((p) => ({ ...p, object: undefined })); }}
              status={errors.object ? "error" : undefined}
              options={objectOptions.map((o) => ({ value: o, label: o }))}
              showSearch
            />
            {errors.object && <div className="form-error">{errors.object}</div>}
          </div>
        </div>

        <div className="silence-row">
          <div className="silence-field">
            <label className="form-label required" htmlFor="sf-duration">静默时长</label>
            <div className="form-field">
              <Select
                id="sf-duration"
                size="middle"
                style={{ width: "100%" }}
                value={duration}
                onChange={(v) => { setDuration(v); setErrors((p) => ({ ...p, duration: undefined })); }}
                status={errors.duration ? "error" : undefined}
                options={DURATION_OPTIONS}
              />
              {errors.duration && <div className="form-error">{errors.duration}</div>}
            </div>
          </div>
          <div className="silence-field">
            <label className="form-label" htmlFor="sf-scope">静默范围</label>
            <div className="form-field">
              <Select
                id="sf-scope"
                size="middle"
                style={{ width: "100%" }}
                value={scope}
                onChange={setScope}
                options={SCOPE_OPTIONS}
              />
            </div>
          </div>
        </div>

        <div className="silence-field">
          <label className="form-label required" htmlFor="sf-reason">静默原因</label>
          <div className="form-field">
            <Input.TextArea
              id="sf-reason"
              rows={3}
              style={{ width: "100%" }}
              placeholder="说明静默原因，便于交接追溯"
              value={reason}
              onChange={(e) => { setReason(e.target.value); setErrors((p) => ({ ...p, reason: undefined })); }}
              status={errors.reason ? "error" : undefined}
            />
            {errors.reason && <div className="form-error">{errors.reason}</div>}
          </div>
        </div>

        <div className="silence-tip">
          <Icon name="info" size="0.875rem" />
          <span>静默期间相关告警将不再通知，到期后自动恢复。请确认已在跟进处置。</span>
        </div>
      </form>
    </Modal>
  );
}
