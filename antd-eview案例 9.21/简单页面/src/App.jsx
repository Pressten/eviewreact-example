// App — 组装应用层状态 Provider 与布局壳
// 全局 Provider（ConfigProvider / IntlProvider / eview-react 主题 CSS）在 main.jsx 接入
import { AppProvider } from './context.jsx';
import HeaderBar from './views/header-bar/index.jsx';
import PageHeading from './views/page-heading/index.jsx';
import MetricFilter from './views/metric-filter/index.jsx';
import MetricTable from './views/metric-table/index.jsx';
import MetricEditor from './views/metric-editor/index.jsx';

function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <HeaderBar />
        <main className="app-main">
          <PageHeading />
          <MetricFilter />
          <MetricTable />
        </main>
        <MetricEditor />
      </div>
    </AppProvider>
  );
}

export default App;
