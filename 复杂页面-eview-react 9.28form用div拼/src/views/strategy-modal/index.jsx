import { useState, useRef, useEffect } from "react";
import Dialog from "@nce/eview-react/Dialog";
import Switch from "@nce/eview-react/Switch";
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import StrategyFields from "../../components/strategy-fields/index.jsx";
import "./index.css";

export default function StrategyModal({ open, record, onClose }) {
  const [enableNow, setEnableNow] = useState(true);
  const [notice, setNotice] = useState(null);
  const basicRef = useRef(null);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  useEffect(() => {
    if (!open) return;
    setNotice(null);
    if (record) {
      setEnableNow(record.status === "enabled");
      // 表单回填：等下一帧 ref 挂上后调用
      const id = setTimeout(() => basicRef.current?.setValues(record), 50);
      return () => clearTimeout(id);
    } else {
      setEnableNow(true);
      basicRef.current?.reset();
    }
  }, [open, record]);

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  const submit = (asDraft) => {
    if (!asDraft) {
      const basic = basicRef.current?.submit();
      if (!basic) return;
    }
    notify(
      "success",
      asDraft ? t("toast.draft") : record ? t("toast.updated") : t("toast.created")
    );
    setTimeout(onClose, 300);
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
        { text: t("modal.draft"), onClick: () => submit(true) },
        { text: t("modal.ok"), status: "primary", onClick: () => submit(false) },
      ]}
    >
      <p className="strategy-modal__desc">{t("modal.desc")}</p>

      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={3000}
          onClose={() => setNotice(null)}
          style={{ marginBottom: 12 }}
        />
      ) : null}

      <StrategyFields ref={basicRef} />

      <div className="switch-row">
        <div className="switch-row__text">
          <span className="switch-row__label">{t("modal.enableNow")}</span>
          <span className="switch-row__desc">{t("modal.enableNowDesc")}</span>
        </div>
        <Switch
          data={[false, true]}
          toggled={enableNow}
          onToggle={(v) => setEnableNow(v)}
        />
      </div>

      <p className="strategy-modal__status">
        <Icon name={enableNow ? "circle-check" : "pencil-line"} size={12} />
        {enableNow ? t("opt.status.enabled") : t("opt.status.draft")}
      </p>
    </Dialog>
  );
}
