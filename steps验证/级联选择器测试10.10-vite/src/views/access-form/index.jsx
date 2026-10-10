import { useState } from "react";
import { IconPlusIcPublicChevronDown, IconPlusIcPublicDisk, IconPlusIcPublicRestore } from '@nce/icon-plus';
import dayjs from "dayjs";
import Button from "@nce/eview-react/Button";
import PopUpMenu from "@nce/eview-react/PopUpMenu";
import TextField from "@/shared/TextField";
import Spinner from "@nce/eview-react/Spinner";
import Select from "@/shared/Select";
import MultipleSelect from "@nce/eview-react/MultipleSelect";
import Toggle from "@nce/eview-react/Toggle";
import TreeSelect from "@nce/eview-react/TreeSelect";
import { notify } from "@/shared/Notice";
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

function toEvOptions(opts) {
  return opts.map((o) => ({ text: o.label, value: o.value }));
}

function buildRegionMenu(options) {
  return options.map((prov) => ({
    id: prov.value,
    text: prov.label,
    submenus: (prov.children || []).map((city) => ({
      id: city.value,
      text: city.label,
      submenus: (city.children || []).map((dist) => ({
        id: dist.value,
        text: dist.label,
        serialno: prov.value + "/" + city.value + "/" + dist.value,
      })),
    })),
  }));
}

function transformTreeData(nodes) {
  return (nodes || []).map((n) => ({
    id: n.value,
    text: n.title,
    children: n.children ? transformTreeData(n.children) : undefined,
  }));
}

