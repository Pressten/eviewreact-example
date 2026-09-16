import { useEffect, useState } from "react";
import { Form, Input, Modal, Select, Switch, message } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { Icon } from "../../assets/shared/icons.js";
import {
  deviceFormInitialValues,
  deviceTypeOptions,
  firmwareOptions,
  policyTemplates,
  siteOptions,
} from "../data.js";
import "./config-modal.css";

// Layer 4: 设备配置弹窗 — 新增 / 编辑设备并绑定采集策略(单一焦点,单列表单)
export default function ConfigModal({ open, record, onCancel }) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [enabled, setEnabled] = useState(true);
  const isEdit = Boolean(record);

  const t = (id, fallback, values) =>
    intl.formatMessage({ id: id, defaultMessage: fallback }, values);
  const label = (id, fallback) => <FormattedMessage id={id} defaultMessage={fallback} />;
  const toOptions = (list) =>
    list.map((item) => ({
      value: item.value,
      label: item.label || t(item.msgId, item.fallback),
    }));

  useEffect(() => {
    if (!open) return;
    if (record) {
      const nextEnabled = record.status !== "disabled";
      form.setFieldsValue({
        name: record.name,
        code: record.code,
        type: record.type,
        site: record.site,
        firmware: record.firmware,
        policy: record.policy,
        enabled: nextEnabled,
        remark: "",
      });
      setEnabled(nextEnabled);
    } else {
      form.resetFields();
      setEnabled(true);
    }
  }, [open, record, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        message.success(
          t(
            isEdit ? "modal.updated" : "modal.created",
            isEdit ? "设备配置已更新" : "设备配置已创建"
          )
        );
        onCancel();
      })
      .catch(() => {});
  };

  const requiredRule = [{ required: true, message: t("modal.required", "此项为必填") }];

  return (
    <Modal
      className="config-modal"
      open={open}
      centered
      width={560}
      maskClosable={false}
      onOk={handleOk}
      onCancel={onCancel}
      okText={t("modal.ok", "确定")}
      cancelText={t("modal.cancel", "取消")}
      title={
        <span className="modal-title">
          <Icon name={isEdit ? "square-pen" : "plus"} size={16} />
          {label(
            isEdit ? "modal.titleEdit" : "modal.title",
            isEdit ? "编辑设备配置" : "新增设备配置"
          )}
        </span>
      }
    >
      <p className="modal-desc">
        {label("modal.desc", "填写设备基础信息并绑定采集策略，保存后立即纳管。")}
      </p>
      <Form form={form} layout="vertical" initialValues={deviceFormInitialValues}>
        <Form.Item name="name" label={label("modal.name", "设备名称")} rules={requiredRule}>
          <Input placeholder={t("modal.name.placeholder", "请输入设备名称")} />
        </Form.Item>
        <Form.Item name="code" label={label("modal.code", "设备编号")} rules={requiredRule}>
          <Input placeholder={t("modal.code.placeholder", "例如 GW-SH-0201")} />
        </Form.Item>
        <Form.Item name="type" label={label("modal.type", "设备类型")} rules={requiredRule}>
          <Select options={toOptions(deviceTypeOptions)} />
        </Form.Item>
        <Form.Item name="site" label={label("modal.site", "所属站点")} rules={requiredRule}>
          <Select options={toOptions(siteOptions)} showSearch optionFilterProp="label" />
        </Form.Item>
        <Form.Item name="firmware" label={label("modal.firmware", "固件版本")}>
          <Select options={firmwareOptions} />
        </Form.Item>
        <Form.Item name="policy" label={label("modal.policy", "采集策略模板")} rules={requiredRule}>
          <Select options={toOptions(policyTemplates)} />
        </Form.Item>

        <div className="modal-switch">
          <div className="modal-switch-text">
            <div className="modal-switch-title">{label("modal.enabled", "保存后立即启用")}</div>
            <div className="modal-switch-desc">
              {label("modal.enabled.desc", "启用后设备将按所选策略开始上报数据")}
            </div>
          </div>
          <Form.Item name="enabled" valuePropName="checked" noStyle>
            <Switch onChange={setEnabled} />
          </Form.Item>
        </div>

        <Form.Item name="remark" label={label("modal.remark", "备注")} className="modal-remark">
          <Input.TextArea
            rows={2}
            placeholder={t("modal.remark.placeholder", "可选，记录设备位置或负责人信息")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
