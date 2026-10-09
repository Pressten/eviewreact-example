import { Menu, Button, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 侧边菜单栏 — 248px 展开 / 48px 收起
export default function SideNav() {
  const { collapsed, toggleCollapsed, activeNav, setActiveNav } = useApp();

  const items = [
    { key: "workbench", icon: <Icon name="house" size="1rem" />, label: "数据工作台" },
    {
      key: "data",
      icon: <Icon name="database" size="1rem" />,
      label: "数据管理",
      children: [
        { key: "datasource", label: "数据源管理" },
        { key: "dataset", label: "数据集管理" },
        { key: "dictionary", label: "数据字典" },
        { key: "lineage", label: "数据血缘" },
        { key: "recycle", label: "回收站" },
      ],
    },
    {
      key: "schedule",
      icon: <Icon name="git-branch" size="1rem" />,
      label: "任务调度",
      children: [
        { key: "sync-task", label: "同步任务" },
        { key: "check-task", label: "校验任务" },
        { key: "task-log", label: "调度日志" },
      ],
    },
    { key: "quality", icon: <Icon name="shield-check" size="1rem" />, label: "质量监控" },
    { key: "audit", icon: <Icon name="clipboard-list" size="1rem" />, label: "操作审计" },
    { key: "setting", icon: <Icon name="settings" size="1rem" />, label: "系统设置" },
  ];

  return (
    <aside className={`side-nav${collapsed ? " is-collapsed" : ""}`}>
      <div className="side-nav__scroll">
        {!collapsed && <div className="side-nav__caption">数据资产中心</div>}
        <Menu
          mode="inline"
          items={items}
          selectedKeys={[activeNav]}
          defaultOpenKeys={["data", "schedule"]}
          inlineCollapsed={collapsed}
          onClick={(e) => setActiveNav(e.key)}
        />
      </div>
      <div className="side-nav__foot">
        <Tooltip title={collapsed ? "展开菜单" : "收起菜单"} placement="right">
          <Button
            type="text"
            block={!collapsed}
            icon={<Icon name={collapsed ? "panel-left-open" : "panel-left-close"} size="1rem" />}
            onClick={toggleCollapsed}
          >
            {collapsed ? null : "收起菜单"}
          </Button>
        </Tooltip>
      </div>
    </aside>
  );
}
