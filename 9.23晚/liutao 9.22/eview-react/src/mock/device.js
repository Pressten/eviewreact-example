// Layer 2: 设备与告警 mock 数据
// 语义化键名,主表 ≥20 条,状态多样化

export const DEVICE_STATUS = {
  online: { text: "在线", tone: "success" },
  offline: { text: "离线", tone: "neutral" },
  warning: { text: "告警", tone: "warning" },
  fault: { text: "故障", tone: "error" },
  maintenance: { text: "维护中", tone: "info" },
};

export const DEVICE_TYPES = [
  { value: "server", text: "服务器" },
  { value: "switch", text: "交换机" },
  { value: "router", text: "路由器" },
  { value: "firewall", text: "防火墙" },
  { value: "ap", text: "无线AP" },
];

export const deviceList = [
  { id: "DEV-1001", name: "核心服务器-Web01", type: "server", ip: "10.20.1.11", room: "机房A-01", status: "online", alarmCount: 0, cpu: 35, mem: 58, lastTime: "2026-09-22 10:24:08" },
  { id: "DEV-1002", name: "核心服务器-DB01", type: "server", ip: "10.20.1.12", room: "机房A-02", status: "warning", alarmCount: 3, cpu: 82, mem: 91, lastTime: "2026-09-22 10:23:51" },
  { id: "DEV-1003", name: "接入交换机-SW03", type: "switch", ip: "10.20.2.23", room: "机房B-01", status: "online", alarmCount: 0, cpu: 12, mem: 24, lastTime: "2026-09-22 10:24:10" },
  { id: "DEV-1004", name: "边界路由器-RT01", type: "router", ip: "10.20.0.1", room: "机房A-01", status: "online", alarmCount: 1, cpu: 28, mem: 45, lastTime: "2026-09-22 10:24:05" },
  { id: "DEV-1005", name: "下一代防火墙-FW01", type: "firewall", ip: "10.20.0.254", room: "机房A-01", status: "online", alarmCount: 0, cpu: 19, mem: 33, lastTime: "2026-09-22 10:24:12" },
  { id: "DEV-1006", name: "无线AP-F3-01", type: "ap", ip: "10.20.5.31", room: "楼层3-东侧", status: "offline", alarmCount: 5, cpu: 0, mem: 0, lastTime: "2026-09-21 18:02:14" },
  { id: "DEV-1007", name: "核心服务器-App02", type: "server", ip: "10.20.1.21", room: "机房A-03", status: "online", alarmCount: 0, cpu: 47, mem: 62, lastTime: "2026-09-22 10:24:09" },
  { id: "DEV-1008", name: "接入交换机-SW07", type: "switch", ip: "10.20.2.47", room: "机房B-02", status: "fault", alarmCount: 8, cpu: 0, mem: 0, lastTime: "2026-09-22 09:15:33" },
  { id: "DEV-1009", name: "边界路由器-RT02", type: "router", ip: "10.20.0.2", room: "机房A-02", status: "online", alarmCount: 0, cpu: 22, mem: 38, lastTime: "2026-09-22 10:24:11" },
  { id: "DEV-1010", name: "无线AP-F5-12", type: "ap", ip: "10.20.5.112", room: "楼层5-西侧", status: "online", alarmCount: 2, cpu: 15, mem: 28, lastTime: "2026-09-22 10:24:07" },
  { id: "DEV-1011", name: "核心服务器-Web02", type: "server", ip: "10.20.1.13", room: "机房A-04", status: "maintenance", alarmCount: 0, cpu: 8, mem: 12, lastTime: "2026-09-22 10:24:03" },
  { id: "DEV-1012", name: "汇聚交换机-AGG01", type: "switch", ip: "10.20.2.1", room: "机房B-01", status: "online", alarmCount: 0, cpu: 25, mem: 41, lastTime: "2026-09-22 10:24:13" },
  { id: "DEV-1013", name: "下一代防火墙-FW02", type: "firewall", ip: "10.20.0.253", room: "机房A-02", status: "warning", alarmCount: 4, cpu: 76, mem: 68, lastTime: "2026-09-22 10:23:58" },
  { id: "DEV-1014", name: "无线AP-F2-08", type: "ap", ip: "10.20.5.208", room: "楼层2-南侧", status: "online", alarmCount: 0, cpu: 18, mem: 31, lastTime: "2026-09-22 10:24:06" },
  { id: "DEV-1015", name: "核心服务器-DB02", type: "server", ip: "10.20.1.22", room: "机房A-05", status: "online", alarmCount: 1, cpu: 55, mem: 72, lastTime: "2026-09-22 10:24:04" },
  { id: "DEV-1016", name: "接入交换机-SW12", type: "switch", ip: "10.20.2.62", room: "机房B-03", status: "offline", alarmCount: 6, cpu: 0, mem: 0, lastTime: "2026-09-20 23:47:02" },
  { id: "DEV-1017", name: "边界路由器-RT03", type: "router", ip: "10.20.0.3", room: "机房C-01", status: "online", alarmCount: 0, cpu: 31, mem: 44, lastTime: "2026-09-22 10:24:12" },
  { id: "DEV-1018", name: "无线AP-F4-05", type: "ap", ip: "10.20.5.405", room: "楼层4-北侧", status: "warning", alarmCount: 3, cpu: 64, mem: 70, lastTime: "2026-09-22 10:23:49" },
  { id: "DEV-1019", name: "核心服务器-Cache01", type: "server", ip: "10.20.1.31", room: "机房A-06", status: "online", alarmCount: 0, cpu: 41, mem: 55, lastTime: "2026-09-22 10:24:10" },
  { id: "DEV-1020", name: "汇聚交换机-AGG02", type: "switch", ip: "10.20.2.2", room: "机房B-02", status: "online", alarmCount: 0, cpu: 23, mem: 37, lastTime: "2026-09-22 10:24:13" },
  { id: "DEV-1021", name: "下一代防火墙-FW03", type: "firewall", ip: "10.20.0.252", room: "机房C-01", status: "fault", alarmCount: 9, cpu: 0, mem: 0, lastTime: "2026-09-22 08:33:21" },
  { id: "DEV-1022", name: "无线AP-F1-03", type: "ap", ip: "10.20.5.103", room: "楼层1-大厅", status: "maintenance", alarmCount: 0, cpu: 5, mem: 9, lastTime: "2026-09-22 10:24:01" },
];

