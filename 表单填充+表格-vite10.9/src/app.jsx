import { useState } from "react";
import { AppProvider } from "./context.jsx";
import AppHeader from "./views/app-header/index.jsx";
import AppSidebar from "./views/app-sidebar/index.jsx";
import RuleForm from "./views/rule-form/index.jsx";
import RuleTable from "./views/rule-table/index.jsx";
import { ruleList } from "./mock/rules.js";
import "./app.css";

export default function App() {
  const [rules, setRules] = useState(ruleList);

  const handleCreate = (rule) => {
    setRules((prev) => [rule, ...prev]);
  };

  return (
    <AppProvider>
      <div className="app-root">
        <AppHeader />
        <div className="app-body">
          <AppSidebar />
          <main className="app-content">
            <RuleForm onCreate={handleCreate} />
            <RuleTable data={rules} />
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
