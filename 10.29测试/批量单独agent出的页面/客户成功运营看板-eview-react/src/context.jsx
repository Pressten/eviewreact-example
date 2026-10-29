import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式 + 看板筛选态
// 换肤单轨驱动:isDark 只切换 <html> 的 .dark class;H5 token 与 antd 组件同源跟随。
// 看板筛选态(时间范围 / 行业 / 关键词)联动下方所有数据区。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [timeRange, setTimeRange] = useState("30d");
  const [industry, setIndustry] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    // 暗色双轨驱动：① <html>.dark 翻转自定义 token 四层 ② <body>.aui3_1_dark 跟随 eview 组件库暗色层
    // （aui3_1_dark.css 已在 main.jsx 入口 import，class 切了才有样式，少任一轨黑白主题切换即坏）
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("aui3_1_dark", isDark);
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
