import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式与业务状态
// 换肤双轨驱动:
//   1. <html> 的 .dark class → token 四层 CSS 变量翻转（普通 H5 元素跟随）
//   2. <body> 的 aui3_1_dark class → eview-react aui3_1_dark.css 暗色覆盖（eview 组件跟随）
// antd 组件暗色算法（ConfigProvider theme.darkAlgorithm）已在本阶段删除，
// antd 组件暗色留待下游替换为 eview-react 后由 aui3_1_dark.css 覆盖。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("aui3_1_dark", isDark);
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
