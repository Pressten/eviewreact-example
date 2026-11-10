import { useMemo } from "react";
import { Icon } from "../../../assets/shared/icon.jsx";
import { buildDataset } from "../../mock/flight.js";
import { useApp } from "../../context.jsx";
import "./index.css";

// 运行质量口径 —— 与主表延误/取消统计完全一致
// 放行正常率 = 出港非延误非取消 / 出港总数
// 起飞正常率 = 已执行出港中准点(延误=0)占比
// 平均延误 = 延误航班的延误分钟均值; 旅客不满意度 = (延误旅客 + 取消旅客×1.2) / 总旅客
function qualityMetrics(ds) {
  const dep = ds.filter((r) => r.dir === "dep");
  const depDelayed = dep.filter((r) => r.status === "delayed").length;
  const depCancelled = dep.filter((r) => r.status === "cancelled").length;
  const releaseRate = dep.length ? Math.round(((dep.length - depDelayed - depCancelled) / dep.length) * 100) : 100;

  const executedDep = dep.filter(
    (r) => ["departed", "arrived"].includes(r.status) || (r.finished && r.status === "delayed")
  );
  const onTimeDep = executedDep.filter((r) => r.delayMinutes === 0);
  const departureRate = executedDep.length ? Math.round((onTimeDep.length / executedDep.length) * 100) : 100;

  const delayedRows = ds.filter((r) => r.delayMinutes > 0);
  const avgDelay = delayedRows.length
    ? Math.round(delayedRows.reduce((s, r) => s + r.delayMinutes, 0) / delayedRows.length)
    : 0;

  const totalPax = ds.reduce((s, r) => s + r.paxCount, 0);
  const affectedPax =
    delayedRows.reduce((s, r) => s + r.paxCount, 0) +
    ds.filter((r) => r.status === "cancelled").reduce((s, r) => s + r.paxCount, 0) * 1.2;
  const dissatisfaction = totalPax ? Math.round((affectedPax / totalPax) * 100) : 0;

  return { releaseRate, departureRate, avgDelay, dissatisfaction };
}

// 区块⑧ 运行质量 —— 4 项指标(两行式: 数值行 + 对比行), 环比昨日箭头分色
export default function OpsQuality() {
  const { airport, dataset } = useApp();
  const current = useMemo(() => qualityMetrics(dataset), [dataset]);
  // 环比基准: 昨日数据(不受今日运行处置覆盖影响)
  const baseline = useMemo(() => qualityMetrics(buildDataset(airport, "yesterday", {})), [airport]);

  const items = [
    { key: "release", label: "放行正常率", value: current.releaseRate, base: baseline.releaseRate, unit: "%", goodUp: true },
    { key: "departure", label: "起飞正常率", value: current.departureRate, base: baseline.departureRate, unit: "%", goodUp: true },
    { key: "avgDelay", label: "平均延误分钟", value: current.avgDelay, base: baseline.avgDelay, unit: " 分", goodUp: false },
    { key: "dissatisfaction", label: "旅客不满意度", value: current.dissatisfaction, base: baseline.dissatisfaction, unit: "%", goodUp: false },
  ];

  return (
    <section className="ops-quality">
      <div className="oq-title">
        <Icon name="gauge" size="1rem" />
        运行质量
        <span className="oq-sub">环比昨日</span>
      </div>
      <div className="oq-grid">
        {items.map((it) => {
          const delta = it.value - it.base;
          const flat = delta === 0;
          const good = it.goodUp ? delta > 0 : delta < 0;
          const cls = flat ? "oq-flat" : good ? "oq-up-good" : "oq-down-bad";
          return (
            <div className="oq-item" key={it.key}>
              <div className="oq-row oq-row-value">
                <span className="oq-label">{it.label}</span>
                <span className="oq-value mono">{it.value}<em>{it.unit}</em></span>
              </div>
              <div className={`oq-row oq-row-delta ${cls}`}>
                <Icon name={flat ? "minus" : delta > 0 ? "trending-up" : "trending-down"} size="0.875rem" />
                <b className="mono">{flat ? "持平" : `${delta > 0 ? "+" : ""}${delta}${it.unit}`}</b>
                <span className="oq-base mono">昨日 {it.base}{it.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
