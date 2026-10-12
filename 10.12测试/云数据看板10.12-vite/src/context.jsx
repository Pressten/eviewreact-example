import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式与业务状态
// 换肤双轨驱动:isDark 同时切换 <html> 的 .dark class 和 <body> 的 aui3_1_dark class;
// 普通 H5 元素(token 四层)与 antd 组件(ant.css 换肤层)同源跟随,无需 React 参与换肤。
// aui3_1_dark 挂 <body> 驱动 eview-react 暗色 CSS,.dark 挂 <html> 驱动 token 变量翻转。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [activeTop, setActiveTop] = useState("overview");

  useEffect(() => {
    document.body.classList.toggle('aui3_1_dark', isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    navCollapsed,
    toggleNav: () => setNavCollapsed((c) => !c),
    activeNav,
    setActiveNav,
    activeTop,
    setActiveTop,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
