import { useEffect, useRef, useState } from "react";
import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Select from "@nce/eview-react/Select";
import InputSelect from "@nce/eview-react/InputSelect";
import Spinner from "@nce/eview-react/Spinner";
import DragInput from "@nce/eview-react/DragInput";
import Toggle from "@nce/eview-react/Toggle";
import CheckboxGroup from "@nce/eview-react/CheckboxGroup";
import SelectCard from "@nce/eview-react/SelectCard";
import DatePicker from "@nce/eview-react/DatePicker";
import TipBox from "@nce/eview-react/TipBox";
import Dialog from "@nce/eview-react/Dialog";
import { Icon } from "../../shared/icon.jsx";
import { deptOptions, ownerOptions, sourceOptions, typeOptions } from "../../mock/dataset.js";

export default function DatasetFormModal({ open, mode, initial, onCancel, onSubmit }) {
  const formRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [desensitize, setDesensitize] = useState(true);

  useEffect(() => {
    if (open) {
      formRef.current?.resetFields();
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
          access: initial.access || ["read"],
          isPublic: !!initial.isPublic,
          qualityTarget: [Math.round(initial.quality * 20)],
          effectDate: new Date(),
        });
      }
    }
  }, [open, initial]);

  const handleSuccess = (values) => {
    if (saving) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onSubmit(values);
    }, 500);
  };

  return (
    <Dialog
      isOpen={open}
      title={
        <span className="mg-modal-title">
          <Icon name={mode === "edit" ? "pencil" : "plus"} size={16} />
          {mode === "edit" ? "编辑数据集" : "新建数据集"}
        </span>
      }
      size={[720, "auto"]}
      style={{ maxHeight: "80vh" }}
      onClose={onCancel}
      buttons={[
        { text: "取消", disabled: saving, onClick: () => onCancel() },
        {
          text: saving ? "保存中..." : mode === "edit" ? "保存修改" : "立即创建",
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
        className="mg-form"
        initialValues={{
          type: "时序数据",
          source: "MySQL",
          owner: "陈志远",
          dept: "能源事业部",
          fields: 24,
          savePolicy: "daily",
          access: ["read", "export"],
          isPublic: false,
          qualityTarget: [80],
          effectDate: new Date(),
        }}
        validateErrorType="tip"
        onSuccess={handleSuccess}
      >
        <Form.Item
          name="name"
          label="数据集名称"
          rules={[{ required: true }, { max: true, args: [50] }]}
          col={24}
        >
          <TextField maxLength={50} placeholder="如：华东光伏电站运行数据" />
        </Form.Item>
        <Form.Item name="desc" label="数据集描述" rules={[{ required: true }]} col={24}>
          <TextArea rows={3} maxLength={200} placeholder="简要说明数据内容、更新频率与使用场景" />
        </Form.Item>
        <Form.Item name="type" label="数据类型" rules={[{ required: true }]}>
          <Select options={typeOptions.map((v) => ({ value: v, text: v }))} />
        </Form.Item>
        <Form.Item name="source" label="数据来源">
          <Select options={sourceOptions.map((v) => ({ value: v, text: v }))} />
        </Form.Item>
        <Form.Item name="owner" label="负责人" rules={[{ required: true }]}>
          <InputSelect
            options={ownerOptions.map((v) => ({ text: v, value: v }))}
            placeholder="输入或选择负责人"
          />
        </Form.Item>
        <Form.Item name="dept" label="所属部门">
          <Select options={deptOptions.map((v) => ({ value: v, text: v }))} />
        </Form.Item>
        <Form.Item name="savePolicy" label="同步策略">
          <SelectCard
            data={[
              { value: "realtime", text: "实时" },
              { value: "daily", text: "每日" },
              { value: "weekly", text: "每周" },
            ]}
          />
        </Form.Item>
        <Form.Item name="fields" label="字段数量" rules={[{ required: true }]}>
          <Spinner min={1} max={500} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="access" label="访问权限">
          <CheckboxGroup
            data={[
              { text: "只读", value: "read" },
              { text: "可编辑", value: "edit" },
              { text: "可导出", value: "export" },
              { text: "可分享", value: "share" },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="isPublic"
          label={
            <span>
              是否公开{" "}
              <TipBox type="simple" content="公开后组织内所有成员可申请访问" direction="top">
                <Icon name="info" size={13} />
              </TipBox>
            </span>
          }
          valuePropName="toggled"
          updateTrigger="onToggle"
        >
          <Toggle data={[false, true]} taggledChildren="公开" unTaggledChildren="私有" />
        </Form.Item>
        <Form.Item name="qualityTarget" label="质量目标分" col={24}>
          <DragInput min={0} max={100} markIndexes={[0, 60, 80, 100]} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="effectDate" label="生效日期">
          <DatePicker type="date" format="yyyy-MM-dd" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label={
            <span>
              敏感字段脱敏{" "}
              <TipBox type="simple" content="开启后手机号、证件号等敏感字段自动脱敏" direction="top">
                <Icon name="info" size={13} />
              </TipBox>
            </span>
          }
        >
          <Toggle data={[false, true]} toggled={desensitize} onToggle={(v) => setDesensitize(v)} />
        </Form.Item>
      </Form>
    </Dialog>
  );
}
