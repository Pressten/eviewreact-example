import { useState, useEffect, createContext, useContext } from "react";
import { seedDatasets, seedRecycleItems, seedNotifications } from "./mock/dataset.js";

// Layer 1: 全局状态 — 主题模式、导航与跨视图业务状态
// 换肤双轨驱动:isDark 切换 <body> 的 aui3_1_dark class + <html> 的 .dark class;
// eview-react 组件(aui3_1 换肤层)与普通 H5 元素(token CSS)同源跟随,无需 React 参与换肤。
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
