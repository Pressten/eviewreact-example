import { IconPlusIcDigitalPowerDpTimer, IconPlusIcPublicHourglass, IconPlusIcPublicTransverseRectangleTemplate, IconPlusIcPublicSortUp, IconPlusIcPublicSortDown, IconPlusIcPublicCloseCircle } from '@hui/icon-plus';
import "./index.css";

// 环比涨跌渲染：方向 + 颜色（上升为坏→红；下降为好→绿；中性上升→蓝）
function Delta({ delta, deltaType }) {
  if (delta === 0 || delta === undefined) return null;
  const up = delta > 0;
  const cls =
    deltaType === "up-bad" ? "delta-bad"
    : deltaType === "down-good" ? "delta-good"
    : deltaType === "down" ? "delta-good"
    : "delta-info";
  const pct = `${up ? "+" : ""}${delta}${deltaType === "up" || deltaType === "down" ? "%" : ""}`;
  const fmt = `${up ? "+" : ""}${delta}`;
  const display = deltaType === "up" || deltaType === "down" ? pct : fmt;
  return (
    <span className={`metric-delta ${cls}`}>
      {up ? <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicSortDown iconSize="0.875rem" iconColor={['currentcolor']} />}
      <span>{display}</span>
      <span className="delta-vs">环比</span>
    </span>
  );
}

const METRIC_META = [
  { key: "qps", title: "总 QPS", icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize="1rem" iconColor={['currentcolor']} />, unitSuffix: "" },
  { key: "avgResponse", title: "平均响应时间", icon: <IconPlusIcDigitalPowerDpTimer iconSize="1rem" iconColor={['currentcolor']} />, unitSuffix: "" },
  { key: "errorRate", title: "错误率", icon: <IconPlusIcPublicCloseCircle iconSize="1rem" iconColor={['currentcolor']} />, unitSuffix: "" },
  { key: "p99", title: "P99 延迟", icon: <IconPlusIcPublicHourglass iconSize="1rem" iconColor={['currentcolor']} />, unitSuffix: "" },
];

// 区块③ 黄金指标行：4 张卡，各带环比涨跌
export default function GoldenMetrics({ metrics, env }) {
  return (
    <div className="golden-row">
      {METRIC_META.map((m) => {
        const d = metrics[m.key];
        const isBad = d.deltaType === "up-bad";
        return (
          <div key={m.key} className={`metric-card${isBad ? " is-bad" : ""}`}>
            <div className="metric-card-head">
              <span className="metric-icon">{m.icon}</span>
              <span className="metric-title">{m.title}</span>
            </div>
            <div className="metric-value">
              <span className={`metric-num${isBad ? " num-bad" : ""}`}>{d.value.toLocaleString()}</span>
              <span className="metric-unit">{d.unit}</span>
            </div>
            <Delta delta={d.delta} deltaType={d.deltaType} />
          </div>
        );
      })}
    </div>
  );
}
