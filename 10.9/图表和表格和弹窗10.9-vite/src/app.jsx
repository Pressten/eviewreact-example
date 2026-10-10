import { useState } from "react";
import { AppProvider } from "./context.jsx";
import TopNav from "./views/top-nav/index.jsx";
import SideMenu from "./views/side-menu/index.jsx";
import KpiRow from "./views/kpi-row/index.jsx";
import ChartBoard from "./views/chart-board/index.jsx";
import DeviceTable from "./views/device-table/index.jsx";
import DetailModal from "./views/detail-modal/index.jsx";
import { deviceList } from "./mock/dashboard.jsx";
import "./app.css";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [detailOpen, setDetailOpen] = useState(true);
  const [activeDevice, setActiveDevice] = useState(deviceList[2]);

  const openDetail = (device) => {
    setActiveDevice(device);
    setDetailOpen(true);
  };

  return (
    <AppProvider>
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
    </AppProvider>
  );
}
