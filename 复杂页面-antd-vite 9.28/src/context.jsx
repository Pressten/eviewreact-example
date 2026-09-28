import { useState, useEffect, createContext, useContext } from "react";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "dayjs/locale/en";

// Layer 1: 全局状态 — 皮肤模式、界面语言、侧边栏折叠
// 换肤双轨驱动：
//   aui3_1_dark 挂 <body> → eview-react 组件暗色变量生效（aui3_1 已在 index.html 常驻 <body>）
//   .dark 挂 <html>      → 原始 token 的暗色覆盖生效（theme-dark.css）
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState("zh");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("aui3_1_dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
    dayjs.locale(lang === "zh" ? "zh-cn" : "en");
  }, [lang]);

  const value = {
    isDark,
    lang,
    collapsed,
    setLang,
    toggleDark: () => setIsDark((d) => !d),
    toggleCollapsed: () => setCollapsed((c) => !c),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
