// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (metrics / records / lineage)
//   Layer 3 reusable      → src/components/{name}/ (status-tag / context-banner)
//   Layer 4 views         → src/views/{name}/      (page-header / data-tabs / metric-list / record-detail / lineage-trace)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { ConfigProvider } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import PageHeader from "./src/views/page-header/index.jsx";
import DataTabs from "./src/views/data-tabs/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <div className="app-root">
          <PageHeader />
          <main className="page-main">
            <DataTabs />
          </main>
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
