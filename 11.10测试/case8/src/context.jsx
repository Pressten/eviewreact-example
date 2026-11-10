import { useState, useEffect, useMemo, useCallback, createContext, useContext } from "react";
import dayjs from "dayjs";
import { buildDataset } from "./mock/flight.js";

// Layer 1: 全局状态 —— 主题模式 + AOC 运行上下文(机场/运行日/选中航班/主表定位/运行处置覆盖)
// 换肤单轨驱动: isDark 只切换 <html> 的 .dark class;
// 普通 H5 元素(token 四层)与 antd 组件(ant.css 换肤层)同源跟随,无需 React 参与换肤。
const AppContext = createContext(null);

// 运行基准时刻: 今日 14:30 —— 顶部运行时钟与关舱门倒计时共用此锚点(页面加载后实时走秒)
export const OPS_MOMENT_MIN = 870;

// 运行秒表: 页面加载后经过的秒数(1s 心跳), 供时钟/倒计时/执勤进度组件订阅
export function useOpsTick() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return tick;
}

// 运行时钟: 基准时刻 + 已流逝秒数
export function useOpsNow() {
  const tick = useOpsTick();
  return useMemo(() => dayjs().startOf("day").add(OPS_MOMENT_MIN, "minute").add(tick, "second"), [tick]);
}

function dayKeyOf(date) {
  const diff = date.startOf("day").diff(dayjs().startOf("day"), "day");
  return diff < 0 ? "yesterday" : diff > 0 ? "tomorrow" : "today";
}

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const [airport, setAirport] = useState("PEK");
  const [opDay, setOpDay] = useState(() => dayjs());
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  // 波及链节点 → 主表定位请求 { id, ts }
  const [locateRequest, setLocateRequest] = useState(null);
  // 运行处置覆盖(⑨ 操作栏): 发布延误 / 取消航班 / 更换飞机 —— 按航班 id 叠加到数据集
  const [overrides, setOverrides] = useState({});

  const dayKey = dayKeyOf(opDay);
  const dataset = useMemo(() => buildDataset(airport, dayKey, overrides), [airport, dayKey, overrides]);

  // 仅在机场/运行日切换时重置选中(首个延误航班) —— 运行处置发布不改变当前选中
  useEffect(() => {
    const first = dataset
      .filter((r) => r.status === "delayed")
      .sort((a, b) => a.schedDep - b.schedDep)[0];
    setSelectedFlightId(first ? first.id : null);
    setLocateRequest(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [airport, dayKey]);

  // 运行处置入口: entries = [{ id, patch }] —— patch 支持 status/delayMinutes/tailNo/delayReason
  const applyOverride = useCallback((entries) => {
    setOverrides((prev) => {
      const next = { ...prev };
      entries.forEach(({ id, patch }) => {
        next[id] = { ...(next[id] || {}), ...patch };
      });
      return next;
    });
  }, []);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    airport,           // 基地机场代码 PEK / PKX / PVG
    setAirport,
    opDay,             // dayjs 运行日
    setOpDay,
    dayKey,            // yesterday / today / tomorrow
    dataset,           // 当前机场 × 运行日航班数据集(含运行处置覆盖)
    selectedFlightId,  // 波及链/机组面板选中航班
    setSelectedFlightId,
    locateRequest,     // 主表定位请求(由波及链/登机口网格节点发起)
    requestLocate: (id) => setLocateRequest({ id, ts: Date.now() }),
    applyOverride,     // 运行处置覆盖(发布延误/取消/换机)
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
