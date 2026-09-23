import StatCard from "../../components/stat-card/index.jsx";
import { useApp } from "../../context.jsx";
import { DEVICES, STATUS_LIST } from "../../mock/device.js";
import "./index.css";

// KPI 总览:卡片点击 → 按状态联动筛选图表与表格
export default function StatOverview() {
  const { statusFilter, toggleStatusFilter, setStatusFilter } = useApp();

  const counts = STATUS_LIST.reduce((acc, item) => {
    acc[item.key] = DEVICES.filter((d) => d.status === item.key).length;
    return acc;
  }, {});

  return (
    <section className="stat-overview" aria-label="设备指标总览">
      <StatCard
        icon="server"
        tone="primary"
        label="设备总数"
        value={DEVICES.length}
        unit="台"
        delta="较上周新增 3 台"
        deltaIcon="trending-up"
        active={statusFilter === null}
        onClick={() => setStatusFilter(null)}
      />
      <StatCard
        icon="circle-check-big"
        tone="success"
        label="运行中"
        value={counts.running}
        unit="台"
        delta={"在线率 " + Math.round((counts.running / DEVICES.length) * 100) + "%"}
        deltaIcon="trending-up"
        active={statusFilter === "running"}
        onClick={() => toggleStatusFilter("running")}
      />
      <StatCard
        icon="triangle-alert"
        tone="error"
        label="告警设备"
        value={counts.alarm}
        unit="台"
        delta={"今日新增告警 " + DEVICES.reduce((sum, d) => sum + d.alarmCount, 0) + " 条"}
        deltaIcon="trending-up"
        active={statusFilter === "alarm"}
        onClick={() => toggleStatusFilter("alarm")}
      />
      <StatCard
        icon="power"
        tone="critical"
        label="停机检修"
        value={counts.stopped}
        unit="台"
        delta="2 台计划内检修"
        deltaIcon="trending-down"
        active={statusFilter === "stopped"}
        onClick={() => toggleStatusFilter("stopped")}
      />
      <StatCard
        icon="wifi-off"
        tone="neutral"
        label="离线设备"
        value={counts.offline}
        unit="台"
        delta="通讯中断待排查"
        deltaIcon="trending-down"
        active={statusFilter === "offline"}
        onClick={() => toggleStatusFilter("offline")}
      />
    </section>
  );
}
