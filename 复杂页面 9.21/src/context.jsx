import { useState, useEffect, createContext, useContext } from 'react';

// Layer 1: 全局状态 — 皮肤模式、界面语言（来自入口 props）、侧边栏折叠
// 换肤单轨驱动：isDark 切换
//   - document.body 的 aui3_1_dark（驱动 eview-react 组件换肤，aui3_1 已在 <body> 静态写入）
//   - document.documentElement(html) 的 dark（驱动项目自有 token 的暗色覆盖层 .dark { ... }）
const AppContext = createContext(null);

export function AppProvider({ lang, setLang, children }) {
  const [isDark, setIsDark] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.body.classList.add('aui3_1');
    document.body.classList.toggle('aui3_1_dark', isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
  }, [lang]);

  const value = {
    isDark,
    lang,
    collapsed,
    setLang,
    toggleDark: () => setIsDark((d) => !d),
    toggleCollapsed: () => setCollapsed((c) => !c),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
