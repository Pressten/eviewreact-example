// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. dashboard.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. stat-card / section-card)
//   Layer 4 views         → src/views/{name}/      (one per section, e.g. top-bar / chart-board)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { useState } from "react";
import { AppProvider } from "./context.jsx";
import TopBar from "./views/top-bar/index.jsx";
import SideNav from "./views/side-nav/index.jsx";
import PageHeader from "./views/page-header/index.jsx";
import KpiBoard from "./views/kpi-board/index.jsx";
import ChartBoard from "./views/chart-board/index.jsx";
import TableBoard from "./views/table-board/index.jsx";
import DetailDrawer from "./views/detail-drawer/index.jsx";
import "./app.css";

function Workspace() {
  const [detail, setDetail] = useState(null);

  return (
    <div className="app-root">
      <TopBar />
      <div className="app-body">
        <SideNav />
        <main className="app-main">
          <PageHeader />
          <KpiBoard />
          <ChartBoard />
          <TableBoard onOpen={setDetail} />
        </main>
      </div>
      <DetailDrawer record={detail} open={!!detail} onClose={() => setDetail(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Workspace />
    </AppProvider>
  );
}
