// App entry — ICT React page (migrated to eview-react Vite)
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (order.js — 订单/售后 mock)
//   Layer 3 reusable      → src/components/{name}/ (status-tag — 订单/售后状态标签)
//   Layer 4 views         → src/views/{name}/      (top-nav / overview-cards / status-tabs /
//                            filter-bar / order-table / aftersale-queue / exception-bar /
//                            order-detail-modal / order-console)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.
//
// 暗色模式：antd ConfigProvider(locale + theme.darkAlgorithm)已删除；
// eview-react ConfigProvider + IntlProvider 在 main.jsx 配好；双轨暗色切换在 context.jsx(AppProvider)。

import { AppProvider } from "./context.jsx";
import OrderConsole from "./views/order-console/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <OrderConsole />
      </div>
    </AppProvider>
  );
}
