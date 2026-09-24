// Layer 2: 拓扑规划 mock 数据

export const planModes = [
  { value: "classic", label: "经典配置规划" },
  { value: "custom", label: "自定义规划" },
];

// —— 经典配置规划（系统推荐方案）——
export const topologyTemplates = [
  { value: "single-core", label: "单核心双出口链路" },
  { value: "dual-core", label: "双核心双出口链路" },
  { value: "ring-access", label: "环形汇聚接入" },
  { value: "leaf-spine", label: "Leaf-Spine 数据中心" },
];

export const siteScales = [
  { value: "small", label: "小型站点（设备 < 50 台）" },
  { value: "medium", label: "中型站点（设备 50 ~ 200 台）" },
  { value: "large", label: "大型站点（设备 > 200 台）" },
];

export const deviceForms = [
  { value: "chassis", label: "框式交换机堆叠" },
  { value: "box", label: "盒式交换机级联" },
  { value: "router", label: "路由器 + 交换机组网" },
];

export const uplinkTypes = [
  { value: "fiber", label: "光纤专线" },
  { value: "ethernet", label: "以太网链路" },
  { value: "backup", label: "5G 无线备份" },
];

// —— 自定义规划 ——
export const templateFile = {
  name: "模板.xlsx",
  size: "28.6 KB",
  version: "V2.3",
  updatedAt: "2026-08-12",
  sheets: ["拓扑结构", "设备清单", "链路信息", "IP 网段"],
};

export const uploadHint = "支持 .xlsx / .xls 格式，单个文件不超过 10 MB，最多同时导入 5 个文件";

export const managementModes = [
  {
    value: "centralized",
    label: "集中式管理",
    desc: "由核心站点统一纳管全部网络设备，配置文件集中下发",
  },
  {
    value: "distributed",
    label: "分布式管理",
    desc: "各区域站点独立管理本地设备，核心站点仅做数据同步",
  },
  {
    value: "hybrid",
    label: "分层混合管理",
    desc: "核心层集中纳管，接入层由区域控制器就近管理",
  },
];

// 已导入的规划文件（演示数据）
export const importedFiles = [
  { uid: "f-1", name: "总部园区拓扑规划.xlsx", size: "312 KB", status: "done", sheets: 4 },
  { uid: "f-2", name: "华南分部链路清单.xlsx", size: "186 KB", status: "done", sheets: 3 },
];
