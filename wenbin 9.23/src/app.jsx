// App entry — ICT React page (migrated to eview-react)
// Provider 套层由 main.jsx 的 ConfigProvider + IntlProvider 提供；
// 本文件只保留 AppProvider（全局状态 + 暗色切换）+ 根布局装配。

import { AppProvider, useApp } from "./context.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import SideBar from "./views/side-bar/index.jsx";
import OverviewView from "./views/overview-view/index.jsx";
import ManagementView from "./views/management-view/index.jsx";
import SyncView from "./views/sync-view/index.jsx";
import RecycleView from "./views/recycle-view/index.jsx";
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
      <Shell />
    </AppProvider>
  );
}
