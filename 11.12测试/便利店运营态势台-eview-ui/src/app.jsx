// App entry — 连锁便利店「网点运营态势台」
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (大区/省份联动 + 门店数据 + 换肤)
//   Layer 2 mock data     → src/mock/data.js       (480 家门店唯一事实来源)
//   Layer 3 reusable      → src/components/{name}/ (section-card / delta-chip)
//   Layer 4 views         → src/views/{name}/      (9 大区块视图)
//   Layer 5 layout        → app.jsx                (根容器装配；Provider 由 main.jsx 接线)
//
// 注：eview-ui 黑白主题 + antd ConfigProvider 已由 scaffold 接线（main.jsx:
// IntlProvider > AppProvider > ThemeProvider > App；useTheme.jsx 的 ThemeProvider 消费
// useApp().isDark 单点驱动 html .dark 轨 + eview-ui ConfigProvider theme 轨），此处不再
// 另写 ConfigProvider；AppProvider 也由 main.jsx 在 ThemeProvider 外层包裹，本文件只渲染业务树。

import HeaderNav from "./views/header-nav/index.jsx";
import KpiRow from "./views/kpi-row/index.jsx";
import OpsBriefing from "./views/ops-briefing/index.jsx";
import RegionGrid from "./views/region-grid/index.jsx";
import StoreTable from "./views/store-table/index.jsx";
import SupplyBoard from "./views/supply-board/index.jsx";
import CircleChart from "./views/circle-chart/index.jsx";
import InspectionPanel from "./views/inspection-panel/index.jsx";
import TrendSection from "./views/trend-section/index.jsx";
import StoreDrawer from "./views/store-drawer/index.jsx";
import RestockModal from "./views/restock-modal/index.jsx";
import "./app.css";

export default function App() {
  return (
    <div className="app-root">
      <HeaderNav />
      <main className="page-body">
        <KpiRow />
        <OpsBriefing />
        <RegionGrid />
        <StoreTable />
        <div className="duo-row">
          <SupplyBoard />
          <CircleChart />
        </div>
        <InspectionPanel />
        <TrendSection />
      </main>
      <StoreDrawer />
      <RestockModal />
    </div>
  );
}
