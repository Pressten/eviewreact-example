import { useEffect, useState, useRef } from "react";
import Dialog from "@nce/eview-react/Dialog";
import Form from "@nce/eview-react/Form";
import Toggle from "@nce/eview-react/Toggle";
import DivMessage from "@nce/eview-react/DivMessage";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import StrategyFields from "../../components/strategy-fields/index.jsx";
import "./index.css";

export default function StrategyModal({ open, record, onClose }) {
  const formRef = useRef(null);
  const [enableNow, setEnableNow] = useState(true);
  const [notice, setNotice] = useState(null);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      if (record) {
        formRef.current?.setFieldsValue({
          name: record.name,
          deviceType: record.deviceType,
          intervalSec: record.intervalSec,
          level: record.level,
        });
        setEnableNow(record.status === "enabled");
      } else {
        formRef.current?.resetFields();
        setEnableNow(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [open, record]);

  const handleSuccess = () => {
    notify("success", record ? t("toast.updated") : t("toast.created"));
    setTimeout(() => onClose(), 500);
  };

  const handleDraft = () => {
    notify("success", t("toast.draft"));
    setTimeout(() => onClose(), 500);
  };

  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      size={[680, "auto"]}
      style={{ maxHeight: "80vh" }}
      title={
        <span className="strategy-modal__title">
          <Icon name="circle-plus" size={16} />
          {record ? t("modal.title.edit") : t("modal.title.new")}
        </span>
      }
      buttons={[
        { text: t("modal.cancel"), onClick: onClose },
        { text: t("modal.draft"), onClick: handleDraft },
        { text: t("modal.ok"), status: "primary", onClick: () => formRef.current?.submit() },
      ]}
    >
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={4000}
          onClose={() => setNotice(null)}
          style={{ marginBottom: 12 }}
        />
      ) : null}

      <p className="strategy-modal__desc">{t("modal.desc")}</p>

      <Form
        ref={formRef}
        layout="vertical"
        itemCol={12}
        validateErrorType="tip"
        initialValues={{ level: "warning", intervalSec: 60, flap: true }}
        onSuccess={handleSuccess}
        onFailed={() => {}}
      >
        <StrategyFields />

        <div className="switch-row">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("modal.enableNow")}</span>
            <span className="switch-row__desc">{t("modal.enableNowDesc")}</span>
          </div>
          <Toggle data={[false, true]} toggled={enableNow} onToggle={(v) => setEnableNow(v)} />
        </div>

        <p className="strategy-modal__status">
          <Icon name={enableNow ? "circle-check" : "pencil-line"} size={12} />
          {enableNow ? t("opt.status.enabled") : t("opt.status.draft")}
        </p>
      </Form>
    </Dialog>
  );
}
