// App entry — CSM 客户成功运营总台
// Layer 5: Provider + 全部 8 个区块装配
//   ① top-nav ② kpi-row ③ filter-bar ④⑤ trend-section
//   ⑥ risk-table + ⑦ right-sidebar(并排) ⑧ announcement

import { AppProvider } from "./context.jsx";
import TopNav from "./views/top-nav/index.jsx";
import KpiRow from "./views/kpi-row/index.jsx";
import FilterBar from "./views/filter-bar/index.jsx";
import TrendSection from "./views/trend-section/index.jsx";
import RiskTable from "./views/risk-table/index.jsx";
import RightSidebar from "./views/right-sidebar/index.jsx";
import Announcement from "./views/announcement/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <TopNav />
        <main className="page-body">
          <KpiRow />
          <FilterBar />
          <TrendSection />
          <div className="table-sidebar-row">
            <RiskTable />
            <RightSidebar />
          </div>
          <Announcement />
        </main>
      </div>
    </AppProvider>
  );
}
