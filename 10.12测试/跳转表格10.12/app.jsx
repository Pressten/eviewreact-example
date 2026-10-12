// App entry — 数据管理页面
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: 主题/侧栏/页签联动)
//   Layer 2 mock data     → src/mock/              (task.js / record.js)
//   Layer 3 reusable      → src/components/{name}/ (status-tag / step-flow)
//   Layer 4 views         → src/views/{name}/      (header-bar / side-nav / stat-cards / data-tabs / ...)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)

import { ConfigProvider, Empty } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import HeaderBar from "./src/views/header-bar/index.jsx";
import SideNav from "./src/views/side-nav/index.jsx";
import StatCards from "./src/views/stat-cards/index.jsx";
import DataTabs from "./src/views/data-tabs/index.jsx";
import "./app.css";


export default function App() {
  return (
    <AppProvider>
      <ConfigProvider
        locale={zhCN}
        wave={{ disabled: true }}
        renderEmpty={() => <Empty />}
        empty={{ image: "./assets/uploads/empty.svg" }}
        spin={{ indicator: <img src="./assets/uploads/loading.svg" alt="" className="custom-spin-indicator" /> }}
      >
        <div className="app-root">
          <HeaderBar />
          <div className="app-body">
            <SideNav />
            <main className="app-main">
              <div className="page-head">
                <h2 className="page-head__title">数据管理</h2>
                <p className="page-head__desc">统一管理数据接入、加工与调度的全链路任务，支持阶段进度追踪与链路下钻</p>
              </div>
              <StatCards />
              <DataTabs />
            </main>
          </div>
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
