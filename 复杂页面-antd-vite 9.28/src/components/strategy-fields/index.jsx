import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Select from "@nce/eview-react/Select";
import Spinner from "@nce/eview-react/Spinner";
import CheckboxGroup from "@nce/eview-react/CheckboxGroup";
import Switch from "@nce/eview-react/Switch";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { deviceTypeOptions, levelOptions, notifyOptions } from "../../mock/strategy.js";
import "./index.css";

// Layer 3: 策略参数字段组 — 表单卡片与弹窗共用同一套字段，保证两处填写体验一致
// StrategyFields：基础参数（默认导出）；StrategyAdvanced：高级参数面板（开关打开后渲染）
//
// 不用 eview-react Form 组件：每字段 useState 存值 + useRef 存控件实例由父组件持有，
// 父组件提交前用 refs.find(r => !r.current.validate()) 循环校验。
// 本组件只负责渲染控件 + 把 value/onChange/ref 透传下去。

function toOptions(list, t) {
  return list.map((item) => ({ value: item.value, text: t(item.labelId) }));
}

// 时间范围用两个 Spinner type="time" 并排显示
function TimeRangeField({ label, value, onChange, startPh, endPh }) {
  const start = Array.isArray(value) ? value[0] : "";
  const end = Array.isArray(value) ? value[1] : "";
  const set = (idx, v) => {
    const next = [idx === 0 ? v : start, idx === 1 ? v : end];
    onChange(next);
  };
  return (
    <div className="strategy-fields__timerange">
      {label ? <span className="strategy-fields__timerange-label">{label}</span> : null}
      <Spinner
        type="time"
        timeFormat="hh:mm"
        value={start}
        doNotFocusWhenValueUpdate
        onChange={(v) => set(0, v)}
      />
      <span className="strategy-fields__timerange-sep">—</span>
      <Spinner
        type="time"
        timeFormat="hh:mm"
        value={end}
        doNotFocusWhenValueUpdate
        onChange={(v) => set(1, v)}
      />
    </div>
  );
}

export default function StrategyFields({ values, setters, refs }) {
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const v = values || {};
  const s = setters || {};
  const r = refs || {};

  return (
    <div className="strategy-fields">
      <div className="strategy-fields__group">
        <span className="strategy-fields__group-title">{t("form.basicTitle")}</span>
        <span className="strategy-fields__group-line" />
      </div>

      <div className="strategy-fields__grid">
        <TextField
          ref={r.nameRef}
          label={t("form.name")}
          required
          placeholder={t("form.name.ph")}
          maxLength={40}
          value={v.name ?? ""}
          onChange={(value) => s.setName?.(value)}
        />

        <Select
          ref={r.deviceTypeRef}
          label={t("form.deviceType")}
          required
          enableClear
          defaultLabel={t("form.deviceType.ph")}
          options={toOptions(deviceTypeOptions, t)}
          value={v.deviceType ?? null}
          onChange={(value) => s.setDeviceType?.(value)}
        />

        <Spinner
          ref={r.intervalSecRef}
          label={`${t("form.interval")}（${t("form.interval.unit")}）`}
          required
          min={5}
          max={86400}
          step={5}
          doNotFocusWhenValueUpdate
          value={v.intervalSec ?? 60}
          onChange={(value) => s.setIntervalSec?.(value)}
        />

        <Select
          label={t("form.level")}
          options={toOptions(levelOptions, t)}
          value={v.level ?? null}
          onChange={(value) => s.setLevel?.(value)}
        />

        <TimeRangeField
          label={t("form.timeRange")}
          value={v.timeRange}
          onChange={(next) => s.setTimeRange?.(next)}
        />

        <TextArea
          className="strategy-fields__full"
          label={t("form.desc2")}
          rows={3}
          maxLength={200}
          placeholder={t("form.desc2.ph")}
          value={v.desc ?? ""}
          onChange={(targetValue) => s.setDesc?.(targetValue)}
        />
      </div>
    </div>
  );
}

export function StrategyAdvanced({ values, setters }) {
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const v = values || {};
  const s = setters || {};

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
        <Spinner
          label={`${t("form.threshold")}（${t("form.threshold.unit")}）`}
          min={0}
          max={100}
          doNotFocusWhenValueUpdate
          value={v.threshold ?? 90}
          onChange={(value) => s.setThreshold?.(value)}
        />

        <Spinner
          label={`${t("form.retry")}（${t("form.retry.unit")}）`}
          min={1}
          max={10}
          doNotFocusWhenValueUpdate
          value={v.retry ?? 3}
          onChange={(value) => s.setRetry?.(value)}
        />

        <div className="switch-row switch-row--inset">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("form.flap")}</span>
            <span className="switch-row__desc">{t("form.flapDesc")}</span>
          </div>
          <Switch
            data={[false, true]}
            toggled={v.flap === true}
            onToggle={(value) => s.setFlap?.(value)}
          />
        </div>

        <TimeRangeField
          label={t("form.silent")}
          value={v.silent}
          onChange={(next) => s.setSilent?.(next)}
        />

        <CheckboxGroup
          className="strategy-fields__full"
          label={t("form.notify")}
          data={toOptions(notifyOptions, t)}
          value={v.notify ?? []}
          onChange={(value) => s.setNotify?.(value)}
        />

        <TextArea
          className="strategy-fields__full"
          label={t("form.memo")}
          rows={2}
          maxLength={120}
          placeholder={t("form.memo.ph")}
          value={v.memo ?? ""}
          onChange={(targetValue) => s.setMemo?.(targetValue)}
        />
      </div>
    </div>
  );
}
