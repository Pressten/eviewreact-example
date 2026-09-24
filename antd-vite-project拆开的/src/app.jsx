import { useApp } from "./context.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import SideBar from "./views/side-bar/index.jsx";
import OverviewView from "./views/overview-view/index.jsx";
import ManagementView from "./views/management-view/index.jsx";
import SyncView from "./views/sync-view/index.jsx";
import RecycleView from "./views/recycle-view/index.jsx";
import "./app.css";

export default function App() {
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
