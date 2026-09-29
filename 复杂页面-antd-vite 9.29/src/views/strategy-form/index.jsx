import { useState, useRef } from "react";
import Form from "@nce/eview-react/Form";
import Switch from "@nce/eview-react/Switch";
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import StrategyFields, { StrategyAdvanced } from "../../components/strategy-fields/index.jsx";
import "./index.css";

export default function StrategyForm({ onOpenModal }) {
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [advancedOn, setAdvancedOn] = useState(false);
  const [notice, setNotice] = useState(null);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const handleSuccess = (values) => {
    if (submitting) return;
    setSubmitting(true);
    setNotice({ type: "success", text: t("toast.created"), key: Date.now() });
    setTimeout(() => setSubmitting(false), 600);
  };

  const notify = (type, text) => {
    setNotice({ type, text, key: Date.now() });
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
            text={t("form.openModal")}
            leftIcon={<Icon name="external-link" size={14} />}
            onClick={onOpenModal}
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
        />
      ) : null}

      <Form
        ref={formRef}
        layout="vertical"
        validateErrorType="tip"
        onSuccess={handleSuccess}
        onFailed={() => {}}
        initialValues={{
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
          <Switch
            data={[false, true]}
            toggled={advancedOn}
            onToggle={(v) => setAdvancedOn(v)}
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
            text={t("form.reset")}
            leftIcon={<Icon name="undo-2" size={14} />}
            onClick={() => formRef.current?.resetFields()}
          />
          <div className="strategy-form__footer-main">
            <Button
              text={t("form.saveDraft")}
              onClick={() => notify("success", t("toast.draft"))}
            />
            <Button
              status="primary"
              text={submitting ? t("form.submit") + "..." : t("form.submit")}
              disabled={submitting}
              leftIcon={<Icon name="save" size={14} />}
              onClick={() => formRef.current?.submit()}
            />
          </div>
        </div>
      </Form>
    </section>
  );
}
