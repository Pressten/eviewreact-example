import { useState, useRef } from "react";
import Form from "@nce/eview-react/Form";
import Button from "@nce/eview-react/Button";
import Switch from "@nce/eview-react/Switch";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { useToast } from "../../components/toast.jsx";
import StrategyFields, { StrategyAdvanced } from "../../components/strategy-fields/index.jsx";
import "./index.css";

// Layer 4: 策略参数表单卡片 — 开关打开后展开高级参数面板
export default function StrategyForm({ onOpenModal }) {
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [advancedOn, setAdvancedOn] = useState(false);
  const { notify } = useToast();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const handleSuccess = () => {
    setSubmitting(true);
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
            text={t("form.openModal")}
            onClick={onOpenModal}
          />
        </div>
      </header>

      <Form
        ref={formRef}
        layout="vertical"
        itemCol={12}
        validateErrorType="tip"
        initialValues={{
          level: "warning",
          intervalSec: 60,
          flap: true,
          notify: ["inbox", "email"],
        }}
        onSuccess={handleSuccess}
        onFailed={() => {}}
      >
        <StrategyFields />

        <div className="switch-row strategy-form__toggle">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("form.advanced.toggle")}</span>
            <span className="switch-row__desc">{t("form.advanced.toggleDesc")}</span>
          </div>
          <Switch
            data={[false, true]}
            toggled={advancedOn}
            onToggle={(value) => setAdvancedOn(value)}
          />
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
            leftIcon={<Icon name="undo-2" size={14} />}
            text={t("form.reset")}
            onClick={() => formRef.current?.resetFields()}
          />
          <div className="strategy-form__footer-main">
            <Button
              text={t("form.saveDraft")}
              onClick={() => notify("success", t("toast.draft"))}
            />
            <Button
              status="primary"
              leftIcon={<Icon name="save" size={14} />}
              text={submitting ? "..." : t("form.submit")}
              disabled={submitting}
              onClick={() => formRef.current?.submit()}
            />
          </div>
        </div>
      </Form>
    </section>
  );
}
