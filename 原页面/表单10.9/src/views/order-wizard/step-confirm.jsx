import { Input, Select, Radio, Checkbox } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import FormField from "../../components/form-field/index.jsx";
import {
  customerTypeOptions,
  industryOptions,
  certTypeOptions,
  serviceTypeOptions,
  productOptions,
  bandwidthOptions,
  accessModeOptions,
  contractOptions,
  slaOptions,
  surveyOptions,
  appointSlotOptions,
  invoiceTypeOptions,
  provinceOptions,
  getCities,
  roomOptions,
  labelOf,
} from "../../mock/order.js";

const { TextArea } = Input;

function SummaryGroup({ icon, title, rows }) {
  return (
    <div className="confirm-group">
      <h4 className="confirm-title">
        <Icon name={icon} size="1rem" />
        {title}
      </h4>
      <dl className="confirm-list">
        {rows.map((row) => (
          <div className="confirm-row" key={row.label}>
            <dt>{row.label}</dt>
            <dd className={row.value ? "" : "is-empty"}>{row.value || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// 步骤四 — 确认提交
export default function StepConfirm({ form, update, errors }) {
  const val = (v) => (v === undefined || v === null || v === "" ? "" : v);

  const address = [labelOf(provinceOptions, form.province), labelOf(getCities(form.province), form.city), form.address]
    .filter(Boolean)
    .join(" ");

  const customerRows = [
    { label: "客户名称", value: val(form.custName) },
    { label: "客户类型", value: labelOf(customerTypeOptions, form.custType) },
    { label: "证件类型", value: labelOf(certTypeOptions, form.certType) },
    { label: "证件号码", value: val(form.certNo) },
    { label: "所属行业", value: labelOf(industryOptions, form.industry) },
    { label: "联系人", value: val(form.contactName) },
    { label: "联系电话", value: val(form.contactPhone) },
    { label: "电子邮箱", value: val(form.contactEmail) },
  ];

  const serviceRows = [
    { label: "业务类型", value: labelOf(serviceTypeOptions, form.serviceType) },
    { label: "产品套餐", value: labelOf(productOptions, form.product) },
    { label: "带宽规格", value: labelOf(bandwidthOptions, form.bandwidth) },
    { label: "接入方式", value: labelOf(accessModeOptions, form.accessMode) },
    { label: "申请数量", value: form.quantity ? `${form.quantity} 条` : "" },
    { label: "合约期限", value: labelOf(contractOptions, form.contract) },
    { label: "服务等级", value: labelOf(slaOptions, form.sla) },
    { label: "固定 IP", value: form.needStaticIp ? `${form.staticIpCount} 个` : "动态分配" },
    { label: "预计年费", value: form.annualFee ? `¥ ${form.annualFee}` : "" },
  ];

  const accessRows = [
    { label: "安装地址", value: address },
    { label: "接入机房", value: labelOf(roomOptions, form.room) },
    {
      label: "预约时间",
      value: form.appointDate
        ? `${form.appointDate.format("YYYY-MM-DD")} ${labelOf(appointSlotOptions, form.appointSlot)}`
        : "",
    },
    { label: "现场联系人", value: val(form.siteName) },
    { label: "现场联系电话", value: val(form.sitePhone) },
    { label: "现场勘查", value: labelOf(surveyOptions, form.survey) },
  ];

  return (
    <div className="confirm-wrap">
      <SummaryGroup icon="user-round" title="客户信息" rows={customerRows} />
      <SummaryGroup icon="package" title="业务信息" rows={serviceRows} />
      <SummaryGroup icon="map-pin" title="接入信息" rows={accessRows} />

      <div className="confirm-group">
        <h4 className="confirm-title">
          <Icon name="receipt-text" size="1rem" />
          发票与附加信息
        </h4>
        <div className="form-grid confirm-form">
          <FormField label="发票类型" required htmlFor="invoiceType">
            <Radio.Group
              id="invoiceType"
              value={form.invoiceType}
              options={invoiceTypeOptions}
              onChange={(e) => update("invoiceType", e.target.value)}
            />
          </FormField>

          <FormField label="发票抬头" required htmlFor="invoiceTitle" error={errors.invoiceTitle}>
            <Input
              id="invoiceTitle"
              value={form.invoiceTitle}
              status={errors.invoiceTitle ? "error" : undefined}
              placeholder="请输入发票抬头（须与客户名称一致）"
              onChange={(e) => update("invoiceTitle", e.target.value)}
              style={{ width: "100%" }}
            />
          </FormField>

          <FormField label="纳税人识别号" required htmlFor="taxNo" error={errors.taxNo}>
            <Input
              id="taxNo"
              value={form.taxNo}
              status={errors.taxNo ? "error" : undefined}
              placeholder="请输入纳税人识别号"
              onChange={(e) => update("taxNo", e.target.value)}
              style={{ width: "100%" }}
            />
          </FormField>

          <FormField label="附加需求" htmlFor="extraDemand" full>
            <TextArea
              id="extraDemand"
              value={form.extraDemand}
              rows={3}
              maxLength={200}
              showCount
              placeholder="如发票寄送地址、合同编号关联等信息"
              onChange={(e) => update("extraDemand", e.target.value)}
            />
          </FormField>
        </div>

        <div className="agree-block">
          <Checkbox checked={form.agree} onChange={(e) => update("agree", e.target.checked)}>
            我已阅读并同意
            <a className="link" href="#agreement" onClick={(e) => e.preventDefault()}>《政企业务服务协议》</a>
            与
            <a className="link" href="#security" onClick={(e) => e.preventDefault()}>《网络信息安全承诺书》</a>
          </Checkbox>
          {errors.agree ? <div className="field-error agree-error">{errors.agree}</div> : null}
        </div>
      </div>
    </div>
  );
}
