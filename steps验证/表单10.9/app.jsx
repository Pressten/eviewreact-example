// App entry — 运营商政企业务受理页面
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. order.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. form-field)
//   Layer 4 views         → src/views/{name}/      (one per section, e.g. header-bar / side-nav)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { ConfigProvider } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import HeaderBar from "./src/views/header-bar/index.jsx";
import SideNav from "./src/views/side-nav/index.jsx";
import OrderWizard from "./src/views/order-wizard/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <div className="app-root">
          <HeaderBar />
          <div className="app-body">
            <SideNav />
            <main className="app-main">
              <OrderWizard />
            </main>
          </div>
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
