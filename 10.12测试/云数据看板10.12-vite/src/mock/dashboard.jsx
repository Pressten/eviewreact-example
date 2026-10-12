// Layer 2 — 数据看板 Mock 数据（云平台运营监控中心）
import { IconPlusIcCarSpeed, IconPlusIcIctServers, IconPlusIcPublicBellClock, IconPlusIcPublicDashboard, IconPlusIcPublicMoneyCircle, IconPlusIcPublicSetting, IconPlusIcPublicShare } from '@nce/icon-plus';

/* ── 顶部一级导航 ───────────────────────────── */
export const topNav = [
  { key: "overview", label: "总览" },
  { key: "resource", label: "资源监控" },
  { key: "alarm", label: "告警中心" },
  { key: "report", label: "报表分析" },
  { key: "admin", label: "系统管理" },
];

/* ── 侧边多级导航 ───────────────────────────── */
export const sideMenu = [
  { key: "dashboard", icon: <IconPlusIcPublicDashboard iconSize="1rem" iconColor={['currentcolor']} />, label: "总览看板" },
  {
    key: "resource",
    icon: <IconPlusIcIctServers iconSize="1rem" iconColor={['currentcolor']} />,
    label: "资源监控",
    children: [
      { key: "resource-host", label: "云主机" },
      { key: "resource-db", label: "云数据库" },
      { key: "resource-storage", label: "对象存储" },
      { key: "resource-net", label: "网络资源" },
    ],
  },
  {
    key: "alarm",
    icon: <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />,
    label: "告警中心",
    children: [
      { key: "alarm-realtime", label: "实时告警" },
      { key: "alarm-rule", label: "告警规则" },
      { key: "alarm-history", label: "历史告警" },
    ],
  },
  { key: "topology", icon: <IconPlusIcPublicShare iconSize="1rem" iconColor={['currentcolor']} />, label: "拓扑视图" },
  { key: "capacity", icon: <IconPlusIcCarSpeed iconSize="1rem" iconColor={['currentcolor']} />, label: "容量分析" },
  { key: "cost", icon: <IconPlusIcPublicMoneyCircle iconSize="1rem" iconColor={['currentcolor']} />, label: "成本管理" },
  {
    key: "settings",
    icon: <IconPlusIcPublicSetting iconSize="1rem" iconColor={['currentcolor']} />,
    label: "系统设置",
    children: [
      { key: "settings-org", label: "组织管理" },
      { key: "settings-role", label: "权限配置" },
      { key: "settings-log", label: "操作日志" },
    ],
  },
];

/* ── 顶部指标卡 ─────────────────────────────── */
export const kpis = [
  {
    key: "online",
    label: "在线实例",
    value: "8,642",
    unit: "台",
    delta: 3.2,
    direction: "up",
    icon: "server",
    tone: "info",
    spark: [42, 48, 45, 56, 52, 61, 58, 66, 63, 72, 69, 78],
  },
  {
    key: "request",
    label: "今日请求量",
    value: "1,286",
    unit: "万次",
    delta: 8.6,
    direction: "up",
    icon: "activity",
    tone: "success",
    spark: [30, 38, 34, 42, 50, 47, 55, 52, 60, 58, 66, 74],
  },
  {
    key: "latency",
    label: "平均响应时间",
    value: "128",
    unit: "ms",
    delta: -5.4,
    direction: "down",
    icon: "timer",
    tone: "warning",
    spark: [80, 74, 78, 66, 70, 62, 58, 64, 55, 52, 48, 44],
  },
  {
    key: "alarm",
    label: "待处理告警",
    value: "36",
    unit: "条",
    delta: 12.5,
    direction: "up",
    icon: "triangle-alert",
    tone: "error",
    spark: [20, 26, 22, 30, 28, 34, 31, 38, 36, 42, 40, 46],
  },
];

/* ── 图表数据 ───────────────────────────────── */
// 请求量趋势（近 15 天，单位：万次）
export const requestTrend = [
  { 日期: "09-28", 请求量: 1024, 峰值: 1386 },
  { 日期: "09-29", 请求量: 1088, 峰值: 1452 },
  { 日期: "09-30", 请求量: 1176, 峰值: 1530 },
  { 日期: "10-01", 请求量: 986, 峰值: 1240 },
  { 日期: "10-02", 请求量: 942, 峰值: 1188 },
  { 日期: "10-03", 请求量: 1068, 峰值: 1396 },
  { 日期: "10-04", 请求量: 1132, 峰值: 1468 },
  { 日期: "10-05", 请求量: 1204, 峰值: 1524 },
  { 日期: "10-06", 请求量: 1268, 峰值: 1602 },
  { 日期: "10-07", 请求量: 1312, 峰值: 1674 },
  { 日期: "10-08", 请求量: 1246, 峰值: 1588 },
  { 日期: "10-09", 请求量: 1348, 峰值: 1706 },
  { 日期: "10-10", 请求量: 1392, 峰值: 1758 },
  { 日期: "10-11", 请求量: 1284, 峰值: 1632 },
  { 日期: "10-12", 请求量: 1286, 峰值: 1690 },
];

