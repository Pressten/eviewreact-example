// App entry — ICT React page (UMD → Vite 标准化产物)
// antd ConfigProvider + zhCN locale 已删除：eview-react ConfigProvider + IntlProvider 在 main.jsx 配好。
// 暗色切换在 context.jsx 的 AppProvider 内（.dark 挂 <html> + aui3_1_dark 挂 <body>）。

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
