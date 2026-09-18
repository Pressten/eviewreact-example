// 应用入口 — ICT React 页面（eview-react）
// Layer 5 布局骨架:组装 AppProvider + AppShell;Provider/IntlProvider 在 main.jsx
// aui3_1 挂 <body>（index.html 常驻），根 div 只挂 className="root"

import { AppProvider } from "./context.jsx";
import AppShell from "./views/AppShell.jsx";
import "./styles/app.css";

export const APP_TITLE = "设备接入配置向导";

export default function App() {
  return (
    <AppProvider>
      <div className="root">
        <AppShell />
      </div>
    </AppProvider>
  );
}
