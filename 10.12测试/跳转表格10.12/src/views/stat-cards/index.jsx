import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// Layer 4: 核心数据展示 — 关键指标卡片
const STATS = [
  { key: "volume", label: "数据总量", value: "8.42", unit: "PB", icon: "database", tone: "brand", trend: "+12.6%", up: true, note: "较昨日" },
  { key: "running", label: "运行中任务", value: "37", unit: "个", icon: "activity", tone: "info", trend: "+5", up: true, note: "实时调度" },
  { key: "today", label: "今日调度次数", value: "1,284", unit: "次", icon: "workflow", tone: "success", trend: "+8.1%", up: true, note: "较昨日" },
  { key: "alarm", label: "异常告警", value: "6", unit: "条", icon: "triangle-alert", tone: "error", trend: "-2", up: false, note: "待处理" },
];

export default function StatCards() {
  return (
    <div className="stat-cards">
      {STATS.map((s) => (
        <div className="stat-card" key={s.key}>
          <span className={"stat-card__icon stat-card__icon--" + s.tone}>
            <Icon name={s.icon} size="1.25rem" />
          </span>
          <div className="stat-card__body">
            <div className="stat-card__label">{s.label}</div>
            <div className="stat-card__value">
              {s.value}
              <span className="stat-card__unit">{s.unit}</span>
            </div>
            <div className={"stat-card__trend" + (s.up ? " is-up" : " is-down")}>
              <Icon name={s.up ? "trending-up" : "trending-down"} size="0.875rem" />
              <span>{s.trend}</span>
              <span className="stat-card__note">{s.note}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
