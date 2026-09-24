// App entry — 网络规划（拓扑规划 + IP规划）
// Provider 与 IntlProvider 在 main.jsx；本文件只做布局组装。
import { AppProvider } from "./context.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import SideNav from "./views/side-nav/index.jsx";
import PageHead from "./views/page-head/index.jsx";
import TopologyPlan from "./views/topology-plan/index.jsx";
import IpPlan from "./views/ip-plan/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <HeaderBar />
        <div className="app-body">
          <SideNav />
          <main className="app-main">
            <div className="app-content">
              <PageHead />
              <TopologyPlan />
              <IpPlan />
            </div>
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
