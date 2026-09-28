import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Select from "@nce/eview-react/Select";
import Spinner from "@nce/eview-react/Spinner";
import Switch from "@nce/eview-react/Switch";
import CheckboxGroup from "@nce/eview-react/CheckboxGroup";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { deviceTypeOptions, levelOptions, notifyOptions } from "../../mock/strategy.js";
import "./index.css";

function toOptions(list, t) {
  return list.map((item) => ({ value: item.value, text: t(item.labelId) }));
}

const StrategyFields = forwardRef((_, ref) => {
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const [name, setName] = useState("");
  const [deviceType, setDeviceType] = useState(null);
  const [intervalSec, setIntervalSec] = useState(60);
  const [level, setLevel] = useState("warning");
  const [timeRangeStart, setTimeRangeStart] = useState("00:00");
  const [timeRangeEnd, setTimeRangeEnd] = useState("23:59");
  const [desc, setDesc] = useState("");

  const nameRef = useRef(null);
  const deviceTypeRef = useRef(null);
  const intervalRef = useRef(null);

  useImperativeHandle(ref, () => ({
    submit: () => {
      const refs = [nameRef, deviceTypeRef, intervalRef];
      const firstBad = refs.find((r) => !r.current?.validate());
      if (firstBad) {
        firstBad.current?.focus();
        return null;
      }
      return {
        name,
        deviceType,
        intervalSec,
        level,
        timeRange: [timeRangeStart, timeRangeEnd],
        desc,
      };
    },
    reset: () => {
      setName("");
      setDeviceType(null);
      setIntervalSec(60);
      setLevel("warning");
      setTimeRangeStart("00:00");
      setTimeRangeEnd("23:59");
      setDesc("");
      deviceTypeRef.current?.clear?.();
    },
    setValues: (record) => {
      if (!record) return;
      setName(record.name ?? "");
      setDeviceType(record.deviceType ?? null);
      setIntervalSec(record.intervalSec ?? 60);
      setLevel(record.level ?? "warning");
      setDesc(record.desc ?? "");
    },
  }));

  return (
    <div className="strategy-fields">
      <div className="strategy-fields__group">
        <span className="strategy-fields__group-title">{t("form.basicTitle")}</span>
        <span className="strategy-fields__group-line" />
      </div>

      <div className="strategy-fields__grid">
        <TextField
          ref={nameRef}
          label={t("form.name")}
          required
          placeholder={t("form.name.ph")}
          maxLength={40}
          value={name}
          onChange={(v) => setName(v)}
          inputStyle={{ width: "100%" }}
        />

        <Select
          ref={deviceTypeRef}
          label={t("form.deviceType")}
          required
          enableClear
          defaultLabel={t("form.deviceType.ph")}
          options={toOptions(deviceTypeOptions, t)}
          value={deviceType}
          onChange={(v) => setDeviceType(v)}
          selectStyle={{ width: "100%" }}
        />

        <div className="strategy-fields__spinner-row">
          <Spinner
            ref={intervalRef}
            label={t("form.interval")}
            required
            min={5}
            max={86400}
            step={5}
            value={intervalSec}
            doNotFocusWhenValueUpdate
            onChange={(v) => setIntervalSec(v)}
          />
          <span className="strategy-fields__unit">{t("form.interval.unit")}</span>
        </div>

        <Select
          label={t("form.level")}
          options={toOptions(levelOptions, t)}
          value={level}
          onChange={(v) => setLevel(v)}
          selectStyle={{ width: "100%" }}
        />

        <div className="strategy-fields__time-range strategy-fields__full">
          <span className="strategy-fields__field-label">{t("form.timeRange")}</span>
          <div className="strategy-fields__time-range-inputs">
            <Spinner
              type="time"
              timeFormat="hh:mm"
              value={timeRangeStart}
              doNotFocusWhenValueUpdate
              onChange={(v) => setTimeRangeStart(v)}
            />
            <span className="strategy-fields__time-sep">—</span>
            <Spinner
              type="time"
              timeFormat="hh:mm"
              value={timeRangeEnd}
              doNotFocusWhenValueUpdate
              onChange={(v) => setTimeRangeEnd(v)}
            />
          </div>
        </div>

        <TextArea
          label={t("form.desc2")}
          rows={3}
          maxLength={200}
          placeholder={t("form.desc2.ph")}
          value={desc}
          onChange={(v) => setDesc(v)}
          inputStyle={{ width: "100%" }}
          className="strategy-fields__full"
        />
      </div>
    </div>
  );
});

