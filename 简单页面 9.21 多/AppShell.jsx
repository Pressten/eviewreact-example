// 布局壳 - 组装页面各区 view（仅引用，不含 view 内部实现）。
// view 文件由 Phase 1 页面 agent 认领改写为 @nce/eview-react；此处路径与 default export 名为冻结契约。
import HeaderBar from "./src/views/header-bar/index.jsx";
import PageHeading from "./src/views/page-heading/index.jsx";
import MetricFilter from "./src/views/metric-filter/index.jsx";
import MetricTable from "./src/views/metric-table/index.jsx";
import MetricEditor from "./src/views/metric-editor/index.jsx";

export default function AppShell() {
  return (
    <div className="app-root">
      <HeaderBar />
      <main className="app-main">
        <PageHeading />
        <MetricFilter />
        <MetricTable />
      </main>
      <MetricEditor />
    </div>
  );
}
