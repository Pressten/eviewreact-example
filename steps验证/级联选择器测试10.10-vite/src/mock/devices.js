// Layer 2: 设备接入列表 mock 数据

export const DEVICE_STATUS = {
  online: { text: "在线", tone: "success" },
  offline: { text: "离线", tone: "neutral" },
  alarm: { text: "异常", tone: "error" },
  pending: { text: "待激活", tone: "warning" },
  disabled: { text: "已停用", tone: "disabled" },
};

export const statusText = (value) =>
  DEVICE_STATUS[value] ? DEVICE_STATUS[value].text : value;

export const devices = [
  { id: "D-1001", name: "南山 01 号智能电表", code: "SN-SZN-0101", type: "smart-meter", group: "深圳 A 机房 / 01 号机柜", region: "广东省 / 深圳市 / 南山区", protocol: "modbus-tcp", port: 502, samples: 15, status: "online", updatedAt: "2026-10-09 18:42" },
  { id: "D-1002", name: "南山 02 号温湿度传感器", code: "SN-SZN-0102", type: "th-sensor", group: "深圳 A 机房 / 01 号机柜", region: "广东省 / 深圳市 / 南山区", protocol: "mqtt", port: 1883, samples: 30, status: "online", updatedAt: "2026-10-09 18:35" },
  { id: "D-1003", name: "福田边缘网关 A", code: "GW-SZF-0201", type: "gateway", group: "深圳 A 机房 / 02 号机柜", region: "广东省 / 深圳市 / 福田区", protocol: "opc-ua", port: 4840, samples: 10, status: "alarm", updatedAt: "2026-10-09 17:58" },
  { id: "D-1004", name: "宝安配电室摄像头", code: "CAM-SZB-0301", type: "camera", group: "深圳 A 机房 / 03 号机柜", region: "广东省 / 深圳市 / 宝安区", protocol: "http", port: 443, samples: 60, status: "online", updatedAt: "2026-10-09 17:20" },
  { id: "D-1005", name: "天河 PLC 主控制器", code: "PLC-GZT-0101", type: "plc", group: "广州 B 机房 / 01 号机柜", region: "广东省 / 广州市 / 天河区", protocol: "modbus-tcp", port: 502, samples: 5, status: "online", updatedAt: "2026-10-09 16:47" },
  { id: "D-1006", name: "海珠 UPS 电源柜", code: "UPS-GZH-0201", type: "ups", group: "广州 B 机房 / 02 号机柜", region: "广东省 / 广州市 / 海珠区", protocol: "snmp", port: 161, samples: 20, status: "offline", updatedAt: "2026-10-08 22:11" },
  { id: "D-1007", name: "西湖 01 号智能电表", code: "SN-HZX-0101", type: "smart-meter", group: "杭州 D 机房 / 01 号机柜", region: "浙江省 / 杭州市 / 西湖区", protocol: "mqtt", port: 1883, samples: 15, status: "online", updatedAt: "2026-10-09 15:32" },
  { id: "D-1008", name: "滨江温湿度传感器组", code: "TH-HZB-0201", type: "th-sensor", group: "杭州 D 机房 / 02 号机柜", region: "浙江省 / 杭州市 / 滨江区", protocol: "mqtt", port: 1883, samples: 30, status: "pending", updatedAt: "2026-10-08 14:05" },
  { id: "D-1009", name: "浦东边缘网关 B", code: "GW-SHP-0101", type: "gateway", group: "上海 C 机房 / 01 号机柜", region: "上海市 / 上海市 / 浦东新区", protocol: "opc-ua", port: 4840, samples: 10, status: "online", updatedAt: "2026-10-09 14:18" },
  { id: "D-1010", name: "上海 C 机房环境摄像头", code: "CAM-SHC-0201", type: "camera", group: "上海 C 机房 / 02 号机柜", region: "上海市 / 上海市 / 浦东新区", protocol: "http", port: 443, samples: 60, status: "disabled", updatedAt: "2026-10-07 09:24" },
  { id: "D-1011", name: "海淀 UPS 电源柜", code: "UPS-BJH-0101", type: "ups", group: "北京 E 机房 / 01 号机柜", region: "北京市 / 北京市 / 海淀区", protocol: "snmp", port: 161, samples: 20, status: "online", updatedAt: "2026-10-09 13:02" },
  { id: "D-1012", name: "朝阳配电室智能电表", code: "SN-BJC-0201", type: "smart-meter", group: "北京 E 机房 / 02 号机柜", region: "北京市 / 北京市 / 朝阳区", protocol: "modbus-tcp", port: 502, samples: 15, status: "alarm", updatedAt: "2026-10-09 12:40" },
  { id: "D-1013", name: "南山 03 号机柜温控器", code: "TH-SZN-0301", type: "th-sensor", group: "深圳 A 机房 / 03 号机柜", region: "广东省 / 深圳市 / 南山区", protocol: "mqtt", port: 1883, samples: 30, status: "online", updatedAt: "2026-10-09 11:55" },
  { id: "D-1014", name: "广州 B 机房 PLC 从站", code: "PLC-GZB-0201", type: "plc", group: "广州 B 机房 / 02 号机柜", region: "广东省 / 广州市 / 海珠区", protocol: "modbus-tcp", port: 503, samples: 5, status: "offline", updatedAt: "2026-10-06 20:31" },
  { id: "D-1015", name: "上海 C 机房边缘网关 C", code: "GW-SHC-0301", type: "gateway", group: "上海 C 机房 / 03 号机柜", region: "上海市 / 上海市 / 浦东新区", protocol: "opc-ua", port: 4840, samples: 10, status: "online", updatedAt: "2026-10-09 10:47" },
  { id: "D-1016", name: "杭州 D 机房备用电源", code: "UPS-HZD-0201", type: "ups", group: "杭州 D 机房 / 02 号机柜", region: "浙江省 / 杭州市 / 滨江区", protocol: "snmp", port: 161, samples: 20, status: "pending", updatedAt: "2026-10-08 08:12" },
  { id: "D-1017", name: "福田门禁摄像头", code: "CAM-SZF-0401", type: "camera", group: "深圳 A 机房 / 02 号机柜", region: "广东省 / 深圳市 / 福田区", protocol: "http", port: 443, samples: 60, status: "online", updatedAt: "2026-10-09 09:33" },
  { id: "D-1018", name: "北京 E 机房 PLC 主站", code: "PLC-BJE-0101", type: "plc", group: "北京 E 机房 / 01 号机柜", region: "北京市 / 北京市 / 海淀区", protocol: "modbus-tcp", port: 502, samples: 5, status: "alarm", updatedAt: "2026-10-09 08:50" },
  { id: "D-1019", name: "西湖区智能电表分表", code: "SN-HZX-0301", type: "smart-meter", group: "杭州 D 机房 / 01 号机柜", region: "浙江省 / 杭州市 / 西湖区", protocol: "mqtt", port: 1883, samples: 15, status: "online", updatedAt: "2026-10-08 19:21" },
  { id: "D-1020", name: "宝安机柜温湿度探头", code: "TH-SZB-0301", type: "th-sensor", group: "深圳 A 机房 / 03 号机柜", region: "广东省 / 深圳市 / 宝安区", protocol: "mqtt", port: 1883, samples: 30, status: "offline", updatedAt: "2026-10-05 16:09" },
  { id: "D-1021", name: "广州 B 机房环境摄像头", code: "CAM-GZB-0101", type: "camera", group: "广州 B 机房 / 01 号机柜", region: "广东省 / 广州市 / 天河区", protocol: "http", port: 8443, samples: 60, status: "disabled", updatedAt: "2026-10-04 11:26" },
  { id: "D-1022", name: "海淀边缘网关 D", code: "GW-BJH-0201", type: "gateway", group: "北京 E 机房 / 02 号机柜", region: "北京市 / 北京市 / 朝阳区", protocol: "opc-ua", port: 4840, samples: 10, status: "online", updatedAt: "2026-10-09 07:40" },
  { id: "D-1023", name: "天河 UPS 电源柜备机", code: "UPS-GZT-0102", type: "ups", group: "广州 B 机房 / 01 号机柜", region: "广东省 / 广州市 / 天河区", protocol: "snmp", port: 162, samples: 20, status: "pending", updatedAt: "2026-10-07 13:58" },
  { id: "D-1024", name: "南山区配电站智能电表", code: "SN-SZN-0401", type: "smart-meter", group: "深圳 A 机房 / 03 号机柜", region: "广东省 / 深圳市 / 南山区", protocol: "modbus-tcp", port: 502, samples: 15, status: "online", updatedAt: "2026-10-09 06:15" },
];
