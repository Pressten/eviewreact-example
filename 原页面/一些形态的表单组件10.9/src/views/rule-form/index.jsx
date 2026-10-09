import { useState } from "react";
import { Input, InputNumber, Select, TreeSelect, Cascader, Radio, Switch, DatePicker, Button, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { deviceTypes, regions, deviceGroups, channels, alarmLevels } from "../../mock/rule.js";
import "./index.css";

const { RangePicker } = DatePicker;

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
  const [messageApi, contextHolder] = message.useMessage();

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
      messageApi.error("请先完善必填项");
      return;
    }
    messageApi.success(`规则「${form.name}」已保存`);
  };

  const handleReset = () => {
    setForm(INITIAL);
    setErrors({});
    messageApi.info("已重置表单");
  };

  return (
    <section className="rule-form card">
      {contextHolder}
      <header className="card-head">
        <div className="card-head__title">
          <h2 className="card-title">新建告警规则</h2>
          <p className="card-sub">配置监控对象、触发条件与通知策略，保存后立即生效。</p>
        </div>
        <span className="card-head__hint">
          <Icon name="info" size="0.875rem" /> 带 <em className="req">*</em> 为必填项
        </span>
      </header>

      <div className="form-body">
        <div className="form-col">
          <Field label="规则名称" required error={errors.name} htmlFor="f-name">
            <Input
              id="f-name"
              size="medium"
              style={{ width: "100%" }}
              placeholder="例如：核心交换机端口丢包率超阈值"
              value={form.name}
              status={errors.name ? "error" : undefined}
              onChange={(e) => setField("name", e.target.value)}
            />
          </Field>

          <Field label="监控对象" required error={errors.target} htmlFor="f-target">
            <Select
              id="f-target"
              style={{ width: "100%" }}
              placeholder="请选择监控对象类型"
              options={deviceTypes}
              value={form.target}
              status={errors.target ? "error" : undefined}
              onChange={(v) => setField("target", v)}
              allowClear
            />
          </Field>

          <Field label="适用区域" required error={errors.regionPath} htmlFor="f-region">
            <Cascader
              id="f-region"
              style={{ width: "100%" }}
              placeholder="请选择省 / 市 / 区"
              options={regions}
              value={form.regionPath}
              status={errors.regionPath ? "error" : undefined}
              onChange={(v) => setField("regionPath", v || [])}
              showSearch
              allowClear
              changeOnSelect
            />
          </Field>

          <Field label="设备分组" error={errors.group} htmlFor="f-group">
            <TreeSelect
              id="f-group"
              style={{ width: "100%" }}
              placeholder="请选择设备分组（可搜索）"
              treeData={deviceGroups}
              value={form.group}
              onChange={(v) => setField("group", v)}
              treeDefaultExpandAll
              showSearch
              treeNodeFilterProp="title"
              allowClear
            />
          </Field>

          <Field label="通知渠道" required error={errors.channels} htmlFor="f-channels">
            <Select
              id="f-channels"
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="请选择通知渠道（可多选）"
              options={channels}
              value={form.channels}
              status={errors.channels ? "error" : undefined}
              onChange={(v) => setField("channels", v)}
              maxTagCount="responsive"
              allowClear
            />
          </Field>

          <Field label="告警级别" error={errors.level} htmlFor="f-level">
            <Radio.Group
              id="f-level"
              options={alarmLevels}
              value={form.level}
              onChange={(e) => setField("level", e.target.value)}
            />
          </Field>

          <Field label="触发阈值" required error={errors.threshold} htmlFor="f-threshold">
            <div className="form-inline">
              <InputNumber
                id="f-threshold"
                mode="spinner"
                variant="outlined"
                style={{ width: "100%" }}
                min={1}
                max={1000}
                step={1}
                value={form.threshold}
                onChange={(v) => setField("threshold", v)}
              />
              <span className="form-inline__unit">次</span>
              <span className="form-inline__note">连续命中该次数后触发告警</span>
            </div>
          </Field>

          <Field label="持续周期" error={errors.duration} htmlFor="f-duration">
            <div className="form-inline">
              <InputNumber
                id="f-duration"
                mode="spinner"
                variant="outlined"
                style={{ width: "100%" }}
                min={1}
                max={1440}
                step={5}
                value={form.duration}
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
            <Switch checked={form.advanced} onChange={(v) => setField("advanced", v)} />
          </div>

          {form.advanced && (
            <div className="sub-form">
              <div className="sub-form__head">
                <Icon name="settings-2" size="0.875rem" />
                <span>高级策略</span>
              </div>
              <div className="sub-form__body">
                <Field label="恢复阈值" htmlFor="f-recover" compact>
                  <div className="form-inline">
                    <InputNumber
                      id="f-recover"
                      mode="spinner"
                      variant="outlined"
                      style={{ width: "100%" }}
                      min={1}
                      max={form.threshold || 1000}
                      step={1}
                      value={form.recoverThreshold}
                      onChange={(v) => setField("recoverThreshold", v)}
                    />
                    <span className="form-inline__unit">次</span>
                  </div>
                </Field>
                <Field label="静默时长" htmlFor="f-silence" compact>
                  <div className="form-inline">
                    <InputNumber
                      id="f-silence"
                      mode="spinner"
                      variant="outlined"
                      style={{ width: "100%" }}
                      min={5}
                      max={1440}
                      step={5}
                      value={form.silenceMinutes}
                      onChange={(v) => setField("silenceMinutes", v)}
                    />
                    <span className="form-inline__unit">分钟</span>
                  </div>
                </Field>
                <Field label="生效时段" htmlFor="f-period" compact>
                  <RangePicker
                    id="f-period"
                    style={{ width: "100%" }}
                    showTime={{ format: "HH:mm" }}
                    format="YYYY-MM-DD HH:mm"
                    value={form.activePeriod}
                    onChange={(v) => setField("activePeriod", v)}
                    placeholder={["开始时间", "结束时间"]}
                  />
                </Field>
              </div>
            </div>
          )}
        </div>

        <footer className="form-actions">
          <Button onClick={handleReset}>重置</Button>
          <Button type="primary" icon={<Icon name="check" size="0.875rem" />} onClick={handleSubmit}>
            保存规则
          </Button>
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
