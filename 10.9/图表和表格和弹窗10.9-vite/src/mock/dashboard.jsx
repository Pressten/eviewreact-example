// Layer 2: 智慧能源运维看板 mock 数据
import { IconPlusIcDigitalPowerDpDocText, IconPlusIcIctCpu, IconPlusIcPublicBellClock, IconPlusIcPublicDashboard, IconPlusIcPublicFlash, IconPlusIcPublicSetting } from '@nce/icon-plus';

// 顶部主导航
export const navTabs = [
  { key: "overview", label: "运营总览" },
  { key: "device", label: "设备管理" },
  { key: "alarm", label: "告警中心" },
  { key: "energy", label: "能耗分析" },
  { key: "report", label: "报表中心" },
];

// 侧边菜单
export const menuItems = [
  { key: "dashboard", icon: <IconPlusIcPublicDashboard iconSize="1rem" iconColor={['currentcolor']} />, label: "运营总览" },
  {
    key: "device",
    icon: <IconPlusIcIctCpu iconSize="1rem" iconColor={['currentcolor']} />,
    label: "设备管理",
    children: [
      { key: "device-list", label: "设备列表" },
      { key: "device-group", label: "分组管理" },
      { key: "device-firmware", label: "固件升级" },
    ],
  },
  {
    key: "alarm",
    icon: <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />,
    label: "告警中心",
    children: [
      { key: "alarm-live", label: "实时告警" },
      { key: "alarm-rule", label: "告警规则" },
      { key: "alarm-history", label: "历史记录" },
    ],
  },
  { key: "energy", icon: <IconPlusIcPublicFlash iconSize="1rem" iconColor={['currentcolor']} />, label: "能耗分析" },
  { key: "report", icon: <IconPlusIcDigitalPowerDpDocText iconSize="1rem" iconColor={['currentcolor']} />, label: "报表中心" },
  { key: "settings", icon: <IconPlusIcPublicSetting iconSize="1rem" iconColor={['currentcolor']} />, label: "系统设置" },
];

// KPI 概览卡
export const kpiList = [
  { key: "online", icon: "server", label: "在线设备", value: "1,286", unit: "台", delta: "+3.2%", up: true, tone: "primary" },
  { key: "power", icon: "zap", label: "今日发电量", value: "42,860", unit: "kWh", delta: "+5.8%", up: true, tone: "success" },
  { key: "alarm", icon: "triangle-alert", label: "待处理告警", value: "18", unit: "条", delta: "-2", up: false, tone: "warning" },
  { key: "util", icon: "gauge", label: "平均利用率", value: "91.4", unit: "%", delta: "+1.1%", up: true, tone: "info" },
];

// 折线图:近 7 日发电量趋势
export const trendData = [
  { 日期: "09-28", 实际发电量: 38200, 计划发电量: 37000 },
  { 日期: "09-29", 实际发电量: 40600, 计划发电量: 38000 },
  { 日期: "09-30", 实际发电量: 35400, 计划发电量: 37500 },
  { 日期: "10-01", 实际发电量: 42800, 计划发电量: 39000 },
  { 日期: "10-02", 实际发电量: 44100, 计划发电量: 39500 },
  { 日期: "10-03", 实际发电量: 39800, 计划发电量: 39000 },
  { 日期: "10-04", 实际发电量: 42860, 计划发电量: 40000 },
];

// 柱状图:各区域平均负载率
export const regionLoad = [
  { 区域: "华北", 平均负载率: 88 },
  { 区域: "华东", 平均负载率: 93 },
  { 区域: "华南", 平均负载率: 76 },
  { 区域: "西南", 平均负载率: 81 },
  { 区域: "西北", 平均负载率: 69 },
  { 区域: "东北", 平均负载率: 62 },
];

// 饼图:设备状态分布
export const statusDist = [
  { name: "运行中", value: 862 },
  { name: "待机", value: 246 },
  { name: "告警", value: 118 },
  { name: "离线", value: 60 },
];

// 仪表盘:综合利用率
export const gaugeData = [{ value: 91.4, name: "综合利用率" }];

// 弹窗内近 24 小时负载曲线
export const loadCurve = [
  { 时间: "00:00", 负载率: 62 },
  { 时间: "02:00", 负载率: 58 },
  { 时间: "04:00", 负载率: 55 },
  { 时间: "06:00", 负载率: 61 },
  { 时间: "08:00", 负载率: 74 },
  { 时间: "10:00", 负载率: 88 },
  { 时间: "12:00", 负载率: 94 },
  { 时间: "14:00", 负载率: 91 },
  { 时间: "16:00", 负载率: 85 },
  { 时间: "18:00", 负载率: 78 },
  { 时间: "20:00", 负载率: 83 },
  { 时间: "22:00", 负载率: 71 },
];

