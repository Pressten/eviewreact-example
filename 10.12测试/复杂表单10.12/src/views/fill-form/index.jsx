// Layer 4: 信息填报表单区 — 场景式分区 + toggle 子区域
import { useState } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Select,
  Steps,
  Switch,
  message,
} from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import FormField from "../../components/form-field/index.jsx";
import SectionPanel from "../../components/section-panel/index.jsx";
import {
  antennaTypeOptions,
  bandOptions,
  bandwidthOptions,
  cityOptions,
  operatorOptions,
  portTypeOptions,
  powerTypeOptions,
  provinceOptions,
  runModeOptions,
  slotRatioOptions,
  stationTypeOptions,
  vendorOptions,
} from "../../mock/operator.js";
import "./index.css";

const EMPTY_VALUES = {
  // 01 主体信息
  operator: "cmcc",
  province: "guangdong",
  city: "shenzhen",
  stationName: "",
  stationCode: "",
  stationType: "macro",
  openDate: null,
  contact: "",
  phone: "",
  address: "",
  remark: "",
  // 02 网络参数
  runMode: "sa",
  bands: ["n78"],
  bandwidth: "100",
  pci: 128,
  tac: 3021,
  uplinkRatio: "ddsu",
  downlinkRatio: "ddsu",
  txPower: 40,
  autoNeighbor: true,
  // 03 设备与板卡
  vendor: "huawei",
  deviceModel: "",
  sn: "",
  softVersion: "",
  boardCount: 22,
  rackHeight: 4,
  ports: ["10ge", "cpri"],
  // 04 电源与环境
  powerType: "grid",
  gridCapacity: 63,
  batteryGroups: 2,
  airCondition: "yes",
  tempLimit: 35,
  // 05 覆盖与天线
  antennaHeight: 30,
  azimuth: 60,
  downtilt: 4,
  coverRadius: 1.5,
  antennaType: "aaU",
};

