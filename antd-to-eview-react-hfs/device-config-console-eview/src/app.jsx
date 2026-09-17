import { useEffect } from "react";
import { IntlProvider } from "react-intl";
import componentsLocales from "@nce/eview-react/locales";
import { AppProvider, useApp } from "./context.jsx";
import { messages } from "./i18n.js";
import HeaderBar from "./views/header-bar.jsx";
import SideMenu from "./views/side-menu.jsx";
import ConsolePage from "./views/console-page.jsx";

export const APP_TITLE = "ICT 设备运维平台 · 设备配置";

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

function AppShell() {
  const { lang, isDark } = useApp();
  const isZh = lang === "zh";

  useEffect(() => {
    document.documentElement.setAttribute("lang", isZh ? "zh-CN" : "en");
  }, [isZh]);

  return (
    <IntlProvider locale={isZh ? "zh-CN" : "en"} messages={{ ...componentsLocales[lang], ...messages[lang] }}>
      <div className={`app-root root aui3_1${isDark ? " aui3_1_dark" : ""}`}>
        <div className="app-shell">
          <HeaderBar />
          <div className="app-body">
            <SideMenu />
            <main className="app-content">
              <ConsolePage />
            </main>
          </div>
        </div>
      </div>
    </IntlProvider>
  );
}
