import { useState } from "react";
import { Button, Form, Switch, message } from "antd";
import { useIntl } from "react-intl";
import { Icon } from "../../../assets/shared/icons.js";
import StrategyFields, { StrategyAdvanced } from "../../components/strategy-fields/index.jsx";
import "./index.css";

// Layer 4: 策略参数表单卡片 — 开关打开后展开高级参数面板
export default function StrategyForm({ onOpenModal }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  // 表单内字段即开关状态：打开后展开更详细的填写项
  const advancedOn = Form.useWatch("advanced", form) === true;

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setSubmitting(true);
      message.success(t("toast.created"));
      setTimeout(() => setSubmitting(false), 600);
    } catch (err) {
      // 校验失败时由 Form.Item 就地提示
    }
  };

  return (
    <section className="panel-card strategy-form">
      <header className="panel-card__head">
        <div className="panel-card__titles">
          <h2 className="panel-card__title">
            <Icon name="sliders-horizontal" size={16} />
            {t("form.title")}
          </h2>
          <p className="panel-card__desc">{t("form.desc")}</p>
        </div>
        <div className="panel-card__actions">
          <span className="strategy-form__draft">
            <Icon name="pencil-line" size={12} />
            {t("form.draftTag")}
          </span>
          <Button
            type="link"
            icon={<Icon name="external-link" size={14} />}
            onClick={onOpenModal}
          >
            {t("form.openModal")}
          </Button>
        </div>
      </header>

      <Form
        form={form}
        layout="vertical"
        requiredMark
        initialValues={{
          advanced: false,
          level: "warning",
          intervalSec: 60,
          flap: true,
          notify: ["inbox", "email"],
        }}
      >
        <StrategyFields />

        <div className="switch-row strategy-form__toggle">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("form.advanced.toggle")}</span>
            <span className="switch-row__desc">{t("form.advanced.toggleDesc")}</span>
          </div>
          <Form.Item name="advanced" valuePropName="checked" noStyle>
            <Switch />
          </Form.Item>
        </div>

        {advancedOn ? <StrategyAdvanced /> : null}

        {advancedOn ? (
          <p className="strategy-form__hint">
            <Icon name="info" size={12} />
            {t("form.hint")}
          </p>
        ) : null}

        <div className="strategy-form__footer">
          <Button
            icon={<Icon name="undo-2" size={14} />}
            onClick={() => {
              form.resetFields();
            }}
          >
            {t("form.reset")}
          </Button>
          <div className="strategy-form__footer-main">
            <Button onClick={() => message.success(t("toast.draft"))}>
              {t("form.saveDraft")}
            </Button>
            <Button
              type="primary"
              loading={submitting}
              icon={<Icon name="save" size={14} />}
              onClick={handleSubmit}
            >
              {t("form.submit")}
            </Button>
          </div>
        </div>
      </Form>
    </section>
  );
}
