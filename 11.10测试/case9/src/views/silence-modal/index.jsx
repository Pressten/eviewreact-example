import { useEffect, useState } from "react";
import { Input, Modal, Select, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { TOPOLOGY } from "../../mock/topology.js";
import "./index.css";

const DURATIONS = [
  { value: "30", label: "30 分钟" },
  { value: "60", label: "1 小时" },
  { value: "120", label: "2 小时" },
  { value: "240", label: "4 小时" },
  { value: "1440", label: "24 小时" },
];

// ①/⑥ 告警静默弹窗：对象 + 时长 + 原因（必填校验，H5 表单骨架）
export default function SilenceModal() {
  const app = useApp();
  const { silence } = app;
  const [target, setTarget] = useState(null);
  const [duration, setDuration] = useState("60");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (silence.open) {
      setTarget(silence.target || null);
      setDuration("60");
      setReason("");
      setErrors({});
    }
  }, [silence.open, silence.target]);

  const options = TOPOLOGY[app.env].nodes.map((n) => ({ value: n.id, label: `${n.name}（${n.id}）` }));
  const targetName = (id) => {
    const node = TOPOLOGY[app.env].nodes.find((n) => n.id === id);
    return node ? node.name : id;
  };
  const durationLabel = (v) => {
    const item = DURATIONS.find((d) => d.value === v);
    return item ? item.label : v;
  };

  const clearErr = (k) => setErrors((e) => ({ ...e, [k]: undefined }));

  const submit = () => {
    const errs = {};
    if (!target) errs.target = "请选择静默对象";
    if (!duration) errs.duration = "请选择静默时长";
    if (!reason.trim()) errs.reason = "请填写静默原因";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const reasonText = reason.trim();
    // 静默生效：该对象「触发中 / 已认领」告警转入已静默
    app.setAlarms((list) =>
      list.map((a) =>
        a.targetKey === target && (a.status === "firing" || a.status === "claimed")
          ? { ...a, status: "silenced", claimBy: null, silenceReason: reasonText }
          : a
      )
    );
    message.success(`已静默「${targetName(target)}」· ${durationLabel(duration)} · 原因：${reasonText}`);
    app.closeSilence();
  };

  return (
    <Modal
      title="告警静默配置"
      open={silence.open}
      onCancel={app.closeSilence}
      onOk={submit}
      okText="确认静默"
      cancelText="取消"
      okButtonProps={{ danger: true }}
      width={480}
    >
      <form
        className="silence-form"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="sf-row">
          <label className="sf-label required" htmlFor="sil-target">
            静默对象
          </label>
          <div className="sf-field">
            <Select
              id="sil-target"
              style={{ width: "100%" }}
              placeholder="选择服务或数据节点"
              value={target}
              showSearch
              optionFilterProp="label"
              status={errors.target ? "error" : undefined}
              onChange={(v) => {
                setTarget(v);
                clearErr("target");
              }}
              options={options}
            />
            {errors.target ? <div className="sf-error">{errors.target}</div> : null}
          </div>
        </div>
        <div className="sf-row">
          <label className="sf-label required" htmlFor="sil-duration">
            静默时长
          </label>
          <div className="sf-field">
            <Select
              id="sil-duration"
              style={{ width: "9rem" }}
              value={duration}
              status={errors.duration ? "error" : undefined}
              onChange={(v) => {
                setDuration(v);
                clearErr("duration");
              }}
              options={DURATIONS}
            />
            {errors.duration ? <div className="sf-error">{errors.duration}</div> : null}
          </div>
        </div>
        <div className="sf-row">
          <label className="sf-label required" htmlFor="sil-reason">
            静默原因
          </label>
          <div className="sf-field">
            <Input.TextArea
              id="sil-reason"
              rows={3}
              maxLength={80}
              showCount
              value={reason}
              placeholder="例如：变更窗口内预期告警，临时静默以降噪"
              status={errors.reason ? "error" : undefined}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) clearErr("reason");
              }}
            />
            {errors.reason ? <div className="sf-error">{errors.reason}</div> : null}
          </div>
        </div>
        <div className="sf-tip">
          <span className="sf-tip-ico">
            <Icon name="triangle-alert" size="0.875rem" />
          </span>
          静默期间，该对象「触发中 / 已认领」的告警将停止通知；已恢复告警不受影响。静默操作将记录值班人与原因。
        </div>
      </form>
    </Modal>
  );
}
