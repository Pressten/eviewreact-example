// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → context.jsx           (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → mock/                  (per-domain files, e.g. rule.js)
//   Layer 3 reusable      → components/{name}/     (cross-view, e.g. level-tag)
//   Layer 4 views         → views/{name}/          (one per section, e.g. rule-form / rule-table)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)

import Button from "@nce/eview-react/Button";
import { IconPlusIcPublicMoon, IconPlusIcPublicSun } from '@nce/icon-plus';
import { AppProvider, useApp } from "./context.jsx";
import RuleForm from "./views/rule-form/index.jsx";
import RuleTable from "./views/rule-table/index.jsx";
import "./app.css";

function PageHeader() {
  const { isDark, toggleDark } = useApp();
  return (
    <header className="page-header">
      <div className="page-header__text">
        <h1 className="page-title">告警规则配置</h1>
        <p className="page-desc">统一维护设备告警的触发条件与通知策略，规则保存后即刻对所选分组生效。</p>
      </div>
      <Button leftIcon={isDark ? <IconPlusIcPublicSun iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMoon iconSize="0.875rem" iconColor={['currentcolor']} />} text={isDark ? "浅色模式" : "深色模式"} onClick={toggleDark} />
    </header>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <div className="page">
          <PageHeader />
          <RuleForm />
          <RuleTable />
        </div>
      </div>
    </AppProvider>
  );
}