export default function FillForm() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [toggles, setToggles] = useState({
    network: true,
    device: true,
    power: false,
    antenna: false,
  });

  const setField = (key) => (val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const setInput = (key) => (e) => setField(key)(e.target.value);
  const toggleSection = (key) => () =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const enabledCount = Object.values(toggles).filter(Boolean).length;

  const validate = () => {
    const next = {};
    if (!values.operator) next.operator = "请选择运营商主体";
    if (!values.province) next.province = "请选择所属省公司";
    if (!values.city) next.city = "请选择所属地市";
    if (!values.stationName) next.stationName = "请输入站点名称";
    if (!values.stationCode) next.stationCode = "请输入站点编码";
    if (!values.openDate) next.openDate = "请选择开通日期";
    if (!values.contact) next.contact = "请输入现场联系人";
    if (!/^1[3-9]\d{9}$/.test(values.phone)) next.phone = "请输入 11 位有效手机号";
    if (toggles.device && !values.deviceModel) next.deviceModel = "请输入设备型号";
    if (toggles.device && !values.sn) next.sn = "请输入设备序列号 SN";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      message.success("校验通过，表单已提交审核");
    } else {
      message.error("存在必填项未完成，请检查标红字段");
    }
  };

  const handleReset = () => {
    setValues(EMPTY_VALUES);
    setErrors({});
    message.info("已重置为初始值");
  };

  return (
    <div className="fill-form">
      {/* 场景头部 */}
      <section className="scenario-card">
        <div className="scenario-card__main">
          <div className="scenario-card__tag">
            <Icon name="antenna" size="0.875rem" />
            5G 基站开通信息填报
          </div>
          <h2 className="scenario-card__title">深圳南山科技园 5G-A 宏站开通采集</h2>
          <p className="scenario-card__desc">
            面向运营商网优工程师的现场信息采集场景，按分区填报站点、网络、设备、供电与覆盖参数，
            提交后进入设备核对与审核流程。
          </p>
          <div className="scenario-card__chips">
            <span className="scenario-chip">
              <Icon name="map-pin" size="0.75rem" />
              广东省 · 深圳市 · 南山科技园北区
            </span>
            <span className="scenario-chip">
              <Icon name="calendar-clock" size="0.75rem" />
              计划开通 2026-10-18
            </span>
            <span className="scenario-chip">
              <Icon name="flag" size="0.75rem" />
              优先级 · 高
            </span>
          </div>
        </div>
        <div className="scenario-card__side">
          <span className="scenario-card__side-label">已开启子区域</span>
          <span className="scenario-card__side-value">
            {enabledCount}
            <em>/ 4</em>
          </span>
        </div>
      </section>

      {/* 流程步骤 */}
      <div className="fill-steps">
        <Steps
          size="small"
          current={1}
          items={[
            { title: "选择场景" },
            { title: "填报信息" },
            { title: "设备核对" },
            { title: "提交审核" },
          ]}
        />
      </div>

      <form className="fill-form__body" onSubmit={(e) => e.preventDefault()}>
        {/* 01 运营商主体信息 */}
        <SectionPanel
          index="01"
          icon="building-2"
          title="运营商主体信息"
          description="站点归属与现场联系信息，均为必填项"
        >
          <div className="form-grid">
            <FormField label="运营商名称" required htmlFor="f-operator" error={errors.operator}>
              <Select
                id="f-operator"
                value={values.operator}
                onChange={setField("operator")}
                options={operatorOptions}
                status={errors.operator ? "error" : undefined}
                style={{ width: "100%" }}
              />
            </FormField>
            <FormField label="所属省公司" required htmlFor="f-province" error={errors.province}>
              <Select
                id="f-province"
                value={values.province}
                onChange={setField("province")}
                options={provinceOptions}
                status={errors.province ? "error" : undefined}
                style={{ width: "100%" }}
              />
            </FormField>
            <FormField label="所属地市" required htmlFor="f-city" error={errors.city}>
              <Select
                id="f-city"
                value={values.city}
                onChange={setField("city")}
                options={cityOptions}
                status={errors.city ? "error" : undefined}
                style={{ width: "100%" }}
              />
            </FormField>

            <FormField label="站点名称" required htmlFor="f-name" error={errors.stationName}>
              <Input
                id="f-name"
                value={values.stationName}
                onChange={setInput("stationName")}
                placeholder="如：南山科技园北区 U1 站"
                status={errors.stationName ? "error" : undefined}
              />
            </FormField>
            <FormField label="站点编码" required htmlFor="f-code" error={errors.stationCode}>
              <Input
                id="f-code"
                value={values.stationCode}
                onChange={setInput("stationCode")}
                placeholder="如：SZ-NS-KJY-U1"
                status={errors.stationCode ? "error" : undefined}
              />
            </FormField>
            <FormField label="站点类型" htmlFor="f-type">
              <Select
                id="f-type"
                value={values.stationType}
                onChange={setField("stationType")}
                options={stationTypeOptions}
                style={{ width: "100%" }}
              />
            </FormField>

            <FormField label="开通日期" required htmlFor="f-date" error={errors.openDate}>
              <DatePicker
                id="f-date"
                value={values.openDate}
                onChange={setField("openDate")}
                status={errors.openDate ? "error" : undefined}
                placeholder="选择开通日期"
                style={{ width: "12rem" }}
              />
            </FormField>
            <FormField label="现场联系人" required htmlFor="f-contact" error={errors.contact}>
              <Input
                id="f-contact"
                value={values.contact}
                onChange={setInput("contact")}
                placeholder="请输入联系人姓名"
                status={errors.contact ? "error" : undefined}
              />
            </FormField>
            <FormField label="联系电话" required htmlFor="f-phone" error={errors.phone}>
              <Input
                id="f-phone"
                value={values.phone}
                onChange={setInput("phone")}
                placeholder="请输入 11 位手机号"
                status={errors.phone ? "error" : undefined}
              />
            </FormField>

            <FormField label="站点地址" span={2} htmlFor="f-address">
              <Input
                id="f-address"
                value={values.address}
                onChange={setInput("address")}
                placeholder="请输入站点详细地址"
              />
            </FormField>
            <FormField label="备注说明" span={3} htmlFor="f-remark">
              <Input.TextArea
                id="f-remark"
                value={values.remark}
                onChange={setInput("remark")}
                rows={3}
                placeholder="补充现场特殊情况、进场要求或协调事项"
              />
            </FormField>
          </div>
        </SectionPanel>

        {/* 02 网络参数配置 */}
        <SectionPanel
          index="02"
          icon="radio"
          title="网络参数配置"
          description="小区与射频参数，影响开通后的网络能力"
          toggleable
          checked={toggles.network}
          onToggle={toggleSection("network")}
        >
          <div className="form-grid">
            <FormField label="组网模式" span={2} htmlFor="f-runmode">
              <Radio.Group
                id="f-runmode"
                value={values.runMode}
                onChange={setInput("runMode")}
                options={runModeOptions}
              />
            </FormField>
            <FormField label="邻区自动配置" htmlFor="f-auto">
              <Switch
                id="f-auto"
                checked={values.autoNeighbor}
                onChange={setField("autoNeighbor")}
              />
            </FormField>

            <FormField label="工作频段" htmlFor="f-band">
              <Select
                id="f-band"
                mode="multiple"
                value={values.bands}
                onChange={setField("bands")}
                options={bandOptions}
                style={{ width: "100%" }}
                placeholder="可多选频段"
              />
            </FormField>
            <FormField label="小区带宽" htmlFor="f-bw">
              <Select
                id="f-bw"
                value={values.bandwidth}
                onChange={setField("bandwidth")}
                options={bandwidthOptions}
                style={{ width: "100%" }}
              />
            </FormField>
            <FormField label="发射功率" htmlFor="f-power">
              <div className="field-with-unit">
                <InputNumber
                  id="f-power"
                  mode="spinner"
                  variant="outlined"
                  min={0}
                  max={80}
                  value={values.txPower}
                  onChange={setField("txPower")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">dBm</span>
              </div>
            </FormField>

            <FormField label="小区标识 PCI" htmlFor="f-pci">
              <InputNumber
                id="f-pci"
                mode="spinner"
                variant="outlined"
                min={0}
                max={1007}
                value={values.pci}
                onChange={setField("pci")}
                style={{ width: "8rem" }}
              />
            </FormField>
            <FormField label="跟踪区码 TAC" htmlFor="f-tac">
              <InputNumber
                id="f-tac"
                mode="spinner"
                variant="outlined"
                min={0}
                max={65535}
                value={values.tac}
                onChange={setField("tac")}
                style={{ width: "8rem" }}
              />
            </FormField>
            <FormField label="上下行时隙" htmlFor="f-slot">
              <Select
                id="f-slot"
                value={values.uplinkRatio}
                onChange={setField("uplinkRatio")}
                options={slotRatioOptions}
                style={{ width: "100%" }}
              />
            </FormField>
          </div>
        </SectionPanel>

        {/* 03 设备与板卡信息 */}
        <SectionPanel
          index="03"
          icon="server"
          title="设备与板卡信息"
          description="主设备型号与端口配置，需与下方板卡清单一致"
          toggleable
          checked={toggles.device}
          onToggle={toggleSection("device")}
        >
          <div className="form-grid">
            <FormField label="设备厂商" htmlFor="f-vendor">
              <Select
                id="f-vendor"
                value={values.vendor}
                onChange={setField("vendor")}
                options={vendorOptions}
                style={{ width: "100%" }}
              />
            </FormField>
            <FormField label="设备型号" required htmlFor="f-model" error={errors.deviceModel}>
              <Input
                id="f-model"
                value={values.deviceModel}
                onChange={setInput("deviceModel")}
                placeholder="如：BBU5900"
                status={errors.deviceModel ? "error" : undefined}
              />
            </FormField>
            <FormField label="软件版本" htmlFor="f-soft">
              <Input
                id="f-soft"
                value={values.softVersion}
                onChange={setInput("softVersion")}
                placeholder="如：V3.2.1"
              />
            </FormField>

            <FormField label="序列号 SN" required htmlFor="f-sn" error={errors.sn}>
              <Input
                id="f-sn"
                value={values.sn}
                onChange={setInput("sn")}
                placeholder="请输入设备唯一序列号"
                status={errors.sn ? "error" : undefined}
              />
            </FormField>
            <FormField label="板卡数量" htmlFor="f-boardcount">
              <div className="field-with-unit">
                <InputNumber
                  id="f-boardcount"
                  mode="spinner"
                  variant="outlined"
                  min={1}
                  max={64}
                  value={values.boardCount}
                  onChange={setField("boardCount")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">块</span>
              </div>
            </FormField>
            <FormField label="机架高度" htmlFor="f-rack">
              <div className="field-with-unit">
                <InputNumber
                  id="f-rack"
                  mode="spinner"
                  variant="outlined"
                  min={1}
                  max={24}
                  value={values.rackHeight}
                  onChange={setField("rackHeight")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">U</span>
              </div>
            </FormField>

            <FormField label="端口类型" span={3} htmlFor="f-ports">
              <Checkbox.Group
                id="f-ports"
                value={values.ports}
                onChange={setField("ports")}
                options={portTypeOptions}
              />
            </FormField>
          </div>
        </SectionPanel>

        {/* 04 电源与环境保障 */}
        <SectionPanel
          index="04"
          icon="plug-zap"
          title="电源与环境保障"
          description="供电与机房环境，未开启时按默认配置归档"
          toggleable
          checked={toggles.power}
          onToggle={toggleSection("power")}
        >
          <div className="form-grid">
            <FormField label="供电类型" htmlFor="f-powertype">
              <Select
                id="f-powertype"
                value={values.powerType}
                onChange={setField("powerType")}
                options={powerTypeOptions}
                style={{ width: "100%" }}
              />
            </FormField>
            <FormField label="市电容量" htmlFor="f-capacity">
              <div className="field-with-unit">
                <InputNumber
                  id="f-capacity"
                  mode="spinner"
                  variant="outlined"
                  min={0}
                  max={400}
                  value={values.gridCapacity}
                  onChange={setField("gridCapacity")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">A</span>
              </div>
            </FormField>
            <FormField label="蓄电池组数" htmlFor="f-battery">
              <div className="field-with-unit">
                <InputNumber
                  id="f-battery"
                  mode="spinner"
                  variant="outlined"
                  min={0}
                  max={8}
                  value={values.batteryGroups}
                  onChange={setField("batteryGroups")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">组</span>
              </div>
            </FormField>

            <FormField label="空调配置" htmlFor="f-ac">
              <Radio.Group
                id="f-ac"
                value={values.airCondition}
                onChange={setInput("airCondition")}
                options={[
                  { value: "yes", label: "已配置" },
                  { value: "no", label: "未配置" },
                ]}
              />
            </FormField>
            <FormField label="环境温度上限" htmlFor="f-temp">
              <div className="field-with-unit">
                <InputNumber
                  id="f-temp"
                  mode="spinner"
                  variant="outlined"
                  min={0}
                  max={60}
                  value={values.tempLimit}
                  onChange={setField("tempLimit")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">℃</span>
              </div>
            </FormField>
          </div>
        </SectionPanel>

        {/* 05 覆盖与天线参数 */}
        <SectionPanel
          index="05"
          icon="radar"
          title="覆盖与天线参数"
          description="天线工参与覆盖规划，影响现场施工方案"
          toggleable
          checked={toggles.antenna}
          onToggle={toggleSection("antenna")}
        >
          <div className="form-grid">
            <FormField label="天线类型" htmlFor="f-anttype">
              <Select
                id="f-anttype"
                value={values.antennaType}
                onChange={setField("antennaType")}
                options={antennaTypeOptions}
                style={{ width: "100%" }}
              />
            </FormField>
            <FormField label="天线挂高" htmlFor="f-height">
              <div className="field-with-unit">
                <InputNumber
                  id="f-height"
                  mode="spinner"
                  variant="outlined"
                  min={0}
                  max={120}
                  value={values.antennaHeight}
                  onChange={setField("antennaHeight")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">m</span>
              </div>
            </FormField>
            <FormField label="覆盖半径" htmlFor="f-radius">
              <div className="field-with-unit">
                <InputNumber
                  id="f-radius"
                  mode="spinner"
                  variant="outlined"
                  min={0}
                  max={30}
                  step={0.1}
                  value={values.coverRadius}
                  onChange={setField("coverRadius")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">km</span>
              </div>
            </FormField>

            <FormField label="方位角" htmlFor="f-azimuth">
              <div className="field-with-unit">
                <InputNumber
                  id="f-azimuth"
                  mode="spinner"
                  variant="outlined"
                  min={0}
                  max={359}
                  value={values.azimuth}
                  onChange={setField("azimuth")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">°</span>
              </div>
            </FormField>
            <FormField label="机械下倾角" htmlFor="f-downtilt">
              <div className="field-with-unit">
                <InputNumber
                  id="f-downtilt"
                  mode="spinner"
                  variant="outlined"
                  min={0}
                  max={30}
                  value={values.downtilt}
                  onChange={setField("downtilt")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">°</span>
              </div>
            </FormField>
          </div>
        </SectionPanel>

        {/* 操作区 */}
        <div className="fill-form__actions">
          <span className="fill-form__hint">
            <Icon name="info" size="0.875rem" />
            带 * 为必填项，提交前将进行完整校验
          </span>
          <div className="fill-form__buttons">
            <Button onClick={handleReset}>重置</Button>
            <Button>保存草稿</Button>
            <Button type="primary" onClick={handleSubmit}>
              提交审核
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
