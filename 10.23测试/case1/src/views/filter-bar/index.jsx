// Layer 4: ④ 筛选工具栏 — 关键词搜索 / 支付方式 / 下单日期范围 / 金额区间 / 预约配送时段（快捷预设）/ 重置
// 快捷键：任意位置按 "/" 聚焦搜索框
import { useEffect } from "react";
import { IconPlusIcPublicAlarmClock, IconPlusIcPublicClose, IconPlusIcPublicCloseCircle, IconPlusIcPublicResetting, IconPlusIcPublicSearch } from '@hui/icon-plus';
import dayjs from "dayjs";
import Button from "@nce/eview-react/Button";
import TextField from "@/shared/TextField";
import Spinner from "@/shared/Spinner";
import Select from "@/shared/Select";
import DatePicker from "@/shared/DatePicker";
import TimePicker from "@/shared/TimePicker";
import { PAY_METHODS } from "../../mock/order.js";
import "./index.css";

const at = (h, m) => dayjs().hour(h).minute(m).second(0).millisecond(0);

const dayjsToTimeArr = (d) => (d ? [d.hour(), d.minute()] : []);

// 预约配送快捷预设（时间段选择带快捷预设）
const SLOT_PRESETS = [
  { label: "上午", value: [at(9, 0), at(12, 0)] },
  { label: "下午", value: [at(14, 0), at(18, 0)] },
  { label: "晚间", value: [at(18, 0), at(22, 0)] },
  { label: "全天", value: [at(8, 0), at(22, 0)] },
];

const PAY_OPTIONS = [
  { text: "全部方式", value: "" },
  ...PAY_METHODS.map((m) => ({ value: m, text: m })),
];

export default function FilterBar({ value, onChange, onReset, exception, exceptionCount, onClearException }) {
  const isSlotActive = (preset) => {
    if (!value.deliveryRange || !value.deliveryRange[0] || !value.deliveryRange[1]) return false;
    return (
      value.deliveryRange[0].format("HH:mm") === preset.value[0].format("HH:mm") &&
      value.deliveryRange[1].format("HH:mm") === preset.value[1].format("HH:mm")
    );
  };

  const applySlot = (preset) => {
    if (isSlotActive(preset)) {
      onChange({ deliveryRange: null });
    } else {
      onChange({ deliveryRange: preset.value });
    }
  };

  const isTimeoutException = exception === "timeout";

  // "/" 快捷键聚焦搜索框（输入态下不拦截）
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== "/") return;
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();
      const el = document.querySelector(".fb-search input");
      if (el) el.focus();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // 金额区间校验（min > max 视为无效，过滤时忽略并提示）
  const amountInvalid =
    value.amountMin != null &&
    value.amountMax != null &&
    value.amountMin > value.amountMax;

  const handleDeliveryFrom = (t) => {
    const cur = value.deliveryRange || [null, null];
    if (t.length === 0) {
      onChange({ deliveryRange: [null, cur[1]] });
    } else {
      onChange({ deliveryRange: [at(parseInt(t[0], 10), parseInt(t[1], 10)), cur[1]] });
    }
  };

  const handleDeliveryTo = (t) => {
    const cur = value.deliveryRange || [null, null];
    if (t.length === 0) {
      onChange({ deliveryRange: [cur[0], null] });
    } else {
      onChange({ deliveryRange: [cur[0], at(parseInt(t[0], 10), parseInt(t[1], 10))] });
    }
  };

  return (
    <div className="filter-bar">
      <div className="fb-row">
        <div className="fb-group">
          <span className="fb-label">搜索订单</span>
          <TextField
            className="fb-search"
            placeholder="订单号 / 收货人 / 手机号（按 / 聚焦）"
            value={value.keyword}
            onChange={(val) => onChange({ keyword: val })}
            suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />}
          />
        </div>
        <div className="fb-group">
          <span className="fb-label">支付方式</span>
          <Select
            enableClear
            defaultLabel="全部方式"
            style={{ width: "7.5rem" }}
            options={PAY_OPTIONS}
            value={value.payMethod ?? ""}
            onChange={(v) => onChange({ payMethod: v })}
          />
        </div>
        <div className="fb-group">
          <span className="fb-label">下单日期</span>
          <DatePicker
            type="date"
            format="yyyy-MM-dd"
            style={{ width: "15rem" }}
            range={value.dateRange ? value.dateRange.map((d) => (d ? d.toDate() : null)) : []}
            onChange={(dateString, date, target) => {
              if (!date) return;
              const cur = value.dateRange || [null, null];
              if (target === "from") {
                onChange({ dateRange: [dayjs(date), cur[1]] });
              } else if (target === "to") {
                onChange({ dateRange: [cur[0], dayjs(date)] });
              }
            }}
          />
        </div>
        <div className="fb-group">
          <span className="fb-label">金额区间</span>
          <div className="fb-amount">
            <Spinner
              min={0}
              value={value.amountMin ?? 0}
              onChange={(v) => onChange({ amountMin: v })}
            />
            <span className="fb-dash">—</span>
            <Spinner
              min={0}
              value={value.amountMax ?? 0}
              onChange={(v) => onChange({ amountMax: v })}
            />
          </div>
        </div>
        <div className="fb-group">
          <span className="fb-label">预约配送</span>
          <div className="fb-time-range">
            <TimePicker
              format="hh:mm"
              supportEmptyTime
              time={dayjsToTimeArr(value.deliveryRange?.[0])}
              onChange={handleDeliveryFrom}
            />
            <span className="fb-dash">—</span>
            <TimePicker
              format="hh:mm"
              supportEmptyTime
              time={dayjsToTimeArr(value.deliveryRange?.[1])}
              onChange={handleDeliveryTo}
            />
          </div>
          <div className="fb-chips">
            {SLOT_PRESETS.map((p) => {
              const on = isSlotActive(p);
              return (
                <a
                  key={p.label}
                  className={on ? "fb-chip fb-chip-on" : "fb-chip"}
                  onClick={() => applySlot(p)}
                >
                  {p.label}
                </a>
              );
            })}
          </div>
        </div>
        <Button
          className="fb-reset"
          size="small"
          leftIcon={<IconPlusIcPublicResetting iconSize="0.875rem" iconColor={['currentcolor']} />}
          text="重置"
          onClick={onReset}
        />
      </div>
      {amountInvalid && (
        <div className="fb-applied">
          <span className="fb-amount-warn">
            金额区间无效：最大金额需不小于最小金额，当前已忽略金额筛选
          </span>
        </div>
      )}
      {exception && (
        <div className="fb-applied">
          <span className="fb-applied-chip">
            {isTimeoutException ? <IconPlusIcPublicAlarmClock iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicCloseCircle iconSize="0.875rem" iconColor={['currentcolor']} />}
            已应用筛选：
            {isTimeoutException
              ? `超时未发货 · ${exceptionCount} 单`
              : `物流异常 · ${exceptionCount} 单`}
            <IconPlusIcPublicClose iconSize="0.75rem" iconColor={['currentcolor']} className="fb-chip-close" />
          </span>
        </div>
      )}
    </div>
  );
}
