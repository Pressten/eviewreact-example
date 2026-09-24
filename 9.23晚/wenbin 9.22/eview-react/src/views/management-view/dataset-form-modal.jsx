import { useEffect, useRef, useState } from "react";
import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Select from "@nce/eview-react/Select";
import InputSelect from "@nce/eview-react/InputSelect";
import SelectCard from "@nce/eview-react/SelectCard";
import Spinner from "@nce/eview-react/Spinner";
import Switch from "@nce/eview-react/Switch";
import TipBox from "@nce/eview-react/TipBox";
import Dialog from "@nce/eview-react/Dialog";
import CheckGroup from "../../components/check-group.jsx";
import { Icon } from "../../shared/icon.jsx";
import { deptOptions, ownerOptions, sourceOptions, typeOptions } from "../../mock/dataset.js";

const savePolicyData = [
  { text: "实时", value: "realtime" },
  { text: "每日", value: "daily" },
  { text: "每周", value: "weekly" },
];
const accessOpts = [
  { text: "只读", value: "read" },
  { text: "可编辑", value: "edit" },
  { text: "可导出", value: "export" },
  { text: "可分享", value: "share" },
];

export default function DatasetFormModal({ open, mode, initial, onCancel, onSubmit }) {
  const formRef = useRef(null);
  const [saving, setSaving] = useState(false);
  // Slider / 日期 / 脱敏开关 / 访问权限不进 Form 托管（避免 DragInput 数组值、原生控件、手写 CheckGroup 的托管坑），本地状态管理，提交时合并
  const [qt, setQt] = useState(80);
  const [access, setAccess] = useState(["read", "export"]);
  const [desensitize, setDesensitize] = useState(true);

  useEffect(() => {
    if (open) {
      formRef.current?.resetFields();
      setQt(80);
      setAccess(["read", "export"]);
      setDesensitize(true);
      if (initial) {
        formRef.current?.setFieldsValue({
          name: initial.name,
          desc: initial.desc,
          type: initial.type,
          source: initial.source,
          owner: initial.owner,
          dept: initial.department,
          fields: initial.fields,
          savePolicy: initial.savePolicy || "daily",
          isPublic: !!initial.isPublic,
        });
        setQt(Math.round(initial.quality * 20));
        setAccess(initial.access || ["read"]);
      }
    }
  }, [open, initial]);

  const handleSuccess = (values) => {
    if (saving) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onSubmit({ ...values, qualityTarget: qt, access });
    }, 500);
  };

  return (
    <Dialog
      isOpen={open}
      onClose={onCancel}
      size={[720, "auto"]}
      style={{ maxHeight: "80vh" }}
      title={
        <span className="mg-modal-title">
          <Icon name={mode === "edit" ? "pencil" : "plus"} size={16} />
          {mode === "edit" ? "编辑数据集" : "新建数据集"}
        </span>
      }
      buttons={[
        { text: "取消", onClick: onCancel },
        {
          text: saving ? "保存中…" : mode === "edit" ? "保存修改" : "立即创建",
          status: "primary",
          disabled: saving,
          onClick: () => formRef.current?.submit(),
        },
      ]}
    >
      <Form
        ref={formRef}
        layout="vertical"
        itemCol={12}
        validateErrorType="tip"
        initialValues={{
          type: "时序数据",
          source: "MySQL",
          owner: "陈志远",
          dept: "能源事业部",
          fields: 24,
          savePolicy: "daily",
          isPublic: false,
        }}
        onSuccess={handleSuccess}
        onFailed={() => {}}
      >
        <Form.Item name="name" label="数据集名称" rules={[{ required: true }]} col={24}>
          <TextField placeholder="如：华东光伏电站运行数据" maxLength={50} leftIcon={<Icon name="database" size={14} />} />
        </Form.Item>
        <Form.Item name="desc" label="数据集描述" rules={[{ required: true }]} col={24}>
          <TextArea rows={3} maxLength={200} placeholder="简要说明数据内容、更新频率与使用场景" />
        </Form.Item>
        <Form.Item name="type" label="数据类型" rules={[{ required: true }]}>
          <Select options={typeOptions.map((v) => ({ text: v, value: v }))} />
        </Form.Item>
        <Form.Item name="source" label="数据来源">
          <Select options={sourceOptions.map((v) => ({ text: v, value: v }))} />
        </Form.Item>
        <Form.Item name="owner" label="负责人" rules={[{ required: true }]}>
          <InputSelect options={ownerOptions.map((v) => ({ text: v, value: v }))} placeholder="输入或选择负责人" />
        </Form.Item>
        <Form.Item name="dept" label="所属部门">
          <Select options={deptOptions.map((v) => ({ text: v, value: v }))} />
        </Form.Item>
        <Form.Item name="savePolicy" label="同步策略">
          <SelectCard data={savePolicyData} />
        </Form.Item>
        <Form.Item name="fields" label="字段数量" rules={[{ required: true }]}>
          <Spinner min={1} max={500} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="isPublic"
          label={
            <span>
              是否公开{" "}
              <TipBox content="公开后组织内所有成员可申请访问" trigger="hover" direction="top">
                <Icon name="info" size={13} />
              </TipBox>
            </span>
          }
          valuePropName="toggled"
          updateTrigger="onToggle"
        >
          <Switch data={[false, true]} taggledChildren="公开" unTaggledChildren="私有" />
        </Form.Item>
      </Form>

      <div className="mg-form-grid">
        <div className="mg-f-item span-2">
          <label>访问权限</label>
          <CheckGroup options={accessOpts} value={access} onChange={setAccess} />
        </div>
        <div className="mg-f-item span-2">
          <label>质量目标分（{qt} 分）</label>
          <div className="mg-slider">
            <input
              type="range"
              min={0}
              max={100}
              value={qt}
              onChange={(e) => setQt(+e.target.value)}
            />
            <div className="mg-slider-marks">
              {[0, 60, 80, 100].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mg-f-item">
          <label>生效日期</label>
          <input type="date" className="mg-native-input" defaultValue="" />
        </div>
        <div className="mg-f-item">
          <label>
            <span>
              敏感字段脱敏{" "}
              <TipBox content="开启后手机号、证件号等敏感字段自动脱敏" trigger="hover" direction="top">
                <Icon name="info" size={13} />
              </TipBox>
            </span>
          </label>
          <Switch data={[false, true]} toggled={desensitize} onToggle={setDesensitize} taggledChildren="开" unTaggledChildren="关" />
        </div>
      </div>
    </Dialog>
  );
}
