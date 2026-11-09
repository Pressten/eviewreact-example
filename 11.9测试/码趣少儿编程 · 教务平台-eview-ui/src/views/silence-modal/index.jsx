import { useState, useEffect } from "react";
import Dialog from "eview-ui/Dialog";
import Select from "eview-ui/Select";
import TextArea from "eview-ui/TextArea";
import Button from "eview-ui/Button";
import message from "@/shared/message";
import Icon from "@/shared/Icon";
import "./index.css";

const DURATION_OPTIONS = [
  { value: "30m", text: "30 分钟" },
  { value: "1h", text: "1 小时" },
  { value: "2h", text: "2 小时" },
  { value: "4h", text: "4 小时" },
  { value: "24h", text: "24 小时" },
];
const SCOPE_OPTIONS = [
  { value: "object", text: "仅当前对象" },
  { value: "strategy", text: "同策略全部告警" },
  { value: "service", text: "同服务全部告警" },
];

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
    message.success(`已对「${object}」静默 ${DURATION_OPTIONS.find((d) => d.value === duration)?.text}`);
    onClose();
  };

  const objectOpts = objectOptions.map((o) => ({ value: o, text: o }));

  return (
    <Dialog
      title={
        <div className="silence-modal-title">
          <Icon name="bell-off" size="1rem" />
          <span>告警静默</span>
        </div>
      }
      isOpen={open}
      onClose={() => onClose()}
      size={[480, "auto"]}
      buttons={[
        { text: "取消", onClick: () => onClose() },
        { text: "确认静默", status: "primary", onClick: submit },
      ]}
    >
      <form className="silence-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <div className="silence-field">
          <label className="form-label required" htmlFor="sf-object">静默对象</label>
          <div className="form-field">
            <Select
              id="sf-object"
              defaultLabel="选择告警对象"
              value={object}
              searchable
              onChange={(v) => { setObject(v); setErrors((p) => ({ ...p, object: undefined })); }}
              status={errors.object ? "error" : undefined}
              options={objectOpts}
              style={{ width: "100%" }}
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
                value={duration}
                onChange={(v) => { setDuration(v); setErrors((p) => ({ ...p, duration: undefined })); }}
                status={errors.duration ? "error" : undefined}
                options={DURATION_OPTIONS}
                style={{ width: "100%" }}
              />
              {errors.duration && <div className="form-error">{errors.duration}</div>}
            </div>
          </div>
          <div className="silence-field">
            <label className="form-label" htmlFor="sf-scope">静默范围</label>
            <div className="form-field">
              <Select
                id="sf-scope"
                value={scope}
                onChange={(v) => setScope(v)}
                options={SCOPE_OPTIONS}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        <div className="silence-field">
          <label className="form-label required" htmlFor="sf-reason">静默原因</label>
          <div className="form-field">
            <TextArea
              id="sf-reason"
              rows={3}
              placeholder="说明静默原因，便于交接追溯"
              value={reason}
              onChange={(v) => { setReason(v); setErrors((p) => ({ ...p, reason: undefined })); }}
              status={errors.reason ? "error" : undefined}
              style={{ width: "100%" }}
            />
            {errors.reason && <div className="form-error">{errors.reason}</div>}
          </div>
        </div>

        <div className="silence-tip">
          <Icon name="info" size="0.875rem" />
          <span>静默期间相关告警将不再通知，到期后自动恢复。请确认已在跟进处置。</span>
        </div>
      </form>
    </Dialog>
  );
}
