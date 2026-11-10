import { useState, useEffect, createContext, useContext } from "react";
import dayjs from "dayjs";
import { ALARMS } from "./mock/alarms.js";

// Layer 1: 全局状态 — NOC 值班监控中心
// 换肤单轨驱动:isDark 只切换 <html> 的 .dark class;
// 普通 H5 元素(token 四层)与 antd 组件(ant.css 换肤层)同源跟随,无需 React 参与换肤。
// 默认深色:NOC 值班风格,异常信息最高层级。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  // 环境切换（生产 / 预发）— 全局联动数据源
  const [env, setEnv] = useState("prod");
  // 时间范围 + 刷新频率
  const [timeRange, setTimeRange] = useState("1h");
  const [refreshRate, setRefreshRate] = useState(30);
  const [lastRefresh, setLastRefresh] = useState(() => dayjs());
  // 刷新脉冲：每次自动 / 手动刷新自增，驱动展示层 QPS 轻微跳动（不改变告警口径）
  const [refreshTick, setRefreshTick] = useState(0);
  // ⑤ 实时图表当前聚焦的服务（由 ② 服务卡 / ④ 拓扑节点联动）
  const [selectedService, setSelectedService] = useState("api-gateway");
  // ⑥ 告警列表：按策略名搜索（拓扑数据节点点击也会写入）
  const [alarmQuery, setAlarmQuery] = useState("");
  // ⑥ 告警行数据（认领 / 静默会就地变更；切环境时重载）
  const [alarms, setAlarms] = useState(() => ALARMS.prod.map((a) => ({ ...a })));
  // ①/⑥ 告警静默弹窗：{ open, target }（target 为行级静默预填对象）
  const [silence, setSilence] = useState({ open: false, target: null });
  // ⑥ 告警详情抽屉：{ open, id }（点击策略名打开）
  const [alarmDetail, setAlarmDetail] = useState({ open: false, id: null });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // 环境切换 → 重载该环境告警快照，并清空策略名搜索
  useEffect(() => {
    setAlarms(ALARMS[env].map((a) => ({ ...a })));
    setAlarmQuery("");
  }, [env]);

  // 自动刷新：按频率更新「最后刷新时间」
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshTick((t) => t + 1);
      setLastRefresh(dayjs());
    }, refreshRate * 1000);
    return () => clearInterval(timer);
  }, [refreshRate]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    env,
    setEnv,
    timeRange,
    setTimeRange,
    refreshRate,
    setRefreshRate,
    lastRefresh,
    refreshTick,
    manualRefresh: () => {
      setRefreshTick((t) => t + 1);
      setLastRefresh(dayjs());
    },
    selectedService,
    setSelectedService,
    alarms,
    setAlarms,
    alarmQuery,
    setAlarmQuery,
    silence,
    openSilence: (target) => setSilence({ open: true, target: target || null }),
    closeSilence: () => setSilence({ open: false, target: null }),
    alarmDetail,
    openAlarmDetail: (rec) => setAlarmDetail({ open: true, id: rec.id }),
    closeAlarmDetail: () => setAlarmDetail({ open: false, id: null }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
