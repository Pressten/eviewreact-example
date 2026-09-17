// 应用入口 — eview-react 页面
// Provider 组装在 main.jsx(ConfigProvider + IntlProvider + aui3_1.css);
// 本组件挂根 DOM 类名 aui3_1,暗色时由 AppProvider 叠加 aui3_1_dark

import { AppProvider } from "./src/context.jsx";
import AppShell from "./src/views/AppShell.jsx";
import "./app.css";

export const APP_TITLE = "设备接入配置向导";

export default function App() {
  return (
    <div className="root aui3_1 app-root">
      <AppProvider>
        <AppShell />
      </AppProvider>
    </div>
  );
}
