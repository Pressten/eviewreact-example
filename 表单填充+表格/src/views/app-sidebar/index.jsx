// Layer 4: 侧边导航栏（Menu inline）
import { useState } from "react";
import { Menu } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

const MENU_ITEMS = [
  {
    key: "acquisition",
    icon: <Icon name="database" size="1rem" />,
    label: "数据采集",
    children: [
      { key: "rule-config", label: "采集规则配置" },
      { key: "source-manage", label: "数据源管理" },
      { key: "point-dict", label: "点位字典" },
      { key: "task-monitor", label: "采集任务监控" },
    ],
  },
  {
    key: "alarm",
    icon: <Icon name="bell" size="1rem" />,
    label: "告警中心",
    children: [
      { key: "alarm-rule", label: "告警规则" },
      { key: "notify-channel", label: "通知渠道" },
    ],
  },
  {
    key: "asset",
    icon: <Icon name="cpu" size="1rem" />,
    label: "设备资产",
    children: [
      { key: "device-ledger", label: "设备台账" },
      { key: "gateway", label: "网关管理" },
    ],
  },
  {
    key: "system",
    icon: <Icon name="settings" size="1rem" />,
    label: "系统设置",
    children: [
      { key: "user-role", label: "用户与权限" },
      { key: "op-log", label: "操作日志" },
    ],
  },
];

export default function AppSidebar() {
  const [selectedKeys, setSelectedKeys] = useState(["rule-config"]);

  return (
    <aside className="app-sider">
      <Menu
        mode="inline"
        items={MENU_ITEMS}
        selectedKeys={selectedKeys}
        defaultOpenKeys={["acquisition", "alarm"]}
        onSelect={({ key }) => setSelectedKeys([key])}
        style={{ borderInlineEnd: "none", background: "transparent" }}
      />
    </aside>
  );
}