// 告警类型分布
export const alarmDistribution = [
  { name: "网络异常", value: 42 },
  { name: "磁盘告警", value: 31 },
  { name: "内存告警", value: 24 },
  { name: "CPU 过载", value: 18 },
  { name: "其他", value: 9 },
];

// 各区域资源用量（单位：核）
export const regionUsage = [
  { 区域: "华北-北京", 用量: 3200 },
  { 区域: "华东-上海", 用量: 2780 },
  { 区域: "华南-广州", 用量: 2140 },
  { 区域: "西南-成都", 用量: 1520 },
  { 区域: "华中-武汉", 用量: 960 },
];

// 集群资源利用率
export const clusterGauge = { value: 68, name: "资源利用率" };

/* ── 云主机实例（表格） ─────────────────────── */
export const instances = [
  { id: "i-8f2a91c3", name: "web-prod-01", region: "华北-北京", spec: "8vCPU / 32GB", status: "运行中", cpu: 42, memory: 58, owner: "张伟", updateTime: "2026-10-12 09:24" },
  { id: "i-3c7b22d8", name: "web-prod-02", region: "华北-北京", spec: "8vCPU / 32GB", status: "运行中", cpu: 38, memory: 51, owner: "张伟", updateTime: "2026-10-12 09:24" },
  { id: "i-5a1e90ff", name: "db-mysql-01", region: "华东-上海", spec: "16vCPU / 64GB", status: "告警", cpu: 88, memory: 91, owner: "李娜", updateTime: "2026-10-12 09:18" },
  { id: "i-7d4c83a1", name: "db-redis-02", region: "华东-上海", spec: "8vCPU / 32GB", status: "运行中", cpu: 34, memory: 46, owner: "李娜", updateTime: "2026-10-12 09:12" },
  { id: "i-2b6f14e9", name: "cache-node-01", region: "华南-广州", spec: "4vCPU / 16GB", status: "运行中", cpu: 27, memory: 62, owner: "王强", updateTime: "2026-10-12 09:05" },
  { id: "i-9e0d75b4", name: "cache-node-02", region: "华南-广州", spec: "4vCPU / 16GB", status: "维护中", cpu: 0, memory: 12, owner: "王强", updateTime: "2026-10-12 08:58" },
  { id: "i-1f8a2c67", name: "api-gateway-01", region: "华北-北京", spec: "8vCPU / 16GB", status: "运行中", cpu: 56, memory: 48, owner: "刘洋", updateTime: "2026-10-12 09:22" },
  { id: "i-6d3e91a2", name: "api-gateway-02", region: "华北-北京", spec: "8vCPU / 16GB", status: "运行中", cpu: 61, memory: 52, owner: "刘洋", updateTime: "2026-10-12 09:22" },
  { id: "i-4a7c05d9", name: "log-collector-01", region: "西南-成都", spec: "4vCPU / 8GB", status: "故障", cpu: 0, memory: 0, owner: "陈静", updateTime: "2026-10-12 07:41" },
  { id: "i-0b9f6e13", name: "log-collector-02", region: "西南-成都", spec: "4vCPU / 8GB", status: "运行中", cpu: 45, memory: 67, owner: "陈静", updateTime: "2026-10-12 09:15" },
  { id: "i-8c2d47b5", name: "bigdata-worker-01", region: "华东-上海", spec: "32vCPU / 128GB", status: "运行中", cpu: 74, memory: 82, owner: "赵磊", updateTime: "2026-10-12 09:20" },
  { id: "i-5e1a90f7", name: "bigdata-worker-02", region: "华东-上海", spec: "32vCPU / 128GB", status: "告警", cpu: 92, memory: 88, owner: "赵磊", updateTime: "2026-10-12 09:19" },
  { id: "i-3b8f62a0", name: "bigdata-worker-03", region: "华东-上海", spec: "32vCPU / 128GB", status: "运行中", cpu: 68, memory: 76, owner: "赵磊", updateTime: "2026-10-12 09:20" },
  { id: "i-7a0c53d6", name: "k8s-master-01", region: "华北-北京", spec: "16vCPU / 64GB", status: "运行中", cpu: 49, memory: 55, owner: "孙悦", updateTime: "2026-10-12 09:23" },
  { id: "i-9d4e28b1", name: "k8s-master-02", region: "华北-北京", spec: "16vCPU / 64GB", status: "运行中", cpu: 44, memory: 53, owner: "孙悦", updateTime: "2026-10-12 09:23" },
  { id: "i-2e6b91c8", name: "k8s-node-01", region: "华南-广州", spec: "8vCPU / 32GB", status: "运行中", cpu: 63, memory: 71, owner: "周敏", updateTime: "2026-10-12 09:11" },
  { id: "i-0c3f75a9", name: "k8s-node-02", region: "华南-广州", spec: "8vCPU / 32GB", status: "已停止", cpu: 0, memory: 0, owner: "周敏", updateTime: "2026-10-11 22:36" },
  { id: "i-5f8a14d2", name: "storage-oss-01", region: "华中-武汉", spec: "16vCPU / 64GB", status: "运行中", cpu: 31, memory: 42, owner: "吴昊", updateTime: "2026-10-12 09:07" },
  { id: "i-1a7d60b3", name: "storage-oss-02", region: "华中-武汉", spec: "16vCPU / 64GB", status: "告警", cpu: 79, memory: 64, owner: "吴昊", updateTime: "2026-10-12 09:09" },
  { id: "i-8b2c95e4", name: "monitor-agent-01", region: "西南-成都", spec: "2vCPU / 8GB", status: "运行中", cpu: 22, memory: 38, owner: "郑爽", updateTime: "2026-10-12 09:16" },
  { id: "i-4d9e07a5", name: "monitor-agent-02", region: "西南-成都", spec: "2vCPU / 8GB", status: "运行中", cpu: 25, memory: 41, owner: "郑爽", updateTime: "2026-10-12 09:16" },
  { id: "i-6c0a83b7", name: "ci-runner-01", region: "华东-上海", spec: "8vCPU / 16GB", status: "维护中", cpu: 0, memory: 8, owner: "张伟", updateTime: "2026-10-12 06:50" },
  { id: "i-3f5b21c9", name: "ci-runner-02", region: "华东-上海", spec: "8vCPU / 16GB", status: "运行中", cpu: 87, memory: 74, owner: "张伟", updateTime: "2026-10-12 09:21" },
  { id: "i-9a1d64e0", name: "backup-node-01", region: "华北-北京", spec: "4vCPU / 16GB", status: "运行中", cpu: 18, memory: 33, owner: "刘洋", updateTime: "2026-10-12 09:02" },
];

