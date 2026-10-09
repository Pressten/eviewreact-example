// Layer 4: 采集规则表单（纵向单列 + 开关驱动子表单）
import { useState } from "react";
import { Input, Select, InputNumber, Switch, Segmented, Button, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import {
  dataSourceOptions,
  frequencyOptions,
  formatOptions,
  pointOptions,
  storageOptions,
} from "../../mock/rules.js";
import "./index.css";

const DEFAULT_FORM = {
  name: "",
  source: undefined,
  endpoint: "",
  frequency: "30s",
  points: [],
  format: "json",
  alarmEnabled: true,
  alarmThreshold: 85,
  notifyChannel: "email",
  receivers: "",
  webhookUrl: "",
  advancedEnabled: false,
  timeout: 3000,
  retries: 2,
  compress: false,
  backupEndpoint: "",
  archiveEnabled: true,
  retentionDays: 90,
  storage: "oss",
};

function ToggleRow({ icon, title, desc, checked, onChange }) {
  return (
    <div className="tf-toggle">
      <span className="tf-toggle__icon">
        <Icon name={icon} size="1rem" />
      </span>
      <div className="tf-toggle__text">
        <span className="tf-toggle__title">{title}</span>
        <span className="tf-toggle__desc">{desc}</span>
      </div>
      <Switch checked={checked} onChange={onChange} size="small" />
    </div>
  );
}

export default function RuleForm({ onCreate }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

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
    if (!form.source) next.source = "请选择数据源类型";
    if (!form.endpoint.trim()) next.endpoint = "请输入连接地址";
    if (form.alarmEnabled) {
      if (!form.receivers.trim()) next.receivers = "请至少填写一位接收人";
      if (form.notifyChannel === "webhook" && !form.webhookUrl.trim()) {
        next.webhookUrl = "请输入 Webhook 回调地址";
      }
    }
    if (form.archiveEnabled && !(form.retentionDays > 0)) {
      next.retentionDays = "保留天数需大于 0";
    }
    return next;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      message.error("请先修正表单中的校验项");
      return;
    }
    const freqLabel =
      (frequencyOptions.find((item) => item.value === form.frequency) || {}).label || "自定义";
    onCreate({
      id: `RULE-${Math.floor(1000 + Math.random() * 8999)}`,
      name: form.name.trim(),
      source: form.source,
      frequency: form.frequency,
      frequencyLabel: freqLabel,
      points: form.points.length ? form.points.length * 6 : 12,
      alarm: form.alarmEnabled ? "on" : "off",
      status: "stopped",
      updatedAt: "刚刚",
    });
    message.success(`规则「${form.name.trim()}」已保存`);
    setForm(DEFAULT_FORM);
  };

  const handleReset = () => {
    setForm(DEFAULT_FORM);
    setErrors({});
  };

  return (
    <section className="tf-card">
      <header className="tf-card__head">
        <span className="tf-card__icon">
          <Icon name="sliders-horizontal" size="1.25rem" />
        </span>
        <div>
          <h2 className="tf-card__title">新建采集规则</h2>
          <p className="tf-card__subtitle">配置数据源、采集策略与扩展能力，保存后即刻下发</p>
        </div>
      </header>

      <form className="tf-form" onSubmit={handleSubmit} noValidate>
        <div className="tf-body">
          <div className="tf-group tf-group--fields">
            <h3 className="tf-group__title">基础信息</h3>

            <div className="tf-field">
              <label className="tf-label tf-label--required" htmlFor="tf-name">
                规则名称
              </label>
              <div className="tf-control">
                <Input
                  id="tf-name"
                  placeholder="例如：1# 锅炉温度监控"
                  value={form.name}
                  status={errors.name ? "error" : undefined}
                  onChange={(e) => setField("name", e.target.value)}
                />
                {errors.name && <span className="tf-error">{errors.name}</span>}
              </div>
            </div>

            <div className="tf-field">
              <label className="tf-label tf-label--required" htmlFor="tf-source">
                数据源类型
              </label>
              <div className="tf-control">
                <Select
                  id="tf-source"
                  placeholder="请选择数据源"
                  style={{ width: "100%" }}
                  value={form.source}
                  options={dataSourceOptions}
                  status={errors.source ? "error" : undefined}
                  onChange={(v) => setField("source", v)}
                />
                {errors.source && <span className="tf-error">{errors.source}</span>}
              </div>
            </div>

            <div className="tf-field">
              <label className="tf-label tf-label--required" htmlFor="tf-endpoint">
                连接地址
              </label>
              <div className="tf-control">
                <Input
                  id="tf-endpoint"
                  placeholder="mqtt://10.20.31.7:1883 或 /dev/ttyS0"
                  prefix={<Icon name="link" size="0.875rem" />}
                  value={form.endpoint}
                  status={errors.endpoint ? "error" : undefined}
                  onChange={(e) => setField("endpoint", e.target.value)}
                />
                {errors.endpoint && <span className="tf-error">{errors.endpoint}</span>}
              </div>
            </div>
          </div>

          <div className="tf-group tf-group--fields">
            <h3 className="tf-group__title">采集策略</h3>

            <div className="tf-field">
              <label className="tf-label" htmlFor="tf-frequency">
                采集频率
              </label>
              <div className="tf-control">
                <Select
                  id="tf-frequency"
                  style={{ width: "100%" }}
                  value={form.frequency}
                  options={frequencyOptions}
                  onChange={(v) => setField("frequency", v)}
                />
              </div>
            </div>

            <div className="tf-field">
              <label className="tf-label" htmlFor="tf-points">
                采集点位
              </label>
              <div className="tf-control">
                <Select
                  id="tf-points"
                  mode="multiple"
                  allowClear
                  placeholder="选择需要采集的物理量"
                  style={{ width: "100%" }}
                  value={form.points}
                  options={pointOptions}
                  onChange={(v) => setField("points", v)}
                />
              </div>
            </div>

            <div className="tf-field">
              <label className="tf-label" htmlFor="tf-format">
                数据格式
              </label>
              <div className="tf-control">
                <Select
                  id="tf-format"
                  style={{ width: "100%" }}
                  value={form.format}
                  options={formatOptions}
                  onChange={(v) => setField("format", v)}
                />
              </div>
            </div>
          </div>

          <div className="tf-group">
            <h3 className="tf-group__title">扩展能力</h3>

            <ToggleRow
              icon="bell-ring"
              title="启用告警通知"
              desc="数值越界时按所选渠道实时推送"
              checked={form.alarmEnabled}
              onChange={(v) => setField("alarmEnabled", v)}
            />
            {form.alarmEnabled && (
              <div className="tf-subpanel">
                <div className="tf-field">
                  <label className="tf-label" htmlFor="tf-threshold">
                    告警阈值
                  </label>
                  <div className="tf-control">
                    <InputNumber
                      id="tf-threshold"
                      mode="spinner"
                      variant="outlined"
                      min={0}
                      max={9999}
                      style={{ width: "100%" }}
                      value={form.alarmThreshold}
                      addonAfter="单位值"
                      onChange={(v) => setField("alarmThreshold", v)}
                    />
                  </div>
                </div>

                <div className="tf-field">
                  <span className="tf-label">通知方式</span>
                  <div className="tf-control">
                    <Segmented
                      block
                      value={form.notifyChannel}
                      onChange={(v) => setField("notifyChannel", v)}
                      options={[
                        { label: "邮件", value: "email", icon: <Icon name="mail" size="0.875rem" /> },
                        { label: "短信", value: "sms", icon: <Icon name="message-square" size="0.875rem" /> },
                        { label: "Webhook", value: "webhook", icon: <Icon name="webhook" size="0.875rem" /> },
                      ]}
                    />
                  </div>
                </div>

                <div className="tf-field">
                  <label className="tf-label tf-label--required" htmlFor="tf-receivers">
                    接收人
                  </label>
                  <div className="tf-control">
                    <Input
                      id="tf-receivers"
                      placeholder="多个邮箱/手机号用逗号分隔"
                      value={form.receivers}
                      status={errors.receivers ? "error" : undefined}
                      onChange={(e) => setField("receivers", e.target.value)}
                    />
                    {errors.receivers && <span className="tf-error">{errors.receivers}</span>}
                  </div>
                </div>

                {form.notifyChannel === "webhook" && (
                  <div className="tf-field tf-field--reveal">
                    <label className="tf-label tf-label--required" htmlFor="tf-webhook">
                      回调地址
                    </label>
                    <div className="tf-control">
                      <Input
                        id="tf-webhook"
                        placeholder="https://alert.example.com/hook/iot"
                        prefix={<Icon name="webhook" size="0.875rem" />}
                        value={form.webhookUrl}
                        status={errors.webhookUrl ? "error" : undefined}
                        onChange={(e) => setField("webhookUrl", e.target.value)}
                      />
                      {errors.webhookUrl && <span className="tf-error">{errors.webhookUrl}</span>}
                    </div>
                  </div>
                )}
              </div>
            )}

            <ToggleRow
              icon="settings-2"
              title="开启高级采集模式"
              desc="自定义超时、重试与传输压缩策略"
              checked={form.advancedEnabled}
              onChange={(v) => setField("advancedEnabled", v)}
            />
            {form.advancedEnabled && (
              <div className="tf-subpanel">
                <div className="tf-field">
                  <label className="tf-label" htmlFor="tf-timeout">
                    请求超时
                  </label>
                  <div className="tf-control">
                    <InputNumber
                      id="tf-timeout"
                      mode="spinner"
                      variant="outlined"
                      min={100}
                      max={60000}
                      step={100}
                      style={{ width: "100%" }}
                      value={form.timeout}
                      addonAfter="ms"
                      onChange={(v) => setField("timeout", v)}
                    />
                  </div>
                </div>

                <div className="tf-field">
                  <label className="tf-label" htmlFor="tf-retries">
                    重试次数
                  </label>
                  <div className="tf-control">
                    <InputNumber
                      id="tf-retries"
                      mode="spinner"
                      variant="outlined"
                      min={0}
                      max={10}
                      style={{ width: "100%" }}
                      value={form.retries}
                      addonAfter="次"
                      onChange={(v) => setField("retries", v)}
                    />
                  </div>
                </div>

                <div className="tf-toggle tf-toggle--inner">
                  <span className="tf-toggle__icon">
                    <Icon name="minimize-2" size="1rem" />
                  </span>
                  <div className="tf-toggle__text">
                    <span className="tf-toggle__title">启用传输压缩</span>
                    <span className="tf-toggle__desc">降低带宽占用，适合高频大数据量场景</span>
                  </div>
                  <Switch
                    checked={form.compress}
                    size="small"
                    onChange={(v) => setField("compress", v)}
                  />
                </div>

                {form.compress && (
                  <div className="tf-field tf-field--reveal">
                    <label className="tf-label" htmlFor="tf-backup">
                      备用地址
                    </label>
                    <div className="tf-control">
                      <Input
                        id="tf-backup"
                        placeholder="主链路异常时自动切换"
                        value={form.backupEndpoint}
                        onChange={(e) => setField("backupEndpoint", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <ToggleRow
              icon="archive"
              title="自动归档历史数据"
              desc="按保留周期转入冷存储，释放在线库压力"
              checked={form.archiveEnabled}
              onChange={(v) => setField("archiveEnabled", v)}
            />
            {form.archiveEnabled && (
              <div className="tf-subpanel">
                <div className="tf-field">
                  <label className="tf-label tf-label--required" htmlFor="tf-retention">
                    保留天数
                  </label>
                  <div className="tf-control">
                    <InputNumber
                      id="tf-retention"
                      mode="spinner"
                      variant="outlined"
                      min={1}
                      max={3650}
                      style={{ width: "100%" }}
                      value={form.retentionDays}
                      addonAfter="天"
                      status={errors.retentionDays ? "error" : undefined}
                      onChange={(v) => setField("retentionDays", v)}
                    />
                    {errors.retentionDays && <span className="tf-error">{errors.retentionDays}</span>}
                  </div>
                </div>

                <div className="tf-field">
                  <label className="tf-label" htmlFor="tf-storage">
                    存储位置
                  </label>
                  <div className="tf-control">
                    <Select
                      id="tf-storage"
                      style={{ width: "100%" }}
                      value={form.storage}
                      options={storageOptions}
                      onChange={(v) => setField("storage", v)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="tf-actions">
          <Button icon={<Icon name="rotate-ccw" size="0.875rem" />} onClick={handleReset}>
            重置
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<Icon name="save" size="0.875rem" />}
          >
            保存规则
          </Button>
        </div>
      </form>
    </section>
  );
}
