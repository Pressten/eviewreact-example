// Layer 2: mock 数据 — 告警规则域
// 语义化 key，覆盖多种状态，主表 24 条。

// ---- 表单选项 ----
export const deviceTypes = [
  { value: "net-device", text: "网络设备（交换机 / 路由器）" },
  { value: "server", text: "物理服务器" },
  { value: "database", text: "数据库实例" },
  { value: "middleware", text: "中间件集群" },
  { value: "app", text: "应用服务" },
  { value: "iot", text: "物联网终端" },
];

export const regions = [
  {
    value: "east",
    label: "华东",
    children: [
      {
        value: "jiangsu",
        label: "江苏省",
        children: [
          { value: "nanjing", label: "南京" },
          { value: "suzhou", label: "苏州" },
          { value: "wuxi", label: "无锡" },
        ],
      },
      {
        value: "zhejiang",
        label: "浙江省",
        children: [
          { value: "hangzhou", label: "杭州" },
          { value: "ningbo", label: "宁波" },
        ],
      },
      {
        value: "shanghai",
        label: "上海市",
        children: [{ value: "pudong", label: "浦东新区" }],
      },
    ],
  },
  {
    value: "south",
    label: "华南",
    children: [
      {
        value: "guangdong",
        label: "广东省",
        children: [
          { value: "guangzhou", label: "广州" },
          { value: "shenzhen", label: "深圳" },
        ],
      },
      {
        value: "fujian",
        label: "福建省",
        children: [
          { value: "xiamen", label: "厦门" },
          { value: "fuzhou", label: "福州" },
        ],
      },
    ],
  },
  {
    value: "north",
    label: "华北",
    children: [
      {
        value: "beijing",
        label: "北京市",
        children: [{ value: "haidian", label: "海淀区" }],
      },
      {
        value: "hebei",
        label: "河北省",
        children: [{ value: "shijiazhuang", label: "石家庄" }],
      },
    ],
  },
  {
    value: "west",
    label: "西部",
    children: [
      {
        value: "sichuan",
        label: "四川省",
        children: [
          { value: "chengdu", label: "成都" },
          { value: "mianyang", label: "绵阳" },
        ],
      },
      {
        value: "shaanxi",
        label: "陕西省",
        children: [{ value: "xian", label: "西安" }],
      },
    ],
  },
];

export const deviceGroups = [
  {
    value: "core-center",
    title: "核心数据中心",
    children: [
      {
        value: "core-net",
        title: "核心网络组",
        children: [
          { value: "core-switch", title: "核心交换机" },
          { value: "core-route", title: "出口路由" },
        ],
      },
      {
        value: "core-db",
        title: "数据库组",
        children: [
          { value: "core-db-mysql", title: "MySQL 集群" },
          { value: "core-db-redis", title: "Redis 集群" },
        ],
      },
    ],
  },
  {
    value: "edge-room",
    title: "边缘机房",
    children: [
      { value: "edge-net", title: "边缘网络组" },
      { value: "edge-iot", title: "物联终端组" },
    ],
  },
  {
    value: "office",
    title: "办公园区",
    children: [
      { value: "office-app", title: "应用服务组" },
      { value: "office-print", title: "打印终端组" },
    ],
  },
];

export const channels = [
  { value: "sms", text: "短信" },
  { value: "email", text: "邮件" },
  { value: "wecom", text: "企业微信" },
  { value: "dingtalk", text: "钉钉" },
  { value: "webhook", text: "Webhook" },
  { value: "phone", text: "语音电话" },
];

export const alarmLevels = [
  { value: "critical", text: "紧急" },
  { value: "major", text: "严重" },
  { value: "minor", text: "一般" },
  { value: "info", text: "提示" },
];

// 告警级别 → 语义色映射（软标签）
export const levelMeta = {
  critical: { label: "紧急", bg: "var(--error-container)", color: "var(--error)" },
  major: { label: "严重", bg: "var(--critical-container)", color: "var(--critical)" },
  minor: { label: "一般", bg: "var(--warning-container)", color: "var(--on-surface)" },
  info: { label: "提示", bg: "var(--info-container)", color: "var(--info)" },
};

const channelLabel = (v) => channels.find((c) => c.value === v)?.text || v;

