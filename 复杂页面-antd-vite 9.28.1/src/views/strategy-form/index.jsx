import { useState, useRef } from "react";
import Button from "@nce/eview-react/Button";
import Form from "@nce/eview-react/Form";
import Toggle from "@nce/eview-react/Toggle";
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

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

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
      >
        <StrategyFields />

        <div className="switch-row strategy-form__toggle">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("form.advanced.toggle")}</span>
            <span className="switch-row__desc">{t("form.advanced.toggleDesc")}</span>
          </div>
          <Toggle data={[false, true]} toggled={advancedOn} onToggle={(v) => setAdvancedOn(v)} />
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
            onClick={() => {
              formRef.current?.resetFields();
              setAdvancedOn(false);
            }}
          />
          <div className="strategy-form__footer-main">
            <Button text={t("form.saveDraft")} onClick={() => notify("success", t("toast.draft"))} />
            <Button
              status="primary"
              disabled={submitting}
              leftIcon={<Icon name="save" size={14} />}
              text={submitting ? t("form.submit") + "..." : t("form.submit")}
              onClick={() => formRef.current?.submit()}
            />
          </div>
        </div>
      </Form>
    </section>
  );
}
