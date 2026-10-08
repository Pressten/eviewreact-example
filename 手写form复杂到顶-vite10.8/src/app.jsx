// App entry — ICT React page (migrated to eview-react Vite scaffold)
// antd ConfigProvider + zhCN locale removed: eview-react ConfigProvider +
// IntlProvider are wired in main.jsx. Dark mode now toggles CSS classes
// (.dark on <html>, aui3_1_dark on <body>) instead of antd theme.darkAlgorithm.
//
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. workorder.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. field-row / panel-card)
//   Layer 4 views         → src/views/{name}/      (one per tab/section, e.g. top-bar / side-nav)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { useEffect } from "react";
import { AppProvider, useApp } from "./context.jsx";
import TopBar from "./views/top-bar/index.jsx";
import SideNav from "./views/side-nav/index.jsx";
import WorkorderPage from "./views/workorder-page/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

function AppShell() {
  const { navCollapsed, isDark } = useApp();

  // 暗色模式：.dark 挂 <html>（token 变量翻转），aui3_1_dark 挂 <body>（eview 暗色 CSS）
  useEffect(() => {
    document.body.classList.toggle("aui3_1_dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

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
