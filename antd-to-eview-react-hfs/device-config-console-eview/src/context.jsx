import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式、界面语言与布局折叠
// 换肤双轨驱动:
//   1) isDark 切换 <html> 的 .dark class → 四层设计 token(base/light/theme/dark)翻转自定义样式
//   2) 根容器 aui3_1 / aui3_1_dark class → eview-react 组件主题翻转(见 app.jsx)
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
