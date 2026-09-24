// Layer 2: 导航 mock 数据（纯数据，icon 使用 Lucide 名称字符串）
export const headerNav = [
  { key: "overview", label: "总览" },
  { key: "planning", label: "网络规划" },
  { key: "devices", label: "设备管理" },
  { key: "alarms", label: "告警中心" },
  { key: "ops", label: "运维中心" },
  { key: "reports", label: "报表中心" },
];

export const sideNavItems = [
  { key: "home", label: "首页概览", icon: "house" },
  {
    key: "planning",
    label: "网络规划",
    icon: "network",
    children: [
      { key: "topology", label: "拓扑规划" },
      { key: "ip", label: "IP规划" },
    ],
  },
  {
    key: "resources",
    label: "资源管理",
    icon: "server",
    children: [
      { key: "sites", label: "站点管理" },
      { key: "devices", label: "设备清单" },
      { key: "links", label: "链路资源" },
    ],
  },
  {
    key: "alarms",
    label: "告警中心",
    icon: "bell",
    children: [
      { key: "alarms-live", label: "实时告警" },
      { key: "alarms-history", label: "历史告警" },
    ],
  },
  { key: "tasks", label: "任务中心", icon: "activity" },
  { key: "templates", label: "模板管理", icon: "layers" },
  { key: "settings", label: "系统设置", icon: "settings" },
];

export const userMenu = [
  { key: "profile", label: "个人中心", icon: "circle-user" },
  { key: "prefs", label: "偏好设置", icon: "sliders-horizontal" },
  { key: "logout", label: "退出登录", icon: "log-out" },
];

export const currentUser = {
  name: "王建国",
  role: "网络规划工程师",
  avatar: "/uploads/user.png",
};

export const breadcrumbPath = ["首页", "网络规划", "拓扑规划"];
