import { useState } from "react";
import { IconPlusIcDigitalPowerDpCheck, IconPlusIcPublicInfo, IconPlusIcPublicSetting } from '@nce/icon-plus';
import TextField from "@nce/eview-react/TextField";
import Spinner from "@nce/eview-react/Spinner";
import Select from "@nce/eview-react/Select";
import MultipleSelect from "@nce/eview-react/MultipleSelect";
import TreeSelect from "@nce/eview-react/TreeSelect";
import Cascader from "@nce/eview-react/Cascader";
import RadioGroup from "@nce/eview-react/RadioGroup";
import Toggle from "@nce/eview-react/Toggle";
import DatePicker from "@nce/eview-react/DatePicker";
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import { deviceTypes, regions, deviceGroups, channels, alarmLevels } from "../../mock/rule.js";
import "./index.css";

const mapTreeData = (nodes) =>
  nodes.map((n) => ({
    id: n.value,
    text: n.title,
    children: n.children ? mapTreeData(n.children) : undefined,
  }));

const INITIAL = {
  name: "",
  target: undefined,
  regionPath: [],
  group: undefined,
  channels: [],
  level: "major",
  threshold: 5,
  duration: 10,
  advanced: false,
  recoverThreshold: 2,
  silenceMinutes: 30,
  activePeriod: null,
};

