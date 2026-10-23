import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式 + 看板筛选态
// 换肤单轨驱动:isDark 切换 <body> 的 aui3_1_dark class + <html> 的 .dark class;H5 token 跟随。
// 看板筛选态(时间范围 / 行业 / 关键词)联动下方所有数据区。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [timeRange, setTimeRange] = useState("30d");
  const [industry, setIndustry] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    document.body.classList.toggle("aui3_1_dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    timeRange,
    setTimeRange,
    industry,
    setIndustry,
    searchKeyword,
    setSearchKeyword,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
