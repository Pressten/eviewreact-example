// App entry — NOC 监控中心（互联网 IT 运维监控告警）
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: 环境/时间范围/刷新/聚焦服务/告警/静默)
//   Layer 2 mock data     → src/mock/              (services / topology / metrics / alarms / operations)
//   Layer 3 reusable      → src/components/{name}/ (section-card / status-tag)
//   Layer 4 views         → src/views/{name}/      (header-bar / service-overview / golden-metrics /
//                            service-topology / realtime-charts / alarm-table / handover-timeline /
//                            change-feed / silence-modal)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)

import { ConfigProvider, Empty } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import HeaderBar from "./src/views/header-bar/index.jsx";
import ServiceOverview from "./src/views/service-overview/index.jsx";
import GoldenMetrics from "./src/views/golden-metrics/index.jsx";
import ServiceTopology from "./src/views/service-topology/index.jsx";
import RealtimeCharts from "./src/views/realtime-charts/index.jsx";
import AlarmTable from "./src/views/alarm-table/index.jsx";
import HandoverTimeline from "./src/views/handover-timeline/index.jsx";
import ChangeFeed from "./src/views/change-feed/index.jsx";
import SilenceModal from "./src/views/silence-modal/index.jsx";
import AlarmDetailDrawer from "./src/views/alarm-detail-drawer/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider
        locale={zhCN}
        wave={{ disabled: true }}
        renderEmpty={() => <Empty style={{ padding: "2rem 0" }} />}
        empty={{ image: "./assets/uploads/empty.svg" }}
        spin={{ indicator: <img src="./assets/uploads/loading.svg" alt="" className="custom-spin-indicator" /> }}
      >
        <div className="app-root">
          <HeaderBar />
          <main className="noc-main">
            <ServiceOverview />
            <GoldenMetrics />
            <ServiceTopology />
            <RealtimeCharts />
            <AlarmTable />
            <div className="noc-bottom-grid">
              <HandoverTimeline />
              <ChangeFeed />
            </div>
          </main>
          <SilenceModal />
          <AlarmDetailDrawer />
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
