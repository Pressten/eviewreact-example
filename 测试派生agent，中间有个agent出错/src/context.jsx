import { useState, useEffect, createContext, useContext } from "react";
import { seedDatasets, seedRecycleItems, seedNotifications } from "./mock/dataset.js";

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
