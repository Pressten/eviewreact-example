import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式与业务状态
// 换肤单轨驱动:isDark 只切换 <html> 的 .dark class;
// 普通 H5 元素(token 四层)与 antd 组件(ant.css 换肤层)同源跟随,无需 React 参与换肤。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState("device");
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
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
