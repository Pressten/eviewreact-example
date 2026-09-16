// mock 数据与流程配置
// 注：eview-react 的 Select/RadioGroup/SelectCard/CheckboxGroup 选项字段用 text（不是 label）；
//     Steps 的 data 用 { text, value }。此处统一输出 eview-react 兼容格式。

// 侧边菜单（亮色体系，默认不生成深色侧导航）
const menuItems = [
  { key: 'overview', icon: 'gauge', label: '设备总览' },
  { key: 'devices', icon: 'server', label: '设备管理' },
  { key: 'alarms', icon: 'bell', label: '告警中心' },
  { key: 'settings', icon: 'settings', label: '系统设置' },
];

// 面包屑路径（真实层级，不凑假路径）
const breadcrumbs = ['设备管理', '新建接入', '配置向导'];

// 步骤定义：横向 Steps 不承载长文案，说明放内容区
// eview-react Steps 需要 { text, value }；保留 key 供业务侧分派
const stepItems = [
  { key: 'basic', text: '基础信息', value: 'basic' },
  { key: 'network', text: '网络配置', value: 'network' },
  { key: 'confirm', text: '确认提交', value: 'confirm' },
];

// eview-react Select 选项：{ value, text }
const deviceTypeOptions = [
  { value: 'inverter', text: '光伏逆变器' },
  { value: 'turbine', text: '风力发电机组' },
  { value: 'storage', text: '储能电池簇' },
  { value: 'meter', text: '智能电表' },
];

const stationOptions = [
  { value: 'north-wind-03', text: '华北风电场-03' },
  { value: 'east-pv-11', text: '华东光伏站-11' },
  { value: 'south-storage-02', text: '华南储能站-02' },
];

// SelectCard（Radio.Button 替代）data：{ value, text }
const protocolOptions = [
  { value: 'modbus-tcp', text: 'Modbus TCP' },
  { value: 'iec104', text: 'IEC 104' },
  { value: 'mqtt', text: 'MQTT' },
];

// 第三步确认页的字段分组呈现配置
const confirmGroups = [
  {
    key: 'basic',
    title: '基础信息',
    fields: [
      ['deviceName', '设备名称'],
      ['deviceType', '设备类型'],
      ['station', '所属站点'],
      ['protocol', '接入协议'],
      ['remark', '备注'],
    ],
  },
  {
    key: 'network',
    title: '网络配置',
    fields: [
      ['host', '通信地址'],
      ['port', '端口'],
      ['collectInterval', '采集周期(秒)'],
      ['encrypted', '链路加密'],
    ],
  },
];

// label → 文案映射（用于确认页回显，引用上面的 text 字段）
const labelMaps = {
  deviceType: Object.fromEntries(deviceTypeOptions.map((o) => [o.value, o.text])),
  station: Object.fromEntries(stationOptions.map((o) => [o.value, o.text])),
  protocol: Object.fromEntries(protocolOptions.map((o) => [o.value, o.text])),
  encrypted: { true: '已启用', false: '未启用' },
};

export {
  menuItems,
  breadcrumbs,
  stepItems,
  deviceTypeOptions,
  stationOptions,
  protocolOptions,
  confirmGroups,
  labelMaps,
};