// ---- 规则列表数据 ----
const raw = [
  ["核心交换机端口丢包率超阈值", "网络设备", ["east", "jiangsu", "nanjing"], "critical", "丢包率", "> 5%", ["sms", "wecom"], true, "2026-10-08 14:22"],
  ["出口路由 CPU 持续过高", "网络设备", ["east", "zhejiang", "hangzhou"], "major", "CPU 使用率", "> 85%", ["email", "dingtalk"], true, "2026-10-08 11:05"],
  ["MySQL 主库慢查询激增", "数据库实例", ["east", "shanghai", "pudong"], "critical", "慢查询数", "> 200 条/分", ["sms", "email", "wecom"], true, "2026-10-07 20:41"],
  ["Redis 内存使用率告警", "数据库实例", ["south", "guangdong", "shenzhen"], "major", "内存使用率", "> 90%", ["wecom"], true, "2026-10-07 18:30"],
  ["物理服务器磁盘空间不足", "物理服务器", ["north", "beijing", "haidian"], "minor", "磁盘使用率", "> 92%", ["email"], true, "2026-10-07 09:12"],
  ["应用服务 5xx 错误率上升", "应用服务", ["east", "jiangsu", "suzhou"], "critical", "错误率", "> 3%", ["sms", "dingtalk", "webhook"], true, "2026-10-06 22:58"],
  ["中间件连接池耗尽", "中间件集群", ["south", "guangdong", "guangzhou"], "major", "活跃连接数", "> 480", ["wecom", "email"], false, "2026-10-06 16:44"],
  ["物联终端离线超时", "物联网终端", ["west", "sichuan", "chengdu"], "minor", "离线时长", "> 15 分钟", ["wecom"], true, "2026-10-06 10:19"],
  ["核心交换机风暴抑制触发", "网络设备", ["east", "jiangsu", "wuxi"], "major", "广播包速率", "> 8000 pps", ["sms"], false, "2026-10-05 19:07"],
  ["数据库主从延迟过大", "数据库实例", ["east", "zhejiang", "ningbo"], "critical", "主从延迟", "> 30s", ["sms", "phone"], true, "2026-10-05 15:33"],
  ["办公打印终端碳粉不足", "物联网终端", ["south", "fujian", "xiamen"], "info", "碳粉余量", "< 10%", ["email"], true, "2026-10-05 09:48"],
  ["应用服务响应时间劣化", "应用服务", ["north", "hebei", "shijiazhuang"], "major", "P99 响应", "> 1200ms", ["wecom", "dingtalk"], true, "2026-10-04 21:15"],
  ["服务器风扇转速异常", "物理服务器", ["west", "shaanxi", "xian"], "minor", "风扇转速", "< 1200 rpm", ["email"], false, "2026-10-04 13:02"],
  ["中间件消息堆积", "中间件集群", ["east", "shanghai", "pudong"], "major", "堆积消息数", "> 10000", ["wecom", "webhook"], true, "2026-10-04 08:27"],
  ["出口带宽利用率饱和", "网络设备", ["south", "fujian", "fuzhou"], "critical", "带宽利用率", "> 95%", ["sms", "email"], true, "2026-10-03 23:41"],
  ["数据库连接数接近上限", "数据库实例", ["east", "jiangsu", "nanjing"], "major", "连接数", "> 900", ["dingtalk"], true, "2026-10-03 17:56"],
  ["物联终端温度过高", "物联网终端", ["west", "sichuan", "mianyang"], "minor", "设备温度", "> 68°C", ["wecom"], false, "2026-10-03 12:20"],
  ["应用服务线程池拒绝", "应用服务", ["north", "beijing", "haidian"], "critical", "拒绝次数", "> 50 次/分", ["sms", "wecom"], true, "2026-10-02 20:04"],
  ["被动监测：地区节点抖动", "网络设备", ["south", "guangdong", "shenzhen"], "info", "抖动", "> 40ms", ["email"], true, "2026-10-02 14:39"],
  ["服务器 RAID 降级", "物理服务器", ["east", "zhejiang", "hangzhou"], "critical", "RAID 状态", "降级", ["sms", "phone", "email"], true, "2026-10-02 07:11"],
  ["中间件 JVM Full GC 频繁", "中间件集群", ["east", "jiangsu", "suzhou"], "minor", "Full GC 次数", "> 8 次/时", ["wecom"], false, "2026-10-01 22:33"],
  ["核心交换机光模块衰减", "网络设备", ["east", "jiangsu", "wuxi"], "major", "光功率", "< -18dBm", ["email", "wecom"], true, "2026-10-01 16:08"],
  ["数据库备份任务失败", "数据库实例", ["north", "hebei", "shijiazhuang"], "major", "备份结果", "失败", ["sms", "email"], true, "2026-10-01 09:26"],
  ["办公园区 AP 掉线", "物联网终端", ["south", "fujian", "xiamen"], "info", "在线状态", "离线", ["wecom"], false, "2026-09-30 18:52"],
];

// 级联路径 → 文本（如 ["east","jiangsu","nanjing"] → "华东 / 江苏省 / 南京"）
function regionText(path) {
  const labels = [];
  let level = regions;
  for (const v of path) {
    const node = level?.find((n) => n.value === v);
    if (!node) break;
    labels.push(node.label);
    level = node.children;
  }
  return labels.join(" / ");
}

export const rules = raw.map((r, i) => {
  const [name, target, regionPath, level, metric, threshold, chs, enabled, updatedAt] = r;
  return {
    id: `RULE-${String(1001 + i)}`,
    name,
    target,
    regionPath,
    regionLabel: regionText(regionPath),
    level,
    metric,
    threshold,
    channels: chs,
    channelLabels: chs.map(channelLabel),
    enabled,
    updatedAt,
  };
});
