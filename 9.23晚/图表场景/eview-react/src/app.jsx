// App entry — 数据指标判断页（eview-react 版）
// Provider 与 IntlProvider 已在 main.jsx 装配，本文件只负责页面装配。

import { useMemo, useState } from "react";
import HeaderBar from "./views/header-bar/index.jsx";
import KpiOverview from "./views/kpi-overview/index.jsx";
import TrendPanel from "./views/trend-panel/index.jsx";
import DomainPanel from "./views/domain-panel/index.jsx";
import MetricTable from "./views/metric-table/index.jsx";
import { metricRows } from "./mock/metrics.js";
import "./app.css";

const DEFAULT_FILTERS = { domain: "all", verdict: "all", keyword: "" };

function judgeVerdict(rate) {
  if (rate >= 98) return "pass";
  if (rate >= 94) return "warn";
  return "fail";
}

function PageShell() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [period, setPeriod] = useState("月");

  const rows = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    return metricRows.filter((row) => {
      if (filters.domain !== "all" && row.domain !== filters.domain) return false;
      if (filters.verdict !== "all" && row.verdict !== filters.verdict) return false;
      if (keyword) {
        const haystack = `${row.name}${row.code}${row.owner}`.toLowerCase();
        if (!haystack.includes(keyword)) return false;
      }
      return true;
    });
  }, [filters]);

  const stats = useMemo(() => {
    const total = rows.length;
    const sum = rows.reduce((acc, row) => acc + row.rate, 0);
    const avgRate = total ? sum / total : 0;
    return {
      total,
      avgRate,
      avgDelta: avgRate - 97.6,
      pass: rows.filter((row) => row.verdict === "pass").length,
      warn: rows.filter((row) => row.verdict === "warn").length,
      fail: rows.filter((row) => row.verdict === "fail").length,
    };
  }, [rows]);

  const focusList = useMemo(
    () => [...rows].sort((a, b) => a.rate - b.rate).slice(0, 5),
    [rows]
  );

  const activeRule = judgeVerdict(stats.avgRate || 0);

  return (
    <div className="app-root">
      <HeaderBar
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        period={period}
        onPeriodChange={setPeriod}
      />
      <main className="page-body">
        <KpiOverview stats={stats} total={stats.total} />
        <TrendPanel stats={stats} activeRule={activeRule} />
        <DomainPanel focusList={focusList} />
        <MetricTable rows={rows} />
      </main>
    </div>
  );
}

export default function App() {
  return <PageShell />;
}