// 告警记录(按设备关联)
export const alarmList = [
  { id: "ALM-5021", deviceId: "DEV-1002", level: "critical", title: "数据库连接数超阈值", time: "2026-09-22 10:23:51", desc: "DB01 活跃连接数达到 980,超过阈值 800" },
  { id: "ALM-5019", deviceId: "DEV-1002", level: "warning", title: "CPU 使用率持续偏高", time: "2026-09-22 10:10:22", desc: "DB01 CPU 使用率连续 10 分钟超过 80%" },
  { id: "ALM-5017", deviceId: "DEV-1002", level: "warning", title: "内存使用率告警", time: "2026-09-22 09:58:03", desc: "DB01 内存使用率 91%,接近上限 95%" },
  { id: "ALM-5031", deviceId: "DEV-1013", level: "critical", title: "防火墙会话数即将耗尽", time: "2026-09-22 10:23:58", desc: "FW02 并发会话数 98000,上限 100000" },
  { id: "ALM-5028", deviceId: "DEV-1013", level: "warning", title: "接口流量异常", time: "2026-09-22 10:15:44", desc: "FW02 GigabitEthernet0/1 入向流量突增" },
  { id: "ALM-5026", deviceId: "DEV-1013", level: "warning", title: "策略命中次数激增", time: "2026-09-22 10:02:11", desc: "FW02 拦截策略 30 分钟内命中 1200 次" },
  { id: "ALM-5035", deviceId: "DEV-1013", level: "info", title: "日志分区使用率提示", time: "2026-09-22 09:30:00", desc: "FW02 日志分区使用率 78%" },
  { id: "ALM-5042", deviceId: "DEV-1008", level: "critical", title: "交换机管理通道中断", time: "2026-09-22 09:15:33", desc: "SW07 SNMP/SSH 均不可达,疑似硬件故障" },
  { id: "ALM-5038", deviceId: "DEV-1008", level: "critical", title: "端口状态异常", time: "2026-09-22 09:12:10", desc: "SW07 Gi1/0/1-1/0/4 端口 down" },
  { id: "ALM-5009", deviceId: "DEV-1006", level: "warning", title: "AP 离线", time: "2026-09-21 18:02:14", desc: "F3-01 失去心跳,检查供电与上行链路" },
  { id: "ALM-5007", deviceId: "DEV-1006", level: "info", title: "关联终端掉线", time: "2026-09-21 17:55:02", desc: "F3-01 下挂 12 台终端全部掉线" },
];

export const ALARM_LEVEL = {
  critical: { text: "严重", tone: "error" },
  warning: { text: "警告", tone: "warning" },
  info: { text: "提示", tone: "info" },
};
