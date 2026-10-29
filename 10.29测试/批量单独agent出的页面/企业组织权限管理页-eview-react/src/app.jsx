// App entry — ICT React page · 企业管理中心·组织与权限页
// Layering convention:
//   Layer 1 global state  → src/context.jsx        (AppProvider: 业务状态 + 暗色切换)
//   Layer 2 mock data     → src/mock/              (organization / members / permissions / audit-logs)
//   Layer 3 reusable      → src/components/{name}/ (role-tag / status-dot / section-card)
//   Layer 4 views         → src/views/{name}/      (top-nav / page-breadcrumb / org-tree / member-table / permission-panel / role-distribution / audit-log / member-drawer / invite-modal / department-modal / transfer-modal)
//   Layer 5 layout        → app.jsx                (Provider + 三栏布局装配)
//
// Styling: 自定义样式在各组件 index.css；token-first；不创建 antd 重写文件。

import { AppProvider } from "./context.jsx";
import TopNav from "./views/top-nav/index.jsx";
import PageBreadcrumb from "./views/page-breadcrumb/index.jsx";
import OrgTree from "./views/org-tree/index.jsx";
import MemberTable from "./views/member-table/index.jsx";
import PermissionPanel from "./views/permission-panel/index.jsx";
import RoleDistribution from "./views/role-distribution/index.jsx";
import AuditLog from "./views/audit-log/index.jsx";
import MemberDrawer from "./views/member-drawer/index.jsx";
import InviteModal from "./views/invite-modal/index.jsx";
import DepartmentModal from "./views/department-modal/index.jsx";
import TransferModal from "./views/transfer-modal/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        {/* 区块 ① 顶部主导航 */}
        <TopNav />
        {/* 区块 ② 面包屑 + 区块 ⑧ 顶部操作区 */}
        <PageBreadcrumb />
        {/* 区块 ③④⑤⑥⑦ 三栏主区域 */}
        <main className="app-main">
          <aside className="app-main__left">
            {/* 区块 ③ 组织树 */}
            <OrgTree />
          </aside>
          <section className="app-main__center">
            {/* 区块 ④ 成员表格 */}
            <div className="app-main__table">
              <MemberTable />
            </div>
            {/* 区块 ⑥ 角色分布 + 区块 ⑦ 审计日志 */}
            <div className="app-main__bottom">
              <div className="app-main__bottom-item">
                <RoleDistribution />
              </div>
              <div className="app-main__bottom-item">
                <AuditLog />
              </div>
            </div>
          </section>
          <aside className="app-main__right">
            {/* 区块 ⑤ 权限面板 */}
            <PermissionPanel />
          </aside>
        </main>
        {/* 浮层：成员详情抽屉 + 三个模态弹窗 */}
        <MemberDrawer />
        <InviteModal />
        <DepartmentModal />
        <TransferModal />
      </div>
    </AppProvider>
  );
}
