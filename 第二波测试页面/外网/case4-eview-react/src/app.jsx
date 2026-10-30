// App entry — 电商平台店铺装修管理台
// Layer 5: 布局骨架 — 顶部导航 / 页面页签 / 左(组件表格 + 楼层结构画布 + 智能建议 + 素材库 + 数据看板 + 发布记录) 右(大促冲刺工作台)
//
// Layering convention:
//   Layer 1 global state  → src/context.jsx        (AppProvider 换肤 + DecorationProvider 装修业务)
//   Layer 2 mock data     → src/mock/              (material.js 素材 / decoration.js 装修业务)
//   Layer 3 reusable      → src/components/{name}/
//   Layer 4 views         → src/views/{name}/      (top-nav / page-tabs / floor-table / floor-canvas ...)
//   Layer 5 layout        → app.jsx

import { AppProvider, DecorationProvider } from "./context.jsx";
import TopNav from "./views/top-nav/index.jsx";
import PageTabsBar from "./views/page-tabs/index.jsx";
import FloorTable from "./views/floor-table/index.jsx";
import FloorCanvas from "./views/floor-canvas/index.jsx";
import SmartSuggest from "./views/smart-suggest/index.jsx";
import MaterialLib from "./views/material-lib/index.jsx";
import DataBoard from "./views/data-board/index.jsx";
import PublishTimeline from "./views/publish-timeline/index.jsx";
import EditFloorModal from "./views/edit-modal/index.jsx";
import SprintPanel from "./views/sprint-panel/index.jsx";
import AppToastContainer from "./shared/AppToast/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <DecorationProvider>
        <div className="deco-app">
          <TopNav />
          <PageTabsBar />
          <main className="deco-main">
            <section className="deco-left">
              <FloorTable />
              <div className="deco-cards deco-cards-duo">
                <FloorCanvas />
                <SmartSuggest />
              </div>
              <div className="deco-cards">
                <MaterialLib />
                <DataBoard />
                <PublishTimeline />
              </div>
            </section>
            <SprintPanel />
          </main>
          <EditFloorModal />
          <AppToastContainer />
        </div>
      </DecorationProvider>
    </AppProvider>
  );
}
