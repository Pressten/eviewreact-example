// Layer 2 mock data for the antd component showcase

// ---- Table: 22 rows, diverse statuses ----
export const tableData = [
  { key: "1", name: "核心交换机 CE16800", id: "DEV-10241", region: "华东-上海", status: "online", severity: "success", cpu: 38, owner: "张伟", updatedAt: "2025-10-11 14:22" },
  { key: "2", name: "边缘网关 AR8140", id: "DEV-10242", region: "华南-深圳", status: "online", severity: "success", cpu: 61, owner: "李娜", updatedAt: "2025-10-11 13:08" },
  { key: "3", name: "存储节点 OceanStor", id: "DEV-10243", region: "华北-北京", status: "warn", severity: "warning", cpu: 87, owner: "王强", updatedAt: "2025-10-11 09:41" },
  { key: "4", name: "防火墙 USG6000", id: "DEV-10244", region: "西南-成都", status: "online", severity: "success", cpu: 24, owner: "陈芳", updatedAt: "2025-10-10 22:17" },
  { key: "5", name: "负载均衡 L7800", id: "DEV-10245", region: "华东-杭州", status: "offline", severity: "default", cpu: 0, owner: "刘洋", updatedAt: "2025-10-09 18:30" },
  { key: "6", name: "无线 AP AirEngine", id: "DEV-10246", region: "华中-武汉", status: "online", severity: "success", cpu: 45, owner: "赵敏", updatedAt: "2025-10-11 11:02" },
  { key: "7", name: "汇聚交换机 S5735", id: "DEV-10247", region: "东北-沈阳", status: "error", severity: "danger", cpu: 92, owner: "孙磊", updatedAt: "2025-10-11 15:55" },
  { key: "8", name: "服务器 RH2288", id: "DEV-10248", region: "华南-广州", status: "online", severity: "success", cpu: 73, owner: "周婷", updatedAt: "2025-10-11 08:14" },
  { key: "9", name: "堡垒机 Secospace", id: "DEV-10249", region: "西北-西安", status: "online", severity: "success", cpu: 19, owner: "吴鹏", updatedAt: "2025-10-10 16:48" },
  { key: "10", name: "光传输 OptiX", id: "DEV-10250", region: "华东-南京", status: "warn", severity: "warning", cpu: 68, owner: "郑雪", updatedAt: "2025-10-11 10:25" },
  { key: "11", name: "认证服务器 Radius", id: "DEV-10251", region: "华北-天津", status: "online", severity: "success", cpu: 33, owner: "黄勇", updatedAt: "2025-10-10 21:09" },
  { key: "12", name: "视频监控 IVS", id: "DEV-10252", region: "西南-昆明", status: "offline", severity: "default", cpu: 0, owner: "罗静", updatedAt: "2025-10-08 14:00" },
  { key: "13", name: "数据库 GaussDB", id: "DEV-10253", region: "华东-苏州", status: "online", severity: "success", cpu: 54, owner: "高翔", updatedAt: "2025-10-11 12:33" },
  { key: "14", name: "DNS 服务器", id: "DEV-10254", region: "华南-东莞", status: "online", severity: "success", cpu: 12, owner: "邓丽", updatedAt: "2025-10-11 07:50" },
  { key: "15", name: "备份一体机", id: "DEV-10255", region: "华中-长沙", status: "warn", severity: "warning", cpu: 81, owner: "曾辉", updatedAt: "2025-10-11 13:47" },
  { key: "16", name: "日志审计 SecoManager", id: "DEV-10256", region: "东北-长春", status: "online", severity: "success", cpu: 27, owner: "彭涛", updatedAt: "2025-10-10 19:12" },
  { key: "17", name: "边缘云 K8s 节点", id: "DEV-10257", region: "西北-兰州", status: "error", severity: "danger", cpu: 95, owner: "蒋琳", updatedAt: "2025-10-11 16:01" },
  { key: "18", name: "PoE 交换机 S5731", id: "DEV-10258", region: "华东-合肥", status: "online", severity: "success", cpu: 41, owner: "韩梅", updatedAt: "2025-10-11 09:30" },
  { key: "19", name: "智能网卡 DPU", id: "DEV-10259", region: "华北-石家庄", status: "online", severity: "success", cpu: 58, owner: "冯宇", updatedAt: "2025-10-10 23:45" },
  { key: "20", name: "应急通信车", id: "DEV-10260", region: "西南-贵阳", status: "offline", severity: "default", cpu: 0, owner: "宋佳", updatedAt: "2025-10-07 11:20" },
  { key: "21", name: "核心路由器 NE40E", id: "DEV-10261", region: "华南-佛山", status: "online", severity: "success", cpu: 49, owner: "曹峰", updatedAt: "2025-10-11 14:10" },
  { key: "22", name: "微波回传 RTN", id: "DEV-10262", region: "东北-哈尔滨", status: "warn", severity: "warning", cpu: 76, owner: "董超", updatedAt: "2025-10-11 10:58" },
];

