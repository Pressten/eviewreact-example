// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: 主题 + 权限中心业务状态)
//   Layer 2 mock data     → src/mock/              (org.js / perm.js / audit.js / policy.js)
//   Layer 3 reusable      → src/components/{name}/ (role-modal)
//   Layer 4 views         → src/views/{name}/      (top-bar / org-tree / perm-matrix / member-table /
//                                                   security-policy / data-scope / audit-log / footer-bar)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { ConfigProvider, Empty, Breadcrumb, message } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { Icon } from "./assets/shared/icon.jsx";
import { AppProvider, useApp } from "./src/context.jsx";
import { PERM_MODULES } from "./src/mock/perm.js";
import TopBar from "./src/views/top-bar/index.jsx";
import OrgTree from "./src/views/org-tree/index.jsx";
import PermMatrix from "./src/views/perm-matrix/index.jsx";
import MemberTable from "./src/views/member-table/index.jsx";
import SecurityPolicy from "./src/views/security-policy/index.jsx";
import DataScope from "./src/views/data-scope/index.jsx";
import AuditLog from "./src/views/audit-log/index.jsx";
import FooterBar from "./src/views/footer-bar/index.jsx";
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
          <div className="page-shell">
            <div className="page-head">
              <div className="page-title">
                <Breadcrumb
                  items={[
                    { title: <a onClick={() => message.info("演示原型：返回「系统设置」目录")}>系统设置</a> },
                    { title: "权限与安全" },
                  ]}
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
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
