// App entry — ICT React page (eview-react 版)
// Provider（ConfigProvider + IntlProvider + AppProvider）已在 main.jsx 组装，本文件只做布局骨架。
// 分层约定（一文件夹一组件，kebab-case + index.jsx/index.css）：
//   Layer 1 全局状态  → context.jsx
//   Layer 2 mock 数据 → mock/
//   Layer 3 复用组件  → components/{name}/
//   Layer 4 视图      → views/{name}/
//   Layer 5 布局      → app.jsx（本文件）

import { useApp } from "./context.jsx";
import { ToastContainer } from "./shared/toast.jsx";
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
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return <Shell />;
}