// Layer 4: 视图 — 规则新建表单（纵向单列）
export default function RuleForm() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const notify = (type, text) => setNotice({ type, text, key: Date.now() });

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "请输入规则名称";
    if (!form.target) next.target = "请选择监控对象";
    if (!form.regionPath || form.regionPath.length === 0) next.regionPath = "请选择适用区域";
    if (!form.channels || form.channels.length === 0) next.channels = "请至少选择一个通知渠道";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      notify("error", "请先完善必填项");
      return;
    }
    notify("success", `规则「${form.name}」已保存`);
  };

  const handleReset = () => {
    setForm(INITIAL);
    setErrors({});
    notify("default", "已重置表单");
  };

  return (
    <section className="rule-form card">
      {notice && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage key={notice.key} display type={notice.type} text={notice.text} onClose={() => setNotice(null)} />
        </div>
      )}
      <header className="card-head">
        <div className="card-head__title">
          <h2 className="card-title">新建告警规则</h2>
          <p className="card-sub">配置监控对象、触发条件与通知策略，保存后立即生效。</p>
        </div>
        <span className="card-head__hint">
          <IconPlusIcPublicInfo iconSize="0.875rem" iconColor={['currentcolor']} /> 带 <em className="req">*</em> 为必填项
        </span>
      </header>

      <div className="form-body">
        <div className="form-col">
          <Field label="规则名称" required error={errors.name} htmlFor="f-name">
            <TextField
              id="f-name"
              style={{ width: "100%" }}
              placeholder="例如：核心交换机端口丢包率超阈值"
              value={form.name}
              onChange={(value) => setField("name", value)}
            />
          </Field>

          <Field label="监控对象" required error={errors.target} htmlFor="f-target">
            <Select
              id="f-target"
              style={{ width: "100%" }}
              defaultLabel="请选择监控对象类型"
              options={deviceTypes}
              value={form.target}
              onChange={(v) => setField("target", v)}
              enableClear
            />
          </Field>

          <Field label="适用区域" required error={errors.regionPath} htmlFor="f-region">
            <Cascader
              id="f-region"
              style={{ width: "100%" }}
              placeholder="请选择省 / 市 / 区"
              options={regions}
              selectedValue={form.regionPath}
              onChange={(v) => setField("regionPath", v || [])}
              changeOnSelect
            />
          </Field>

          <Field label="设备分组" error={errors.group} htmlFor="f-group">
            <TreeSelect
              id="f-group"
              style={{ width: "100%" }}
              treeData={mapTreeData(deviceGroups)}
              nodeKey="id"
              enableMultiSelect={false}
              value={form.group}
              onChange={(nodes) => setField("group", nodes[0]?.value)}
            />
          </Field>

          <Field label="通知渠道" required error={errors.channels} htmlFor="f-channels">
            <MultipleSelect
              id="f-channels"
              style={{ width: "100%" }}
              placeholder="请选择通知渠道（可多选）"
              options={channels}
              value={form.channels}
              onChange={(v) => setField("channels", v)}
              enableCloseIcon
            />
          </Field>

          <Field label="告警级别" error={errors.level} htmlFor="f-level">
            <RadioGroup
              id="f-level"
              data={alarmLevels}
              value={form.level}
              isControlled
              onChange={(a, b) => {
                const next = a === form.level ? b : a;
                setField("level", next);
              }}
            />
          </Field>

          <Field label="触发阈值" required error={errors.threshold} htmlFor="f-threshold">
            <div className="form-inline">
              <Spinner
                id="f-threshold"
                style={{ width: "100%" }}
                min={1}
                max={1000}
                step={1}
                value={form.threshold}
                doNotFocusWhenValueUpdate
                onChange={(v) => setField("threshold", v)}
              />
              <span className="form-inline__unit">次</span>
              <span className="form-inline__note">连续命中该次数后触发告警</span>
            </div>
          </Field>

          <Field label="持续周期" error={errors.duration} htmlFor="f-duration">
            <div className="form-inline">
              <Spinner
                id="f-duration"
                style={{ width: "100%" }}
                min={1}
                max={1440}
                step={5}
                value={form.duration}
                doNotFocusWhenValueUpdate
                onChange={(v) => setField("duration", v)}
              />
              <span className="form-inline__unit">分钟</span>
            </div>
          </Field>

          <div className="form-switch-row">
            <div className="form-switch-row__text">
              <span className="form-switch-row__label">启用高级策略</span>
              <span className="form-switch-row__desc">开启后可配置自动恢复阈值、静默时长与生效时段</span>
            </div>
            <Toggle data={[false, true]} toggled={form.advanced} onToggle={(v) => setField("advanced", v)} />
          </div>

          {form.advanced && (
            <div className="sub-form">
              <div className="sub-form__head">
                <IconPlusIcPublicSetting iconSize="0.875rem" iconColor={['currentcolor']} />
                <span>高级策略</span>
              </div>
              <div className="sub-form__body">
                <Field label="恢复阈值" htmlFor="f-recover" compact>
                  <div className="form-inline">
                    <Spinner
                      id="f-recover"
                      style={{ width: "100%" }}
                      min={1}
                      max={form.threshold || 1000}
                      step={1}
                      value={form.recoverThreshold}
                      doNotFocusWhenValueUpdate
                      onChange={(v) => setField("recoverThreshold", v)}
                    />
                    <span className="form-inline__unit">次</span>
                  </div>
                </Field>
                <Field label="静默时长" htmlFor="f-silence" compact>
                  <div className="form-inline">
                    <Spinner
                      id="f-silence"
                      style={{ width: "100%" }}
                      min={5}
                      max={1440}
                      step={5}
                      value={form.silenceMinutes}
                      doNotFocusWhenValueUpdate
                      onChange={(v) => setField("silenceMinutes", v)}
                    />
                    <span className="form-inline__unit">分钟</span>
                  </div>
                </Field>
                <Field label="生效时段" htmlFor="f-period" compact>
                  <DatePicker
                    id="f-period"
                    style={{ width: "100%" }}
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    timeEmbedded
                    range={form.activePeriod || []}
                    onChange={(dateString, date, target) => {
                      if (!date) return;
                      setForm((prev) => {
                        const current = prev.activePeriod || [null, null];
                        if (target === "from") return { ...prev, activePeriod: [date, current[1]] };
                        if (target === "to") return { ...prev, activePeriod: [current[0], date] };
                        return prev;
                      });
                    }}
                  />
                </Field>
              </div>
            </div>
          )}
        </div>

        <footer className="form-actions">
          <Button text="重置" onClick={handleReset} />
          <Button status="primary" leftIcon={<IconPlusIcDigitalPowerDpCheck iconSize="0.875rem" iconColor={['currentcolor']} />} text="保存规则" onClick={handleSubmit} />
        </footer>
      </div>
    </section>
  );
}

// 字段骨架：标签居左 + 必填星号 + 控件下方校验文案（不占位）
function Field({ label, required, error, htmlFor, children, compact }) {
  return (
    <div className={`form-field${compact ? " form-field--compact" : ""}`}>
      <label className={`form-label${required ? " required" : ""}`} htmlFor={htmlFor}>
        {label}
      </label>
      <div className="form-control">
        {children}
        {error && <div className="form-error">{error}</div>}
      </div>
    </div>
  );
}
