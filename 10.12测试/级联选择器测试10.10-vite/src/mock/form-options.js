// Layer 2: 表单域选项数据（设备接入配置）

// 设备类型 — 单选下拉
export const deviceTypeOptions = [
  { value: "smart-meter", label: "智能电表" },
  { value: "th-sensor", label: "温湿度传感器" },
  { value: "gateway", label: "边缘网关" },
  { value: "camera", label: "视频摄像头" },
  { value: "plc", label: "PLC 控制器" },
  { value: "ups", label: "UPS 电源" },
];

// 接入协议 — 单选下拉
export const protocolOptions = [
  { value: "mqtt", label: "MQTT" },
  { value: "modbus-tcp", label: "Modbus TCP" },
  { value: "opc-ua", label: "OPC UA" },
  { value: "snmp", label: "SNMP v3" },
  { value: "http", label: "HTTP / HTTPS" },
];

// 需要填写端口的协议（联动条件）
export const PORT_PROTOCOLS = ["mqtt", "modbus-tcp", "opc-ua", "snmp"];

export const protocolLabel = (value) => {
  const hit = protocolOptions.find((o) => o.value === value);
  return hit ? hit.label : value;
};

export const deviceTypeLabel = (value) => {
  const hit = deviceTypeOptions.find((o) => o.value === value);
  return hit ? hit.label : value;
};

// 所属分组 — 树形下拉
export const groupTreeData = [
  {
    value: "south",
    title: "华南大区",
    children: [
      {
        value: "sz-a",
        title: "深圳 A 机房",
        children: [
          { value: "sz-a-01", title: "01 号机柜" },
          { value: "sz-a-02", title: "02 号机柜" },
          { value: "sz-a-03", title: "03 号机柜" },
        ],
      },
      {
        value: "gz-b",
        title: "广州 B 机房",
        children: [
          { value: "gz-b-01", title: "01 号机柜" },
          { value: "gz-b-02", title: "02 号机柜" },
        ],
      },
    ],
  },
  {
    value: "east",
    title: "华东大区",
    children: [
      {
        value: "sh-c",
        title: "上海 C 机房",
        children: [
          { value: "sh-c-01", title: "01 号机柜" },
          { value: "sh-c-02", title: "02 号机柜" },
          { value: "sh-c-03", title: "03 号机柜" },
        ],
      },
      {
        value: "hz-d",
        title: "杭州 D 机房",
        children: [
          { value: "hz-d-01", title: "01 号机柜" },
          { value: "hz-d-02", title: "02 号机柜" },
        ],
      },
    ],
  },
  {
    value: "north",
    title: "华北大区",
    children: [
      {
        value: "bj-e",
        title: "北京 E 机房",
        children: [
          { value: "bj-e-01", title: "01 号机柜" },
          { value: "bj-e-02", title: "02 号机柜" },
        ],
      },
    ],
  },
];

// 部署位置 — 级联选择
export const regionOptions = [
  {
    value: "guangdong",
    label: "广东省",
    children: [
      {
        value: "shenzhen",
        label: "深圳市",
        children: [
          { value: "nanshan", label: "南山区" },
          { value: "futian", label: "福田区" },
          { value: "baoan", label: "宝安区" },
        ],
      },
      {
        value: "guangzhou",
        label: "广州市",
        children: [
          { value: "tianhe", label: "天河区" },
          { value: "haizhu", label: "海珠区" },
        ],
      },
    ],
  },
  {
    value: "zhejiang",
    label: "浙江省",
    children: [
      {
        value: "hangzhou",
        label: "杭州市",
        children: [
          { value: "xihu", label: "西湖区" },
          { value: "binjiang", label: "滨江区" },
        ],
      },
    ],
  },
  {
    value: "shanghai",
    label: "上海市",
    children: [
      {
        value: "shanghai-city",
        label: "上海市",
        children: [
          { value: "pudong", label: "浦东新区" },
          { value: "huangpu", label: "黄浦区" },
          { value: "xuhui", label: "徐汇区" },
        ],
      },
    ],
  },
  {
    value: "beijing",
    label: "北京市",
    children: [
      {
        value: "beijing-city",
        label: "北京市",
        children: [
          { value: "haidian", label: "海淀区" },
          { value: "chaoyang", label: "朝阳区" },
        ],
      },
    ],
  },
];

// 能力标签 — 多选下拉
export const capabilityOptions = [
  { value: "edge", label: "边缘计算" },
  { value: "encrypt", label: "需加密传输" },
  { value: "lowfreq", label: "低频采集" },
  { value: "outdoor", label: "户外部署" },
  { value: "backup", label: "备用链路" },
  { value: "priority", label: "高优先级" },
];

// 告警等级 — 单选下拉（高级采集开启后展示）
export const alertLevelOptions = [
  { value: "info", label: "提示" },
  { value: "minor", label: "一般" },
  { value: "critical", label: "严重" },
];

// 通知方式 — 多选下拉（告警通知开启后展示）
export const notifyChannelOptions = [
  { value: "sms", label: "短信" },
  { value: "email", label: "邮件" },
  { value: "webhook", label: "Webhook" },
  { value: "dingtalk", label: "钉钉" },
];
