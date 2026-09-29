// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. workorder.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. field-row / panel-card)
//   Layer 4 views         → src/views/{name}/      (one per tab/section, e.g. top-bar / side-nav)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { ConfigProvider } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider, useApp } from "./src/context.jsx";
import TopBar from "./src/views/top-bar/index.jsx";
import SideNav from "./src/views/side-nav/index.jsx";
import WorkorderPage from "./src/views/workorder-page/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <AppShell />
      </ConfigProvider>
    </AppProvider>
  );
}

function AppShell() {
  const { navCollapsed } = useApp();

  return (
    <div className={`app-root ${navCollapsed ? "app-root--collapsed" : ""}`}>
      <TopBar />
      <div className="app-body">
        <SideNav />
        <main className="app-main">
          <WorkorderPage />
        </main>
      </div>
    </div>
  );
}
