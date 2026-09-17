// Layer 2: 数据与业务逻辑 — 设备配置控制台的 mock 数据与派生统计
// 展示文案统一存 i18n msgId(如 "deviceType.gateway"),由视图层用 useIntl / FormattedMessage 渲染

// ---- 顶部一级导航 ----
export const topNav = [
  { key: "console", msgId: "nav.console", fallback: "控制台" },
  { key: "resources", msgId: "nav.resources", fallback: "资源管理" },
  { key: "operations", msgId: "nav.operations", fallback: "运维中心" },
  { key: "reports", msgId: "nav.reports", fallback: "数据报表" },
];

// ---- 侧边多级导航 ----
export const sideMenuItems = [
  { key: "overview", icon: "layout-dashboard", msgId: "menu.overview", fallback: "总览" },
  {
    key: "devices",
    icon: "cpu",
    msgId: "menu.devices",
    fallback: "设备管理",
    children: [
      { key: "device-config", msgId: "menu.devices.config", fallback: "设备配置" },
      { key: "device-inventory", msgId: "menu.devices.inventory", fallback: "设备台账" },
      { key: "firmware", msgId: "menu.devices.firmware", fallback: "固件升级" },
    ],
  },
  {
    key: "collection",
    icon: "radio-tower",
    msgId: "menu.collection",
    fallback: "数据采集",
    children: [
      { key: "policy", msgId: "menu.collection.policy", fallback: "采集策略" },
      { key: "protocol", msgId: "menu.collection.protocol", fallback: "协议模板" },
    ],
  },
  { key: "alarms", icon: "bell", msgId: "menu.alarms", fallback: "告警中心" },
  { key: "reports", icon: "chart-column", msgId: "menu.reports", fallback: "数据报表" },
  { key: "settings", icon: "settings", msgId: "menu.settings", fallback: "系统设置" },
];

// ---- 表单选项字典 ----
export const deviceTypeOptions = [
  { value: "gateway", msgId: "deviceType.gateway", fallback: "智能网关" },
  { value: "sensor", msgId: "deviceType.sensor", fallback: "环境传感器" },
  { value: "meter", msgId: "deviceType.meter", fallback: "电力仪表" },
  { value: "camera", msgId: "deviceType.camera", fallback: "视频终端" },
];

export const TYPE_ICON = {
  gateway: "cpu",
  sensor: "thermometer",
  meter: "gauge",
  camera: "video",
};

export const siteOptions = [
  { value: "shanghai", msgId: "site.shanghai", fallback: "上海临港数据中心" },
  { value: "beijing", msgId: "site.beijing", fallback: "北京亦庄机房" },
  { value: "shenzhen", msgId: "site.shenzhen", fallback: "深圳前海园区" },
  { value: "chengdu", msgId: "site.chengdu", fallback: "成都天府节点" },
];

export const protocolOptions = [
  { value: "mqtt", label: "MQTT" },
  { value: "http", label: "HTTP" },
  { value: "coap", label: "CoAP" },
];

export const compressionOptions = [
  { value: "none", msgId: "option.compression.none", fallback: "不压缩" },
  { value: "gzip", label: "GZIP" },
  { value: "lz4", label: "LZ4" },
];

export const priorityOptions = [
  { value: "high", msgId: "option.priority.high", fallback: "高" },
  { value: "medium", msgId: "option.priority.medium", fallback: "中" },
  { value: "low", msgId: "option.priority.low", fallback: "低" },
];

export const policyTemplates = [
  { value: "policy.highFreq", msgId: "policy.highFreq", fallback: "高频采集策略" },
  { value: "policy.standard", msgId: "policy.standard", fallback: "标准采集策略" },
  { value: "policy.lowFreq", msgId: "policy.lowFreq", fallback: "低频采集策略" },
  { value: "policy.video", msgId: "policy.video", fallback: "视频回传策略" },
];

export const firmwareOptions = ["v3.8.2", "v3.8.0", "v3.6.0", "v2.4.1"].map((v) => ({
  value: v,
  label: v,
}));

export const STATUS_KEYS = ["online", "offline", "alarm", "upgrading", "disabled"];

