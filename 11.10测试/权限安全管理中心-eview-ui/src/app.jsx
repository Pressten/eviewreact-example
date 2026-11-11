// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: 主题 + 权限中心业务状态)
//   Layer 2 mock data     → src/mock/              (org.js / perm.js / audit.js / policy.js)
//   Layer 3 reusable      → src/components/{name}/ (role-modal)
//   Layer 4 views         → src/views/{name}/      (top-bar / org-tree / perm-matrix / member-table /
//                                                   security-policy / data-scope / audit-log / footer-bar)
//   Layer 5 layout        → app.jsx                (root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.
//
// 黑白主题接线：AppProvider（isDark/toggleDark）+ ThemeProvider 由 main.jsx 接线，
// html .dark 轨与 eview-ui ConfigProvider theme 轨统一由 ThemeProvider 单点驱动；
// 本文件不再包裹 antd ConfigProvider（含 locale/theme.darkAlgorithm），也不自写暗色 useEffect。

import { useRef } from "react";
import Crumbs from "@cloudsop/eview-ui/Crumbs";
import Icon from "@/shared/Icon";
import Notify from "@/shared/Notify";
import { useApp } from "./context.jsx";
import { PERM_MODULES } from "./mock/perm.js";
import TopBar from "./views/top-bar/index.jsx";
import OrgTree from "./views/org-tree/index.jsx";
import PermMatrix from "./views/perm-matrix/index.jsx";
import MemberTable from "./views/member-table/index.jsx";
import SecurityPolicy from "./views/security-policy/index.jsx";
import DataScope from "./views/data-scope/index.jsx";
import AuditLog from "./views/audit-log/index.jsx";
import FooterBar from "./views/footer-bar/index.jsx";
import "./app.css";

// 页头概览统计（置于 Provider 内，读取实时业务状态）
function PageHeadStats() {
  const { roles, members, changeCount } = useApp();
  const stats = [
    { key: "roles", label: "角色", value: roles.length, icon: "shield-check", warn: false },
    { key: "modules", label: "功能模块", value: PERM_MODULES.length, icon: "layout-grid", warn: false },
    { key: "members", label: "组织成员", value: members.length, icon: "users", warn: false },
    { key: "changes", label: "未保存变更", value: changeCount, icon: "circle-alert", warn: true },
  ];
  return (
    <div className="page-stats">
      {stats.map((s) => (
        <div className={"stat-chip" + (s.warn && s.value > 0 ? " warn" : "")} key={s.key}>
          <Icon name={s.icon} size="0.875rem" className="stat-icon" />
          <span className="stat-value">{s.value}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const notifyRef = useRef(null);

  // Crumbs data：items→data；项 {title, url?}（href/path→url）；最后一项不传 url 即当前页
  const crumbsData = [
    { title: "系统设置", url: "system" },
    { title: "权限与安全" },
  ];

  return (
    <div className="app-root">
      <TopBar />
      <div className="page-shell">
        <div className="page-head">
          <div className="page-title">
            {/* Breadcrumb→Crumbs：onClick(url, event) 组件级（非每项）；message.info→受控 DivMessage */}
            <Crumbs
              data={crumbsData}
              onClick={(url) => {
                if (url === "system") {
                  notifyRef.current && notifyRef.current.show("info", "演示原型：返回「系统设置」目录");
                }
              }}
            />
            <h1>权限与安全</h1>
            <p className="page-desc">
              集中维护组织架构、角色权限矩阵与安全策略，支持操作审计回溯与变更留痕
            </p>
          </div>
          <PageHeadStats />
        </div>
        <FooterBar />
        <main className="page-body">
          <OrgTree />
          <section className="content-col">
            <PermMatrix />
            <MemberTable />
            <div className="policy-row">
              <SecurityPolicy />
              <DataScope />
            </div>
            <AuditLog />
          </section>
        </main>
      </div>
      {/* message 命令式 → 受控 DivMessage 渲染（浮层抽离独立子组件，避免焦点竞争） */}
      <Notify ref={notifyRef} />
    </div>
  );
}
