import PageHeader from './views/page-header/index.jsx';
import DataTabs from './views/data-tabs/index.jsx';

// App 壳：仅布局装配。Provider（ConfigProvider/IntlProvider/AppProvider）在 main.jsx。
export default function App() {
  return (
    <div className="app-root">
      <PageHeader />
      <main className="page-main">
        <DataTabs />
      </main>
    </div>
  );
}
