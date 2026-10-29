import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式 + 看板全局筛选 + 跨区块联动（客户抽屉 / 跟进弹窗 / 转交弹窗 / 表格状态页签）
// 换肤单轨驱动:isDark 只切换 <html> 的 .dark class;
// 普通 H5 元素(token 四层)与 antd 组件(ant.css 换肤层)同源跟随,无需 React 参与换肤。
const AppContext = createContext(null);

// 平滑滚动定位到页面区块（配合目标卡片上的 scroll-margin-top 吸顶偏移）
export function scrollToSection(selector) {
  if (typeof document === "undefined") return;
  const target = document.querySelector(selector);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  // 看板全局筛选：时间范围 / 客户行业 / 关键词（联动趋势、构成、表格与右侧栏数据）
  const [timeRange, setTimeRange] = useState("30d");
  const [industry, setIndustry] = useState("全部行业");
  const [keyword, setKeyword] = useState("");

  // 风险客户表格状态页签（饼图扇区 / KPI 卡下钻联动）
  const [tableStatusFilter, setTableStatusFilter] = useState("全部");

  // 客户详情抽屉
  const [drawerCustomerId, setDrawerCustomerId] = useState(null);

  // 跟进 / 回访弹窗（mode: "follow" 跟进 | "callback" 回访）
  const [followUpModal, setFollowUpModal] = useState({ open: false, mode: "follow", customerId: null });

  // 转交负责人弹窗（批量转交时 customerId 为空、customerName 为"选中的 N 家客户"）
  const [transferModal, setTransferModal] = useState({ open: false, customerId: null, customerName: "" });

  // 全局轻量通知（替代 antd message.success/info() 命令式 API——eview-react DivMessage 只能渲染式）
  // notify(type, text) 触发一条，notice 带唯一 key 供 DivMessage 重挂；null 表示无通知。
  // closeNotice 在点关闭时调用；自动消失后 DivMessage 内部隐藏，notice 残留 true 不影响（下次 notify 覆盖新 key）。
  const [notice, setNotice] = useState(null);
  const notify = (type, text, persistent = false) =>
    setNotice({ key: Date.now() + Math.random(), type, text, persistent });
  const closeNotice = () => setNotice(null);

  // 暗色双轨切换：① <html>.dark（自定义 token 四层跟随）+ ② <body>.aui3_1_dark（eview 组件库暗色覆盖层跟随）
  // aui3_1_dark.css 已在 main.jsx import，class 切了即生效（少任一轨黑白主题切换即坏）。
  useEffect(() => {
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
    keyword,
    setKeyword,

    tableStatusFilter,
    setTableStatusFilter,

    drawerCustomerId,
    openCustomerDrawer: (customerId) => setDrawerCustomerId(customerId),
    closeCustomerDrawer: () => setDrawerCustomerId(null),

    followUpModal,
    openFollowUpModal: ({ mode = "follow", customerId = null } = {}) =>
      setFollowUpModal({ open: true, mode, customerId }),
    closeFollowUpModal: () => setFollowUpModal((prev) => ({ ...prev, open: false })),

    transferModal,
    openTransferModal: ({ customerId = null, customerName = "" } = {}) =>
      setTransferModal({ open: true, customerId, customerName }),
    closeTransferModal: () => setTransferModal((prev) => ({ ...prev, open: false })),

    notice,
    notify,
    closeNotice,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
