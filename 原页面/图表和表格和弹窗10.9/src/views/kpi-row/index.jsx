// Layer 4: KPI 概览区
import StatCard from "../../components/stat-card/index.jsx";
import { kpiList } from "../../mock/dashboard.js";
import "./index.css";

export default function KpiRow() {
  return (
    <section className="kpi-row">
      {kpiList.map((k) => (
        <StatCard key={k.key} {...k} />
      ))}
    </section>
  );
}
