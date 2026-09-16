import { useEffect } from "react";
import { IntlProvider } from "react-intl";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import componentsLocales from "@nce/eview-react/locales";

import { AppProvider } from "./src/context.jsx";
import AppShell from "./src/views/AppShell.jsx";

export const APP_TITLE = "设备接入配置向导";

// 应用入口 — ICT React 页面
// Layer 5 布局骨架:ConfigProvider(main.jsx) + IntlProvider(组件内置文案) + AppShell;
// 业务文案为中文硬编码(无多语言切换),IntlProvider 仅承载 eview-react 组件内置文案。
// antd 的 ConfigProvider locale={zhCN} + antd-zh-cn.js 整套删除,职责由 componentsLocales 替代。
const locale = "zh";

export default function App() {
  // 本页无 DatePicker,但 eview-react 组件内部可能引用 dayjs,统一注册中文 locale。
  useEffect(() => {
    dayjs.locale("zh-cn");
  }, []);

  return (
    <AppProvider>
      <IntlProvider locale="zh-CN" messages={componentsLocales[locale]}>
        <AppShell />
      </IntlProvider>
    </AppProvider>
  );
}
