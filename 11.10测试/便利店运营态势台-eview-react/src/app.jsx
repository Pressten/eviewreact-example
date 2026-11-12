// App entry — 连锁便利店「网点运营态势台」
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (大区/省份联动 + 门店数据 + 换肤)
//   Layer 2 mock data     → src/mock/data.js       (480 家门店唯一事实来源)
//   Layer 3 reusable      → src/components/{name}/ (section-card / delta-chip)
//   Layer 4 views         → src/views/{name}/      (9 大区块视图)
//   Layer 5 layout        → app.jsx                (Provider + 根容器装配)

import { AppProvider } from "./context.jsx";
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
import Notice from "./components/notice/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
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
        <Notice />
      </div>
    </AppProvider>
  );
}
