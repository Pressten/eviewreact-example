import Icon from "@/shared/Icon";
import { IconPlusIcPublicSortDown, IconPlusIcPublicSortUp } from '@nce/icon-plus';
import "./index.css";

// 通用指标卡 — 顶部 KPI 概览
export default function StatCard({ label, value, unit, delta, direction, icon, tone, spark }) {
  const up = direction === "up";
  return (
    <div className="stat-card">
      <div className="stat-card__head">
        <span className={`stat-card__icon stat-card__icon--${tone}`}>
          <Icon name={icon} size="1.25rem" />
        </span>
        <span className="stat-card__label">{label}</span>
      </div>
      <div className="stat-card__value">
        <span className="stat-card__num">{value}</span>
        <span className="stat-card__unit">{unit}</span>
      </div>
      <div className="stat-card__foot">
        <span className={`stat-card__delta stat-card__delta--${up ? "up" : "down"}`}>
          {up ? <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicSortDown iconSize="0.875rem" iconColor={['currentcolor']} />}
          {Math.abs(delta)}%
        </span>
        <span className="stat-card__cmp">较昨日</span>
        <span className="stat-card__spark" aria-hidden="true">
          {spark.map((v, i) => (
            <i key={i} style={{ height: `${v}%` }} />
          ))}
        </span>
      </div>
    </div>
  );
}