/* ── 抽屉详情：近 24 小时 CPU 趋势 ─────────── */
export const hourlyCpu = [
  { 时间: "00:00", CPU使用率: 32, 内存使用率: 48 },
  { 时间: "02:00", CPU使用率: 28, 内存使用率: 46 },
  { 时间: "04:00", CPU使用率: 24, 内存使用率: 45 },
  { 时间: "06:00", CPU使用率: 31, 内存使用率: 47 },
  { 时间: "08:00", CPU使用率: 52, 内存使用率: 56 },
  { 时间: "10:00", CPU使用率: 68, 内存使用率: 62 },
  { 时间: "12:00", CPU使用率: 74, 内存使用率: 65 },
  { 时间: "14:00", CPU使用率: 66, 内存使用率: 61 },
  { 时间: "16:00", CPU使用率: 71, 内存使用率: 63 },
  { 时间: "18:00", CPU使用率: 58, 内存使用率: 57 },
  { 时间: "20:00", CPU使用率: 46, 内存使用率: 53 },
  { 时间: "22:00", CPU使用率: 38, 内存使用率: 50 },
];

/* ── 抽屉详情：最近事件 ─────────────────────── */
export const instanceEvents = [
  { time: "2026-10-12 09:24", level: "info", title: "实例健康检查通过", desc: "自动巡检未发现异常指标" },
  { time: "2026-10-12 08:10", level: "warning", title: "内存使用率超过阈值", desc: "内存使用率达到 91%，阈值 85%" },
  { time: "2026-10-11 22:36", level: "info", title: "配置变更成功", desc: "安全组规则已更新（zhaolei）" },
  { time: "2026-10-11 18:02", level: "error", title: "磁盘写入延迟升高", desc: "平均写延迟 42ms，持续 6 分钟" },
  { time: "2026-10-10 14:20", level: "info", title: "快照备份完成", desc: "生成快照 snap-2f8a1c，大小 128GB" },
];
