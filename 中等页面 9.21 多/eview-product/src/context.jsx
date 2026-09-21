import { createContext, useContext, useEffect, useState } from 'react';

// Layer 1: 全局状态 — 主题模式（浅/深）
// 换肤单轨驱动（eview-react 硬纪律）：同一 effect 内同时切两处类——
//   - aui3_1_dark 挂 <body>（<body> 始终带 aui3_1，叠加 aui3_1_dark 命中 .aui3_1.aui3_1_dark 暗色覆盖）
//   - dark 挂 <html>（documentElement，供组件库暗色样式识别）
// 普通 H5 元素（消费 --surface/--on-surface 等 token）与组件库同源跟随，无需 React 逐个换肤。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('aui3_1_dark', isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d)
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
