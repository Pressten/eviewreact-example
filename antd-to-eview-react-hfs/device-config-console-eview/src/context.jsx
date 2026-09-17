import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式、界面语言与布局折叠
// 换肤双类名驱动: aui3_1_dark 挂 .root(eview-react 组件暗色) + .dark 挂 <html>(原始 token 暗色覆盖)
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState("zh");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const root = document.querySelector(".root");
    if (root) root.classList.toggle("aui3_1_dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
  }, [lang]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    lang,
    setLang,
    collapsed,
    toggleCollapsed: () => setCollapsed((c) => !c),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
