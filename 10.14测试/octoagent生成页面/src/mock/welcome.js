// Layer 2: 欢迎页 mock 数据
export const stats = [
  {
    key: "devices",
    label: "设备总数",
    value: "1,284",
    icon: "server",
    color: "var(--primary)",
    tint: "var(--primary-container)",
    trend: "+2.3%",
  },
  {
    key: "alarms",
    label: "在线告警",
    value: "3",
    icon: "bell",
    color: "var(--critical)",
    tint: "var(--critical-container)",
    trend: "-1",
  },
  {
    key: "tickets",
    label: "今日工单",
    value: "5",
    icon: "clipboard-list",
    color: "var(--info)",
    tint: "var(--info-container)",
    trend: "+1",
  },
  {
    key: "pending",
    label: "待办事项",
    value: "12",
    icon: "list-checks",
    color: "var(--success)",
    tint: "var(--success-container)",
    trend: "0",
  },
];

export const activities = [
  {
    text: "设备「华东网关 GW-0271」上报温度超限告警",
    time: "10 分钟前",
    level: "error",
    tag: "告警",
  },
  {
    text: "工单 #20837「配电柜巡检」已完成验收",
    time: "35 分钟前",
    level: "success",
    tag: "工单",
  },
  {
    text: "系统自动巡检任务完成，本次覆盖 1,284 台设备",
    time: "1 小时前",
    level: "info",
    tag: "巡检",
  },
  {
    text: "运维管理员提交了月度运行报告草稿",
    time: "2 小时前",
    level: "info",
    tag: "报告",
  },
  {
    text: "设备「储能变流器 PCS-114」离线超过 30 分钟",
    time: "3 小时前",
    level: "critical",
    tag: "离线",
  },
  {
    text: "告警「UPS 电池组电压异常」已被确认并指派处理",
    time: "5 小时前",
    level: "success",
    tag: "已处理",
  },
];
