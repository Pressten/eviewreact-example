import { useState } from "react";
import { Modal, Input, InputNumber, Select, DatePicker, message } from "antd";
import dayjs from "dayjs";
import { Icon } from "../../../assets/shared/icon.jsx";
import { stages } from "../../../src/mock/stages.js";
import { filterSalespeople } from "../../../src/mock/selectors.js";

// 新建商机 Modal — H5 表单骨架 + 受控校验
const EMPTY = {
  customer: "",
  amount: null,
  stage: undefined,
  closeDate: null,
  owner: undefined,
  productLine: "solution",
};

export default function NewOppModal({ open, onClose, onCreated, team }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const salesOpts = filterSalespeople({ team }).map((s) => ({
    value: s.id,
    label: `${s.name} · ${s.deptName}`,
  }));
  const stageOpts = stages.map((s) => ({ value: s.key, label: s.label }));
  const plOpts = [
    { value: "cloud", label: "云服务" },
    { value: "hardware", label: "智能硬件" },
    { value: "solution", label: "行业解决方案" },
    { value: "software", label: "软件订阅" },
  ];

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.customer || !form.customer.trim()) e.customer = "请输入客户名称";
    if (!form.amount || form.amount <= 0) e.amount = "请输入有效金额";
    if (!form.stage) e.stage = "请选择商机阶段";
    if (!form.closeDate) e.closeDate = "请选择预计成交日期";
    if (!form.owner) e.owner = "请选择负责人";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const owner = form.owner;
    const ownerPerson = salesOpts.find((s) => s.value === owner);
    const newOpp = {
      id: `new-${Date.now()}`,
      customer: form.customer.trim(),
      amount: Number(form.amount),
      stage: form.stage,
      owner,
      team,
      stayDays: 0,
      nextAction: "call",
      actionLabel: "新建跟进",
      nearExpiry: false,
      closeDate: dayjs(form.closeDate).format("YYYY-MM-DD"),
      productLine: form.productLine,
      createdAt: dayjs().format("YYYY-MM-DD"),
      lastSummary: `${dayjs().format("MM-DD")} 新建商机,${form.customer} 进入销售漏斗`,
    };
    onCreated(newOpp);
    message.success(`商机「${newOpp.customer}」已创建并加入看板`);
    setForm(EMPTY);
    setErrors({});
  };

  const handleCancel = () => {
    setForm(EMPTY);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      open={open}
      title={<span className="nom__title"><Icon name="circle-plus" size="1.125rem" color="var(--primary)" />新建商机</span>}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="创建商机"
      cancelText="取消"
      width={620}
      destroyOnClose
    >
      <form className="nom" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="nom__grid">
          <div className="nom__field">
            <label className="form-label required" htmlFor="nom-customer">客户名称</label>
            <div className="form-field">
              <Input
                id="nom-customer"
                placeholder="请输入客户名称"
                value={form.customer}
                onChange={(e) => set("customer", e.target.value)}
                status={errors.customer ? "error" : undefined}
                maxLength={40}
              />
              {errors.customer && <div className="form-error">{errors.customer}</div>}
            </div>
          </div>

          <div className="nom__field">
            <label className="form-label required" htmlFor="nom-amount">商机金额(万元)</label>
            <div className="form-field">
              <InputNumber
                id="nom-amount"
                mode="spinner"
                variant="outlined"
                placeholder="请输入金额"
                value={form.amount}
                onChange={(v) => set("amount", v)}
                status={errors.amount ? "error" : undefined}
                min={1}
                max={10000}
                style={{ width: "100%" }}
              />
              {errors.amount && <div className="form-error">{errors.amount}</div>}
            </div>
          </div>

          <div className="nom__field">
            <label className="form-label required" htmlFor="nom-stage">商机阶段</label>
            <div className="form-field">
              <Select
                id="nom-stage"
                placeholder="请选择阶段"
                value={form.stage}
                onChange={(v) => set("stage", v)}
                options={stageOpts}
                status={errors.stage ? "error" : undefined}
                style={{ width: "100%" }}
              />
              {errors.stage && <div className="form-error">{errors.stage}</div>}
            </div>
          </div>

          <div className="nom__field">
            <label className="form-label required" htmlFor="nom-close">预计成交日期</label>
            <div className="form-field">
              <DatePicker
                id="nom-close"
                value={form.closeDate}
                onChange={(v) => set("closeDate", v)}
                status={errors.closeDate ? "error" : undefined}
                style={{ width: "100%" }}
                placeholder="选择日期"
              />
              {errors.closeDate && <div className="form-error">{errors.closeDate}</div>}
            </div>
          </div>

          <div className="nom__field">
            <label className="form-label required" htmlFor="nom-owner">负责人</label>
            <div className="form-field">
              <Select
                id="nom-owner"
                placeholder="请选择负责人"
                value={form.owner}
                onChange={(v) => set("owner", v)}
                options={salesOpts}
                status={errors.owner ? "error" : undefined}
                style={{ width: "100%" }}
                showSearch
                optionFilterProp="label"
              />
              {errors.owner && <div className="form-error">{errors.owner}</div>}
            </div>
          </div>

          <div className="nom__field">
            <label className="form-label" htmlFor="nom-pl">产品线</label>
            <div className="form-field">
              <Select
                id="nom-pl"
                value={form.productLine}
                onChange={(v) => set("productLine", v)}
                options={plOpts}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        <div className="nom__hint">
          <Icon name="lightbulb" size="0.875rem" color="var(--critical)" />
          提示:新建商机将自动加入当前看板对应阶段列,并参与漏斗合计。
        </div>
      </form>
    </Modal>
  );
}
