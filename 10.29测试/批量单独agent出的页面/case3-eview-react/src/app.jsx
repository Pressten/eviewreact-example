// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → ./context.jsx        (AppProvider: 全局筛选 + 跨区块联动 + dark mode toggle)
//   Layer 2 mock data     → ./mock/dashboard.js  (客户成功运营总台数据层 + 统一客户档案)
//   Layer 3 reusable      → ./components/{name}/ (section-card / status-tag / chart-actions / form-sheet)
//   Layer 4 views         → ./views/{name}/      (top-nav / kpi-cards / alert-ticker / filter-bar / trend-card /
//                                                   health-pie-card / risk-table / expiring-list / quick-actions /
//                                                   team-workload / announcement-bar(悬浮) / customer-drawer /
//                                                   follow-up-modal / transfer-modal)
//   Layer 5 layout        → app.jsx                (Provider + 区块装配 + 全局抽屉与弹窗挂载)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.
// 暗色双轨切换（.dark on <html> + aui3_1_dark on <body>）由 context.jsx 的 AppProvider useEffect 驱动；
// eview-react ConfigProvider + IntlProvider 已在 main.jsx 配好，业务层不再设 Provider。

import { AppProvider, useApp } from "./context.jsx";
import DivMessage from "@nce/eview-react/DivMessage";
import TopNav from "./views/top-nav/index.jsx";
import KpiCards from "./views/kpi-cards/index.jsx";
import AlertTicker from "./views/alert-ticker/index.jsx";
import FilterBar from "./views/filter-bar/index.jsx";
import TrendCard from "./views/trend-card/index.jsx";
import HealthPieCard from "./views/health-pie-card/index.jsx";
import RiskTable from "./views/risk-table/index.jsx";
import ExpiringList from "./views/expiring-list/index.jsx";
import QuickActions from "./views/quick-actions/index.jsx";
import TeamWorkload from "./views/team-workload/index.jsx";
import AnnouncementBar from "./views/announcement-bar/index.jsx";
import CustomerDrawer from "./views/customer-drawer/index.jsx";
import FollowUpModal from "./views/follow-up-modal/index.jsx";
import TransferModal from "./views/transfer-modal/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

// 全局轻量通知浮层（替代 antd message.success/info() 命令式 API）
// 复刻 antd message 顶部居中浮层：position:fixed 居中；DivMessage display 受控于 notice
function NotificationLayer() {
  const { notice, closeNotice } = useApp();
  if (!notice) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1050,
      }}
    >
      <DivMessage
        key={notice.key}
        display
        type={notice.type === "info" ? "default" : notice.type}
        text={notice.text}
        enableDisposeTimeOut={!notice.persistent}
        onClose={closeNotice}
      />
    </div>
  );
}

function AppShell() {
  return (
    <>
      <NotificationLayer />
      <div className="app-root">
        {/* ① 顶部导航 */}
        <TopNav />
        <main className="page-main">
          {/* ② KPI 指标卡行（点击下钻） */}
          <KpiCards />
          {/* 实时风险告警轮播条 */}
          <AlertTicker />
          {/* ③ 筛选条（时间范围 / 行业 / 关键词，联动下方数据区） */}
          <FilterBar />
          {/* ④ 趋势区 + ⑤ 构成区（饼图扇区可下钻表格） */}
          <div className="charts-row">
            <TrendCard />
            <HealthPieCard />
          </div>
          {/* ⑥ 风险客户表格（全宽，多选批量 / 行点击详情） */}
          <RiskTable />
          {/* ⑦ 到期榜单 + 团队负载 + 快捷操作（底部三卡等高对齐） */}
          <section className="bottom-grid">
            <ExpiringList />
            <TeamWorkload />
            <QuickActions />
          </section>
        </main>
      </div>

      {/* ⑧ 产品公告：右下角悬浮，可展开/收起 */}
      <AnnouncementBar />

      {/* 全局客户详情抽屉与操作弹窗 */}
      <CustomerDrawer />
      <FollowUpModal />
      <TransferModal />
    </>
  );
}
