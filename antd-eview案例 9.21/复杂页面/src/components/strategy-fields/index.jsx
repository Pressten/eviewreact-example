import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Spinner from "@nce/eview-react/Spinner";
import Select from "@nce/eview-react/Select";
import CheckboxGroup from "@nce/eview-react/CheckboxGroup";
import Toggle from "@nce/eview-react/Toggle";
import { useIntl } from "react-intl";
import { Icon } from "../../../assets/shared/icons.js";
import { deviceTypeOptions, levelOptions, notifyOptions } from "../../mock/strategy.js";
import "./index.css";

// Layer 3: 策略参数字段组 — 表单卡片与弹窗共用同一套字段，保证两处填写体验一致
// StrategyFields：基础参数（默认导出）；StrategyAdvanced：高级参数面板（开关打开后渲染）

function toOptions(list, t) {
  // eview-react Select/CheckboxGroup 用 text（不是 label）
  return list.map((item) => ({ value: item.value, text: t(item.labelId) }));
}

// TimePicker.RangePicker 无对应，手写双 Spinner type="time" 接收 [start,end] 数组值
function TimeRangePicker({ value, onChange }) {
  const pair = Array.isArray(value) ? value : ["", ""];
  const start = pair[0] || "";
  const end = pair[1] || "";
  return (
    <div className="strategy-fields__timerange">
      <Spinner
        type="time"
        timeFormat="HH:mm"
        value={start}
        onChange={(v) => onChange?.([v, end])}
      />
      <span className="strategy-fields__timerange-sep">~</span>
      <Spinner
        type="time"
        timeFormat="HH:mm"
        value={end}
        onChange={(v) => onChange?.([start, v])}
      />
    </div>
  );
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
          rules={[{ required: true }]}
        >
          <TextField placeholder={t("form.name.ph")} maxLength={40} inputStyle={{ width: "100%" }} />
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
            selectStyle={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label={t("form.interval")}
          name="intervalSec"
          rules={[{ required: true }]}
        >
          <Spinner
            min={5}
            max={86400}
            step={5}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label={t("form.level")} name="level">
          <Select options={toOptions(levelOptions, t)} selectStyle={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label={t("form.timeRange")} name="timeRange">
          <TimeRangePicker />
        </Form.Item>

        <Form.Item label={t("form.desc2")} name="desc" className="strategy-fields__full">
          <TextArea rows={3} maxLength={200} placeholder={t("form.desc2.ph")} inputStyle={{ width: "100%" }} />
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
          <Spinner
            min={0}
            max={100}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label={t("form.retry")} name="retry">
          <Spinner
            min={1}
            max={10}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <div className="switch-row switch-row--inset">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("form.flap")}</span>
            <span className="switch-row__desc">{t("form.flapDesc")}</span>
          </div>
          <Form.Item name="flap" valuePropName="toggled" updateTrigger="onToggle">
            <Toggle />
          </Form.Item>
        </div>

        <Form.Item label={t("form.silent")} name="silent">
          <TimeRangePicker />
        </Form.Item>

        <Form.Item label={t("form.notify")} name="notify" className="strategy-fields__full">
          <CheckboxGroup
            data={toOptions(notifyOptions, t)}
            className="strategy-fields__checks"
          />
        </Form.Item>

        <Form.Item label={t("form.memo")} name="memo" className="strategy-fields__full">
          <TextArea rows={2} maxLength={120} placeholder={t("form.memo.ph")} inputStyle={{ width: "100%" }} />
        </Form.Item>
      </div>
    </div>
  );
}
