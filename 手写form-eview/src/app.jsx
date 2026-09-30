// App entry — ICT React page (migrated to eview-react scaffold)
// antd ConfigProvider + zhCN locale removed; scaffold main.jsx provides
// eview-react ConfigProvider + IntlProvider.
// Dark mode: context.jsx toggles both .dark on <html> (CSS vars) and
// aui3_1_dark on <body> (eview-react dark theme).

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
