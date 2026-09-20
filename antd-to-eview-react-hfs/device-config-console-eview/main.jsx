import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ConfigProvider from "@nce/eview-react/ConfigProvider";

// ICT 3.1 主题：浅色 + 深色同时引入，运行时靠 <html> 的 aui3_1 / aui3_1 aui3_1_dark 切换
import "@nce/eview-react/styles/aui3_1.css";
import "@nce/eview-react/styles/aui3_1_dark.css";
import "./assets/style/base.css";
import "./assets/style/light.css";
import "./assets/style/theme.css";
import "./assets/style/dark.css";
import "./app.css";

import App from "./app.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </StrictMode>
);
