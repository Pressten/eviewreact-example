// Layer 4: 侧边导航（教务系统模块菜单）
import { Menu } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

const ITEMS = [
  { key: "dashboard", icon: <Icon name="layout-dashboard" size="0.875rem" />, label: "工作台" },
  { key: "students", icon: <Icon name="users" size="0.875rem" />, label: "学员管理" },
  { key: "classes", icon: <Icon name="school" size="0.875rem" />, label: "班级管理" },
  { key: "courses", icon: <Icon name="book-open" size="0.875rem" />, label: "课程管理" },
  { key: "schedule", icon: <Icon name="calendar-days" size="0.875rem" />, label: "排课管理" },
  { key: "teachers", icon: <Icon name="presentation" size="0.875rem" />, label: "教师管理" },
  { key: "finance", icon: <Icon name="wallet" size="0.875rem" />, label: "缴费管理" },
  { key: "gallery", icon: <Icon name="image" size="0.875rem" />, label: "作品墙" },
  { key: "stats", icon: <Icon name="chart-column" size="0.875rem" />, label: "数据统计" },
];

export default function Sidebar({ collapsed }) {
  return (
    <aside className={"app-sidebar" + (collapsed ? " is-collapsed" : "")}>
      <div className="app-sidebar__brand">
        <Icon name="graduation-cap" size="1.5rem" color="#0067D1" />
        {!collapsed && <span className="app-sidebar__brand-text">码趣教务</span>}
      </div>
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={["students"]}
        items={ITEMS}
        className="app-sidebar__menu"
      />
    </aside>
  );
}
