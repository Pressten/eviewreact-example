// 应用入口 — ICT React 页面
// Provider 组装（ConfigProvider + IntlProvider）在 main.jsx；这里只挂 AppShell

import { AppProvider } from "./context.jsx";
import AppShell from "./views/AppShell.jsx";
import "./app.css";

export const APP_TITLE = "设备接入配置向导";

export default function App() {
  return (
    <AppProvider>
      <div className="app-root aui3_1">
        <AppShell />
      </div>
    </AppProvider>
  );
}
