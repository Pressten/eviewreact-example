// App entry — eview-react 版
// 结构同源项目根 app.jsx：AppProvider + app-root 布局组装；antd ConfigProvider 已移除
// （组件文案与弹层文案由 main.jsx 的 ConfigProvider + IntlProvider 提供）。

import { AppProvider } from "./context.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import StatOverview from "./views/stat-overview/index.jsx";
import ChartPanel from "./views/chart-panel/index.jsx";
import DeviceTable from "./views/device-table/index.jsx";
import "../app.css";

export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <HeaderBar />
        <main className="page-body">
          <StatOverview />
          <ChartPanel />
          <DeviceTable />
        </main>
      </div>
    </AppProvider>
  );
}
