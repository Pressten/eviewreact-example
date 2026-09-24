// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. device.js / alarm.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. status-tag / section-card)
//   Layer 4 views         → src/views/{name}/      (one per tab/section, e.g. device-table / header-bar)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { ConfigProvider } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider, useApp } from "./src/context.jsx";
import HeaderBar from "./src/views/header-bar/index.jsx";
import SideBar from "./src/views/side-bar/index.jsx";
import OverviewView from "./src/views/overview-view/index.jsx";
import ManagementView from "./src/views/management-view/index.jsx";
import SyncView from "./src/views/sync-view/index.jsx";
import RecycleView from "./src/views/recycle-view/index.jsx";
import "./app.css";

function Shell() {
  const { activeMenu } = useApp();
  return (
    <div className="app-root">
      <HeaderBar />
      <div className="app-body">
        <SideBar />
        <main className="app-main" key={activeMenu}>
          {activeMenu === "overview" && <OverviewView />}
          {activeMenu === "management" && <ManagementView />}
          {activeMenu === "sync" && <SyncView />}
          {activeMenu === "recycle" && <RecycleView />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <Shell />
      </ConfigProvider>
    </AppProvider>
  );
}
