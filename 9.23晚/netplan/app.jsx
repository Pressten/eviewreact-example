// App entry — 网络规划（拓扑规划 + IP规划）
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: 主题模式 + 全局状态)
//   Layer 2 mock data     → src/mock/              (nav / topology / ip)
//   Layer 3 reusable      → src/components/        (section-card / notice-bar / status-tag / empty-block / table-toolbar)
//   Layer 4 views         → src/views/             (header-bar / side-nav / page-head / topology-plan / ip-plan)
//   Layer 5 layout        → app.jsx                (Provider + 根容器组装)
//
// Styling: custom styles in each component folder's index.css; prefer tokens for visual values.

import { ConfigProvider } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import HeaderBar from "./src/views/header-bar/index.jsx";
import SideNav from "./src/views/side-nav/index.jsx";
import PageHead from "./src/views/page-head/index.jsx";
import TopologyPlan from "./src/views/topology-plan/index.jsx";
import IpPlan from "./src/views/ip-plan/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <div className="app-root">
          <HeaderBar />
          <div className="app-body">
            <SideNav />
            <main className="app-main">
              <div className="app-content">
                <PageHead />
                <TopologyPlan />
                <IpPlan />
              </div>
            </main>
          </div>
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
