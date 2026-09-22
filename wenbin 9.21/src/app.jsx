import { useApp } from "./context.jsx";
import { NoticeProvider } from "./components/notice/index.jsx";
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
    <NoticeProvider>
      <Shell />
    </NoticeProvider>
  );
}
