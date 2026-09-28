import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import Dialog from "@nce/eview-react/Dialog";
import Form from "@nce/eview-react/Form";
import Switch from "@nce/eview-react/Switch";
import DivMessage from "@nce/eview-react/DivMessage";
import { Icon } from "../../shared/icon.jsx";
import StrategyFields from "../../components/strategy-fields/index.jsx";
import "./index.css";

// Layer 4: 策略弹窗表单 — 页面头/表格行均可唤起，复用同一套参数字段
// Modal → Dialog：open→isOpen；footer→buttons 数组；onCancel→onClose（不会自动关，需 setIsOpen(false)）
// Form → ref + onSuccess；Form.useWatch → onValuesChange + useState
// message.success → DivMessage
export default function StrategyModal({ open, record, onClose }) {
  const formRef = useRef(null);
  const [enableNow, setEnableNow] = useState(true);
  const [notice, setNotice] = useState(null);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  useEffect(() => {
    if (!open) return;
    setEnableNow(record ? record.status === "enabled" : true);
    setNotice(null);
    if (record) {
      // 异步回填用 setFieldsValue（initialValues 只在初始化生效）
      setTimeout(() => {
        formRef.current?.setFieldsValue({
          name: record.name,
          deviceType: record.deviceType,
          intervalSec: record.intervalSec,
          level: record.level,
          enableNow: record.status === "enabled",
        });
      }, 0);
    } else {
      formRef.current?.resetFields();
    }
  }, [open, record]);

  const submit = (asDraft) => {
    if (asDraft) {
      notify("success", asDraft ? t("toast.draft") : record ? t("toast.updated") : t("toast.created"));
      onClose();
    } else {
      formRef.current?.submit();
    }
  };

  const handleSuccess = (values) => {
    notify(
      "success",
      record ? t("toast.updated") : t("toast.created")
    );
    onClose();
  };

  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      size={[680, "auto"]}
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

      <Form
        ref={formRef}
        layout="vertical"
        itemCol={12}
        validateErrorType="tip"
        initialValues={{ enableNow: true, level: "warning", intervalSec: 60, flap: true }}
        onSuccess={handleSuccess}
        onFailed={() => {}}
        onValuesChange={(changed) => {
          if ("enableNow" in changed) setEnableNow(!!changed.enableNow);
        }}
      >
        <StrategyFields />

        <div className="switch-row">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("modal.enableNow")}</span>
            <span className="switch-row__desc">{t("modal.enableNowDesc")}</span>
          </div>
          <Form.Item name="enableNow" valuePropName="toggled" updateTrigger="onToggle" noStyle>
            <Switch data={[false, true]} />
          </Form.Item>
        </div>

        <p className="strategy-modal__status">
          <Icon name={enableNow ? "circle-check" : "pencil-line"} size={12} />
          {enableNow ? t("opt.status.enabled") : t("opt.status.draft")}
        </p>
      </Form>
    </Dialog>
  );
}
