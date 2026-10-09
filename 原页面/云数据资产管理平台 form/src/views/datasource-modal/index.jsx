import { useState, useEffect } from "react";
import { Modal, Input, Select, Segmented, InputNumber, Button, message } from "antd";
import { useApp, stamp } from "../../context.jsx";
import { TYPE_OPTIONS, DEPT_OPTIONS, FREQ_OPTIONS } from "../../mock/datasource.js";
import FormField from "../../components/form-field/index.jsx";
import "./index.css";

const { TextArea } = Input;

const STATUS_SEGMENTS = [
  { label: "已上线", value: "online" },
  { label: "草稿", value: "draft" },
  { label: "已下线", value: "offline" },
];

const BLANK = {
  name: "",
  type: undefined,
  dept: undefined,
  owner: "",
  freq: "天级",
  address: "",
  status: "online",
  tables: 0,
  desc: "",
};

// Layer 4: 新建 / 编辑数据源弹窗 — H5 表单骨架 + 受控校验
export default function DatasourceModal() {
  const { editor, closeEditor, upsertRecord, nextId, list } = useApp();
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const isEdit = editor.mode === "edit";

  useEffect(() => {
    if (!editor.open) return;
    if (isEdit && editor.record) {
      setForm({ ...BLANK, ...editor.record });
    } else {
      setForm({ ...BLANK, id: nextId, createdAt: stamp().slice(0, 10), owner: "张伟" });
    }
    setErrors({});
  }, [editor.open, editor.mode, editor.record]);

  const patch = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validate = () => {
    const next = {};
    const name = form.name.trim();
    if (!name) {
      next.name = "请输入数据源名称";
    } else if (list.some((item) => item.name === name && item.id !== form.id)) {
      next.name = "该数据源名称已存在";
    }
    if (!form.type) next.type = "请选择数据源类型";
    if (!form.dept) next.dept = "请选择归属部门";
    if (!form.owner.trim()) next.owner = "请输入负责人";
    if (!form.address.trim()) next.address = "请输入连接地址";
    return next;
  };

  const handleSubmit = () => {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    upsertRecord({
      ...form,
      name: form.name.trim(),
      owner: form.owner.trim(),
      address: form.address.trim(),
      updatedAt: stamp(),
    });
    message.success(isEdit ? "数据源已保存" : "数据源已创建");
    closeEditor();
  };

  return (
    <Modal
      open={editor.open}
      title={isEdit ? "编辑数据源" : "新建数据源"}
      width={680}
      maskClosable={false}
      onCancel={closeEditor}
      footer={[
        <Button key="cancel" onClick={closeEditor}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {isEdit ? "保存" : "创建"}
        </Button>,
      ]}
    >
      <div className="ds-form">
        <FormField
          label="数据源名称"
          htmlFor="ds-name"
          required
          error={errors.name}
          className="ds-form__full"
        >
          <Input
            id="ds-name"
            value={form.name}
            placeholder="如：门店交易明细库"
            status={errors.name ? "error" : undefined}
            onChange={(e) => patch("name", e.target.value)}
          />
        </FormField>

        <FormField label="数据源类型" htmlFor="ds-type" required error={errors.type}>
          <Select
            id="ds-type"
            value={form.type}
            placeholder="请选择类型"
            options={TYPE_OPTIONS}
            status={errors.type ? "error" : undefined}
            onChange={(value) => patch("type", value)}
          />
        </FormField>

        <FormField label="归属部门" htmlFor="ds-dept" required error={errors.dept}>
          <Select
            id="ds-dept"
            value={form.dept}
            placeholder="请选择归属部门"
            options={DEPT_OPTIONS}
            status={errors.dept ? "error" : undefined}
            onChange={(value) => patch("dept", value)}
          />
        </FormField>

        <FormField label="负责人" htmlFor="ds-owner" required error={errors.owner}>
          <Input
            id="ds-owner"
            value={form.owner}
            placeholder="请输入负责人姓名"
            status={errors.owner ? "error" : undefined}
            onChange={(e) => patch("owner", e.target.value)}
          />
        </FormField>

        <FormField label="更新频率" htmlFor="ds-freq">
          <Select
            id="ds-freq"
            value={form.freq}
            options={FREQ_OPTIONS}
            onChange={(value) => patch("freq", value)}
          />
        </FormField>

        <FormField
          label="连接地址"
          htmlFor="ds-address"
          required
          error={errors.address}
          className="ds-form__full"
        >
          <Input
            id="ds-address"
            value={form.address}
            placeholder="如：10.62.18.31:3306/retail_trade 或 https://open.api.internal/v1/assets"
            status={errors.address ? "error" : undefined}
            onChange={(e) => patch("address", e.target.value)}
          />
        </FormField>

        <FormField label="运行状态" htmlFor="ds-status">
          <Segmented
            id="ds-status"
            block
            value={form.status}
            options={STATUS_SEGMENTS}
            onChange={(value) => patch("status", value)}
          />
        </FormField>

        <FormField label="数据表数量" htmlFor="ds-tables">
          <InputNumber
            id="ds-tables"
            min={0}
            max={9999}
            value={form.tables}
            onChange={(value) => patch("tables", value || 0)}
          />
        </FormField>

        <FormField label="数据源描述" htmlFor="ds-desc" className="ds-form__full">
          <TextArea
            id="ds-desc"
            rows={3}
            maxLength={120}
            showCount
            value={form.desc}
            placeholder="简要说明该数据源的业务含义与使用范围"
            onChange={(e) => patch("desc", e.target.value)}
          />
        </FormField>
      </div>
    </Modal>
  );
}
