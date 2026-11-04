// App entry — ICT React page (migrated to eview-react Vite scaffold)
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
//
// i18n scenario A (hardcoded zh): IntlProvider + componentsLocales 已在 main.jsx 配好，
// antd ConfigProvider / antd-zh locale 已删除。antd 组件导入保留（阶段2 替换为 eview）。

import { useState, useEffect } from "react";
import Empty from "@nce/eview-react/Empty";
import { AppProvider, useApp } from "./context.jsx";
import Sidebar from "./components/sidebar/index.jsx";
import HeaderBar from "./components/header-bar/index.jsx";
import AssetTree from "./views/asset-tree/index.jsx";
import "./app.css";

// AppShell 挂在 AppProvider 内部，可调用 useApp() 取 isDark 并驱动双轨暗色类名：
//   body 轨 aui3_1_dark  → eview 组件库暗色（aui3_1.css / aui3_1_dark.css）
//   html 轨 .dark        → 自定义 token 四层（base/light/theme/dark.css 的 .dark 覆盖）
function AppShell() {
  const { isDark } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("assets");

  useEffect(() => {
    document.body.classList.toggle("aui3_1_dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
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
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
