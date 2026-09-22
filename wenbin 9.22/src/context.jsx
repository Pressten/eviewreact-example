import { useState, useEffect, createContext, useContext } from "react";
import { seedDatasets, seedRecycleItems, seedNotifications } from "./mock/dataset.js";

// Layer 1: 全局状态 — 主题模式、导航与跨视图业务状态
// 换肤双轨驱动：isDark 同时切 <html> 的 .dark 与 <body> 的 aui3_1_dark；
// eview-react 组件（aui3_1_dark）与 H5 元素（.dark token 覆盖）同源跟随。
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
    document.body.classList.toggle("aui3_1_dark", isDark);
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
