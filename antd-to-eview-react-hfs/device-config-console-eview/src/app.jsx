// 应用入口 — ICT React 页面（eview-react 版）
// 分层约定:
//   Layer 1 全局状态   → src/context.jsx  (AppProvider: dark 模式 / 界面语言 / 导航折叠)
//   Layer 2 数据与逻辑 → src/data.js, src/i18n.js (mock 数据、派生统计、中英字典)
//   Layer 3 通用小组件 → src/components/  (SectionCard / StatusTag / Toast)
//   Layer 4 视图组件   → src/views/       (header-bar / side-menu / config-form / device-table / config-modal)
//   Layer 5 布局骨架   → app.jsx          (本文件: 组装 IntlProvider + aui3_1 根容器 + CSS 布局外壳)
//
// 样式约定: eview-react 组件承载交互与 ICT 3.1 组件样式(入口已引 aui3_1.css);
// 自定义样式写在 CSS 文件中,颜色/阴影/圆角一律使用 token(var(--primary) / var(--shadow-card) / var(--radius-*))。
// 换肤双轨驱动: <html> 的 .dark 切换四层设计 token;根容器 aui3_1 / aui3_1_dark 切换 eview 组件主题。

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
  const locale = isZh ? "zh" : "en";

  useEffect(() => {
    document.documentElement.setAttribute("lang", isZh ? "zh-CN" : "en");
  }, [isZh]);

  return (
    <IntlProvider
      locale={isZh ? "zh-CN" : "en"}
      messages={{ ...componentsLocales[locale], ...messages[lang] }}
    >
      <div className={"app-root aui3_1" + (isDark ? " aui3_1_dark" : "")}>
        <div className="app-shell">
          <HeaderBar />
          <div className="app-body app-body-has-sider">
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
