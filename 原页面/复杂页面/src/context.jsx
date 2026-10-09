import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 皮肤模式、界面语言、侧边栏折叠
// 换肤单轨驱动：isDark 只切换 <html> 的 .dark class；
// 普通 H5 元素(token 四层)与 antd 组件(ant.css 换肤层)同源跟随，无需 React 参与换肤。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState("zh");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
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
