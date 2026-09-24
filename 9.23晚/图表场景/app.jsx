// App entry — 数据指标判断页
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. metrics.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. verdict-tag)
//   Layer 4 views         → src/views/{name}/      (one per section, e.g. header-bar)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)

import { useMemo, useState } from "react";
import { ConfigProvider } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import HeaderBar from "./src/views/header-bar/index.jsx";
import KpiOverview from "./src/views/kpi-overview/index.jsx";
import TrendPanel from "./src/views/trend-panel/index.jsx";
import DomainPanel from "./src/views/domain-panel/index.jsx";
import MetricTable from "./src/views/metric-table/index.jsx";
import { metricRows } from "./src/mock/metrics.js";
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
  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <PageShell />
      </ConfigProvider>
    </AppProvider>
  );
}