export const statusMap = {
  online: { text: "在线", color: "success" },
  offline: { text: "离线", color: "default" },
  warn: { text: "告警", color: "warning" },
  error: { text: "故障", color: "error" },
};

// ---- Select options ----
export const regionOptions = [
  { label: "华东", value: "east" },
  { label: "华南", value: "south" },
  { label: "华北", value: "north" },
  { label: "西南", value: "sw", disabled: true },
  { label: "西北", value: "nw" },
  { label: "东北", value: "ne" },
  { label: "华中", value: "central" },
];

// ---- Cascader multi-level ----
export const cascaderOptions = [
  {
    value: "shanghai",
    label: "上海",
    children: [
      { value: "pudong", label: "浦东新区", children: [{ value: "zhangjiang", label: "张江园区" }, { value: "jinqiao", label: "金桥" }] },
      { value: "minhang", label: "闵行区", children: [{ value: "xinzhuang", label: "莘庄" }] },
    ],
  },
  {
    value: "guangdong",
    label: "广东",
    children: [
      { value: "shenzhen", label: "深圳", children: [{ value: "nanshan", label: "南山" }, { value: "futian", label: "福田" }] },
      { value: "guangzhou", label: "广州", children: [{ value: "tianhe", label: "天河" }] },
    ],
  },
  {
    value: "beijing",
    label: "北京",
    children: [{ value: "haidian", label: "海淀区", children: [{ value: "zhongguancun", label: "中关村" }] }],
  },
];

// ---- TreeSelect treeData ----
export const treeData = [
  {
    title: "网络设备",
    value: "network",
    children: [
      { title: "交换机", value: "switch" },
      { title: "路由器", value: "router" },
      { title: "防火墙", value: "firewall" },
    ],
  },
  {
    title: "计算设备",
    value: "compute",
    children: [
      { title: "服务器", value: "server" },
      { title: "边缘节点", value: "edge" },
    ],
  },
  {
    title: "安全设备",
    value: "security",
    children: [
      { title: "堡垒机", value: "bastion" },
      { title: "审计系统", value: "audit" },
    ],
  },
];

// ---- Checkbox group ----
export const checkboxOptions = [
  { label: "邮件通知", value: "email" },
  { label: "短信通知", value: "sms" },
  { label: "站内信", value: "inbox" },
  { label: " webhook 推送", value: "webhook" },
  { label: "已停用通道", value: "disabled", disabled: true },
];

// ---- Radio group options ----
export const radioOptions = [
  { label: "立即执行", value: "now" },
  { label: "延迟执行", value: "delay" },
  { label: "仅预检", value: "check" },
];

// ---- Timeline ----
export const timelineItems = [
  { color: "green", children: "工单已创建，等待派单 (10-09 09:12)" },
  { color: "blue", children: "工程师 张伟 接单，开始定位 (10-09 10:40)" },
  { color: "blue", children: "定位完成：核心交换机端口异常 (10-09 12:05)" },
  { color: "orange", children: "更换光模块，等待业务恢复验证 (10-09 14:30)" },
  { color: "gray", children: "验证中，预计 30 分钟内闭环 (10-09 15:00)" },
];

// ---- Carousel slides ----
export const carouselSlides = [
  { bg: "linear-gradient(135deg, var(--brand-05), var(--brand-20))", title: "网络智能运维平台", sub: "全网设备可视化与一键诊断" },
  { bg: "linear-gradient(135deg, var(--mint-05), var(--mint-30))", title: "绿色节能数据中心", sub: "PUE 实时监控与调度" },
  { bg: "linear-gradient(135deg, var(--blue-05), var(--blue-40))", title: "云网端一体安全", sub: "从边缘到核心的全栈防护" },
];

// ---- List (H5 alternative) data ----
export const listData = Array.from({ length: 6 }).map((_, i) => ({
  id: `L-${100 + i}`,
  title: `巡检任务 #${100 + i}`,
  desc: `覆盖区域 ${["华东", "华南", "华北", "西南", "西北", "东北"][i % 6]}，共 ${8 + i * 3} 台设备待检`,
  time: `2025-10-1${i} 0${i}:00`,
  done: i % 2 === 0,
}));

// ---- Descriptions (H5 alternative) data ----
export const descItems = [
  { label: "设备名称", children: "核心交换机 CE16800" },
  { label: "设备 ID", children: "DEV-10241" },
  { label: "所属区域", children: "华东-上海" },
  { label: "运行状态", children: "在线" },
  { label: "CPU 占用", children: "38%" },
  { label: "责任人", children: "张伟" },
  { label: "IP 地址", children: "10.20.30.41" },
  { label: "最近更新", children: "2025-10-11 14:22" },
];
