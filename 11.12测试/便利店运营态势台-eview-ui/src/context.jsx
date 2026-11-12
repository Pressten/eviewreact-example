import { useState, createContext, useContext } from "react";
import { INITIAL_STORES, REGION_OPTIONS } from "./mock/data.js";

// Layer 1: 全局状态 — 主题模式 + 业务联动状态
// 换肤单轨驱动:html .dark 轨由 scaffold 的 ThemeProvider(src/theme/useTheme.jsx)单点驱动,
// AppProvider 不再自写暗色 useEffect(双处切 .dark 即错);isDark state + toggleDark 保留,
// 业务组件与暗色切换 UI 的契约不变。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  // —— 业务全局状态 ——
  const [region, setRegion] = useState("全部"); // 大区切换（联动 ③④⑥⑦⑧）
  const [province, setProvince] = useState(null); // 省份联动（③ ⇄ ④）
  const [abnormalOnly, setAbnormalOnly] = useState(false); // ④ 异常门店视图（②KPI 卡可触发）
  const [stores, setStores] = useState(INITIAL_STORES); // 门店数据唯一事实来源
  const [lastUpdated, setLastUpdated] = useState(() => new Date(2026, 10, 9, 8, 36));
  const [detailStoreId, setDetailStoreId] = useState(null); // ⑤ 门店详情抽屉
  const [restockStoreId, setRestockStoreId] = useState(null); // ⑥ 补货弹窗

  const selectRegion = (r) => {
    if (REGION_OPTIONS.includes(r)) {
      setRegion(r);
      setProvince(null);
    }
  };

  const toggleProvince = (p) => setProvince((prev) => (prev === p ? null : p));

  const updateStore = (storeId, patch) => {
    setStores((ss) => ss.map((s) => (s.storeId === storeId ? { ...s, ...patch } : s)));
  };

  // 一键补货确认后：缺货清零并从看板移除
  const restockStore = (storeId) => {
    updateStore(storeId, { stockoutSku: 0, restocked: true, lastRestockTime: "11-09 09:10" });
  };

  // 刷新：营业额/客流做 ±2% 实时扰动，模拟新一轮数据快照（趋势末点、KPI 随之重算）
  const refresh = () => {
    setStores((ss) =>
      ss.map((s) => {
        if (s.status !== "营业中") return s;
        const k = 0.98 + Math.random() * 0.04;
        return {
          ...s,
          dailySales: Math.round(s.dailySales * k),
          customerCount: Math.round(s.customerCount * k),
        };
      })
    );
    setLastUpdated(new Date());
  };

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    region,
    province,
    abnormalOnly,
    stores,
    lastUpdated,
    detailStoreId,
    restockStoreId,
    selectRegion,
    setProvince,
    toggleProvince,
    updateStore,
    restockStore,
    setDetailStoreId,
    setRestockStoreId,
    refresh,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
