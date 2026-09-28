import { useRef, useState } from "react";
import Button from "@nce/eview-react/Button";
import Switch from "@nce/eview-react/Switch";
import DivMessage from "@nce/eview-react/DivMessage";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import StrategyFields, { StrategyAdvanced } from "../../components/strategy-fields/index.jsx";
import "./index.css";

// Layer 4: 策略参数表单卡片 — 开关打开后展开高级参数面板
// 不用 eview-react Form 组件：每字段 useState + 每控件 useRef，提交前用
// refs.find(r => !r.current.validate()) 循环校验，首个失败项 ref.current.focus()。

const INITIAL = {
  name: "",
  deviceType: null,
  intervalSec: 60,
  level: "warning",
  timeRange: null,
  desc: "",
  advanced: false,
  threshold: 90,
  retry: 3,
  flap: true,
  silent: null,
  notify: ["inbox", "email"],
  memo: "",
};

export default function StrategyForm({ onOpenModal }) {
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const nameRef = useRef(null);
  const deviceTypeRef = useRef(null);
  const intervalSecRef = useRef(null);

  const notifyMsg = (type, text) => setNotice({ key: Date.now(), type, text });

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    const refs = [nameRef, deviceTypeRef, intervalSecRef];
    const firstBad = refs.find((r) => !r.current?.validate());
    if (firstBad) {
      firstBad.current?.focus();
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      notifyMsg("success", t("toast.created"));
    }, 600);
  };

  const handleReset = () => {
    setForm(INITIAL);
    nameRef.current?.clear?.();
    deviceTypeRef.current?.clear?.();
    notifyMsg(null);
  };

  const handleSaveDraft = () => {
    notifyMsg("success", t("toast.draft"));
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
          style={{ marginBottom: "var(--spacing-4)" }}
        />
      ) : null}

      <div
        className="strategy-form__body"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-inset)",
        }}
      >
        <StrategyFields
          values={form}
          setters={{
            setName: (v) => setField("name", v),
            setDeviceType: (v) => setField("deviceType", v),
            setIntervalSec: (v) => setField("intervalSec", v),
            setLevel: (v) => setField("level", v),
            setTimeRange: (v) => setField("timeRange", v),
            setDesc: (v) => setField("desc", v),
          }}
          refs={{ nameRef, deviceTypeRef, intervalSecRef }}
        />

        <div className="switch-row strategy-form__toggle">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("form.advanced.toggle")}</span>
            <span className="switch-row__desc">{t("form.advanced.toggleDesc")}</span>
          </div>
          <Switch
            data={[false, true]}
            toggled={form.advanced === true}
            onToggle={(value) => setField("advanced", value)}
          />
        </div>

        {form.advanced ? (
          <StrategyAdvanced
            values={form}
            setters={{
              setThreshold: (v) => setField("threshold", v),
              setRetry: (v) => setField("retry", v),
              setFlap: (v) => setField("flap", v),
              setSilent: (v) => setField("silent", v),
              setNotify: (v) => setField("notify", v),
              setMemo: (v) => setField("memo", v),
            }}
          />
        ) : null}

        {form.advanced ? (
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
            <Button text={t("form.saveDraft")} onClick={handleSaveDraft} />
            <Button
              status="primary"
              text={submitting ? `${t("form.submit")}...` : t("form.submit")}
              disabled={submitting}
              leftIcon={<Icon name="save" size={14} />}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
