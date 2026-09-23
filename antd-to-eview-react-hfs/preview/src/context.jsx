import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式 + 图表/表格联动状态
// 换肤双轨驱动:isDark 同时切换 <body> 的 aui3_1_dark(eview-react 组件)与 <html> 的 .dark(原始 token 覆盖);
// 普通 H5 元素(token 四层)与 eview-react 组件(aui3_1_dark)同源跟随,无需 React 参与换肤。
//
// 联动状态:
//   regionFilter / statusFilter — 由 KPI 卡片、柱状图、饼图、筛选 chips 双向驱动,作用于表格与交叉图表
//   selectedDeviceCode         — 由表格行点击驱动,作用于趋势折线图
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [regionFilter, setRegionFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [selectedDeviceCode, setSelectedDeviceCode] = useState(null);

  useEffect(() => {
    // 双轨换肤：aui3_1_dark 挂 <body>（eview-react 组件暗色，aui3_1 已在 index.html 常驻）
    // .dark 挂 <html>（原始 token 暗色覆盖，见 src/styles/theme-dark.css）
    document.body.classList.toggle("aui3_1_dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleRegionFilter = (region) => {
    setRegionFilter((prev) => (prev === region ? null : region));
  };

  const toggleStatusFilter = (statusKey) => {
    setStatusFilter((prev) => (prev === statusKey ? null : statusKey));
  };

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    regionFilter,
    statusFilter,
    selectedDeviceCode,
    setRegionFilter,
    setStatusFilter,
    toggleRegionFilter,
    toggleStatusFilter,
    setSelectedDeviceCode,
    clearFilters: () => {
      setRegionFilter(null);
      setStatusFilter(null);
      setSelectedDeviceCode(null);
    }
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
