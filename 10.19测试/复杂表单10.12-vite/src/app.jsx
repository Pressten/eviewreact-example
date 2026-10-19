// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → context.jsx           (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → mock/                 (per-domain files, e.g. operator.js)
//   Layer 3 reusable      → components/{name}/    (cross-view, e.g. status-tag / section-panel)
//   Layer 4 views         → views/{name}/         (one per tab/section, e.g. fill-form / board-table)
//   Layer 5 layout        → app.jsx               (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { AppProvider } from "./context.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import FillForm from "./views/fill-form/index.jsx";
import BoardTable from "./views/board-table/index.jsx";
import "./app.css";


export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <HeaderBar />
        <main className="app-main">
          <FillForm />
          <BoardTable />
        </main>
      </div>
    </AppProvider>
  );
}
