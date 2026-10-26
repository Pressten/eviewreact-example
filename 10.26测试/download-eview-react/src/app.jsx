// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → context.jsx           (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → mock/                 (per-domain files, e.g. device.js / alarm.js)
//   Layer 3 reusable      → components/{name}/     (cross-view, e.g. status-tag / section-card)
//   Layer 4 views         → views/{name}/          (one per tab/section, e.g. device-table / header-bar)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.
// Note: eview-react IntlProvider + ConfigProvider are wired in main.jsx (scenario A).

import { AppProvider } from "./context.jsx";
import HeaderBar from "./views/header-bar/index.jsx";
import Showcase from "./views/showcase/index.jsx";
import "./app.css";


export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <HeaderBar />
        <Showcase />
      </div>
    </AppProvider>
  );
}
