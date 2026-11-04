// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. device.js / alarm.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. status-tag / section-card)
//   Layer 4 views         → src/views/{name}/      (one per tab/section, e.g. device-table / header-bar)
//   src/utils/            → pure function utilities (formatNumber, debounce, etc.)
//   src/hooks/            → custom React hooks (useDebounce, useTableData, etc.)
//   src/constants/        → enums and config constants (STATUS_MAP, PAGE_SIZE, etc.)
//   src/styles/           → cross-view shared CSS (utility classes, keyframes; not antd overrides)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { useState } from "react";
import { AppProvider } from "./context.jsx";
import Sidebar from "./components/sidebar/index.jsx";
import HeaderBar from "./components/header-bar/index.jsx";
import AssetTree from "./views/asset-tree/index.jsx";
import "./app.css";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("assets");

  return (
    <AppProvider>
      <div className="app-root">
        <Sidebar
          collapsed={collapsed}
          activeKey={activeKey}
          onSelect={setActiveKey}
        />
        <div className="app-main">
          <HeaderBar
            collapsed={collapsed}
            onToggleSidebar={() => setCollapsed((c) => !c)}
          />
          <main className="app-content">
            <AssetTree />
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
