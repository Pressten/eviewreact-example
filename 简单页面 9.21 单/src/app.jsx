import DivMessage from '@nce/eview-react/DivMessage';
import HeaderBar from './views/header-bar/index.jsx';
import PageHeading from './views/page-heading/index.jsx';
import MetricFilter from './views/metric-filter/index.jsx';
import MetricTable from './views/metric-table/index.jsx';
import MetricEditor from './views/metric-editor/index.jsx';
import { AppProvider, useApp } from './context.jsx';

// App 入口 — Provider + 根容器装配
// 场景：数据指标管理页 —— 表单 + 表格，无图表。
// 分层约定（一组件一目录，kebab-case + index.jsx）：
//   Layer 1 全局状态 → context.jsx（AppProvider：全局状态 + 深色切换 + 操作反馈）
//   Layer 2 mock 数据 → mock/metrics.js
//   Layer 3 复用件 → components/{panel-card,status-tag,category-chip,ratio-value,more-menu}
//   Layer 4 视图 → views/{header-bar,page-heading,metric-filter,metric-table,metric-editor}
//   Layer 5 布局 → app.jsx

function AppContent() {
  const { notice, clearNotice } = useApp();
  return (
    <div className="app-root">
      <HeaderBar />
      <main className="app-main">
        {notice ? (
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            title={notice.title}
            text={notice.text}
            disposeTimeOut={4000}
            onClose={clearNotice}
          />
        ) : null}
        <PageHeading />
        <MetricFilter />
        <MetricTable />
      </main>
      <MetricEditor />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
