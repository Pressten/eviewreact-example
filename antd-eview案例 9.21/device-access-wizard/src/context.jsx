import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — dark 模式双轨同步(<body> aui3_1_dark + <html> .dark)
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // aui3_1 常驻 <body>(eview-react 浅色基础);暗色叠加 aui3_1_dark;.dark 挂 <html> 驱动原始 token 覆盖
    document.body.classList.add("aui3_1");
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
