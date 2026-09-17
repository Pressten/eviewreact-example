import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — dark 模式双轨同步
// aui3_1 已在 index.html 的 <body> 上常驻（class="ev_no_wcag aui3_1"）
// 暗色时叠 aui3_1_dark（挂 <body>，eview-react 组件暗色）+ .dark（挂 <html>，原始 token 暗色覆盖）
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
