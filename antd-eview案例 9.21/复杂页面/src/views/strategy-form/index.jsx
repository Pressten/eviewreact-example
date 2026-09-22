import { useRef, useState } from "react";
import Button from "@nce/eview-react/Button";
import Form from "@nce/eview-react/Form";
import Toggle from "@nce/eview-react/Toggle";
import DivMessage from "@nce/eview-react/DivMessage";
import { useIntl } from "react-intl";
import { Icon } from "../../../assets/shared/icons.js";
import StrategyFields, { StrategyAdvanced } from "../../components/strategy-fields/index.jsx";
import "./index.css";

// Layer 4: 策略参数表单卡片 — 开关打开后展开高级参数面板
// Form 模式：useRef + ref.submit() → onSuccess 回调（非 useForm Promise 链）
// 命令式 toast → 渲染 <DivMessage display type="success">
export default function StrategyForm({ onOpenModal }) {
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [advancedOn, setAdvancedOn] = useState(false);
  const [toast, setToast] = useState(null);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const showToast = (msg) => setToast({ key: Date.now(), msg });

  // 校验通过走 onSuccess 回调（替代 Promise 链）
  const handleSuccess = (values) => {
    setSubmitting(true);
    showToast(t("toast.created"));
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
          >
            {t("form.openModal")}
          </Button>
        </div>
      </header>

      <Form
        ref={formRef}
        layout="vertical"
        validateErrorType="tip"
        onSuccess={handleSuccess}
        onFailed={() => { /* 校验失败由 Form.Item 就地提示 */ }}
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
          <Toggle toggled={advancedOn} onToggle={(v) => setAdvancedOn(v)} />
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
            onClick={() => formRef.current.resetFields()}
          >
            {t("form.reset")}
          </Button>
          <div className="strategy-form__footer-main">
            <Button onClick={() => showToast(t("toast.draft"))}>
              {t("form.saveDraft")}
            </Button>
            <Button
              status="primary"
              disabled={submitting}
              leftIcon={<Icon name="save" size={14} />}
              onClick={() => formRef.current.submit()}
            >
              {submitting ? t("form.submit") + "..." : t("form.submit")}
            </Button>
          </div>
        </div>
      </Form>

      {toast ? (
        <DivMessage key={toast.key} display type="success">
          {toast.msg}
        </DivMessage>
      ) : null}
    </section>
  );
}