export const StrategyAdvanced = forwardRef((_, ref) => {
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const [threshold, setThreshold] = useState(0);
  const [retry, setRetry] = useState(1);
  const [flap, setFlap] = useState(true);
  const [silentStart, setSilentStart] = useState("22:00");
  const [silentEnd, setSilentEnd] = useState("06:00");
  const [notify, setNotify] = useState(["inbox", "email"]);
  const [memo, setMemo] = useState("");

  useImperativeHandle(ref, () => ({
    submit: () => {
      return {
        threshold,
        retry,
        flap,
        silent: [silentStart, silentEnd],
        notify,
        memo,
      };
    },
    reset: () => {
      setThreshold(0);
      setRetry(1);
      setFlap(true);
      setSilentStart("22:00");
      setSilentEnd("06:00");
      setNotify(["inbox", "email"]);
      setMemo("");
    },
    setValues: (record) => {
      if (!record) return;
      setThreshold(record.threshold ?? 0);
      setRetry(record.retry ?? 1);
      setFlap(record.flap ?? true);
      setNotify(record.notify ?? ["inbox", "email"]);
      setMemo(record.memo ?? "");
    },
  }));

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
        <div className="strategy-fields__spinner-row">
          <Spinner
            label={t("form.threshold")}
            min={0}
            max={100}
            value={threshold}
            doNotFocusWhenValueUpdate
            onChange={(v) => setThreshold(v)}
          />
          <span className="strategy-fields__unit">{t("form.threshold.unit")}</span>
        </div>

        <div className="strategy-fields__spinner-row">
          <Spinner
            label={t("form.retry")}
            min={1}
            max={10}
            value={retry}
            doNotFocusWhenValueUpdate
            onChange={(v) => setRetry(v)}
          />
          <span className="strategy-fields__unit">{t("form.retry.unit")}</span>
        </div>

        <div className="switch-row switch-row--inset">
          <div className="switch-row__text">
            <span className="switch-row__label">{t("form.flap")}</span>
            <span className="switch-row__desc">{t("form.flapDesc")}</span>
          </div>
          <Switch
            data={[false, true]}
            toggled={flap}
            onToggle={(v) => setFlap(v)}
          />
        </div>

        <div className="strategy-fields__time-range strategy-fields__full">
          <span className="strategy-fields__field-label">{t("form.silent")}</span>
          <div className="strategy-fields__time-range-inputs">
            <Spinner
              type="time"
              timeFormat="hh:mm"
              value={silentStart}
              doNotFocusWhenValueUpdate
              onChange={(v) => setSilentStart(v)}
            />
            <span className="strategy-fields__time-sep">—</span>
            <Spinner
              type="time"
              timeFormat="hh:mm"
              value={silentEnd}
              doNotFocusWhenValueUpdate
              onChange={(v) => setSilentEnd(v)}
            />
          </div>
        </div>

        <CheckboxGroup
          label={t("form.notify")}
          data={toOptions(notifyOptions, t)}
          value={notify}
          onChange={(v) => setNotify(v)}
          className="strategy-fields__full"
        />

        <TextArea
          label={t("form.memo")}
          rows={2}
          maxLength={120}
          placeholder={t("form.memo.ph")}
          value={memo}
          onChange={(v) => setMemo(v)}
          inputStyle={{ width: "100%" }}
          className="strategy-fields__full"
        />
      </div>
    </div>
  );
});

export default StrategyFields;
