export const menuItems = [
  { key: "overview", icon: "gauge", label: "设备总览" },
  { key: "devices", icon: "server", label: "设备管理" },
  { key: "alarms", icon: "bell", label: "告警中心" },
  { key: "settings", icon: "settings", label: "系统设置" },
];

export const breadcrumbs = ["设备管理", "新建接入", "配置向导"];

export const stepItems = [
  { key: "basic", text: "基础信息", value: "basic" },
  { key: "network", text: "网络配置", value: "network" },
  { key: "confirm", text: "确认提交", value: "confirm" },
];

export const deviceTypeOptions = [
  { value: "inverter", text: "光伏逆变器" },
  { value: "turbine", text: "风力发电机组" },
  { value: "storage", text: "储能电池簇" },
  { value: "meter", text: "智能电表" },
];

export const stationOptions = [
  { value: "north-wind-03", text: "华北风电场-03" },
  { value: "east-pv-11", text: "华东光伏站-11" },
  { value: "south-storage-02", text: "华南储能站-02" },
];

export const protocolOptions = [
  { value: "modbus-tcp", text: "Modbus TCP" },
  { value: "iec104", text: "IEC 104" },
  { value: "mqtt", text: "MQTT" },
];

export const confirmGroups = [
  {
    key: "basic",
    title: "基础信息",
    fields: [
      ["deviceName", "设备名称"],
      ["deviceType", "设备类型"],
      ["station", "所属站点"],
      ["protocol", "接入协议"],
      ["remark", "备注"],
    ],
  },
  {
    key: "network",
    title: "网络配置",
    fields: [
      ["host", "通信地址"],
      ["port", "端口"],
      ["collectInterval", "采集周期(秒)"],
      ["encrypted", "链路加密"],
    ],
  },
];

export const labelMaps = {
  deviceType: Object.fromEntries(deviceTypeOptions.map((o) => [o.value, o.text])),
  station: Object.fromEntries(stationOptions.map((o) => [o.value, o.text])),
  protocol: Object.fromEntries(protocolOptions.map((o) => [o.value, o.text])),
  encrypted: { true: "已启用", false: "未启用" },
};
