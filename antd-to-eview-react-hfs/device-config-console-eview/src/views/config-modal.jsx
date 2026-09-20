import { useEffect, useRef } from "react";
import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Select from "@nce/eview-react/Select";
import Toggle from "@nce/eview-react/Toggle";
import Dialog from "@nce/eview-react/Dialog";
import { FormattedMessage, useIntl } from "react-intl";
import { Icon } from "../icons.jsx";
import { useToast } from "../components/Toast.jsx";
import {
  deviceFormInitialValues,
  deviceTypeOptions,
  firmwareOptions,
  policyTemplates,
  siteOptions,
} from "../data.js";
import "./config-modal.css";

// Layer 4: 设备配置弹窗 — 新增 / 编辑设备并绑定采集策略(单一焦点,单列表单)
// antd → eview-react: Modal → Dialog(isOpen/onClose/buttons,尺寸 size=[宽,'auto'] + maxHeight 限高);
// form.validateFields().then() → ref.submit() → onSuccess(values) 回调,校验失败自动走 onFailed;
// Switch 行 → Form.Item label + labelTip 托管(valuePropName="toggled" updateTrigger="onToggle"),
// 不能用 div 包裹 Form.Item 做左右布局(标签宽度与栅格按直接子级计算,见 skill Form.md)。
export default function ConfigModal({ open, record, onCancel }) {
  const intl = useIntl();
  const toast = useToast();
  const formRef = useRef(null);
  const isEdit = Boolean(record);

  const t = (id, fallback, values) =>
    intl.formatMessage({ id: id, defaultMessage: fallback }, values);
  const label = (id, fallback) => <FormattedMessage id={id} defaultMessage={fallback} />;
  const toOptions = (list) =>
    list.map((item) => ({
      value: item.value,
      text: item.label || t(item.msgId, item.fallback),
    }));

  useEffect(() => {
    if (!open) return;
    // Dialog destroyOnClose 默认 true,每次打开 Form 重新挂载;effect 跑时 ref 已就绪
    const form = formRef.current;
    if (!form) return;
    if (record) {
      form.setFieldsValue({
        name: record.name,
        code: record.code,
        type: record.type,
        site: record.site,
        firmware: record.firmware,
        policy: record.policy,
        enabled: record.status !== "disabled",
        remark: "",
      });
    } else {
      form.resetFields();
    }
  }, [open, record]);

  const handleSuccess = () => {
    toast.success(
      t(isEdit ? "modal.updated" : "modal.created", isEdit ? "设备配置已更新" : "设备配置已创建")
    );
    onCancel();
  };

  return (
    <Dialog
      className="config-modal"
      isOpen={open}
      onClose={onCancel}
      size={[560, "auto"]}
      style={{ maxHeight: "80vh" }}
      title={
        <span className="modal-title">
          <Icon name={isEdit ? "square-pen" : "plus"} size={16} />
          {label(isEdit ? "modal.titleEdit" : "modal.title", isEdit ? "编辑设备配置" : "新增设备配置")}
        </span>
      }
      buttons={[
        { text: t("modal.cancel", "取消"), onClick: onCancel },
        {
          text: t("modal.ok", "确定"),
          status: "primary",
          onClick: () => formRef.current && formRef.current.submit(),
        },
      ]}
    >
      <p className="modal-desc">
        {label("modal.desc", "填写设备基础信息并绑定采集策略，保存后立即纳管。")}
      </p>
      <Form
        ref={formRef}
        layout="vertical"
        validateErrorType="tip"
        initialValues={deviceFormInitialValues}
        onSuccess={handleSuccess}
        onFailed={() => {}}
      >
        <Form.Item name="name" label={label("modal.name", "设备名称")} rules={[{ required: true }]}>
          <TextField placeholder={t("modal.name.placeholder", "请输入设备名称")} />
        </Form.Item>
        <Form.Item name="code" label={label("modal.code", "设备编号")} rules={[{ required: true }]}>
          <TextField placeholder={t("modal.code.placeholder", "例如 GW-SH-0201")} />
        </Form.Item>
        <Form.Item name="type" label={label("modal.type", "设备类型")} rules={[{ required: true }]}>
          <Select options={toOptions(deviceTypeOptions)} />
        </Form.Item>
        <Form.Item name="site" label={label("modal.site", "所属站点")} rules={[{ required: true }]}>
          <Select options={toOptions(siteOptions)} />
        </Form.Item>
        <Form.Item name="firmware" label={label("modal.firmware", "固件版本")}>
          <Select options={firmwareOptions.map((o) => ({ value: o.value, text: o.label }))} />
        </Form.Item>
        <Form.Item name="policy" label={label("modal.policy", "采集策略模板")} rules={[{ required: true }]}>
          <Select options={toOptions(policyTemplates)} />
        </Form.Item>

        <Form.Item
          name="enabled"
          label={label("modal.enabled", "保存后立即启用")}
          labelTip={t("modal.enabled.desc", "启用后设备将按所选策略开始上报数据")}
          valuePropName="toggled"
          updateTrigger="onToggle"
        >
          <Toggle data={[false, true]} />
        </Form.Item>

        <Form.Item name="remark" label={label("modal.remark", "备注")}>
          <TextArea
            maxLength={200}
            placeholder={t("modal.remark.placeholder", "可选，记录设备位置或负责人信息")}
          />
        </Form.Item>
      </Form>
    </Dialog>
  );
}