// ---- 表格数据 ----
export const deviceRows = [
  {
    code: "GW-SH-0121",
    name: "临港网关 A01",
    type: "gateway",
    site: "shanghai",
    policy: "policy.highFreq",
    firmware: "v3.8.2",
    status: "online",
    lastReport: "2026-09-15 09:42",
  },
  {
    code: "SN-BJ-0044",
    name: "亦庄传感器 B12",
    type: "sensor",
    site: "beijing",
    policy: "policy.standard",
    firmware: "v2.4.1",
    status: "online",
    lastReport: "2026-09-15 09:41",
  },
  {
    code: "MT-SZ-0087",
    name: "前海电表 C07",
    type: "meter",
    site: "shenzhen",
    policy: "policy.standard",
    firmware: "v2.4.1",
    status: "alarm",
    lastReport: "2026-09-15 09:12",
  },
  {
    code: "VC-SH-0203",
    name: "临港视频终端 V03",
    type: "camera",
    site: "shanghai",
    policy: "policy.video",
    firmware: "v3.6.0",
    status: "online",
    lastReport: "2026-09-15 09:40",
  },
  {
    code: "GW-CD-0056",
    name: "天府网关 D05",
    type: "gateway",
    site: "chengdu",
    policy: "policy.highFreq",
    firmware: "v3.8.0",
    status: "offline",
    lastReport: "2026-09-14 22:05",
  },
  {
    code: "SN-SZ-0112",
    name: "前海传感器 B08",
    type: "sensor",
    site: "shenzhen",
    policy: "policy.lowFreq",
    firmware: "v2.3.9",
    status: "online",
    lastReport: "2026-09-15 09:38",
  },
  {
    code: "MT-BJ-0130",
    name: "亦庄电表 C11",
    type: "meter",
    site: "beijing",
    policy: "policy.standard",
    firmware: "v2.4.1",
    status: "upgrading",
    lastReport: "2026-09-15 08:57",
  },
  {
    code: "GW-SH-0137",
    name: "临港网关 A02",
    type: "gateway",
    site: "shanghai",
    policy: "policy.highFreq",
    firmware: "v3.8.2",
    status: "online",
    lastReport: "2026-09-15 09:42",
  },
  {
    code: "SN-CD-0021",
    name: "天府传感器 B03",
    type: "sensor",
    site: "chengdu",
    policy: "policy.lowFreq",
    firmware: "v2.4.1",
    status: "disabled",
    lastReport: "2026-08-30 17:24",
  },
  {
    code: "VC-BJ-0064",
    name: "亦庄视频终端 V07",
    type: "camera",
    site: "beijing",
    policy: "policy.video",
    firmware: "v3.6.0",
    status: "alarm",
    lastReport: "2026-09-15 07:33",
  },
  {
    code: "MT-SH-0149",
    name: "临港电表 C19",
    type: "meter",
    site: "shanghai",
    policy: "policy.standard",
    firmware: "v2.4.1",
    status: "online",
    lastReport: "2026-09-15 09:39",
  },
  {
    code: "GW-SZ-0078",
    name: "前海网关 D02",
    type: "gateway",
    site: "shenzhen",
    policy: "policy.standard",
    firmware: "v3.8.0",
    status: "offline",
    lastReport: "2026-09-14 19:48",
  },
];

// ---- 表单初值 ----
export const policyFormInitialValues = {
  policyName: "临港数据中心高频采集",
  deviceType: "gateway",
  site: "shanghai",
  protocol: "mqtt",
  interval: 30,
  priority: "high",
  enhanced: true,
  sampleInterval: 500,
  batchSize: 60,
  heartbeat: 45,
  bufferLimit: 10000,
  compression: "gzip",
  retries: 3,
  masking: false,
  remark: "",
};

export const deviceFormInitialValues = {
  name: "",
  code: "",
  type: "gateway",
  site: "shanghai",
  firmware: "v3.8.2",
  policy: "policy.highFreq",
  enabled: true,
  remark: "",
};

// ---- 派生统计 ----
export function summarize(rows) {
  return rows.reduce(
    (acc, row) => {
      acc.total += 1;
      if (acc[row.status] !== undefined) acc[row.status] += 1;
      return acc;
    },
    { total: 0, online: 0, offline: 0, alarm: 0, upgrading: 0, disabled: 0 }
  );
}
