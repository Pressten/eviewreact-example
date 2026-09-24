import { useState, useEffect, createContext, useContext } from "react";
import { seedDatasets, seedRecycleItems, seedNotifications } from "./mock/dataset.js";

// Layer 1: 全局状态 — 主题模式、导航与跨视图业务状态
// 换肤双轨驱动：isDark 同时切换 <body> 的 aui3_1_dark（eview-react 组件暗色）与 <html> 的 .dark（原始 token 暗色覆盖）。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [activeMenu, setActiveMenu] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [datasets, setDatasets] = useState(seedDatasets);
  const [recycleItems, setRecycleItems] = useState(seedRecycleItems);
  const [notifyCount, setNotifyCount] = useState(
    seedNotifications.filter((n) => n.unread).length
  );
  const [globalKeyword, setGlobalKeyword] = useState("");

  useEffect(() => {
    // aui3_1_dark 挂 <body>（aui3_1 已在 index.html 的 <body> 上常驻）
    document.body.classList.toggle("aui3_1_dark", isDark);
    // .dark 挂 <html>（theme-dark.css 的暗色覆盖全局生效）
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    activeMenu,
    setActiveMenu,
    sidebarCollapsed,
    toggleSidebar: () => setSidebarCollapsed((c) => !c),
    datasets,
    setDatasets,
    recycleItems,
    setRecycleItems,
    notifyCount,
    setNotifyCount,
    globalKeyword,
    setGlobalKeyword,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
