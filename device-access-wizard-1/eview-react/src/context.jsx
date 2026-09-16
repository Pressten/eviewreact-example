import { createContext, useContext, useState, useEffect } from 'react';

// 全局状态 — dark 模式双轨同步：
//   aui3_1_dark → eview-react 组件暗色（aui3_1.css 内置变量）
//   dark       → 原始 token 暗色覆盖（theme-dark.css）
// 两个类名都挂在 .app-root 上，eview-react 组件与手写 CSS 同时跟随。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.querySelector('.app-root');
    if (root) {
      root.classList.toggle('aui3_1_dark', isDark);
      root.classList.toggle('dark', isDark);
    }
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
