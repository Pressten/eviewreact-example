// App entry — 连锁便利店「网点运营态势台」
// Provider 层级已上提到 main.jsx：IntlProvider > AppProvider > ThemeProvider > App。
//   - AppProvider（src/context.jsx）：业务全局状态 + isDark/toggleDark（业务组件用 useApp 消费）
//   - ThemeProvider（src/theme/useTheme.jsx）：消费 useApp().isDark，html .dark 轨 +
//     eview-ui ConfigProvider theme 轨（locale="zh" version="aui3-1"），由 scaffold 预制
// 本文件只保留业务树（暗色切换 UI 在 HeaderNav 内，调用 toggleDark）。

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
import { ToastProvider } from "./components/toast/index.jsx";
import "./app.css";

// TODO(eview-ui): ToastProvider 包裹业务树——antd 命令式 message.success/info 转受控 DivMessage
// 浮层（migration-workflow.md §7.3）。浮层抽离为独立组件 + 自己的 state，规避输入组件焦点竞争。
export default function App() {
  return (
    <ToastProvider>
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
    </ToastProvider>
  );
}
