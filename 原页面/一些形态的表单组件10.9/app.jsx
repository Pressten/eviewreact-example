// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. rule.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. level-tag)
//   Layer 4 views         → src/views/{name}/      (one per section, e.g. rule-form / rule-table)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)

import { ConfigProvider, Button } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { Icon } from "./assets/shared/icon.jsx";
import { AppProvider, useApp } from "./src/context.jsx";
import RuleForm from "./src/views/rule-form/index.jsx";
import RuleTable from "./src/views/rule-table/index.jsx";
import "./app.css";

function PageHeader() {
  const { isDark, toggleDark } = useApp();
  return (
    <header className="page-header">
      <div className="page-header__text">
        <h1 className="page-title">告警规则配置</h1>
        <p className="page-desc">统一维护设备告警的触发条件与通知策略，规则保存后即刻对所选分组生效。</p>
      </div>
      <Button icon={<Icon name={isDark ? "sun" : "moon"} size="0.875rem" />} onClick={toggleDark}>
        {isDark ? "浅色模式" : "深色模式"}
      </Button>
    </header>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <div className="app-root">
          <div className="page">
            <PageHeader />
            <RuleForm />
            <RuleTable />
          </div>
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
