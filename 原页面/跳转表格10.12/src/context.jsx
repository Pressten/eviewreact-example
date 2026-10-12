import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式、侧栏折叠与跨页签联动
// 换肤单轨驱动:isDark 只切换 <html> 的 .dark class;antd 由 ant.css 换肤层跟随。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("task");
  const [detailRecord, setDetailRecord] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // 表格链接 → 跳转到第三个页签(链路详情)
  const openDetail = (record) => {
    setDetailRecord(record);
    setActiveTab("detail");
  };

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    collapsed,
    toggleCollapsed: () => setCollapsed((c) => !c),
    activeTab,
    setActiveTab,
    detailRecord,
    openDetail,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