const REGION_MENU = buildRegionMenu(regionOptions);
const GROUP_TREE_EV = transformTreeData(groupTreeData);
const TYPE_OPTS = toEvOptions(deviceTypeOptions);
const PROTOCOL_OPTS = toEvOptions(protocolOptions);
const CAP_OPTS = toEvOptions(capabilityOptions);
const LEVEL_OPTS = toEvOptions(alertLevelOptions);
const CHANNEL_OPTS = toEvOptions(notifyChannelOptions);

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
  const [notifyOn, setNotifyOn] = useState(false);

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
    setNotifyOn(false);
    notify("info", "已重置表单");
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
    if (notifyOn && values.channels.length === 0) errs.channels = "请至少选择一种通知方式";

    setErrors(errs);
    const keys = Object.keys(errs);
    if (keys.length > 0) {
      notify("error", "存在 " + keys.length + " 项未通过校验，请检查后重试");
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
    notify("success", "设备接入配置已保存");
    setValues(INITIAL_VALUES);
    setRegionText("");
    setErrors({});
    setAdvanced(false);
    setNotifyOn(false);
  };

  const handleRegionSelect = (evt) => {
    const serialno = evt.value;
    if (serialno === undefined) return;
    const parts = String(serialno).split("/");
    if (parts.length < 3) return;
    const provVal = parts[0];
    const cityVal = parts[1];
    const distVal = parts[2];
    const prov = regionOptions.find((o) => o.value === provVal);
    const city = prov && prov.children ? prov.children.find((o) => o.value === cityVal) : null;
    const dist = city && city.children ? city.children.find((o) => o.value === distVal) : null;
    setField("region", [provVal, cityVal, distVal]);
    setRegionText([prov && prov.label, city && city.label, dist && dist.label].filter(Boolean).join(" / "));
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
              <TextField
                id="f-name"
                containerStyle={inputStyle}
                placeholder="如：南山 01 号智能电表"
                value={values.name}
                onChange={(value) => setField("name", value)}
              />
            </Field>

            <Field
              label="设备编码"
              htmlFor="f-code"
              required
              error={errors.code}
              helper="平台内唯一标识，提交后不可修改。"
            >
              <TextField
                id="f-code"
                containerStyle={inputStyle}
                placeholder="如：SN-SZN-0101"
                value={values.code}
                onChange={(value) => setField("code", value)}
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
                enableClear
                style={inputStyle}
                defaultLabel="请选择设备类型"
                value={values.type}
                options={TYPE_OPTS}
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
                enableClear
                searchable
                enableMultiSelect={false}
                nodeKey="id"
                style={inputStyle}
                value={values.group}
                treeData={GROUP_TREE_EV}
                onChange={(nodes) => setField("group", nodes[0] ? nodes[0].value : undefined)}
              />
            </Field>

            <Field
              label="部署位置"
              required
              error={errors.region}
              helper="用于地图定位与就近派单。"
            >
              <PopUpMenu options={REGION_MENU} width="240px" onClick={handleRegionSelect}>
                <div
                  className={"cascader-trigger" + (errors.region ? " cascader-trigger--error" : "")}
                  style={inputStyle}
                >
                  <span
                    className={
                      "cascader-trigger__text" +
                      (regionText ? "" : " cascader-trigger__text--placeholder")
                    }
                  >
                    {regionText || "请选择省 / 市 / 区"}
                  </span>
                  <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} />
                </div>
              </PopUpMenu>
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
                enableClear
                style={inputStyle}
                defaultLabel="请选择接入协议"
                value={values.protocol}
                options={PROTOCOL_OPTS}
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
                <Spinner
                  id="f-port"
                  min={1}
                  max={65535}
                  step={1}
                  style={{ width: "10rem" }}
                  value={values.port}
                  doNotFocusWhenValueUpdate
                  onChange={(v) => setField("port", v)}
                />
              </Field>
            ) : null}
          </div>
        </div>

        <div className="form-group">
          <h3 className="form-group__title">采集与告警</h3>
          <div className="form-group__fields">
            <Field
              label="能力标签"
              htmlFor="f-cap"
              helper="可多选，影响采集策略下发。"
            >
              <MultipleSelect
                id="f-cap"
                searchable
                enableCloseIcon
                selectStyle={inputStyle}
                placeholder="请选择能力标签（可多选）"
                value={values.capabilities}
                options={CAP_OPTS}
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
                  <Toggle
                    data={[false, true]}
                    toggled={advanced}
                    onToggle={(value) => {
                      setAdvanced(value);
                      if (!value) {
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
                    <TextField
                      id="f-url"
                      containerStyle={inputStyle}
                      placeholder="如：192.168.10.21:1883"
                      value={values.collectUrl}
                      onChange={(value) => setField("collectUrl", value)}
                    />
                  </Field>
                  <Field label="采集周期" htmlFor="f-interval" helper="建议 5 - 300 秒。">
                    <Spinner
                      id="f-interval"
                      min={1}
                      max={3600}
                      step={5}
                      style={{ width: "10rem" }}
                      value={values.interval}
                      doNotFocusWhenValueUpdate
                      onChange={(v) => setField("interval", v)}
                    />
                    <span className="form-unit">秒</span>
                  </Field>
                  <Field label="超时阈值" htmlFor="f-timeout" helper="超过阈值记为采集失败。">
                    <Spinner
                      id="f-timeout"
                      min={500}
                      max={60000}
                      step={500}
                      style={{ width: "10rem" }}
                      value={values.timeout}
                      doNotFocusWhenValueUpdate
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
                  <Toggle
                    data={[false, true]}
                    toggled={notifyOn}
                    onToggle={(value) => {
                      setNotifyOn(value);
                      if (!value) {
                        setValues((prev) => ({ ...prev, channels: [] }));
                        clearError("channels");
                      }
                    }}
                  />
                </div>
              </div>

              {notifyOn ? (
                <div className="form-subpanel">
                  <div className="form-subpanel__title">告警通知设置</div>
                  <Field
                    label="告警等级"
                    htmlFor="f-level"
                    helper="决定通知渠道与升级策略。"
                  >
                    <Select
                      id="f-level"
                      enableClear
                      style={inputStyle}
                      defaultLabel="请选择告警等级"
                      value={values.alertLevel}
                      options={LEVEL_OPTS}
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
                    <MultipleSelect
                      id="f-channel"
                      enableCloseIcon
                      selectStyle={inputStyle}
                      placeholder="请选择通知方式（可多选）"
                      value={values.channels}
                      options={CHANNEL_OPTS}
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
        <Button
          text="重置"
          leftIcon={<IconPlusIcPublicRestore iconSize="0.875rem" iconColor={['currentcolor']} />}
          onClick={handleReset}
        />
        <Button
          status="primary"
          text="保存配置"
          leftIcon={<IconPlusIcPublicDisk iconSize="0.875rem" iconColor={['currentcolor']} />}
          onClick={handleSubmit}
        />
      </div>
    </form>
  );
}
