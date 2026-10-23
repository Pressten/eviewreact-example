import { IconPlusIcBpitTicket, IconPlusIcCarUser, IconPlusIcDigitalPowerDpExcelFile, IconPlusIcDigitalPowerDpUserCluster, IconPlusIcIctLogOut, IconPlusIcPublicAddMember, IconPlusIcPublicAlert, IconPlusIcPublicBarChart, IconPlusIcPublicBrush, IconPlusIcPublicDashboard, IconPlusIcPublicMoneyCircle, IconPlusIcPublicPdfFileTextured, IconPlusIcPublicSetting, IconPlusIcPublicTelephone } from '@hui/icon-plus';
// Layer 2: 客户成功运营总台 — 全量 mock 数据
// 字段语义化命名,覆盖 KPI / 趋势 / 构成 / 风险表 / 到期榜单 / 公告 / 导航 / 通知

// ── 主导航 ──
export const navItems = [
  { key: "workbench", label: "工作台", icon: <IconPlusIcPublicDashboard iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "customers", label: "客户", icon: <IconPlusIcDigitalPowerDpUserCluster iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "tickets", label: "工单", icon: <IconPlusIcBpitTicket iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "data", label: "数据", icon: <IconPlusIcPublicBarChart iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "settings", label: "设置", icon: <IconPlusIcPublicSetting iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

// ── 通知消息(铃铛下拉) ──
export const notifications = [
  { id: "n1", icon: <IconPlusIcPublicAlert iconSize="0.875rem" iconColor={['currentcolor']} />, title: "锦绣金融 健康分降至 38,进入流失预警", time: "5 分钟前", tone: "risk" },
  { id: "n2", icon: <IconPlusIcPublicBrush iconSize="0.875rem" iconColor={['currentcolor']} />, title: "云栖科技 提交了 3 条紧急工单,待处理", time: "32 分钟前", tone: "warning" },
  { id: "n3", icon: <IconPlusIcPublicMoneyCircle iconSize="0.875rem" iconColor={['currentcolor']} />, title: "瑞云软件 将于 11/02 到期,建议尽快跟进", time: "1 小时前", tone: "info" },
  { id: "n4", icon: <IconPlusIcPublicAddMember iconSize="0.875rem" iconColor={['currentcolor']} />, title: "新增客户「极光智能」已分配给您的团队", time: "3 小时前", tone: "success" },
];

// ── 头像下拉菜单 ──
export const userMenuItems = [
  { key: "profile", label: "个人设置", icon: <IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "team", label: "团队管理", icon: <IconPlusIcDigitalPowerDpUserCluster iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { type: "divider" },
  { key: "logout", label: "退出登录", icon: <IconPlusIcIctLogOut iconSize="0.875rem" iconColor={['currentcolor']} />, danger: true },
];

// ── KPI 指标卡(本月快照,不受下方筛选影响) ──
export const kpiCards = [
  {
    key: "renewal",
    title: "本月续约金额",
    value: "1,286",
    unit: "万元",
    delta: 12.5,
    deltaSuffix: "%",
    direction: "up",
    sentiment: "good",
    description: "较上月新增 ¥143 万,续约稳步增长",
    icon: "wallet",
  },
  {
    key: "healthy",
    title: "健康客户占比",
    value: "68.2",
    unit: "%",
    delta: 3.4,
    deltaSuffix: "pp",
    direction: "up",
    sentiment: "good",
    description: "健康客户 186 家,占比稳步提升",
    icon: "shield-check",
  },
  {
    key: "risk",
    title: "高风险客户数",
    value: "23",
    unit: "家",
    delta: 5,
    deltaSuffix: "",
    direction: "up",
    sentiment: "bad",
    description: "本周新增 5 家,需优先安排跟进",
    icon: "triangle-alert",
  },
  {
    key: "response",
    title: "平均响应时长",
    value: "2.4",
    unit: "h",
    delta: -0.8,
    deltaSuffix: "h",
    direction: "down",
    sentiment: "good",
    description: "较上周缩短 25%,服务效率提升",
    icon: "clock",
  },
];

// ── 行业下拉选项 ──
export const industries = [
  { value: "all", label: "全部行业" },
  { value: "finance", label: "金融" },
  { value: "retail", label: "零售" },
  { value: "manufacturing", label: "制造" },
  { value: "education", label: "教育" },
  { value: "healthcare", label: "医疗" },
  { value: "internet", label: "互联网" },
];

// 行业 → 数据倍率(切换时下方数据区数值可见变化)
export const industryMultipliers = {
  all: 1,
  finance: 1.08,
  retail: 0.88,
  manufacturing: 0.92,
  education: 0.95,
  healthcare: 1.04,
  internet: 1.15,
};

// ── 时间范围 ──
export const timeRangeOptions = [
  { label: "近 7 天", value: "7d" },
  { label: "近 30 天", value: "30d" },
  { label: "本季度", value: "quarter" },
];

// ── 导出下拉 ──
export const exportMenuItems = [
  { key: "excel", label: "导出 Excel", icon: <IconPlusIcDigitalPowerDpExcelFile iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "pdf", label: "导出 PDF", icon: <IconPlusIcPublicPdfFileTextured iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

// ── 趋势数据(3 系列 × N 点,波动不单调) ──
const trendSets = {
  "7d": {
    labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    activity: [72, 78, 81, 85, 88, 76, 65],
    tickets: [28, 34, 38, 42, 47, 36, 22],
    duration: [32, 35, 38, 42, 45, 36, 28],
  },
  "30d": {
    labels: ["D1", "D4", "D7", "D10", "D13", "D16", "D19", "D22", "D25", "D28", "D29", "D30"],
    activity: [65, 70, 74, 78, 72, 81, 85, 79, 83, 88, 84, 79],
    tickets: [22, 28, 32, 38, 30, 42, 47, 40, 45, 52, 44, 38],
    duration: [28, 31, 34, 38, 33, 41, 45, 40, 43, 48, 42, 37],
  },
  quarter: {
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"],
    activity: [62, 66, 70, 68, 73, 77, 75, 80, 78, 83, 85, 82],
    tickets: [20, 24, 28, 26, 32, 36, 34, 40, 38, 44, 46, 42],
    duration: [26, 29, 33, 31, 36, 40, 38, 43, 41, 46, 48, 44],
  },
};

export function getTrendData(timeRange, industry) {
  const set = trendSets[timeRange] || trendSets["30d"];
  const mult = industryMultipliers[industry] || 1;
  return set.labels.map((label, i) => ({
    时间: label,
    活跃度: Math.round(set.activity[i] * mult),
    工单量: Math.round(set.tickets[i] * mult),
    使用时长: Math.round(set.duration[i] * mult),
  }));
}

// ── 健康度构成(饼图) ──
const healthBases = {
  "7d": { healthy: 45, watch: 30, risk: 15, churn: 10 },
  "30d": { healthy: 42, watch: 28, risk: 18, churn: 12 },
  quarter: { healthy: 40, watch: 29, risk: 19, churn: 12 },
};

export function getHealthDistribution(timeRange, industry) {
  const base = healthBases[timeRange] || healthBases["30d"];
  const mult = industryMultipliers[industry] || 1;
  const data = [
    { name: "健康", value: Math.round(base.healthy * mult) },
    { name: "观察", value: Math.round(base.watch * mult) },
    { name: "风险", value: Math.round(base.risk * mult) },
    { name: "流失预警", value: Math.round(base.churn * mult) },
  ];
  const total = data.reduce((s, d) => s + d.value, 0);
  return { data, total };
}

// ── 风险客户表(12 行,4 种状态) ──
export const riskCustomers = [
  { id: "c1", companyName: "云栖科技", industry: "互联网", industryKey: "internet", healthScore: 42, csm: "李明轩", renewalDate: "2025-11-12", statusKey: "risk", amount: 86 },
  { id: "c2", companyName: "锦绣金融", industry: "金融", industryKey: "finance", healthScore: 38, csm: "王思远", renewalDate: "2025-11-03", statusKey: "churn", amount: 210 },
  { id: "c3", companyName: "恒达制造", industry: "制造", industryKey: "manufacturing", healthScore: 55, csm: "张博文", renewalDate: "2025-11-18", statusKey: "risk", amount: 124 },
  { id: "c4", companyName: "悦读教育", industry: "教育", industryKey: "education", healthScore: 61, csm: "陈雅琴", renewalDate: "2025-11-25", statusKey: "watch", amount: 58 },
  { id: "c5", companyName: "康健医疗", industry: "医疗", industryKey: "healthcare", healthScore: 72, csm: "李明轩", renewalDate: "2025-12-02", statusKey: "watch", amount: 96 },
  { id: "c6", companyName: "鲜零售", industry: "零售", industryKey: "retail", healthScore: 35, csm: "王思远", renewalDate: "2025-11-08", statusKey: "churn", amount: 42 },
  { id: "c7", companyName: "数聚网络", industry: "互联网", industryKey: "internet", healthScore: 48, csm: "张博文", renewalDate: "2025-11-30", statusKey: "risk", amount: 178 },
  { id: "c8", companyName: "鼎信金融", industry: "金融", industryKey: "finance", healthScore: 66, csm: "陈雅琴", renewalDate: "2025-12-10", statusKey: "watch", amount: 320 },
  { id: "c9", companyName: "智造工场", industry: "制造", industryKey: "manufacturing", healthScore: 51, csm: "李明轩", renewalDate: "2025-11-15", statusKey: "risk", amount: 89 },
  { id: "c10", companyName: "启智教育", industry: "教育", industryKey: "education", healthScore: 84, csm: "王思远", renewalDate: "2025-12-20", statusKey: "healthy", amount: 67 },
  { id: "c11", companyName: "仁心医院", industry: "医疗", industryKey: "healthcare", healthScore: 44, csm: "张博文", renewalDate: "2025-11-22", statusKey: "risk", amount: 135 },
  { id: "c12", companyName: "优品零售", industry: "零售", industryKey: "retail", healthScore: 58, csm: "陈雅琴", renewalDate: "2025-12-05", statusKey: "watch", amount: 73 },
];

// 表格状态 Tabs
export const statusTabs = [
  { key: "all", label: "全部" },
  { key: "risk", label: "风险" },
  { key: "watch", label: "观察" },
  { key: "churn", label: "流失预警" },
  { key: "healthy", label: "健康" },
];

// 表格行业筛选(取值有限 → filters)
export const industryFilters = industries
  .filter((i) => i.value !== "all")
  .map((i) => ({ text: i.label, value: i.value }));

// 表格状态筛选
export const statusFilters = [
  { text: "健康", value: "healthy" },
  { text: "观察", value: "watch" },
  { text: "风险", value: "risk" },
  { text: "流失预警", value: "churn" },
];

// 行内"更多"下拉(4 项)
export const moreActionItems = [
  { key: "detail", label: "查看详情", icon: "eye" },
  { key: "changeOwner", label: "修改负责人", icon: "user-cog" },
  { key: "watchlist", label: "加入观察名单", icon: "bookmark" },
  { key: "transferCsm", label: "转移 CSM", icon: "arrow-left-right" },
];

// ── 30 天内到期客户榜单(6 条,与表格不重复) ──
export const expiringCustomers = [
  { id: "e1", companyName: "瑞云软件", renewalDate: "11-02", amount: 145, daysLeft: 2, csm: "王思远" },
  { id: "e2", companyName: "蓝海传媒", renewalDate: "11-05", amount: 98, daysLeft: 5, csm: "李明轩" },
  { id: "e3", companyName: "飞鸟物流", renewalDate: "11-09", amount: 67, daysLeft: 9, csm: "张博文" },
  { id: "e4", companyName: "星辰文化", renewalDate: "11-14", amount: 52, daysLeft: 14, csm: "陈雅琴" },
  { id: "e5", companyName: "万通商旅", renewalDate: "11-19", amount: 118, daysLeft: 19, csm: "刘子涵" },
  { id: "e6", companyName: "绿源能源", renewalDate: "11-26", amount: 89, daysLeft: 26, csm: "王思远" },
];

// ── 快捷操作入口(4 个) ──
export const quickActions = [
  { key: "newFollow", label: "新建跟进", icon: <IconPlusIcPublicAddMember iconSize="1.25rem" iconColor={['var(--primary)']} /> },
  { key: "callback", label: "发起回访", icon: <IconPlusIcPublicTelephone iconSize="1.25rem" iconColor={['var(--primary)']} /> },
  { key: "submitTicket", label: "提交工单", icon: <IconPlusIcPublicBrush iconSize="1.25rem" iconColor={['var(--primary)']} /> },
  { key: "group", label: "拉群", icon: <IconPlusIcDigitalPowerDpUserCluster iconSize="1.25rem" iconColor={['var(--primary)']} /> },
];

// ── 底部公告轮播(3 条) ──
export const announcements = [
  {
    type: "update",
    typeLabel: "更新",
    text: "客户健康评分模型 v3.2 上线,新增「使用深度」维度,健康分更精准",
    date: "10-18",
  },
  {
    type: "feature",
    typeLabel: "功能",
    text: "批量跟进工具发布,支持一次性发起 20 位客户的回访任务",
    date: "10-15",
  },
  {
    type: "event",
    typeLabel: "预告",
    text: "11 月客户成功峰会 · 11/28 线上举办,现已开放报名",
    date: "10-12",
  },
];
