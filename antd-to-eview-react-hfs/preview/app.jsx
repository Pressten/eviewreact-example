// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: 主题 + 图表/表格联动状态)
//   Layer 2 mock data     → src/mock/device.js     (设备监控域 mock 数据)
//   Layer 3 reusable      → src/components/{name}/ (status-tag / stat-card)
//   Layer 4 views         → src/views/{name}/      (header-bar / stat-overview / chart-panel / device-table)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { ConfigProvider } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import HeaderBar from "./src/views/header-bar/index.jsx";
import StatOverview from "./src/views/stat-overview/index.jsx";
import ChartPanel from "./src/views/chart-panel/index.jsx";
import DeviceTable from "./src/views/device-table/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <div className="app-root">
          <HeaderBar />
          <main className="page-body">
            <StatOverview />
            <ChartPanel />
            <DeviceTable />
          </main>
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
