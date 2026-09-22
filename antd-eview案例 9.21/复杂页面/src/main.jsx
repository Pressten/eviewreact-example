import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IntlProvider } from "react-intl";
import componentsLocales from "@nce/eview-react/locales";
import ConfigProvider from "@nce/eview-react/ConfigProvider";
import "@nce/eview-react/styles/aui3_1.css";
import "@nce/eview-react/styles/aui3_1_dark.css";
import "./styles/base.css";
import "./styles/tokens.css";
import "./styles/theme-dark.css";
import { AppProvider, useApp } from "./context.jsx";
import { messages as businessMessages } from "./i18n.js";
import App from "../app.jsx";

// 合并 eview-react 组件内置文案 + 业务文案
const mergedMessages = {
  zh: { ...componentsLocales.zh, ...businessMessages.zh },
  en: { ...componentsLocales.en, ...businessMessages.en },
};

// lang state 在 AppProvider 里，Root 读 lang 后提供 IntlProvider（必须是 ConfigProvider 的子级，包住所有业务组件与弹层）
function Root() {
  const { lang } = useApp();
  return (
    <IntlProvider locale={lang} messages={mergedMessages[lang] || {}}>
      <App />
    </IntlProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider>
      <AppProvider>
        <Root />
      </AppProvider>
    </ConfigProvider>
  </StrictMode>
);
