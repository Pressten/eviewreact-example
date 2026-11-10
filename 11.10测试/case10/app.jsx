// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: 版本/选中接口/Drawer/公告/筛选/滚动联动 + 暗色切换)
//   Layer 2 mock data     → src/mock/              (api-registry / api-details / error-codes / changelog / docs)
//   Layer 3 reusable      → src/components/{name}/ (method-tag / status-tag / code-block)
//   Layer 4 views         → src/views/{name}/      (top-bar / doc-sidebar / doc-body / section-* / api-drawer / announcement-modal)
//   Layer 5 layout        → app.jsx                (Provider + 两栏文档布局 + 弹层组装)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { ConfigProvider, Empty } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import TopBar from "./src/views/top-bar/index.jsx";
import DocSidebar from "./src/views/doc-sidebar/index.jsx";
import DocBody from "./src/views/doc-body/index.jsx";
import ApiDrawer from "./src/views/api-drawer/index.jsx";
import AnnouncementModal from "./src/views/announcement-modal/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider
        locale={zhCN}
        wave={{ disabled: true }}
        renderEmpty={() => <Empty style={{ padding: "2rem 0" }} />}
        empty={{ image: "./assets/uploads/empty.svg" }}
        spin={{ indicator: <img src="./assets/uploads/loading.svg" alt="" className="custom-spin-indicator" /> }}
      >
        <div className="app-root">
          <TopBar />
          <div className="page-body">
            <DocSidebar />
            <DocBody />
          </div>
          {/* 弹层：接口详情 Drawer + 版本更新公告 Modal（portal 渲染） */}
          <ApiDrawer />
          <AnnouncementModal />
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
