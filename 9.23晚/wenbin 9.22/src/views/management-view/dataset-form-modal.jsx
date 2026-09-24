import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { AutoComplete, Checkbox, DatePicker, Form, Input, InputNumber, Modal, Radio, Select, Slider, Switch, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { deptOptions, ownerOptions, sourceOptions, typeOptions } from "../../mock/dataset.js";

export default function DatasetFormModal({ open, mode, initial, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (initial) {
        form.setFieldsValue({
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
          qualityTarget: Math.round(initial.quality * 20),
          effectDate: dayjs(),
        });
      }
    }
  }, [open, initial, form]);

  const handleOk = async () => {
    try {
      await form.validateFields();
      setSaving(true);
      setTimeout(() => {
        setSaving(false);
        onSubmit(form.getFieldsValue(true));
      }, 500);
    } catch (e) {
      return;
    }
  };

  return (
    <Modal
      open={open}
      title={
        <span className="mg-modal-title">
          <Icon name={mode === "edit" ? "pencil" : "plus"} size={16} />
          {mode === "edit" ? "编辑数据集" : "新建数据集"}
        </span>
      }
      width={720}
      okText={mode === "edit" ? "保存修改" : "立即创建"}
      cancelText="取消"
      confirmLoading={saving}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
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
          qualityTarget: 80,
          effectDate: dayjs(),
        }}
      >
        <div className="mg-form-grid">
          <Form.Item
            name="name"
            label="数据集名称"
            rules={[
              { required: true, message: "请输入数据集名称" },
              { max: 50, message: "名称不超过 50 个字符" },
            ]}
            className="span-2"
          >
            <Input showCount maxLength={50} placeholder="如：华东光伏电站运行数据" prefix={<Icon name="database" size={14} />} />
          </Form.Item>
          <Form.Item name="desc" label="数据集描述" rules={[{ required: true, message: "请输入描述信息" }]} className="span-2">
            <Input.TextArea rows={3} showCount maxLength={200} placeholder="简要说明数据内容、更新频率与使用场景" />
          </Form.Item>
          <Form.Item name="type" label="数据类型" rules={[{ required: true, message: "请选择数据类型" }]}>
            <Select options={typeOptions.map((v) => ({ value: v, label: v }))} />
          </Form.Item>
          <Form.Item name="source" label="数据来源">
            <Select options={sourceOptions.map((v) => ({ value: v, label: v }))} />
          </Form.Item>
          <Form.Item name="owner" label="负责人" rules={[{ required: true, message: "请输入负责人" }]}>
            <AutoComplete options={ownerOptions.map((v) => ({ value: v }))} placeholder="输入或选择负责人" />
          </Form.Item>
          <Form.Item name="dept" label="所属部门">
            <Select options={deptOptions.map((v) => ({ value: v, label: v }))} />
          </Form.Item>
          <Form.Item name="savePolicy" label="同步策略">
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              options={[
                { value: "realtime", label: "实时" },
                { value: "daily", label: "每日" },
                { value: "weekly", label: "每周" },
              ]}
            />
          </Form.Item>
          <Form.Item name="fields" label="字段数量" rules={[{ required: true, message: "请输入字段数量" }]}>
            <InputNumber min={1} max={500} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="access" label="访问权限">
            <Checkbox.Group
              options={[
                { label: "只读", value: "read" },
                { label: "可编辑", value: "edit" },
                { label: "可导出", value: "export" },
                { label: "可分享", value: "share" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="isPublic"
            label={
              <span>
                是否公开{" "}
                <Tooltip title="公开后组织内所有成员可申请访问">
                  <Icon name="info" size={13} />
                </Tooltip>
              </span>
            }
            valuePropName="checked"
          >
            <Switch checkedChildren="公开" unCheckedChildren="私有" />
          </Form.Item>
          <Form.Item name="qualityTarget" label="质量目标分" className="span-2">
            <Slider marks={{ 0: "0", 60: "60", 80: "80", 100: "100" }} tooltip={{ formatter: (v) => `${v} 分` }} />
          </Form.Item>
          <Form.Item name="effectDate" label="生效日期">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label={
              <span>
                敏感字段脱敏{" "}
                <Tooltip title="开启后手机号、证件号等敏感字段自动脱敏">
                  <Icon name="info" size={13} />
                </Tooltip>
              </span>
            }
          >
            <Switch defaultChecked size="small" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
