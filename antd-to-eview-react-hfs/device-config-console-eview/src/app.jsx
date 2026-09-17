// 应用入口 — ICT React 页面(eview-react 版)
// 分层约定:
//   Layer 1 全局状态   → src/context.jsx  (AppProvider: dark 模式 / 界面语言 / 导航折叠)
//   Layer 2 数据与逻辑 → src/data.js, src/i18n.js (mock 数据、派生统计、中英字典)
//   Layer 3 通用小组件 → src/components/  (SectionCard / StatusTag / Toast)
//   Layer 4 视图组件   → src/views/       (header-bar / side-menu / config-form / device-table / config-modal)
//   Layer 5 布局骨架   → app.jsx          (本文件: IntlProvider + 手写 Layout 骨架)
//
// 样式约定: 自定义样式写在 CSS 文件中,颜色/阴影/圆角一律使用 token(var(--primary) 等)。
// 切语言两件套同步: IntlProvider(locale/messages)。组件内置文案由 componentsLocales 提供。

import { IntlProvider } from "react-intl";
import componentsLocales from "@nce/eview-react/locales";
import { AppProvider, useApp } from "./src/context.jsx";
import { messages } from "./src/i18n.js";
import HeaderBar from "./src/views/header-bar.jsx";
import SideMenu from "./src/views/side-menu.jsx";
import ConsolePage from "./src/views/console-page.jsx";
import "./app.css";

// 页面标题 — 构建时写入产物 <title>
export const APP_TITLE = "ICT 设备运维平台 · 设备配置";

// 组件内置文案 + 业务文案合并(antd 的 ConfigProvider locale / antd-zh-cn 整套删除)
const mergedMessages = {
  zh: { ...componentsLocales.zh, ...messages.zh },
  en: { ...componentsLocales.en, ...messages.en },
};

function AppShell() {
  const { lang } = useApp();

  return (
    <IntlProvider locale={lang} messages={mergedMessages[lang]}>
      {/* TODO(eview-react): Layout 无 Reference,手写布局骨架 */}
      <div className="app-shell">
        <HeaderBar />
        <div className="app-body">
          <SideMenu />
          <main className="app-content">
            <ConsolePage />
          </main>
        </div>
      </div>
    </IntlProvider>
  );
}

export default function App() {
  return (
    <div className="root aui3_1 app-root">
      <AppProvider>
        <AppShell />
      </AppProvider>
    </div>
  );
}
