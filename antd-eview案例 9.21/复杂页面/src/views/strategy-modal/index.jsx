import { useEffect, useRef, useState } from "react";
import Dialog from "@nce/eview-react/Dialog";
import Form from "@nce/eview-react/Form";
import Toggle from "@nce/eview-react/Toggle";
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import { useIntl } from "react-intl";
import { Icon } from "../../../assets/shared/icons.js";
import StrategyFields from "../../components/strategy-fields/index.jsx";
import "./index.css";

// Layer 4: 策略弹窗表单 — 页面头/表格行均可唤起，复用同一套参数字段
// Modal → Dialog (open→isOpen / footer→buttons / onClose 不自动关)
// Form: useForm → useRef / 校验 → ref.submit() + onSuccess 回调
// 命令式 toast → 渲染 <DivMessage>
export default function StrategyModal({ open, record, onClose }) {
  const formRef = useRef(null);
  const [enableNow, setEnableNow] = useState(true);
  const [toast, setToast] = useState(null);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const showToast = (msg) => setToast({ key: Date.now(), msg });

  useEffect(() => {
    if (!open) return;
    if (record) {
      setEnableNow(record.status === "enabled");
      formRef.current?.setFieldsValue({
        name: record.name,
        deviceType: record.deviceType,
        intervalSec: record.intervalSec,
        level: record.level,
      });
    } else {
      setEnableNow(true);
      formRef.current?.resetFields();
    }
  }, [open, record]);

  // 校验通过走 onSuccess 回调（替代 Promise 链）
  const handleSuccess = (values) => {
    showToast(record ? t("toast.updated") : t("toast.created"));
    onClose();
  };

  // 草稿按钮跳过校验，直接提示并关闭
  const handleDraft = () => {
    showToast(t("toast.draft"));
    onClose();
  };

  return (
    <>
      <Dialog
        isOpen={open}
        onClose={onClose}
        title={
          <span className="strategy-modal__title">
            <Icon name="circle-plus" size={16} />
            {record ? t("modal.title.edit") : t("modal.title.new")}
          </span>
        }
        buttons={[
          { text: t("modal.cancel"), onClick: () => onClose() },
          { text: t("modal.draft"), onClick: handleDraft },
          { text: t("modal.ok"), status: "primary", onClick: () => formRef.current?.submit() },
        ]}
      >
        <p className="strategy-modal__desc">{t("modal.desc")}</p>

        <Form
          ref={formRef}
          layout="vertical"
          validateErrorType="tip"
          onSuccess={handleSuccess}
          onFailed={() => { /* 校验失败由 Form.Item 就地提示 */ }}
          initialValues={{ level: "warning", intervalSec: 60, flap: true }}
        >
          <StrategyFields advanced={false} />

          <div className="switch-row">
            <div className="switch-row__text">
              <span className="switch-row__label">{t("modal.enableNow")}</span>
              <span className="switch-row__desc">{t("modal.enableNowDesc")}</span>
            </div>
            <Toggle toggled={enableNow} onToggle={(v) => setEnableNow(v)} />
          </div>

          <p className="strategy-modal__status">
            <Icon name={enableNow ? "circle-check" : "pencil-line"} size={12} />
            {enableNow ? t("opt.status.enabled") : t("opt.status.draft")}
          </p>
        </Form>
      </Dialog>

      {toast ? (
        <DivMessage key={toast.key} display type="success">
          {toast.msg}
        </DivMessage>
      ) : null}
    </>
  );
}
