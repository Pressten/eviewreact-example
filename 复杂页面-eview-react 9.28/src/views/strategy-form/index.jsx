import { useRef, useState } from "react";
import { useIntl } from "react-intl";
import Form from "@nce/eview-react/Form";
import Button from "@nce/eview-react/Button";
import Switch from "@nce/eview-react/Switch";
import DivMessage from "@nce/eview-react/DivMessage";
import { Icon } from "../../shared/icon.jsx";
import StrategyFields, { StrategyAdvanced } from "../../components/strategy-fields/index.jsx";
import "./index.css";

// Layer 4: 策略参数表单卡片 — 开关打开后展开高级参数面板
// Form 模式转换（antd → eview-react）：
//   useForm() → useRef(null)；form.validateFields() Promise → ref.submit() → onSuccess(values) 回调
//   Form.useWatch("advanced") → onValuesChange + useState（eview-react 无 useWatch）
//   message.success() 命令式 → DivMessage 渲染式（notice state + key 重挂）
export default function StrategyForm({ onOpenModal }) {
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [advancedOn, setAdvancedOn] = useState(false);
  const [notice, setNotice] = useState(null);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  const handleSuccess = (values) => {
    if (submitting) return;
    setSubmitting(true);
    // 真实项目：await api.save(values)
    notify("success", t("toast.created"));
    setTimeout(() => setSubmitting(false), 600);
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
            status="text"
            leftIcon={<Icon name="external-link" size={14} />}
            onClick={onOpenModal}
            text={t("form.openModal")}
          />
        </div>
      </header>

      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={5000}
          onClose={() => setNotice(null)}
          style={{ marginBottom: 12 }}
        />
      ) : null}

      <Form
        ref={formRef}
        layout="vertical"
        itemCol={12}
        validateErrorType="tip"
        initialValues={{
          advanced: false,
          level: "warning",
          intervalSec: 60,
          flap: true,
          notify: ["inbox", "email"],
        }}
        onSuccess={handleSuccess}
        onFailed={() => {}}
        onValuesChange={(changed) => {
          if ("advanced" in changed) setAdvancedOn(!!changed.advanced);
        }}
      >
        <StrategyFields />

        <div className="switch-row strategy-form__toggle">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("form.advanced.toggle")}</span>
            <span className="switch-row__desc">{t("form.advanced.toggleDesc")}</span>
          </div>
          <Form.Item name="advanced" valuePropName="toggled" updateTrigger="onToggle" noStyle>
            <Switch data={[false, true]} />
          </Form.Item>
        </div>

        {advancedOn ? <StrategyAdvanced /> : null}

        {advancedOn ? (
          <p className="strategy-form__hint">
            <Icon name="info" size={12} />
            {t("form.hint")}
          </p>
        ) : null}

        <Form.Item col={24} colon={false}>
          <div className="strategy-form__footer">
            <Button
              leftIcon={<Icon name="undo-2" size={14} />}
              onClick={() => formRef.current?.resetFields()}
              text={t("form.reset")}
            />
            <div className="strategy-form__footer-main">
              <Button onClick={() => notify("success", t("toast.draft"))} text={t("form.saveDraft")} />
              <Button
                status="primary"
                disabled={submitting}
                leftIcon={<Icon name="save" size={14} />}
                onClick={() => formRef.current?.submit()}
                text={submitting ? t("form.submit") + "..." : t("form.submit")}
              />
            </div>
          </div>
        </Form.Item>
      </Form>
    </section>
  );
}
