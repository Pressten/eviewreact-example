import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import Spinner from "@nce/eview-react/Spinner";
import Select from "@nce/eview-react/Select";
import Toggle from "@nce/eview-react/Toggle";
import TextArea from "@nce/eview-react/TextArea";
import CheckboxGroup from "@nce/eview-react/CheckboxGroup";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { deviceTypeOptions, levelOptions, notifyOptions } from "../../mock/strategy.js";
import "./index.css";

function toOptions(list, t) {
  return list.map((item) => ({ value: item.value, text: t(item.labelId) }));
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

      <Form.Item
        label={t("form.name")}
        name="name"
        rules={[{ required: true }]}
        col={12}
      >
        <TextField placeholder={t("form.name.ph")} maxLength={40} />
      </Form.Item>

      <Form.Item
        label={t("form.deviceType")}
        name="deviceType"
        rules={[{ required: true }]}
        col={12}
      >
        <Select
          defaultLabel={t("form.deviceType.ph")}
          options={toOptions(deviceTypeOptions, t)}
          enableClear
        />
      </Form.Item>

      <Form.Item
        label={`${t("form.interval")}(${t("form.interval.unit")})`}
        name="intervalSec"
        rules={[{ required: true }]}
        col={12}
      >
        <Spinner
          min={5}
          max={86400}
          step={5}
          doNotFocusWhenValueUpdate
        />
      </Form.Item>

      <Form.Item label={t("form.level")} name="level" col={12}>
        <Select options={toOptions(levelOptions, t)} enableClear />
      </Form.Item>

      <Form.Item label={t("form.timeRange")} name="timeRange" col={12}>
        <Spinner type="time" timeFormat="hh:mm" doNotFocusWhenValueUpdate />
      </Form.Item>

      <Form.Item label={t("form.desc2")} name="desc" col={24}>
        <TextArea rows={3} maxLength={200} placeholder={t("form.desc2.ph")} />
      </Form.Item>
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

      <Form.Item label={`${t("form.threshold")}(${t("form.threshold.unit")})`} name="threshold" col={12}>
        <Spinner min={0} max={100} doNotFocusWhenValueUpdate />
      </Form.Item>

      <Form.Item label={`${t("form.retry")}(${t("form.retry.unit")})`} name="retry" col={12}>
        <Spinner min={1} max={10} doNotFocusWhenValueUpdate />
      </Form.Item>

      <div className="switch-row switch-row--inset">
        <div className="switch-row__text">
          <span className="switch-row__label">{t("form.flap")}</span>
          <span className="switch-row__desc">{t("form.flapDesc")}</span>
        </div>
        <Form.Item name="flap" valuePropName="toggled" updateTrigger="onToggle" noStyle>
          <Toggle data={[false, true]} />
        </Form.Item>
      </div>

      <Form.Item label={t("form.silent")} name="silent" col={12}>
        <Spinner type="time" timeFormat="hh:mm" doNotFocusWhenValueUpdate />
      </Form.Item>

      <Form.Item label={t("form.notify")} name="notify" col={24}>
        <CheckboxGroup data={toOptions(notifyOptions, t)} className="strategy-fields__checks" />
      </Form.Item>

      <Form.Item label={t("form.memo")} name="memo" col={24}>
        <TextArea rows={2} maxLength={120} placeholder={t("form.memo.ph")} />
      </Form.Item>
    </div>
  );
}
