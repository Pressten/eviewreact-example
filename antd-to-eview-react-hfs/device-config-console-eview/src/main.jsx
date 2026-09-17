// 应用入口 — eview-react 页面
// Provider 组装:IntlProvider 按当前语言动态切换,放在 app.jsx(依赖 context 的 lang);
// 本文件只挂 ConfigProvider 与三处 CSS import

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ConfigProvider from "@nce/eview-react/ConfigProvider";
import "@nce/eview-react/styles/aui3_1.css";
import "./styles/tokens.css";
import "./styles/theme-dark.css";
import App from "./app.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </StrictMode>
);
