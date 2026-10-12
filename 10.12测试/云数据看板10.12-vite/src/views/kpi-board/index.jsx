import StatCard from "../../components/stat-card/index.jsx";
import { kpis } from "../../mock/dashboard.jsx";
import "./index.css";

export default function KpiBoard() {
  return (
    <div className="kpi-board">
      {kpis.map((k) => (
        <StatCard key={k.key} {...k} />
      ))}
    </div>
  );
}
