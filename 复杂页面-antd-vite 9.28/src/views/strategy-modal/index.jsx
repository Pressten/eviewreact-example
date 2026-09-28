import { useEffect, useRef, useState } from "react";
import Dialog from "@nce/eview-react/Dialog";
import Switch from "@nce/eview-react/Switch";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import StrategyFields from "../../components/strategy-fields/index.jsx";
import "./index.css";

// Layer 4: 策略弹窗表单 — 页面头/表格行均可唤起，复用同一套参数字段
// 不用 eview-react Form 组件：每字段 useState + 每控件 useRef，Dialog buttons 触发校验循环。

const EMPTY = {
  name: "",
  deviceType: null,
  intervalSec: 60,
  level: "warning",
  timeRange: null,
  desc: "",
  enableNow: true,
};

export default function StrategyModal({ open, record, onClose, onNotify }) {
  const [form, setForm] = useState(EMPTY);
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const nameRef = useRef(null);
  const deviceTypeRef = useRef(null);
  const intervalSecRef = useRef(null);

  // 打开时回填（编辑）或重置（新建）
  useEffect(() => {
    if (!open) return;
    if (record) {
      setForm({
        ...EMPTY,
        name: record.name ?? "",
        deviceType: record.deviceType ?? null,
        intervalSec: record.intervalSec ?? 60,
        level: record.level ?? "warning",
        enableNow: record.status === "enabled",
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, record]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = (asDraft) => {
    if (!asDraft) {
      const refs = [nameRef, deviceTypeRef, intervalSecRef];
      const firstBad = refs.find((r) => !r.current?.validate());
      if (firstBad) {
        firstBad.current?.focus();
        return;
      }
    }
    onNotify?.(
      "success",
      asDraft ? t("toast.draft") : record ? t("toast.updated") : t("toast.created")
    );
    onClose?.();
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-inset)",
          padding: "0 var(--spacing-inset) var(--spacing-inset)",
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

        <div className="switch-row">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("modal.enableNow")}</span>
            <span className="switch-row__desc">{t("modal.enableNowDesc")}</span>
          </div>
          <Switch
            data={[false, true]}
            toggled={form.enableNow === true}
            onToggle={(value) => setField("enableNow", value)}
          />
        </div>

        <p className="strategy-modal__status">
          <Icon name={form.enableNow ? "circle-check" : "pencil-line"} size={12} />
          {form.enableNow ? t("opt.status.enabled") : t("opt.status.draft")}
        </p>
      </div>
    </Dialog>
  );
}
