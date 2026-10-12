import { useState } from "react";
import dayjs from "dayjs";
import { Button, Cascader, Input, InputNumber, Select, Switch, TreeSelect, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import {
  alertLevelOptions,
  capabilityOptions,
  deviceTypeOptions,
  groupTreeData,
  notifyChannelOptions,
  PORT_PROTOCOLS,
  protocolOptions,
  regionOptions,
} from "../../mock/form-options.js";
import "./index.css";

const INITIAL_VALUES = {
  name: "",
  code: "",
  type: undefined,
  group: undefined,
  region: [],
  protocol: undefined,
  port: null,
  capabilities: [],
  collectUrl: "",
  interval: 15,
  timeout: 3000,
  alertLevel: undefined,
  channels: [],
};

// 单字段行：标签（左）· 控件 · 字段说明（右）
function Field({ label, htmlFor, required, error, helper, children }) {
  return (
    <div className="form-row">
      <label className={"form-label" + (required ? " required" : "")} htmlFor={htmlFor}>
        {label}
      </label>
      <div className="form-field">
        {children}
        {error ? <div className="form-error">{error}</div> : null}
      </div>
      <div className="form-helper">{helper}</div>
    </div>
  );
}

function findTreeLabel(nodes, value) {
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node.value === value) return node.title;
    if (node.children) {
      const hit = findTreeLabel(node.children, value);
      if (hit) return hit;
    }
  }
  return "";
}

