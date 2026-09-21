import { AppProvider } from './context.jsx';
import PageHeader from './views/page-header/index.jsx';
import DataTabs from './views/data-tabs/index.jsx';

// App 入口壳（Layer 5：Provider + 根容器装配）
// 视图业务由 src/views/* 各页面 agent 填实，本文件只做全局装配。
export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <PageHeader />
        <main className="page-main">
          <DataTabs />
        </main>
      </div>
    </AppProvider>
  );
}
