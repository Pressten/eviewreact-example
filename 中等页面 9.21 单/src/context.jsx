// context.jsx — Layer 1: 全局状态（主题模式）
// 暗色切换：aui3_1_dark 挂 <body>（eview-react 组件暗色变量生效，弹层 portal 在 body 下也能继承）
//            .dark 挂 <html>（theme-dark.css 的原始 token 暗色覆盖生效）
import { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext(null);

function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // aui3_1 已在 index.html 的 <body> 上常驻（浅色基础），暗色时叠加 aui3_1_dark
    document.body.classList.toggle('aui3_1_dark', isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useApp() {
  return useContext(AppContext);
}

export { AppProvider, useApp };
