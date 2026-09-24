import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Spinner from "@nce/eview-react/Spinner";
import Select from "@nce/eview-react/Select";
import DatePicker from "@nce/eview-react/DatePicker";
import CheckboxGroup from "@nce/eview-react/CheckboxGroup";
import Switch from "@nce/eview-react/Switch";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { deviceTypeOptions, levelOptions, notifyOptions } from "../../mock/strategy.js";
import "./index.css";

// Layer 3: 策略参数字段组 — 表单卡片与弹窗共用同一套字段
// Form.Item 作为 Fragment 直接子级展开（Form 内不允许 div 包裹做栅格），多列靠父 Form itemCol + Form.Item.col

function toOptions(list, t) {
  return list.map((item) => ({ value: item.value, text: t(item.labelId) }));
}

export default function StrategyFields() {
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  return (
    <>
      <div className="strategy-fields__group">
        <span className="strategy-fields__group-title">{t("form.basicTitle")}</span>
        <span className="strategy-fields__group-line" />
      </div>

      <Form.Item
        label={t("form.name")}
        name="name"
        rules={[{ required: true }]}
        col={24}
      >
        <TextField placeholder={t("form.name.ph")} maxLength={40} />
      </Form.Item>

      <Form.Item
        label={t("form.deviceType")}
        name="deviceType"
        rules={[{ required: true }]}
      >
        <Select
          defaultLabel={t("form.deviceType.ph")}
          options={toOptions(deviceTypeOptions, t)}
          enableClear
        />
      </Form.Item>

      <Form.Item
        label={`${t("form.interval")}（${t("form.interval.unit")}）`}
        name="intervalSec"
        rules={[{ required: true }]}
      >
        <Spinner min={5} max={86400} step={5} />
      </Form.Item>

      <Form.Item label={t("form.level")} name="level">
        <Select options={toOptions(levelOptions, t)} />
      </Form.Item>

      <Form.Item label={t("form.timeRange")} name="timeRange" col={24}>
        <DatePicker range={[]} format="HH:mm" />
      </Form.Item>

      <Form.Item label={t("form.desc2")} name="desc" col={24}>
        <TextArea rows={3} maxLength={200} placeholder={t("form.desc2.ph")} />
      </Form.Item>
    </>
  );
}

export function StrategyAdvanced() {
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  return (
    <>
      <div className="strategy-fields__group">
        <span className="strategy-fields__group-title">{t("form.advancedTitle")}</span>
        <span className="strategy-fields__group-line" />
        <span className="strategy-fields__group-chip">
          <Icon name="sliders-horizontal" size={12} />
          {intl.formatMessage({ id: "form.advancedBadge" }, { count: 6 })}
        </span>
      </div>

      <Form.Item label={`${t("form.threshold")}（${t("form.threshold.unit")}）`} name="threshold">
        <Spinner min={0} max={100} />
      </Form.Item>

      <Form.Item label={`${t("form.retry")}（${t("form.retry.unit")}）`} name="retry">
        <Spinner min={1} max={10} />
      </Form.Item>

      <Form.Item
        label={t("form.flap")}
        labelTip={t("form.flapDesc")}
        name="flap"
        valuePropName="toggled"
        updateTrigger="onToggle"
      >
        <Switch data={[false, true]} />
      </Form.Item>

      <Form.Item label={t("form.silent")} name="silent" col={24}>
        <DatePicker range={[]} format="HH:mm" />
      </Form.Item>

      <Form.Item label={t("form.notify")} name="notify" col={24}>
        <CheckboxGroup data={toOptions(notifyOptions, t)} />
      </Form.Item>

      <Form.Item label={t("form.memo")} name="memo" col={24}>
        <TextArea rows={2} maxLength={120} placeholder={t("form.memo.ph")} />
      </Form.Item>
    </>
  );
}
