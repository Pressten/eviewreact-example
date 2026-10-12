import { IconPlusIcDevBranch, IconPlusIcHuaweiCloudDatabase, IconPlusIcPublicAlert, IconPlusIcPublicHeart, IconPlusIcPublicSortDown, IconPlusIcPublicSortUp } from '@nce/icon-plus';
import "./index.css";

// Layer 4: 核心数据展示 — 关键指标卡片
const STATS = [
  { key: "volume", label: "数据总量", value: "8.42", unit: "PB", icon: <IconPlusIcHuaweiCloudDatabase iconSize="1.25rem" iconColor={['currentcolor']} />, tone: "brand", trend: "+12.6%", up: true, note: "较昨日" },
  { key: "running", label: "运行中任务", value: "37", unit: "个", icon: <IconPlusIcPublicHeart iconSize="1.25rem" iconColor={['currentcolor']} />, tone: "info", trend: "+5", up: true, note: "实时调度" },
  { key: "today", label: "今日调度次数", value: "1,284", unit: "次", icon: <IconPlusIcDevBranch iconSize="1.25rem" iconColor={['currentcolor']} />, tone: "success", trend: "+8.1%", up: true, note: "较昨日" },
  { key: "alarm", label: "异常告警", value: "6", unit: "条", icon: <IconPlusIcPublicAlert iconSize="1.25rem" iconColor={['currentcolor']} />, tone: "error", trend: "-2", up: false, note: "待处理" },
];

export default function StatCards() {
  return (
    <div className="stat-cards">
      {STATS.map((s) => (
        <div className="stat-card" key={s.key}>
          <span className={"stat-card__icon stat-card__icon--" + s.tone}>
            {s.icon}
          </span>
          <div className="stat-card__body">
            <div className="stat-card__label">{s.label}</div>
            <div className="stat-card__value">
              {s.value}
              <span className="stat-card__unit">{s.unit}</span>
            </div>
            <div className={"stat-card__trend" + (s.up ? " is-up" : " is-down")}>
              {s.up ? <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicSortDown iconSize="0.875rem" iconColor={['currentcolor']} />}
              <span>{s.trend}</span>
              <span className="stat-card__note">{s.note}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
