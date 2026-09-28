import { useIntl } from "react-intl";
import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Select from "@nce/eview-react/Select";
import Spinner from "@nce/eview-react/Spinner";
import CheckboxGroup from "@nce/eview-react/CheckboxGroup";
import Switch from "@nce/eview-react/Switch";
import { Icon } from "../../shared/icon.jsx";
import { deviceTypeOptions, levelOptions, notifyOptions } from "../../mock/strategy.js";
import "./index.css";

// Layer 3: 策略参数字段组 — 表单卡片与弹窗共用同一套字段，保证两处填写体验一致
// StrategyFields：基础参数（默认导出，返回数组——Form.Item 直接作为 Form 子级，eview-react 硬约束）
// StrategyAdvanced：高级参数面板（开关打开后渲染，同样返回数组）
//
// eview-react 无 TimePicker.RangePicker 对应，TimeRangePicker 为手写补位（两个 Spinner type="time"）
//   value: ["hh:mm", "hh:mm"]；onChange([start, end])
// TODO(eview-react): TimePicker.RangePicker 无对应，当前手写
function TimeRangePicker({ value, onChange, format = "hh:mm" }) {
  const [start, end] = Array.isArray(value) ? value : ["", ""];
  const setStart = (v) => onChange?.([v, end]);
  const setEnd = (v) => onChange?.([start, v]);
  return (
    <div className="time-range-picker">
      <Spinner
        type="time"
        timeFormat={format}
        value={start}
        doNotFocusWhenValueUpdate
        onChange={setStart}
      />
      <span className="time-range-picker__sep">—</span>
      <Spinner
        type="time"
        timeFormat={format}
        value={end}
        doNotFocusWhenValueUpdate
        onChange={setEnd}
      />
    </div>
  );
}

function toOptions(list, t) {
  // eview-react Select/CheckboxGroup 选项字段：text（不是 label）
  return list.map((item) => ({ value: item.value, text: t(item.labelId) }));
}

// 返回数组：Form.Item 直接作为父 Form 的子级（eview-react 硬约束：Form 内不允许 div 包 Form.Item 做栅格）
// Form 级 itemCol={12} 设默认半宽；单项整行用 Form.Item col={24}
export default function StrategyFields() {
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  return [
    <div className="strategy-fields__group" key="basic-group">
      <span className="strategy-fields__group-title">{t("form.basicTitle")}</span>
      <span className="strategy-fields__group-line" />
    </div>,
    <Form.Item
      key="name"
      label={t("form.name")}
      name="name"
      rules={[{ required: true }]}
    >
      <TextField placeholder={t("form.name.ph")} maxLength={40} />
    </Form.Item>,
    <Form.Item
      key="deviceType"
      label={t("form.deviceType")}
      name="deviceType"
      rules={[{ required: true }]}
    >
      <Select
        defaultLabel={t("form.deviceType.ph")}
        options={toOptions(deviceTypeOptions, t)}
        enableClear
      />
    </Form.Item>,
    <Form.Item
      key="intervalSec"
      label={`${t("form.interval")}（${t("form.interval.unit")}）`}
      name="intervalSec"
      rules={[{ required: true }]}
    >
      <Spinner min={5} max={86400} step={5} doNotFocusWhenValueUpdate />
    </Form.Item>,
    <Form.Item key="level" label={t("form.level")} name="level">
      <Select options={toOptions(levelOptions, t)} enableClear />
    </Form.Item>,
    <Form.Item key="timeRange" label={t("form.timeRange")} name="timeRange">
      <TimeRangePicker format="hh:mm" />
    </Form.Item>,
    <Form.Item key="desc" label={t("form.desc2")} name="desc" col={24}>
      <TextArea rows={3} maxLength={200} placeholder={t("form.desc2.ph")} />
    </Form.Item>,
  ];
}

export function StrategyAdvanced() {
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  return [
    <div className="strategy-fields__group" key="adv-group">
      <span className="strategy-fields__group-title">{t("form.advancedTitle")}</span>
      <span className="strategy-fields__group-line" />
      <span className="strategy-fields__group-chip">
        <Icon name="sliders-horizontal" size={12} />
        {intl.formatMessage({ id: "form.advancedBadge" }, { count: 6 })}
      </span>
    </div>,
    <Form.Item
      key="threshold"
      label={`${t("form.threshold")}（${t("form.threshold.unit")}）`}
      name="threshold"
    >
      <Spinner min={0} max={100} doNotFocusWhenValueUpdate />
    </Form.Item>,
    <Form.Item
      key="retry"
      label={`${t("form.retry")}（${t("form.retry.unit")}）`}
      name="retry"
    >
      <Spinner min={1} max={10} doNotFocusWhenValueUpdate />
    </Form.Item>,
    <div className="switch-row switch-row--inset" key="flap-row">
      <div className="switch-row__text">
        <span className="switch-row__label">{t("form.flap")}</span>
        <span className="switch-row__desc">{t("form.flapDesc")}</span>
      </div>
      <Form.Item name="flap" valuePropName="toggled" updateTrigger="onToggle" noStyle>
        <Switch data={[false, true]} />
      </Form.Item>
    </div>,
    <Form.Item key="silent" label={t("form.silent")} name="silent">
      <TimeRangePicker format="hh:mm" />
    </Form.Item>,
    <Form.Item key="notify" label={t("form.notify")} name="notify" col={24}>
      <CheckboxGroup
        data={toOptions(notifyOptions, t)}
        className="strategy-fields__checks"
      />
    </Form.Item>,
    <Form.Item key="memo" label={t("form.memo")} name="memo" col={24}>
      <TextArea rows={2} maxLength={120} placeholder={t("form.memo.ph")} />
    </Form.Item>,
  ];
}
