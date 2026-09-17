import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — dark 模式双轨同步
//   aui3_1_dark 挂 .app-root → eview-react 组件暗色生效
//   .dark       挂 <html>    → 原始 token 暗色覆盖生效
// （替代 antd 的 theme.darkAlgorithm）
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const appRoot = document.querySelector(".app-root");
    if (appRoot) appRoot.classList.toggle("aui3_1_dark", isDark);
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
