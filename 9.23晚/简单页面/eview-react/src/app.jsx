// App entry — ICT 3.1 (@nce/eview-react) 数据指标管理页
// 全局 Provider（ConfigProvider / IntlProvider / eview-react 主题 CSS）在 main.jsx 接入；
// 此处组装应用层状态 Provider 与布局壳。
import DivMessage from "@nce/eview-react/DivMessage";
import { AppProvider, useApp } from "./context.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import PageHeading from "./views/page-heading/index.jsx";
import MetricFilter from "./views/metric-filter/index.jsx";
import MetricTable from "./views/metric-table/index.jsx";
import MetricEditor from "./views/metric-editor/index.jsx";

function AppShell() {
  const { toast } = useApp();
  return (
    <div className="app-root">
      <HeaderBar />
      <main className="app-main">
        <PageHeading />
        <MetricFilter />
        <MetricTable />
      </main>
      <MetricEditor />
      {toast ? (
        <DivMessage
          key={toast.key}
          display
          type="success"
          text={toast.msg}
          disposeTimeOut={3000}
          style={{ position: "fixed", top: 16, right: 16, zIndex: 50 }}
        />
      ) : null}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
