import { useState, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式与业务状态
// 换肤单轨驱动：isDark 切换 <html> 的 .dark class + <body> 的 aui3_1_dark class
// （统一切换逻辑见 app.jsx 的 AppShell；普通 H5 元素 token 四层与 eview 暗色 CSS 同源跟随，
//   无需 React 参与换肤；antd 组件暗色留待下游 antd→eview-react 替换后由暗色 CSS 覆盖）
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [activeTopNav, setActiveTopNav] = useState("workorder");
  const [activeSideKey, setActiveSideKey] = useState("order-create");

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    navCollapsed,
    toggleNav: () => setNavCollapsed((c) => !c),
    activeTopNav,
    setActiveTopNav,
    activeSideKey,
    setActiveSideKey,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
