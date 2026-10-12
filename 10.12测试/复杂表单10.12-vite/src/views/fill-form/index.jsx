// Layer 4: 信息填报表单区 — 场景式分区 + toggle 子区域
import { useState } from "react";
import { IconPlusIcBpitFlag, IconPlusIcCarRadar1, IconPlusIcIctServers, IconPlusIcPublicBuilding, IconPlusIcPublicCalendar, IconPlusIcPublicInfo, IconPlusIcPublicMappinOnMap, IconPlusIcPublicPower, IconPlusIcPublicRadiowave } from '@nce/icon-plus';
import Button from "@nce/eview-react/Button";
import CheckboxGroup from "@nce/eview-react/CheckboxGroup";
import DatePicker from "@nce/eview-react/DatePicker";
import TextField from "@/shared/TextField";
import TextArea from "@/shared/TextArea";
import Spinner from "@nce/eview-react/Spinner";
import RadioGroup from "@nce/eview-react/RadioGroup";
import Select from "@/shared/Select";
import MultipleSelect from "@/shared/MultipleSelect";
import Steps from "@nce/eview-react/Steps";
import Toggle from "@nce/eview-react/Toggle";
import DivMessage from "@nce/eview-react/DivMessage";
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

const STEP_DATA = [
  { text: "选择场景", value: "1" },
  { text: "填报信息", value: "2" },
  { text: "设备核对", value: "3" },
  { text: "提交审核", value: "4" },
];

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
  const [notice, setNotice] = useState(null);
  const notify = (type, text) => setNotice({ type, text, key: Date.now() });

  const setField = (key) => (val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

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
      notify("success", "校验通过，表单已提交审核");
    } else {
      notify("error", "存在必填项未完成，请检查标红字段");
    }
  };

  const handleReset = () => {
    setValues(EMPTY_VALUES);
    setErrors({});
    notify("default", "已重置为初始值");
  };

  return (
    <div className="fill-form">
      {notice ? (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}

      {/* 场景头部 */}
      <section className="scenario-card">
        <div className="scenario-card__main">
          <div className="scenario-card__tag">
            <IconPlusIcPublicRadiowave iconSize="0.875rem" iconColor={['currentcolor']} />
            5G 基站开通信息填报
          </div>
          <h2 className="scenario-card__title">深圳南山科技园 5G-A 宏站开通采集</h2>
          <p className="scenario-card__desc">
            面向运营商网优工程师的现场信息采集场景，按分区填报站点、网络、设备、供电与覆盖参数，
            提交后进入设备核对与审核流程。
          </p>
          <div className="scenario-card__chips">
            <span className="scenario-chip">
              <IconPlusIcPublicMappinOnMap iconSize="0.75rem" iconColor={['currentcolor']} />
              广东省 · 深圳市 · 南山科技园北区
            </span>
            <span className="scenario-chip">
              <IconPlusIcPublicCalendar iconSize="0.75rem" iconColor={['currentcolor']} />
              计划开通 2026-10-18
            </span>
            <span className="scenario-chip">
              <IconPlusIcBpitFlag iconSize="0.75rem" iconColor={['currentcolor']} />
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
        <Steps data={STEP_DATA} currentStep="2" labelPlacement="horizontal" />
      </div>

      <form className="fill-form__body" onSubmit={(e) => e.preventDefault()}>
        {/* 01 运营商主体信息 */}
        <SectionPanel
          index="01"
          icon={<IconPlusIcPublicBuilding iconSize="1.25rem" iconColor={['currentcolor']} />}
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
                style={{ width: "100%" }}
              />
            </FormField>
            <FormField label="所属省公司" required htmlFor="f-province" error={errors.province}>
              <Select
                id="f-province"
                value={values.province}
                onChange={setField("province")}
                options={provinceOptions}
                style={{ width: "100%" }}
              />
            </FormField>
            <FormField label="所属地市" required htmlFor="f-city" error={errors.city}>
              <Select
                id="f-city"
                value={values.city}
                onChange={setField("city")}
                options={cityOptions}
                style={{ width: "100%" }}
              />
            </FormField>

            <FormField label="站点名称" required htmlFor="f-name" error={errors.stationName}>
              <TextField
                id="f-name"
                value={values.stationName}
                onChange={setField("stationName")}
                placeholder="如：南山科技园北区 U1 站"
              />
            </FormField>
            <FormField label="站点编码" required htmlFor="f-code" error={errors.stationCode}>
              <TextField
                id="f-code"
                value={values.stationCode}
                onChange={setField("stationCode")}
                placeholder="如：SZ-NS-KJY-U1"
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
                type="date"
                format="yyyy-MM-dd"
                placeholder="选择开通日期"
                value={values.openDate ?? undefined}
                onChange={(dateString, date) => {
                  if (date) setField("openDate")(date);
                }}
                style={{ width: "12rem" }}
              />
            </FormField>
            <FormField label="现场联系人" required htmlFor="f-contact" error={errors.contact}>
              <TextField
                id="f-contact"
                value={values.contact}
                onChange={setField("contact")}
                placeholder="请输入联系人姓名"
              />
            </FormField>
            <FormField label="联系电话" required htmlFor="f-phone" error={errors.phone}>
              <TextField
                id="f-phone"
                value={values.phone}
                onChange={setField("phone")}
                placeholder="请输入 11 位手机号"
              />
            </FormField>

            <FormField label="站点地址" span={2} htmlFor="f-address">
              <TextField
                id="f-address"
                value={values.address}
                onChange={setField("address")}
                placeholder="请输入站点详细地址"
              />
            </FormField>
            <FormField label="备注说明" span={3} htmlFor="f-remark">
              <TextArea
                id="f-remark"
                value={values.remark}
                onChange={(value) => setField("remark")(value)}
                placeholder="补充现场特殊情况、进场要求或协调事项"
              />
            </FormField>
          </div>
        </SectionPanel>

        {/* 02 网络参数配置 */}
        <SectionPanel
          index="02"
          icon={<IconPlusIcPublicRadiowave iconSize="1.25rem" iconColor={['currentcolor']} />}
          title="网络参数配置"
          description="小区与射频参数，影响开通后的网络能力"
          toggleable
          checked={toggles.network}
          onToggle={toggleSection("network")}
        >
          <div className="form-grid">
            <FormField label="组网模式" span={2} htmlFor="f-runmode">
              <RadioGroup
                id="f-runmode"
                isControlled
                data={runModeOptions}
                value={values.runMode}
                onChange={(a, b) => {
                  const next = a === values.runMode ? b : a;
                  setField("runMode")(next);
                }}
              />
            </FormField>
            <FormField label="邻区自动配置" htmlFor="f-auto">
              <Toggle
                id="f-auto"
                data={[false, true]}
                toggled={values.autoNeighbor}
                onToggle={setField("autoNeighbor")}
              />
            </FormField>

            <FormField label="工作频段" htmlFor="f-band">
              <MultipleSelect
                id="f-band"
                value={values.bands}
                onChange={(value) => setField("bands")(value)}
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
                <Spinner
                  id="f-power"
                  min={0}
                  max={80}
                  value={values.txPower}
                  doNotFocusWhenValueUpdate
                  onChange={setField("txPower")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">dBm</span>
              </div>
            </FormField>

            <FormField label="小区标识 PCI" htmlFor="f-pci">
              <Spinner
                id="f-pci"
                min={0}
                max={1007}
                value={values.pci}
                doNotFocusWhenValueUpdate
                onChange={setField("pci")}
                style={{ width: "8rem" }}
              />
            </FormField>
            <FormField label="跟踪区码 TAC" htmlFor="f-tac">
              <Spinner
                id="f-tac"
                min={0}
                max={65535}
                value={values.tac}
                doNotFocusWhenValueUpdate
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
          icon={<IconPlusIcIctServers iconSize="1.25rem" iconColor={['currentcolor']} />}
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
              <TextField
                id="f-model"
                value={values.deviceModel}
                onChange={setField("deviceModel")}
                placeholder="如：BBU5900"
              />
            </FormField>
            <FormField label="软件版本" htmlFor="f-soft">
              <TextField
                id="f-soft"
                value={values.softVersion}
                onChange={setField("softVersion")}
                placeholder="如：V3.2.1"
              />
            </FormField>

            <FormField label="序列号 SN" required htmlFor="f-sn" error={errors.sn}>
              <TextField
                id="f-sn"
                value={values.sn}
                onChange={setField("sn")}
                placeholder="请输入设备唯一序列号"
              />
            </FormField>
            <FormField label="板卡数量" htmlFor="f-boardcount">
              <div className="field-with-unit">
                <Spinner
                  id="f-boardcount"
                  min={1}
                  max={64}
                  value={values.boardCount}
                  doNotFocusWhenValueUpdate
                  onChange={setField("boardCount")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">块</span>
              </div>
            </FormField>
            <FormField label="机架高度" htmlFor="f-rack">
              <div className="field-with-unit">
                <Spinner
                  id="f-rack"
                  min={1}
                  max={24}
                  value={values.rackHeight}
                  doNotFocusWhenValueUpdate
                  onChange={setField("rackHeight")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">U</span>
              </div>
            </FormField>

            <FormField label="端口类型" span={3} htmlFor="f-ports">
              <CheckboxGroup
                id="f-ports"
                data={portTypeOptions}
                value={values.ports}
                onChange={(value) => setField("ports")(value)}
              />
            </FormField>
          </div>
        </SectionPanel>

        {/* 04 电源与环境保障 */}
        <SectionPanel
          index="04"
          icon={<IconPlusIcPublicPower iconSize="1.25rem" iconColor={['currentcolor']} />}
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
                <Spinner
                  id="f-capacity"
                  min={0}
                  max={400}
                  value={values.gridCapacity}
                  doNotFocusWhenValueUpdate
                  onChange={setField("gridCapacity")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">A</span>
              </div>
            </FormField>
            <FormField label="蓄电池组数" htmlFor="f-battery">
              <div className="field-with-unit">
                <Spinner
                  id="f-battery"
                  min={0}
                  max={8}
                  value={values.batteryGroups}
                  doNotFocusWhenValueUpdate
                  onChange={setField("batteryGroups")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">组</span>
              </div>
            </FormField>

            <FormField label="空调配置" htmlFor="f-ac">
              <RadioGroup
                id="f-ac"
                isControlled
                data={[
                  { value: "yes", text: "已配置" },
                  { value: "no", text: "未配置" },
                ]}
                value={values.airCondition}
                onChange={(a, b) => {
                  const next = a === values.airCondition ? b : a;
                  setField("airCondition")(next);
                }}
              />
            </FormField>
            <FormField label="环境温度上限" htmlFor="f-temp">
              <div className="field-with-unit">
                <Spinner
                  id="f-temp"
                  min={0}
                  max={60}
                  value={values.tempLimit}
                  doNotFocusWhenValueUpdate
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
          icon={<IconPlusIcCarRadar1 iconSize="1.25rem" iconColor={['currentcolor']} />}
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
                <Spinner
                  id="f-height"
                  min={0}
                  max={120}
                  value={values.antennaHeight}
                  doNotFocusWhenValueUpdate
                  onChange={setField("antennaHeight")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">m</span>
              </div>
            </FormField>
            <FormField label="覆盖半径" htmlFor="f-radius">
              <div className="field-with-unit">
                <Spinner
                  id="f-radius"
                  min={0}
                  max={30}
                  step={0.1}
                  precision={1}
                  value={values.coverRadius}
                  doNotFocusWhenValueUpdate
                  onChange={setField("coverRadius")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">km</span>
              </div>
            </FormField>

            <FormField label="方位角" htmlFor="f-azimuth">
              <div className="field-with-unit">
                <Spinner
                  id="f-azimuth"
                  min={0}
                  max={359}
                  value={values.azimuth}
                  doNotFocusWhenValueUpdate
                  onChange={setField("azimuth")}
                  style={{ width: "8rem" }}
                />
                <span className="field-unit">°</span>
              </div>
            </FormField>
            <FormField label="机械下倾角" htmlFor="f-downtilt">
              <div className="field-with-unit">
                <Spinner
                  id="f-downtilt"
                  min={0}
                  max={30}
                  value={values.downtilt}
                  doNotFocusWhenValueUpdate
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
            <IconPlusIcPublicInfo iconSize="0.875rem" iconColor={['currentcolor']} />
            带 * 为必填项，提交前将进行完整校验
          </span>
          <div className="fill-form__buttons">
            <Button text="重置" onClick={handleReset} />
            <Button text="保存草稿" />
            <Button status="primary" text="提交审核" onClick={handleSubmit} />
          </div>
        </div>
      </form>
    </div>
  );
}
