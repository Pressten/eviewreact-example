import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 皮肤模式、界面语言、侧边栏折叠
// 换肤双轨驱动：isDark 同时切 <body> 的 aui3_1_dark 与 <html> 的 .dark；
// eview-react 组件跟随 aui3_1_dark，原始 token 跟随 .dark，同源同步。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState("zh");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // 暗色模式同时切两处：aui3_1_dark 挂 <body>（eview-react 组件暗色变量生效），.dark 挂 <html>（原始 token 暗色覆盖生效）
    document.body.classList.toggle("aui3_1_dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
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
