import { useMemo, useState } from "react";
import { IconPlusIcPublicChevronDown, IconPlusIcPublicDisk, IconPlusIcPublicRefreshClockwise } from '@nce/icon-plus';
import dayjs from "dayjs";
import Button from "@nce/eview-react/Button";
import PopUpMenu from "@nce/eview-react/PopUpMenu";
import TextField from "@/shared/TextField";
import Spinner from "@nce/eview-react/Spinner";
import Select from "@/shared/Select";
import MultipleSelect from "@/shared/MultipleSelect";
import Toggle from "@nce/eview-react/Toggle";
import TreeSelect from "@nce/eview-react/TreeSelect";
import DivMessage from "@nce/eview-react/DivMessage";
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

// antd 选项 { value, label } → eview 选项 { value, text }
const toTextOptions = (opts) => opts.map((o) => ({ value: o.value, text: o.label }));

// antd 树 { value, title, children } → eview 树 { id, text, children }
const toTreeNodes = (nodes) =>
  nodes.map((n) => ({
    id: n.value,
    text: n.title,
    children: n.children ? toTreeNodes(n.children) : undefined,
  }));

function findTreeLabel(nodes, id) {
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node.id === id) return node.text;
    if (node.children) {
      const hit = findTreeLabel(node.children, id);
      if (hit) return hit;
    }
  }
  return "";
}

// 级联选值：将 regionOptions 构建为 PopUpMenu options（label→text）+ 叶子路径映射
function buildRegionMenu() {
  const map = {};
  const build = (nodes, parents) =>
    nodes.map((n) => {
      const path = [...parents, n];
      const item = { id: n.value, text: n.label };
      if (n.children && n.children.length) {
        item.submenus = build(n.children, path);
      } else {
        item.serialno = n.value;
        map[n.value] = {
          values: path.map((p) => p.value),
          labels: path.map((p) => p.label),
        };
      }
      return item;
    });
  const options = build(regionOptions, []);
  return { options, map };
}

export default function AccessForm({ onSubmit }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [regionText, setRegionText] = useState("");
  const [errors, setErrors] = useState({});
  const [advanced, setAdvanced] = useState(false);
  const [notify, setNotify] = useState(false);
  const [notice, setNotice] = useState(null);

  const portVisible = PORT_PROTOCOLS.indexOf(values.protocol) >= 0;

  const { options: regionMenuOptions, map: regionMap } = useMemo(buildRegionMenu, []);
  const groupTreeNodes = useMemo(() => toTreeNodes(groupTreeData), []);

  const setField = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    setNotice(null);
  };

  const clearError = (name) =>
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setRegionText("");
    setErrors({});
    setAdvanced(false);
    setNotify(false);
    setNotice({ type: "default", text: "已重置表单", key: Date.now() });
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
      setNotice({
        type: "error",
        text: "存在 " + keys.length + " 项未通过校验，请检查后重试",
        key: Date.now(),
        persistent: true,
      });
      return;
    }

    onSubmit({
      name: values.name.trim(),
      code: values.code.trim().toUpperCase(),
      type: values.type,
      group: findTreeLabel(groupTreeNodes, values.group),
      region: regionText,
      protocol: values.protocol,
      port: portVisible ? values.port : null,
      samples: values.interval,
      status: advanced ? "online" : "pending",
      updatedAt: dayjs().format("YYYY-MM-DD HH:mm"),
    });
    setNotice({ type: "success", text: "设备接入配置已保存", key: Date.now() });
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
              <TextField
                id="f-name"
                style={inputStyle}
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
                style={inputStyle}
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
                options={toTextOptions(deviceTypeOptions)}
                onChange={(value) => setField("type", value)}
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
                style={inputStyle}
                treeData={groupTreeNodes}
                nodeKey="id"
                enableMultiSelect={false}
                value={values.group}
                onChange={(nodes) => setField("group", nodes[0] ? nodes[0].value : undefined)}
              />
            </Field>

            <Field
              label="部署位置"
              required
              error={errors.region}
              helper="用于地图定位与就近派单。"
            >
              <PopUpMenu
                options={regionMenuOptions}
                width="200px"
                onClick={(evt) => {
                  const path = regionMap[evt.value];
                  if (path) {
                    setField("region", path.values);
                    setRegionText(path.labels.join(" / "));
                  }
                }}
              >
                <div
                  className={
                    "cascader-trigger" + (errors.region ? " cascader-trigger--error" : "")
                  }
                >
                  <span
                    className={
                      "cascader-trigger__text" + (regionText ? "" : " is-placeholder")
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
                options={toTextOptions(protocolOptions)}
                onChange={(value) => setField("protocol", value)}
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
                  doNotFocusWhenValueUpdate
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
              <MultipleSelect
                id="f-cap"
                searchable
                enableCloseIcon
                style={inputStyle}
                placeholder="请选择能力标签（可多选）"
                value={values.capabilities}
                options={toTextOptions(capabilityOptions)}
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
                      style={inputStyle}
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
                      doNotFocusWhenValueUpdate
                      style={{ width: "10rem" }}
                      value={values.interval}
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
                      doNotFocusWhenValueUpdate
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
                  <Toggle
                    data={[false, true]}
                    toggled={notify}
                    onToggle={(value) => {
                      setNotify(value);
                      if (!value) {
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
                      enableClear
                      style={inputStyle}
                      defaultLabel="请选择告警等级"
                      value={values.alertLevel}
                      options={toTextOptions(alertLevelOptions)}
                      onChange={(value) => setField("alertLevel", value)}
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
                      style={inputStyle}
                      placeholder="请选择通知方式（可多选）"
                      value={values.channels}
                      options={toTextOptions(notifyChannelOptions)}
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
          leftIcon={<IconPlusIcPublicRefreshClockwise iconSize="0.875rem" iconColor={['currentcolor']} />}
          text="重置"
          onClick={handleReset}
        />
        <Button
          status="primary"
          leftIcon={<IconPlusIcPublicDisk iconSize="0.875rem" iconColor={['currentcolor']} />}
          text="保存配置"
          onClick={() => handleSubmit()}
        />
      </div>

      {notice ? (
        <div className="app-notice">
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            enableDisposeTimeOut={!notice.persistent}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
    </form>
  );
}
