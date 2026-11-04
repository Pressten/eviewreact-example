import { useState } from "react";
import { Menu } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

const menuItems = [
  { key: "overview", icon: <Icon name="layout-dashboard" size="1rem" />, label: "总览" },
  { key: "assets", icon: <Icon name="server" size="1rem" />, label: "资产管理" },
  { key: "monitor", icon: <Icon name="activity" size="1rem" />, label: "监控告警" },
  { key: "log", icon: <Icon name="scroll-text" size="1rem" />, label: "操作日志" },
  { key: "settings", icon: <Icon name="settings" size="1rem" />, label: "系统设置" },
];

export default function Sidebar({ collapsed, activeKey, onSelect }) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-brand">
        <Icon name="hexagon" size="1.5rem" color="#0067D1" />
        {!collapsed && <span className="sidebar-brand-text">运维控制台</span>}
      </div>
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[activeKey]}
        items={menuItems}
        onClick={({ key }) => onSelect(key)}
      />
    </aside>
  );
}
