// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (weekly-report.js: 周报数据域)
//   Layer 3 reusable      → src/components/{name}/ (section-card / metric-card)
//   Layer 4 views         → src/views/{name}/      (report-header / kpi-cards / store-compare / ...)
//   Layer 5 layout        → app.jsx                (Provider + 周报 9 区块装配,持有门店范围筛选状态)
//
// 门店范围筛选（页头 Select）联动: ③ 门店销售对比 / ⑤ 城市排行 / ⑦ 目标完成度 / ⑧ 区域进度
//
// 暗色模式: ConfigProvider(theme.darkAlgorithm) 已删除，换为 context.jsx 的 AppProvider 内
// useEffect 同时切换 <html>.dark（token CSS 变量）与 <body>.aui3_1_dark（eview 暗色 CSS）。
// 主题切换按钮（sun/moon）在 views/global-nav，通过 useApp().toggleDark 驱动。

import { useMemo, useState } from "react";
import { AppProvider } from "./context.jsx";
import { STORES, WEEK_INFO, buildKpiList, filterStoresByScope } from "./mock/weekly-report.jsx";
import GlobalNav from "./views/global-nav/index.jsx";
import ReportHeader from "./views/report-header/index.jsx";
import KpiCards from "./views/kpi-cards/index.jsx";
import StoreCompare from "./views/store-compare/index.jsx";
import SalesFunnel from "./views/sales-funnel/index.jsx";
import CityRank from "./views/city-rank/index.jsx";
import CategoryMargin from "./views/category-margin/index.jsx";
import TargetGauge from "./views/target-gauge/index.jsx";
import RegionProgress from "./views/region-progress/index.jsx";
import WeeklyNews from "./views/weekly-news/index.jsx";
import "./app.css";

export default function App() {
  const [scope, setScope] = useState("ALL");
  const scopedStores = useMemo(() => filterStoresByScope(scope), [scope]);
  const kpiList = useMemo(() => buildKpiList(), []);

  return (
    <AppProvider>
      <div className="app-root">
        {/* 顶部导航栏: 品牌 + 一级模块导航 + 全局工具与用户区（打印时隐藏） */}
        <GlobalNav />

        <div className="report-page">
          {/* ① 页头: 标题 + 时间范围 + 门店范围筛选 + 导出 PDF */}
          <ReportHeader scope={scope} onScopeChange={setScope} />

          {/* ② 周核心指标卡 × 4（口径固定为全部门店,不随筛选联动） */}
          <div className="kpi-section-label">
            <span className="section-index">02</span>
            <span className="kpi-section-name">周核心指标</span>
            <span className="kpi-section-note">口径为全部门店 · 点击卡片查看近 8 周趋势与同比</span>
          </div>
          <KpiCards kpiList={kpiList} />

          {/* ③ 门店销售对比（联动） */}
          <StoreCompare stores={scopedStores} />

          <div className="report-grid">
            {/* ④ 销售漏斗（全部门店口径） */}
            <SalesFunnel stores={STORES} />
            {/* ⑤ 城市排行（联动） */}
            <CityRank stores={scopedStores} />
          </div>

          <div className="report-grid">
            {/* ⑥ 品类毛利率排名（全品类口径） */}
            <CategoryMargin />
            {/* ⑦ 目标完成度（联动） */}
            <TargetGauge stores={scopedStores} />
          </div>

          {/* ⑧ 区域进度（联动） */}
          <RegionProgress stores={scopedStores} />

          {/* ⑨ 周要闻与下周重点 */}
          <WeeklyNews />

          <footer className="report-footer">
            {WEEK_INFO.brandName} · 连锁零售运营周报 · 第 {WEEK_INFO.weekNumber} 周 ·
            数据截至 {WEEK_INFO.compileTime} · 由 BI 平台自动汇总
          </footer>
        </div>
      </div>
    </AppProvider>
  );
}
