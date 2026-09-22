import { useState, useEffect, createContext, useContext } from 'react';

// Layer 1: 全局状态 — 主题模式（暗色双轨切换）
// aui3_1 常驻 <body>（index.html 写死），暗色时叠 aui3_1_dark 于 <body>；
// .dark 挂 <html>，驱动 theme-dark.css 的语义覆盖。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('aui3_1_dark', isDark);
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
