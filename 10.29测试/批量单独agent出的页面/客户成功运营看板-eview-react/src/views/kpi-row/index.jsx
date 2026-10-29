import KpiCard from "../../components/kpi-card/index.jsx";
import { kpiCards } from "../../mock/dashboard.jsx";
import "./index.css";

// ② KPI 行 — 4 张指标卡(本月快照,不受下方筛选联动)
export default function KpiRow() {
  return (
    <section className="kpi-row">
      {kpiCards.map((data) => (
        <KpiCard key={data.key} data={data} />
      ))}
    </section>
  );
}
