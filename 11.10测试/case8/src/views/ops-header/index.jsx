import { Badge, DatePicker, Dropdown, Tooltip } from "antd";
import dayjs from "dayjs";
import { Icon } from "../../../assets/shared/icon.jsx";
import { AIRPORTS } from "../../mock/flight.js";
import { WEATHER } from "../../mock/ops.js";
import { useApp, useOpsNow } from "../../context.jsx";
import "./index.css";

// 区块① 顶部运行栏 —— 双层结构:
// 上层主操作行: 航司标识 / 基地机场切换 / 运行日切换 / 运行时钟 / 气象预警 / 值班组
// 下层摘要条: 今日运行摘要(计数口径与主表一致)
const DUTY_CREW = [
  { name: "王志远", role: "A 席签派员", avatar: "./assets/uploads/avatar-wang.jpg" },
  { name: "莫琳", role: "B 席签派员", avatar: "./assets/uploads/avatar-momo.jpg" },
  { name: "维琪", role: "值班经理", avatar: "./assets/uploads/avatar-vicky.jpg" },
];

export default function OpsHeader() {
  const { isDark, toggleDark, airport, setAirport, opDay, setOpDay, dayKey, dataset } = useApp();
  const now = useOpsNow();
  // 气象预警条数与⑥气象流量区内容联动
  const weather = WEATHER[airport];
  const airportMeta = AIRPORTS.find((a) => a.code === airport);
  const dayLabel = dayKey === "yesterday" ? "昨日" : dayKey === "tomorrow" ? "明日" : "今日";

  // 机场/运行日切换联动主表数据集(经由 context 重算), 摘要计数与主表统计口径一致
  const summary = {
    total: dataset.length,
    executed: dataset.filter((r) => ["arrived", "departed", "diverted"].includes(r.status) || (dayKey === "yesterday" && r.status === "delayed")).length,
    delayed: dataset.filter((r) => r.status === "delayed").length,
    cancelled: dataset.filter((r) => r.status === "cancelled").length,
  };

  const airportItems = {
    items: AIRPORTS.map((a) => ({
      key: a.code,
      label: (
        <span className="airport-item">
          <span className="airport-code">{a.code}</span>
          <span className="airport-full">{a.fullName}机场</span>
          <span className="airport-tag">{a.code === "PEK" ? "主基地" : "基地"}</span>
        </span>
      ),
    })),
    selectedKeys: [airport],
    onClick: ({ key }) => setAirport(key),
  };

  const dayItems = {
    items: [
      { key: "yesterday", label: `昨日 · ${dayjs().add(-1, "day").format("MM-DD")}` },
      { key: "today", label: `今日 · ${dayjs().format("MM-DD")}` },
      { key: "tomorrow", label: `明日 · ${dayjs().add(1, "day").format("MM-DD")}` },
    ],
    selectedKeys: [dayKey],
    onClick: ({ key }) => setOpDay(dayjs().add(key === "yesterday" ? -1 : key === "tomorrow" ? 1 : 0, "day")),
  };

  // 运行日仅允许 昨日/今日/明日 三天切换
  const disableDate = (current) => {
    const diff = current.startOf("day").diff(dayjs().startOf("day"), "day");
    return diff < -1 || diff > 1;
  };

  return (
    <header className="ops-header">
      <div className="oh-main">
        <div className="brand">
          <span className="brand-mark">
            <Icon name="plane-takeoff" size="1.25rem" />
          </span>
          <span className="brand-text">
            <span className="brand-name">华翼航空 AOC</span>
            <span className="brand-sub">运行控制中心</span>
          </span>
        </div>

        <span className="hdr-sep" />

        <Dropdown menu={airportItems} trigger={["click"]}>
          <button type="button" className="ops-trigger">
            <Icon name="map-pin" size="0.875rem" />
            <span className="trigger-main">{airport}</span>
            <span className="trigger-sub">{airportMeta.fullName}</span>
            <Icon name="chevron-down" size="0.75rem" />
          </button>
        </Dropdown>

        <Dropdown menu={dayItems} trigger={["click"]}>
          <button type="button" className="ops-trigger">
            <Icon name="calendar-days" size="0.875rem" />
            <span className="trigger-main">{dayLabel}</span>
            <span className="trigger-sub">{opDay.format("MM-DD")}</span>
            <Icon name="chevron-down" size="0.75rem" />
          </button>
        </Dropdown>

        <DatePicker
          value={opDay}
          onChange={(d) => d && setOpDay(d)}
          disabledDate={disableDate}
          allowClear={false}
        />

        <span className="hdr-sep" />

        <div className="ops-clock">
          <span className="clock-main">{now.format("HH:mm:ss")}</span>
          <span className="clock-sub">
            {now.format("YYYY-MM-DD dddd")} · UTC {now.subtract(8, "hour").format("HH:mm:ss")}Z
          </span>
        </div>

        <div className="hdr-flex" />

        <Tooltip
          title={
            `${weather.alerts.length} 条气象预警生效：${weather.alerts.map((a) => a.title).join(" / ")} —— ` +
            `详情见「气象与流量」区`
          }
        >
          <Badge count={weather.alerts.length} size="small" offset={[-2, 4]}>
            <button type="button" className="ops-icon-btn" title="气象预警">
              <Icon name="cloud-lightning" size="1rem" />
            </button>
          </Badge>
        </Tooltip>

        <span className="hdr-sep" />

        <div className="duty-crew">
          {DUTY_CREW.map((c) => (
            <Tooltip key={c.name} title={`${c.name} · ${c.role}`}>
              <span className="crew-avatar">
                <img src={c.avatar} alt={c.name} />
              </span>
            </Tooltip>
          ))}
        </div>

        <button type="button" className="ops-icon-btn" onClick={toggleDark} title="切换深浅模式">
          <Icon name={isDark ? "sun" : "moon"} size="1rem" />
        </button>
      </div>

      <div className="oh-summary">
        <span className="sum-label">
          {airportMeta.fullName} · {dayLabel}运行摘要
        </span>
        <span className="sum-chip">计划 <b className="sum-value">{summary.total}</b> 班</span>
        <span className="sum-chip">已执行 <b className="sum-value sum-ok">{summary.executed}</b></span>
        <span className="sum-chip">延误 <b className="sum-value sum-warn">{summary.delayed}</b></span>
        <span className="sum-chip">取消 <b className="sum-value sum-err">{summary.cancelled}</b></span>
        <span className="sum-note">计数口径与航班动态主表一致</span>
      </div>
    </header>
  );
}
