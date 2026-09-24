import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式与业务状态
// 换肤双轨驱动：isDark 同时切换 <body> 的 aui3_1_dark（eview-react 组件暗色）
// 与 <html> 的 .dark（原始 token 暗色覆盖 + 图表 hdesign-dark 主题）
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("aui3_1_dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
