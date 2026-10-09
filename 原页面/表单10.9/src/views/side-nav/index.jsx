import { useState } from "react";
import { Menu } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// Layer 4 — 侧边导航栏（antd Menu，一级带图标，二级不带图标）
const MENU_ITEMS = [
  { key: "home", icon: <Icon name="layout-dashboard" size="1rem" />, label: "首页概览" },
  { key: "customer", icon: <Icon name="users" size="1rem" />, label: "客户管理" },
  {
    key: "order",
    icon: <Icon name="clipboard-list" size="1rem" />,
    label: "业务受理",
    children: [
      { key: "order-create", label: "企业专线开通" },
      { key: "order-broadband", label: "宽带报装" },
      { key: "order-cloud", label: "云专线受理" },
      { key: "order-change", label: "移机与变更" },
    ],
  },
  { key: "ticket", icon: <Icon name="file-text" size="1rem" />, label: "订单工单" },
  {
    key: "resource",
    icon: <Icon name="network" size="1rem" />,
    label: "资源管理",
    children: [
      { key: "res-line", label: "传输资源" },
      { key: "res-ip", label: "IP 地址池" },
      { key: "res-fiber", label: "光缆资源" },
      { key: "res-room", label: "机房与端口" },
    ],
  },
  { key: "billing", icon: <Icon name="receipt" size="1rem" />, label: "计费中心" },
  { key: "dispatch", icon: <Icon name="wrench" size="1rem" />, label: "工单调度" },
  { key: "report", icon: <Icon name="chart-column" size="1rem" />, label: "运营报表" },
  { key: "settings", icon: <Icon name="settings" size="1rem" />, label: "系统设置" },
];

export default function SideNav() {
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState("order-create");
  const [openKeys, setOpenKeys] = useState(["order"]);

  const foldProps = collapsed ? {} : { openKeys, onOpenChange: (keys) => setOpenKeys(keys) };

  return (
    <aside className={"sidenav" + (collapsed ? " is-collapsed" : "")}>
      <div className="sidenav-scroll">
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={[selected]}
          items={MENU_ITEMS}
          onClick={({ key }) => setSelected(key)}
          className="sidenav-menu"
          {...foldProps}
        />
      </div>
      <button type="button" className="sidenav-fold" onClick={() => setCollapsed((c) => !c)}>
        <Icon name={collapsed ? "panel-left-open" : "panel-left-close"} size="1rem" />
        {!collapsed ? <span>收起导航</span> : null}
      </button>
    </aside>
  );
}
