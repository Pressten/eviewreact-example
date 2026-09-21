import { useEffect } from "react";
import { IntlProvider } from "react-intl";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "dayjs/locale/en";
import componentsLocales from "@nce/eview-react/locales";

import { AppProvider, useApp } from "./src/context.jsx";
import { messages as businessMessages } from "./src/i18n.js";
import { ToastProvider } from "./src/components/Toast.jsx";
import HeaderBar from "./src/views/header-bar.jsx";
import SideMenu from "./src/views/side-menu.jsx";
import ConsolePage from "./src/views/console-page.jsx";

export const APP_TITLE = "ICT 设备运维平台 · 设备配置";

// 组件库内置文案与业务字典合并，随语言整体切换
const mergedMessages = {
  zh: { ...componentsLocales.zh, ...businessMessages.zh },
  en: { ...componentsLocales.en, ...businessMessages.en },
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

function AppShell() {
  const { lang } = useApp();
  const isZh = lang === "zh";

  useEffect(() => {
    dayjs.locale(isZh ? "zh-cn" : "en");
  }, [isZh]);

  return (
    <IntlProvider locale={isZh ? "zh-CN" : "en"} messages={mergedMessages[lang]}>
      <ToastProvider>
        <div className="app-shell">
          <HeaderBar />
          <div className="app-body">
            <SideMenu />
            <main className="app-content">
              <ConsolePage />
            </main>
          </div>
        </div>
      </ToastProvider>
    </IntlProvider>
  );
}
