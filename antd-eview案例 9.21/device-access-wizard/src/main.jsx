// 应用入口 — eview-react 规范:Provider + IntlProvider + CSS 装配 + createRoot 挂载
// Layer 5 布局骨架:组装 Provider + AppShell;视图组件见 src/views/
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ConfigProvider from "@nce/eview-react/ConfigProvider";
import { IntlProvider } from "react-intl";
import componentsLocales from "@nce/eview-react/locales";
import "@nce/eview-react/styles/aui3_1.css";
import "@nce/eview-react/styles/aui3_1_dark.css";
import "./styles/base.css";
import "./styles/tokens.css";
import "./styles/theme-dark.css";
import "../app.css";
import { AppProvider } from "./context.jsx";
import AppShell from "./views/AppShell.jsx";
import { businessMessages } from "./i18n.js";

const locale = "zh";
// 组件内置文案 + 业务文案合并后注入 IntlProvider(业务文案为空时等同 componentsLocales)
const mergedMessages = {
  zh: { ...componentsLocales.zh, ...businessMessages.zh },
  en: { ...componentsLocales.en, ...businessMessages.en },
};

export const APP_TITLE = "设备接入配置向导";

export default function App() {
  // IntlProvider 必须是 ConfigProvider 的直接子级,否则弹层 portal 取不到组件文案
  return (
    <AppProvider>
      <ConfigProvider>
        <IntlProvider locale={locale} messages={mergedMessages[locale]}>
          <AppShell />
        </IntlProvider>
      </ConfigProvider>
    </AppProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
