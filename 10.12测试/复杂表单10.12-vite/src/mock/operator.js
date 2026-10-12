// Layer 2: 运营商信息填报领域 Mock 数据

export const operatorOptions = [
  { value: "cmcc", text: "中国移动" },
  { value: "cucc", text: "中国联通" },
  { value: "ctcc", text: "中国电信" },
  { value: "cbn", text: "中国广电" },
];

export const provinceOptions = [
  { value: "guangdong", text: "广东省分公司" },
  { value: "jiangsu", text: "江苏省分公司" },
  { value: "zhejiang", text: "浙江省分公司" },
  { value: "shandong", text: "山东省分公司" },
  { value: "sichuan", text: "四川省分公司" },
  { value: "hubei", text: "湖北省分公司" },
];

export const cityOptions = [
  { value: "shenzhen", text: "深圳市" },
  { value: "guangzhou", text: "广州市" },
  { value: "dongguan", text: "东莞市" },
  { value: "foshan", text: "佛山市" },
  { value: "zhuhai", text: "珠海市" },
  { value: "huizhou", text: "惠州市" },
];

export const stationTypeOptions = [
  { value: "macro", text: "宏基站" },
  { value: "micro", text: "微基站" },
  { value: "indoor", text: "室内分布" },
  { value: "remote", text: "射频拉远（RRU）" },
  { value: "bs", text: "一体化基站" },
];

export const runModeOptions = [
  { value: "sa", text: "独立组网（SA）" },
  { value: "nsa", text: "非独立组网（NSA）" },
];

export const bandOptions = [
  { value: "n41", text: "n41 / 2.6GHz" },
  { value: "n78", text: "n78 / 3.5GHz" },
  { value: "n79", text: "n79 / 4.9GHz" },
  { value: "n28", text: "n28 / 700MHz" },
  { value: "b3", text: "B3 / 1.8GHz" },
  { value: "b39", text: "B39 / 1.9GHz" },
];

export const bandwidthOptions = [
  { value: "20", text: "20 MHz" },
  { value: "40", text: "40 MHz" },
  { value: "60", text: "60 MHz" },
  { value: "80", text: "80 MHz" },
  { value: "100", text: "100 MHz" },
];

export const slotRatioOptions = [
  { value: "ddddd_suudd", text: "2:2（DDDSU）" },
  { value: "dddsu", text: "3:1（DDDSU）" },
  { value: "ddsu", text: "4:1（DDDSU）" },
  { value: "custom", text: "自定义配比" },
];

export const vendorOptions = [
  { value: "huawei", text: "华为（Huawei）" },
  { value: "zte", text: "中兴（ZTE）" },
  { value: "ericsson", text: "爱立信（Ericsson）" },
  { value: "nokia", text: "诺基亚（Nokia）" },
  { value: "datang", text: "大唐移动（Datang）" },
];

export const portTypeOptions = [
  { value: "ge", text: "GE 电口" },
  { value: "10ge", text: "10GE 光口" },
  { value: "25ge", text: "25GE 光口" },
  { value: "cpri", text: "CPRI/RoE 前传口" },
];

export const powerTypeOptions = [
  { value: "grid", text: "市电引入" },
  { value: "oil", text: "油机备电" },
  { value: "solar", text: "光伏发电" },
  { value: "battery", text: "蓄电池组" },
];

export const antennaTypeOptions = [
  { value: "aaU", text: "有源天线单元（AAU）" },
  { value: "rru", text: "一体化 RRU" },
  { value: "passive", text: "无源天线阵列" },
  { value: "mas", text: "Massive MIMO" },
];

// 状态字典：key -> 展示文案 + 语义色档
export const STATUS_DICT = {
  online: { text: "在线", tone: "success" },
  activated: { text: "已激活", tone: "info" },
  alarm: { text: "告警", tone: "alert" },
  offline: { text: "离线", tone: "none" },
  pending: { text: "待激活", tone: "warning" },
  stopped: { text: "已停用", tone: "error" },
};

