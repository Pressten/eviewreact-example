import Crumbs from "@nce/eview-react/Crumbs";
import DivMessage from "@nce/eview-react/DivMessage";
import { AppProvider, useApp } from "./context.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import SideNav from "./views/side-nav/index.jsx";
import FilterPanel from "./views/filter-panel/index.jsx";
import DatasourceTable from "./views/datasource-table/index.jsx";
import DatasourceModal from "./views/datasource-modal/index.jsx";
import ConfirmModal from "./views/confirm-modal/index.jsx";
import "./app.css";

function AppShell() {
  const { notice, clearNotice } = useApp();
  return (
    <div className="app-root">
      <HeaderBar />
      <div className="app-body">
        <SideNav />
        <main className="app-main">
          <div className="page-head">
            <Crumbs
              data={[
                { title: "首页", url: "/" },
                { title: "数据管理", url: "/data" },
                { title: "数据源管理" },
              ]}
              seprator="/"
            />
            <h1 className="page-head__title">数据源管理</h1>
            <p className="page-head__desc">
              统一纳管全域数据源接入信息，维护连接配置、归属部门与同步状态。
            </p>
          </div>
          <FilterPanel />
          <DatasourceTable />
        </main>
      </div>
      <DatasourceModal />
      <ConfirmModal />
      {notice ? (
        <div className="app-notice">
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={clearNotice}
          />
        </div>
      ) : null}
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
