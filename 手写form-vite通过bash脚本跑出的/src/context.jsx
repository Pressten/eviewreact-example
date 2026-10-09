import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式与业务状态
// 换肤双轨驱动:isDark 同时切换 <html> 的 .dark class 和 <body> 的 aui3_1_dark class;
// <html>.dark 翻转 token 变量(四层),<body>.aui3_1_dark 驱动 eview-react 暗色 CSS。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("aui3_1_dark", isDark);
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