export const boardRows = [
  { id: "BD-2401", name: "主控传输板", slot: 1, model: "HBPOF", vendor: "huawei", boardType: "控制", ports: 8, usedPorts: 6, version: "V3.2.1", status: "online", updatedAt: "2026-10-09 14:22" },
  { id: "BD-2402", name: "基带处理板", slot: 2, model: "HBPOD", vendor: "huawei", boardType: "基带", ports: 4, usedPorts: 4, version: "V3.2.1", status: "online", updatedAt: "2026-10-09 14:22" },
  { id: "BD-2403", name: "基带处理板", slot: 3, model: "HBPOD", vendor: "huawei", boardType: "基带", ports: 4, usedPorts: 2, version: "V3.1.8", status: "alarm", updatedAt: "2026-10-08 09:31" },
  { id: "BD-2404", name: "射频接口板", slot: 4, model: "HBFD", vendor: "huawei", boardType: "射频", ports: 12, usedPorts: 8, version: "V2.9.4", status: "online", updatedAt: "2026-10-08 18:07" },
  { id: "BD-2405", name: "电源分配板", slot: 5, model: "PAU-48", vendor: "zte", boardType: "供电", ports: 2, usedPorts: 2, version: "V1.6.0", status: "online", updatedAt: "2026-10-07 11:15" },
  { id: "BD-2406", name: "风扇散热板", slot: 6, model: "FAN-A1", vendor: "zte", boardType: "散热", ports: 1, usedPorts: 1, version: "V1.2.3", status: "offline", updatedAt: "2026-10-06 21:44" },
  { id: "BD-2407", name: "环境监控板", slot: 7, model: "EMU-3", vendor: "huawei", boardType: "监控", ports: 6, usedPorts: 3, version: "V2.0.0", status: "pending", updatedAt: "2026-10-06 08:02" },
  { id: "BD-2408", name: "主控传输板", slot: 8, model: "ZTB-500", vendor: "zte", boardType: "控制", ports: 8, usedPorts: 8, version: "V4.0.2", status: "activated", updatedAt: "2026-10-05 16:38" },
  { id: "BD-2409", name: "基带处理板", slot: 9, model: "ZBB-2", vendor: "zte", boardType: "基带", ports: 4, usedPorts: 3, version: "V4.0.2", status: "online", updatedAt: "2026-10-05 16:38" },
  { id: "BD-2410", name: "时钟同步板", slot: 10, model: "SYN-G3", vendor: "ericsson", boardType: "时钟", ports: 4, usedPorts: 2, version: "V5.1.0", status: "alarm", updatedAt: "2026-10-04 13:20" },
  { id: "BD-2411", name: "射频拉远接口板", slot: 11, model: "ERF-X2", vendor: "ericsson", boardType: "射频", ports: 16, usedPorts: 9, version: "V5.1.0", status: "online", updatedAt: "2026-10-04 13:20" },
  { id: "BD-2412", name: "交换背板", slot: 12, model: "SWB-9", vendor: "nokia", boardType: "交换", ports: 24, usedPorts: 18, version: "V6.3.7", status: "online", updatedAt: "2026-10-03 10:05" },
  { id: "BD-2413", name: "光传输板", slot: 13, model: "OTU-10", vendor: "nokia", boardType: "传输", ports: 10, usedPorts: 6, version: "V6.3.7", status: "online", updatedAt: "2026-10-03 10:05" },
  { id: "BD-2414", name: "电源分配板", slot: 14, model: "PAU-48", vendor: "zte", boardType: "供电", ports: 2, usedPorts: 1, version: "V1.6.0", status: "stopped", updatedAt: "2026-10-02 19:47" },
  { id: "BD-2415", name: "基带处理板", slot: 15, model: "DTB-3", vendor: "datang", boardType: "基带", ports: 4, usedPorts: 4, version: "V2.4.1", status: "online", updatedAt: "2026-10-02 09:12" },
  { id: "BD-2416", name: "主控传输板", slot: 16, model: "DTB-3", vendor: "datang", boardType: "控制", ports: 8, usedPorts: 5, version: "V2.4.1", status: "pending", updatedAt: "2026-10-01 15:55" },
  { id: "BD-2417", name: "射频接口板", slot: 17, model: "HBFD", vendor: "huawei", boardType: "射频", ports: 12, usedPorts: 12, version: "V2.9.4", status: "alarm", updatedAt: "2026-09-30 22:31" },
  { id: "BD-2418", name: "环境监控板", slot: 18, model: "EMU-3", vendor: "huawei", boardType: "监控", ports: 6, usedPorts: 2, version: "V2.0.0", status: "online", updatedAt: "2026-09-30 07:19" },
  { id: "BD-2419", name: "光传输板", slot: 19, model: "OTU-10", vendor: "nokia", boardType: "传输", ports: 10, usedPorts: 4, version: "V6.2.0", status: "offline", updatedAt: "2026-09-29 12:40" },
  { id: "BD-2420", name: "风扇散热板", slot: 20, model: "FAN-A1", vendor: "zte", boardType: "散热", ports: 1, usedPorts: 1, version: "V1.2.3", status: "online", updatedAt: "2026-09-29 12:40" },
  { id: "BD-2421", name: "时钟同步板", slot: 21, model: "SYN-G3", vendor: "ericsson", boardType: "时钟", ports: 4, usedPorts: 4, version: "V5.0.2", status: "activated", updatedAt: "2026-09-28 17:08" },
  { id: "BD-2422", name: "射频拉远接口板", slot: 22, model: "ERF-X2", vendor: "ericsson", boardType: "射频", ports: 16, usedPorts: 11, version: "V5.0.2", status: "online", updatedAt: "2026-09-28 17:08" },
];
