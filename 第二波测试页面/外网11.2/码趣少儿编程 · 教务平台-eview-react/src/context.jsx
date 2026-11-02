import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式（开发者设置页默认浅色）
// 换肤双轨驱动：isDark 同时切换 <html> 的 .dark class（自定义 token 四层）
// 与 <body> 的 aui3_1_dark class（eview-react aui3_1 换肤层），二者同源跟随，无需 React 参与换肤。
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
