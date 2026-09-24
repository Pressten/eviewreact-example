import { AppProvider } from "./context.jsx";
import PageHeader from "./views/page-header.jsx";
import DataTabs from "./views/data-tabs.jsx";
import "./styles/app.css";

function App() {
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

export default App;
