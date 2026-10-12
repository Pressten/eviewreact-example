import { Menu } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

const TABS = ["task", "record", "detail"];

// Layer 4: 侧边导航 — 使用 Menu 组件
export default function SideNav() {
  const { collapsed, toggleCollapsed, activeTab, setActiveTab } = useApp();

  const items = [
    { key: "workbench", icon: <Icon name="layout-dashboard" size="1rem" />, label: "工作台" },
    {
      key: "data",
      icon: <Icon name="database" size="1rem" />,
      label: "数据管理",
      children: [
        { key: "task", label: "任务清单" },
        { key: "record", label: "执行记录" },
        { key: "detail", label: "链路详情" },
      ],
    },
    { key: "resource", icon: <Icon name="boxes" size="1rem" />, label: "资源目录" },
    { key: "monitor", icon: <Icon name="activity" size="1rem" />, label: "监控告警" },
    { key: "user", icon: <Icon name="users" size="1rem" />, label: "用户权限" },
    { key: "setting", icon: <Icon name="settings" size="1rem" />, label: "系统设置" },
  ];

  const onSelect = ({ key }) => {
    if (TABS.indexOf(key) > -1) setActiveTab(key);
  };

  return (
    <aside className={"side-nav" + (collapsed ? " is-collapsed" : "")}>
      <Menu
        className="side-nav__menu"
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={TABS.indexOf(activeTab) > -1 ? [activeTab] : []}
        defaultOpenKeys={["data"]}
        items={items}
        onClick={onSelect}
      />
      <button type="button" className="side-nav__toggle" onClick={toggleCollapsed} title={collapsed ? "展开侧栏" : "收起侧栏"}>
        <Icon name={collapsed ? "panel-left-open" : "panel-left-close"} size="1rem" />
        {!collapsed && <span>收起侧栏</span>}
      </button>
    </aside>
  );
}
