import { useEffect } from "react";
import { Modal, Form, Switch, Button, message } from "antd";
import { useIntl } from "react-intl";
import { Icon } from "../../../assets/shared/icons.js";
import StrategyFields from "../../components/strategy-fields/index.jsx";
import "./index.css";

// Layer 4: 策略弹窗表单 — 页面头/表格行均可唤起，复用同一套参数字段
export default function StrategyModal({ open, record, onClose }) {
  const [form] = Form.useForm();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const enableNow = Form.useWatch("enableNow", form) !== false;

  useEffect(() => {
    if (!open) return;
    if (record) {
      form.setFieldsValue({
        name: record.name,
        deviceType: record.deviceType,
        intervalSec: record.intervalSec,
        level: record.level,
        enableNow: record.status === "enabled",
      });
    } else {
      form.resetFields();
    }
  }, [open, record]);

  const submit = async (asDraft) => {
    if (!asDraft) {
      try {
        await form.validateFields();
      } catch (err) {
        return;
      }
    }
    message.success(
      asDraft ? t("toast.draft") : record ? t("toast.updated") : t("toast.created")
    );
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={680}
      title={
        <span className="strategy-modal__title">
          <Icon name="circle-plus" size={16} />
          {record ? t("modal.title.edit") : t("modal.title.new")}
        </span>
      }
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t("modal.cancel")}
        </Button>,
        <Button key="draft" onClick={() => submit(true)}>
          {t("modal.draft")}
        </Button>,
        <Button key="ok" type="primary" onClick={() => submit(false)}>
          {t("modal.ok")}
        </Button>,
      ]}
    >
      <p className="strategy-modal__desc">{t("modal.desc")}</p>

      <Form
        form={form}
        layout="vertical"
        requiredMark
        initialValues={{ enableNow: true, level: "warning", intervalSec: 60, flap: true }}
      >
        <StrategyFields advanced={false} />

        <div className="switch-row">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("modal.enableNow")}</span>
            <span className="switch-row__desc">{t("modal.enableNowDesc")}</span>
          </div>
          <Form.Item name="enableNow" valuePropName="checked" noStyle>
            <Switch />
          </Form.Item>
        </div>

        <p className="strategy-modal__status">
          <Icon name={enableNow ? "circle-check" : "pencil-line"} size={12} />
          {enableNow ? t("opt.status.enabled") : t("opt.status.draft")}
        </p>
      </Form>
    </Modal>
  );
}
