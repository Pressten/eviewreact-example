import { useState } from "react";
import { IconPlusIcPublicBoltCircle, IconPlusIcPublicPlusCircle } from '@hui/icon-plus';
import Dialog from "@nce/eview-react/Dialog";
import TextField from "@/shared/TextField";
import Spinner from "@/shared/Spinner";
import Select from "@/shared/Select";
import DatePicker from "@/shared/DatePicker";
import DivMessage from "@nce/eview-react/DivMessage";
import dayjs from "dayjs";
import { stages } from "../../mock/stages.js";
import { filterSalespeople } from "../../mock/selectors.js";

// 新建商机 Dialog — H5 表单骨架 + 受控校验
const EMPTY = {
  customer: "",
  amount: null,
  stage: "",
  closeDate: null,
  owner: "",
  productLine: "solution",
};

export default function NewOppModal({ open, onClose, onCreated, team }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);

  const salesOpts = filterSalespeople({ team }).map((s) => ({
    value: s.id,
    text: `${s.name} · ${s.deptName}`,
  }));
  const stageOpts = [
    { value: "", text: "请选择阶段" },
    ...stages.map((s) => ({ value: s.key, text: s.label })),
  ];
  const salesOptsWithPlaceholder = [
    { value: "", text: "请选择负责人" },
    ...salesOpts,
  ];
  const plOpts = [
    { value: "cloud", text: "云服务" },
    { value: "hardware", text: "智能硬件" },
    { value: "solution", text: "行业解决方案" },
    { value: "software", text: "软件订阅" },
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
    setNotice({ key: Date.now(), text: `商机「${newOpp.customer}」已创建并加入看板` });
    setForm(EMPTY);
    setErrors({});
  };

  const handleCancel = () => {
    setForm(EMPTY);
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      isOpen={open}
      title={<span className="nom__title"><IconPlusIcPublicPlusCircle iconSize="1.125rem" iconColor={['var(--primary)']} />新建商机</span>}
      onClose={handleCancel}
      size={[620, "auto"]}
      destroyOnClose
      buttons={[
        { text: "取消", onClick: handleCancel },
        { text: "创建商机", status: "primary", onClick: handleSubmit },
      ]}
    >
      {notice && (
        <div className="nom__notice">
          <DivMessage
            key={notice.key}
            display
            type="success"
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      )}
      <form className="nom" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="nom__grid">
          <div className="nom__field">
            <label className="form-label required" htmlFor="nom-customer">客户名称</label>
            <div className="form-field">
              <TextField
                id="nom-customer"
                placeholder="请输入客户名称"
                value={form.customer}
                onChange={(value) => set("customer", value)}
                maxLength={40}
              />
              {errors.customer && <div className="form-error">{errors.customer}</div>}
            </div>
          </div>

          <div className="nom__field">
            <label className="form-label required" htmlFor="nom-amount">商机金额(万元)</label>
            <div className="form-field">
              <Spinner
                id="nom-amount"
                value={form.amount}
                onChange={(value) => set("amount", value)}
                min={1}
                max={10000}
                doNotFocusWhenValueUpdate
              />
              {errors.amount && <div className="form-error">{errors.amount}</div>}
            </div>
          </div>

          <div className="nom__field">
            <label className="form-label required" htmlFor="nom-stage">商机阶段</label>
            <div className="form-field">
              <Select
                id="nom-stage"
                defaultLabel="请选择阶段"
                value={form.stage}
                onChange={(v) => set("stage", v)}
                options={stageOpts}
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
                onChange={(_dateString, date) => { if (date) set("closeDate", date); }}
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
                defaultLabel="请选择负责人"
                value={form.owner}
                onChange={(v) => set("owner", v)}
                options={salesOptsWithPlaceholder}
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
              />
            </div>
          </div>
        </div>

        <div className="nom__hint">
          <IconPlusIcPublicBoltCircle iconSize="0.875rem" iconColor={['var(--critical)']} />
          提示:新建商机将自动加入当前看板对应阶段列,并参与漏斗合计。
        </div>
      </form>
    </Dialog>
  );
}
