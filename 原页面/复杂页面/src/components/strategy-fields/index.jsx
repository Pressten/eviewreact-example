import { Form, Input, InputNumber, Select, TimePicker, Checkbox, Switch } from "antd";
import { useIntl } from "react-intl";
import { Icon } from "../../../assets/shared/icons.js";
import { deviceTypeOptions, levelOptions, notifyOptions } from "../../mock/strategy.js";
import "./index.css";

// Layer 3: 策略参数字段组 — 表单卡片与弹窗共用同一套字段，保证两处填写体验一致
// StrategyFields：基础参数（默认导出）；StrategyAdvanced：高级参数面板（开关打开后渲染）

function toOptions(list, t) {
  return list.map((item) => ({ value: item.value, label: t(item.labelId) }));
}

export default function StrategyFields() {
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  return (
    <div className="strategy-fields">
      <div className="strategy-fields__group">
        <span className="strategy-fields__group-title">{t("form.basicTitle")}</span>
        <span className="strategy-fields__group-line" />
      </div>

      <div className="strategy-fields__grid">
        <Form.Item
          label={t("form.name")}
          name="name"
          rules={[{ required: true, message: t("form.name.required") }]}
        >
          <Input placeholder={t("form.name.ph")} allowClear maxLength={40} />
        </Form.Item>

        <Form.Item
          label={t("form.deviceType")}
          name="deviceType"
          rules={[{ required: true, message: t("form.deviceType.required") }]}
        >
          <Select
            placeholder={t("form.deviceType.ph")}
            options={toOptions(deviceTypeOptions, t)}
          />
        </Form.Item>

        <Form.Item
          label={t("form.interval")}
          name="intervalSec"
          rules={[{ required: true, message: t("form.interval.required") }]}
        >
          <InputNumber
            min={5}
            max={86400}
            step={5}
            style={{ width: "100%" }}
            addonAfter={t("form.interval.unit")}
          />
        </Form.Item>

        <Form.Item label={t("form.level")} name="level">
          <Select options={toOptions(levelOptions, t)} />
        </Form.Item>

        <Form.Item label={t("form.timeRange")} name="timeRange">
          <TimePicker.RangePicker
            style={{ width: "100%" }}
            format="HH:mm"
            minuteStep={15}
            placeholder={["00:00", "23:59"]}
          />
        </Form.Item>

        <Form.Item label={t("form.desc2")} name="desc" className="strategy-fields__full">
          <Input.TextArea rows={3} maxLength={200} showCount placeholder={t("form.desc2.ph")} />
        </Form.Item>
      </div>
    </div>
  );
}

export function StrategyAdvanced() {
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  return (
    <div className="strategy-fields__advanced">
      <div className="strategy-fields__group">
        <span className="strategy-fields__group-title">{t("form.advancedTitle")}</span>
        <span className="strategy-fields__group-line" />
        <span className="strategy-fields__group-chip">
          <Icon name="sliders-horizontal" size={12} />
          {intl.formatMessage({ id: "form.advancedBadge" }, { count: 6 })}
        </span>
      </div>

      <div className="strategy-fields__grid">
        <Form.Item label={t("form.threshold")} name="threshold">
          <InputNumber
            min={0}
            max={100}
            style={{ width: "100%" }}
            addonAfter={t("form.threshold.unit")}
          />
        </Form.Item>

        <Form.Item label={t("form.retry")} name="retry">
          <InputNumber
            min={1}
            max={10}
            style={{ width: "100%" }}
            addonAfter={t("form.retry.unit")}
          />
        </Form.Item>

        <div className="switch-row switch-row--inset">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("form.flap")}</span>
            <span className="switch-row__desc">{t("form.flapDesc")}</span>
          </div>
          <Form.Item name="flap" valuePropName="checked" noStyle>
            <Switch />
          </Form.Item>
        </div>

        <Form.Item label={t("form.silent")} name="silent">
          <TimePicker.RangePicker
            style={{ width: "100%" }}
            format="HH:mm"
            minuteStep={30}
            placeholder={["22:00", "06:00"]}
          />
        </Form.Item>

        <Form.Item label={t("form.notify")} name="notify" className="strategy-fields__full">
          <Checkbox.Group
            options={toOptions(notifyOptions, t)}
            className="strategy-fields__checks"
          />
        </Form.Item>

        <Form.Item label={t("form.memo")} name="memo" className="strategy-fields__full">
          <Input.TextArea rows={2} maxLength={120} placeholder={t("form.memo.ph")} />
        </Form.Item>
      </div>
    </div>
  );
}
