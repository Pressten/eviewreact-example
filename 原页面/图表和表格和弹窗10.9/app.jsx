// App entry — 智慧能源运维数据看板
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx
//   Layer 2 mock data     → src/mock/             (dashboard.js)
//   Layer 3 reusable      → src/components/       (stat-card / status-tag)
//   Layer 4 views         → src/views/            (top-nav / side-menu / kpi-row / chart-board / device-table / detail-modal)
//   Layer 5 layout        → app.jsx               (Provider + root container assembly)

import { useState } from "react";
import { ConfigProvider } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import TopNav from "./src/views/top-nav/index.jsx";
import SideMenu from "./src/views/side-menu/index.jsx";
import KpiRow from "./src/views/kpi-row/index.jsx";
import ChartBoard from "./src/views/chart-board/index.jsx";
import DeviceTable from "./src/views/device-table/index.jsx";
import DetailModal from "./src/views/detail-modal/index.jsx";
import { deviceList } from "./src/mock/dashboard.js";
import "./app.css";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [detailOpen, setDetailOpen] = useState(true); // 详情弹窗默认弹出
  const [activeDevice, setActiveDevice] = useState(deviceList[2]);

  const openDetail = (device) => {
    setActiveDevice(device);
    setDetailOpen(true);
  };

  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <div className="app-root">
          <TopNav onToggleCollapse={() => setCollapsed((c) => !c)} />
          <div className="app-body">
            <SideMenu collapsed={collapsed} />
            <main className="app-main">
              <KpiRow />
              <ChartBoard />
              <DeviceTable onView={openDetail} />
            </main>
          </div>
          <DetailModal
            open={detailOpen}
            device={activeDevice}
            onClose={() => setDetailOpen(false)}
          />
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
