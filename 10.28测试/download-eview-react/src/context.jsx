import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式 + 作战室业务状态
// 换肤双轨驱动:isDark 同时切换 <html> 的 .dark class(自定义 token 四层)
// 与 <body> 的 aui3_1_dark class(eview-react aui3_1 暗色覆盖层)。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  // 作战室全局筛选态
  const [team, setTeam] = useState("huadong");            // 大区
  const [productLine, setProductLine] = useState("all");  // 产品线
  const [dept, setDept] = useState("all");                // 部门
  const [timeRange, setTimeRange] = useState("quarter");  // 时间范围
  const [funnelStage, setFunnelStage] = useState(null);   // 漏斗阶段联动看板

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("aui3_1_dark", isDark);
  }, [isDark]);

  // 团队切换全局联动:重置漏斗阶段筛选
  const switchTeam = (t) => {
    setTeam(t);
    setFunnelStage(null);
  };

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    team, setTeam: switchTeam,
    productLine, setProductLine,
    dept, setDept,
    timeRange, setTimeRange,
    funnelStage, setFunnelStage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