// 设备明细:种子 [名称, 类型, 区域, 状态, 负载率, 温度, 厂商, 固件, 累计在线(h)]
const deviceSeeds = [
  ["华能光伏A区逆变器-01", "光伏逆变器", "华北", "运行中", 92, 46.3, "华为", "Sun2000-5.0", 1382],
  ["华能光伏A区逆变器-02", "光伏逆变器", "华北", "运行中", 88, 45.1, "华为", "Sun2000-5.0", 1382],
  ["华能光伏A区逆变器-03", "光伏逆变器", "华北", "告警", 97, 58.7, "华为", "Sun2000-5.2", 1350],
  ["大同储能电站PCS-01", "储能变流器", "华北", "运行中", 84, 42.5, "阳光电源", "SG3125-v3", 1204],
  ["大同储能电站PCS-02", "储能变流器", "华北", "待机", 12, 33.8, "阳光电源", "SG3125-v3", 1204],
  ["张北风电主控-07", "风机主控", "华北", "运行中", 79, 44.9, "金风科技", "GW-Ctrl-2.1", 2210],
  ["张北风电主控-08", "风机主控", "华北", "离线", 0, 21.4, "金风科技", "GW-Ctrl-2.1", 2210],
  ["临港光伏逆变器-11", "光伏逆变器", "华东", "运行中", 95, 49.2, "固德威", "GW-HT-3.0", 968],
  ["临港光伏逆变器-12", "光伏逆变器", "华东", "运行中", 90, 47.6, "固德威", "GW-HT-3.0", 968],
  ["苏州储能变流器-03", "储能变流器", "华东", "运行中", 86, 41.2, "上能电气", "EH-2500", 1120],
  ["苏州储能变流器-04", "储能变流器", "华东", "告警", 99, 61.5, "上能电气", "EH-2500", 1120],
  ["杭州汇流箱-05", "汇流箱", "华东", "运行中", 72, 38.4, "华为", "PVS-16", 1430],
  ["广州光伏逆变器-21", "光伏逆变器", "华南", "运行中", 83, 44.7, "阳光电源", "SG110-v2", 876],
  ["广州光伏逆变器-22", "光伏逆变器", "华南", "待机", 9, 32.1, "阳光电源", "SG110-v2", 876],
  ["深圳智能电表-18", "智能电表", "华南", "运行中", 64, 35.6, "威胜", "DP-310", 1980],
  ["珠海环境监测仪-02", "环境监测仪", "华南", "运行中", 41, 36.9, "聚光科技", "AQ-700", 1544],
  ["成都储能变流器-06", "储能变流器", "西南", "运行中", 81, 43.8, "宁德时代", "CATL-PCS-2", 1002],
  ["成都储能变流器-07", "储能变流器", "西南", "告警", 96, 59.3, "宁德时代", "CATL-PCS-2", 1002],
  ["重庆光伏逆变器-33", "光伏逆变器", "西南", "运行中", 77, 42.0, "固德威", "GW-HT-3.0", 934],
  ["西安光伏逆变器-41", "光伏逆变器", "西北", "运行中", 68, 40.5, "华为", "Sun2000-5.0", 1108],
  ["兰州风机主控-12", "风机主控", "西北", "待机", 14, 34.2, "金风科技", "GW-Ctrl-2.1", 1766],
  ["兰州风机主控-13", "风机主控", "西北", "离线", 0, 20.8, "金风科技", "GW-Ctrl-2.1", 1766],
  ["沈阳汇流箱-09", "汇流箱", "东北", "运行中", 59, 37.1, "上能电气", "PVS-16", 1268],
  ["哈尔滨环境监测仪-04", "环境监测仪", "东北", "运行中", 37, 31.5, "聚光科技", "AQ-700", 1476],
];

export const deviceList = deviceSeeds.map((s, i) => ({
  id: i + 1,
  name: s[0],
  type: s[1],
  region: s[2],
  status: s[3],
  load: s[4],
  temp: s[5],
  manufacturer: s[6],
  firmware: s[7],
  uptimeHours: s[8],
  code: `DEV-${1001 + i}`,
  ip: `10.24.${Math.floor(i / 8) + 1}.${11 + (i % 240)}`,
  updated: `2026-10-09 ${String(8 + (i % 9)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
}));

// 弹窗近期告警
export const recentAlarms = [
  { color: "orange", time: "2026-10-09 09:42", title: "负载率短时超过 90%", desc: "系统已自动触发降载策略,当前恢复至正常区间。" },
  { color: "blue", time: "2026-10-08 22:10", title: "固件升级成功", desc: "固件由 Sun2000-5.0 升级至 Sun2000-5.2。" },
  { color: "green", time: "2026-10-08 06:00", title: "例行巡检通过", desc: "各项参数均在阈值范围内,无异常。" },
];
