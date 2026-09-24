import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式与业务状态
// 换肤双轨驱动:isDark 同时切换 <body> 的 aui3_1_dark(eview-react 组件暗色)
// 与 <html> 的 .dark(原始 token 暗色覆盖);aui3_1 常驻 <body>(index.html 写死)。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState("device");
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    document.body.classList.toggle("aui3_1_dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // 链接跳转到指定页签(表格内链接点击时调用)
  const jumpToTab = (tabKey, device) => {
    if (device) setSelectedDevice(device);
    setActiveTab(tabKey);
  };

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    activeTab,
    setActiveTab,
    selectedDevice,
    setSelectedDevice,
    selectedRowKeys,
    setSelectedRowKeys,
    jumpToTab,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