export default function AccessForm({ onSubmit }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [regionText, setRegionText] = useState("");
  const [errors, setErrors] = useState({});
  const [advanced, setAdvanced] = useState(false);
  const [notify, setNotify] = useState(false);

  const portVisible = PORT_PROTOCOLS.indexOf(values.protocol) >= 0;

  const setField = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const clearError = (name) =>
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setRegionText("");
    setErrors({});
    setAdvanced(false);
    setNotify(false);
    message.info("已重置表单");
  };

  const handleSubmit = () => {
    const errs = {};
    if (!values.name.trim()) errs.name = "请输入设备名称";
    if (!values.code.trim()) errs.code = "请输入设备编码";
    else if (!/^[A-Za-z0-9-]{4,32}$/.test(values.code.trim()))
      errs.code = "仅支持字母、数字与短横线（4-32 位）";
    if (!values.type) errs.type = "请选择设备类型";
    if (!values.group) errs.group = "请选择所属分组";
    if (!values.region || values.region.length === 0) errs.region = "请选择部署位置";
    if (!values.protocol) errs.protocol = "请选择接入协议";
    if (portVisible && (values.port === null || values.port === undefined))
      errs.port = "请输入端口号";
    if (advanced && !values.collectUrl.trim()) errs.collectUrl = "请输入采集地址";
    if (notify && values.channels.length === 0) errs.channels = "请至少选择一种通知方式";

    setErrors(errs);
    const keys = Object.keys(errs);
    if (keys.length > 0) {
      message.error("存在 " + keys.length + " 项未通过校验，请检查后重试");
      return;
    }

    onSubmit({
      name: values.name.trim(),
      code: values.code.trim().toUpperCase(),
      type: values.type,
      group: findTreeLabel(groupTreeData, values.group),
      region: regionText,
      protocol: values.protocol,
      port: portVisible ? values.port : null,
      samples: values.interval,
      status: advanced ? "online" : "pending",
      updatedAt: dayjs().format("YYYY-MM-DD HH:mm"),
    });
    message.success("设备接入配置已保存");
    setValues(INITIAL_VALUES);
    setRegionText("");
    setErrors({});
    setAdvanced(false);
    setNotify(false);
  };

  const inputStyle = { width: "100%" };

  return (
    <form
      className="access-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="access-form__body">
        {/* 基础信息 */}
        <div className="form-group">
          <h3 className="form-group__title">基础信息</h3>
          <div className="form-group__fields">
            <Field
              label="设备名称"
              htmlFor="f-name"
              required
              error={errors.name}
              helper="用于列表展示，建议包含位置与设备用途。"
            >
              <Input
                id="f-name"
                allowClear
                style={inputStyle}
                placeholder="如：南山 01 号智能电表"
                value={values.name}
                status={errors.name ? "error" : undefined}
                onChange={(e) => setField("name", e.target.value)}
              />
            </Field>

            <Field
              label="设备编码"
              htmlFor="f-code"
              required
              error={errors.code}
              helper="平台内唯一标识，提交后不可修改。"
            >
              <Input
                id="f-code"
                allowClear
                style={inputStyle}
                placeholder="如：SN-SZN-0101"
                value={values.code}
                status={errors.code ? "error" : undefined}
                onChange={(e) => setField("code", e.target.value)}
              />
            </Field>

            <Field
              label="设备类型"
              htmlFor="f-type"
              required
              error={errors.type}
              helper="决定设备可采集的指标模板。"
            >
              <Select
                id="f-type"
                allowClear
                showSearch
                optionFilterProp="label"
                style={inputStyle}
                placeholder="请选择设备类型"
                value={values.type}
                status={errors.type ? "error" : undefined}
                options={deviceTypeOptions}
                onChange={(v) => setField("type", v)}
              />
            </Field>

            <Field
              label="所属分组"
              htmlFor="f-group"
              required
              error={errors.group}
              helper="按大区 / 机房 / 机柜三级归类。"
            >
              <TreeSelect
                id="f-group"
                allowClear
                showSearch
                treeDefaultExpandAll
                treeNodeFilterProp="title"
                style={inputStyle}
                placeholder="请选择所属分组"
                value={values.group}
                status={errors.group ? "error" : undefined}
                treeData={groupTreeData}
                onChange={(v) => setField("group", v)}
              />
            </Field>

            <Field
              label="部署位置"
              required
              error={errors.region}
              helper="用于地图定位与就近派单。"
            >
              <Cascader
                options={regionOptions}
                expandTrigger="hover"
                style={inputStyle}
                value={values.region && values.region.length ? values.region : undefined}
                onChange={(val, labels) => {
                  setField("region", val || []);
                  setRegionText((labels || []).join(" / "));
                }}
              >
                <Input
                  readOnly
                  className="cascader-trigger"
                  style={inputStyle}
                  placeholder="请选择省 / 市 / 区"
                  value={regionText}
                  status={errors.region ? "error" : undefined}
                  suffix={<Icon name="chevron-down" size="0.875rem" />}
                />
              </Cascader>
            </Field>

            <Field
              label="接入协议"
              htmlFor="f-protocol"
              required
              error={errors.protocol}
              helper="不同协议的端口与报文格式不同。"
            >
              <Select
                id="f-protocol"
                allowClear
                style={inputStyle}
                placeholder="请选择接入协议"
                value={values.protocol}
                status={errors.protocol ? "error" : undefined}
                options={protocolOptions}
                onChange={(v) => setField("protocol", v)}
              />
            </Field>

            {portVisible ? (
              <Field
                label="服务端口"
                htmlFor="f-port"
                required
                error={errors.port}
                helper="取值范围 1 - 65535。"
              >
                <InputNumber
                  id="f-port"
                  mode="spinner"
                  variant="outlined"
                  min={1}
                  max={65535}
                  step={1}
                  style={{ width: "10rem" }}
                  value={values.port}
                  onChange={(v) => setField("port", v)}
                />
              </Field>
            ) : null}
          </div>
        </div>

        {/* 采集与告警 */}
        <div className="form-group">
          <h3 className="form-group__title">采集与告警</h3>
          <div className="form-group__fields">
            <Field
              label="能力标签"
              htmlFor="f-cap"
              helper="可多选，影响采集策略下发。"
            >
              <Select
                id="f-cap"
                mode="multiple"
                allowClear
                showSearch
                optionFilterProp="label"
                maxTagCount="responsive"
                style={inputStyle}
                placeholder="请选择能力标签（可多选）"
                value={values.capabilities}
                options={capabilityOptions}
                onChange={(v) => setField("capabilities", v)}
              />
            </Field>

            <div className="form-toggle-block">
              <div className="form-switch-row">
                <div className="form-switch-row__text">
                  <div className="form-switch-row__title">启用高级采集</div>
                  <div className="form-switch-row__desc">
                    开启后可配置采集地址、周期与超时阈值，用于高频数据上报。
                  </div>
                </div>
                <div className="form-switch-row__control">
                  <Switch
                    checked={advanced}
                    onChange={(checked) => {
                      setAdvanced(checked);
                      if (!checked) {
                        setValues((prev) => ({ ...prev, collectUrl: "" }));
                        clearError("collectUrl");
                      }
                    }}
                  />
                </div>
              </div>

              {advanced ? (
                <div className="form-subpanel">
                  <div className="form-subpanel__title">高级采集参数</div>
                  <Field
                    label="采集地址"
                    htmlFor="f-url"
                    required
                    error={errors.collectUrl}
                    helper="支持 IP:端口 或域名形式。"
                  >
                    <Input
                      id="f-url"
                      allowClear
                      style={inputStyle}
                      placeholder="如：192.168.10.21:1883"
                      value={values.collectUrl}
                      status={errors.collectUrl ? "error" : undefined}
                      onChange={(e) => setField("collectUrl", e.target.value)}
                    />
                  </Field>
                  <Field label="采集周期" htmlFor="f-interval" helper="建议 5 - 300 秒。">
                    <InputNumber
                      id="f-interval"
                      mode="spinner"
                      variant="outlined"
                      min={1}
                      max={3600}
                      step={5}
                      style={{ width: "10rem" }}
                      value={values.interval}
                      onChange={(v) => setField("interval", v)}
                    />
                    <span className="form-unit">秒</span>
                  </Field>
                  <Field label="超时阈值" htmlFor="f-timeout" helper="超过阈值记为采集失败。">
                    <InputNumber
                      id="f-timeout"
                      mode="spinner"
                      variant="outlined"
                      min={500}
                      max={60000}
                      step={500}
                      style={{ width: "10rem" }}
                      value={values.timeout}
                      onChange={(v) => setField("timeout", v)}
                    />
                    <span className="form-unit">毫秒</span>
                  </Field>
                </div>
              ) : null}
            </div>

            <div className="form-toggle-block">
              <div className="form-switch-row">
                <div className="form-switch-row__text">
                  <div className="form-switch-row__title">启用告警通知</div>
                  <div className="form-switch-row__desc">
                    开启后按告警等级通过指定渠道推送通知。
                  </div>
                </div>
                <div className="form-switch-row__control">
                  <Switch
                    checked={notify}
                    onChange={(checked) => {
                      setNotify(checked);
                      if (!checked) {
                        setValues((prev) => ({ ...prev, channels: [] }));
                        clearError("channels");
                      }
                    }}
                  />
                </div>
              </div>

              {notify ? (
                <div className="form-subpanel">
                  <div className="form-subpanel__title">告警通知设置</div>
                  <Field
                    label="告警等级"
                    htmlFor="f-level"
                    helper="决定通知渠道与升级策略。"
                  >
                    <Select
                      id="f-level"
                      allowClear
                      style={inputStyle}
                      placeholder="请选择告警等级"
                      value={values.alertLevel}
                      options={alertLevelOptions}
                      onChange={(v) => setField("alertLevel", v)}
                    />
                  </Field>
                  <Field
                    label="通知方式"
                    htmlFor="f-channel"
                    required
                    error={errors.channels}
                    helper="可多选，至少选择一种。"
                  >
                    <Select
                      id="f-channel"
                      mode="multiple"
                      allowClear
                      maxTagCount="responsive"
                      style={inputStyle}
                      placeholder="请选择通知方式（可多选）"
                      value={values.channels}
                      status={errors.channels ? "error" : undefined}
                      options={notifyChannelOptions}
                      onChange={(v) => setField("channels", v)}
                    />
                  </Field>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="access-form__footer">
        <Button icon={<Icon name="rotate-ccw" size="0.875rem" />} onClick={handleReset}>
          重置
        </Button>
        <Button type="primary" htmlType="submit" icon={<Icon name="save" size="0.875rem" />}>
          保存配置
        </Button>
      </div>
    </form>
  );
}
