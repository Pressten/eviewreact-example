import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { IntlProvider } from "react-intl";
import componentsLocales from "@nce/eview-react/locales";
import ConfigProvider from "@nce/eview-react/ConfigProvider";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "dayjs/locale/en";
import "@nce/eview-react/styles/aui3_1.css";
import "@nce/eview-react/styles/aui3_1_dark.css";
import "./styles/base.css";
import "./styles/font.css";
import "./styles/tokens.css";
import "./styles/theme-dark.css";
import { AppProvider, useApp } from "./context.jsx";
import { messages as businessMessages } from "./i18n.js";
import App from "./app.jsx";

// 合并组件内置文案（componentsLocales）+ 业务语言包（businessMessages）
// locale 用 "zh" 不是 "zh-CN"（匹配 componentsLocales 的 key）
const mergedMessages = {
  zh: { ...componentsLocales.zh, ...businessMessages.zh },
  en: { ...componentsLocales.en, ...businessMessages.en },
};

// Root 里读 lang → IntlProvider → App
// IntlProvider 必须是 ConfigProvider 的直接子级，否则弹层（Dialog portal）取不到业务文案报 MISSING_TRANSLATION
function Root() {
  const { lang } = useApp();

  useEffect(() => {
    dayjs.locale(lang === "zh" ? "zh-cn" : "en");
  }, [lang]);

  return (
    <IntlProvider locale={lang} messages={mergedMessages[lang]}>
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
