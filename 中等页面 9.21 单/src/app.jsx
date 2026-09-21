// app.jsx — Layer 5: 应用根容器（Provider + 头部 + 主体页签）
// antd ConfigProvider 已移除；eview-react 的 ConfigProvider + IntlProvider 在 main.jsx
// 暗色切换（body.aui3_1_dark + html.dark）由 AppProvider 内的 useEffect 负责（见 context.jsx）
import { AppProvider } from './context.jsx';
import PageHeader from './page-header.jsx';
import DataTabs from './data-tabs.jsx';
import './app.css';

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
