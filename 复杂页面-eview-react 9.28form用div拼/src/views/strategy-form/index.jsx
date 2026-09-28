import { useState, useRef } from "react";
import Button from "@nce/eview-react/Button";
import Switch from "@nce/eview-react/Switch";
import DivMessage from "@nce/eview-react/DivMessage";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import StrategyFields, { StrategyAdvanced } from "../../components/strategy-fields/index.jsx";
import "./index.css";

export default function StrategyForm({ onOpenModal }) {
  const [submitting, setSubmitting] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [notice, setNotice] = useState(null);
  const basicRef = useRef(null);
  const advancedRef = useRef(null);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  const handleSubmit = async () => {
    if (submitting) return;
    const basic = basicRef.current?.submit();
    if (!basic) return;
    let values = basic;
    if (advanced) {
      const adv = advancedRef.current?.submit();
      if (adv) values = { ...values, ...adv };
    }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      notify("success", t("toast.created"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    basicRef.current?.reset();
    advancedRef.current?.reset();
    setAdvanced(false);
    setNotice(null);
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
          enableDisposeTimeOut={notice.type !== "error"}
          onClose={() => setNotice(null)}
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <StrategyFields ref={basicRef} />

      <div className="switch-row strategy-form__toggle">
        <div className="switch-row__text">
          <span className="switch-row__label">{t("form.advanced.toggle")}</span>
          <span className="switch-row__desc">{t("form.advanced.toggleDesc")}</span>
        </div>
        <Switch
          data={[false, true]}
          toggled={advanced}
          onToggle={(v) => setAdvanced(v)}
        />
      </div>

      {advanced ? <StrategyAdvanced ref={advancedRef} /> : null}

      {advanced ? (
        <p className="strategy-form__hint">
          <Icon name="info" size={12} />
          {t("form.hint")}
        </p>
      ) : null}

      <div className="strategy-form__footer">
        <Button
          text={t("form.reset")}
          leftIcon={<Icon name="undo-2" size={14} />}
          onClick={handleReset}
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
            onClick={handleSubmit}
          />
        </div>
      </div>
    </section>
  );
}
