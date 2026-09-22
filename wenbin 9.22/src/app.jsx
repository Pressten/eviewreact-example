// App entry — ICT React page (eview-react 版本)
// Provider 在 main.jsx：ConfigProvider + IntlProvider；aui3_1 挂 <body>。
import { AppProvider, useApp } from "./context.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import SideBar from "./views/side-bar/index.jsx";
import OverviewView from "./views/overview-view/index.jsx";
import ManagementView from "./views/management-view/index.jsx";
import SyncView from "./views/sync-view/index.jsx";
import RecycleView from "./views/recycle-view/index.jsx";
import { MessageContainer } from "./shared/message.jsx";
import { ConfirmContainer } from "./shared/confirm.jsx";
import "./shared/helpers.css";
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
      <MessageContainer />
      <ConfirmContainer />
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
