// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. datasource.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. page-card / form-field / status-tag)
//   Layer 4 views         → src/views/{name}/      (one per tab/section, e.g. header-bar / datasource-table)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { ConfigProvider, Breadcrumb } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import HeaderBar from "./src/views/header-bar/index.jsx";
import SideNav from "./src/views/side-nav/index.jsx";
import FilterPanel from "./src/views/filter-panel/index.jsx";
import DatasourceTable from "./src/views/datasource-table/index.jsx";
import DatasourceModal from "./src/views/datasource-modal/index.jsx";
import ConfirmModal from "./src/views/confirm-modal/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <div className="app-root">
          <HeaderBar />
          <div className="app-body">
            <SideNav />
            <main className="app-main">
              <div className="page-head">
                <Breadcrumb
                  items={[{ title: "首页" }, { title: "数据管理" }, { title: "数据源管理" }]}
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
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
