import { useState } from "react";
import { IconPlusIcDigitalPowerLogManagement, IconPlusIcIctServers, IconPlusIcPublicDashboard, IconPlusIcPublicHeartWaveform, IconPlusIcPublicSetting, IconPlusIcPublicTransverseRectangleTemplate } from '@hui/icon-plus';
import Accordion from "@nce/eview-react/Accordion";
import "./index.css";

const menuItems = [
  { value: "overview", icon: <IconPlusIcPublicDashboard iconSize="1rem" iconColor={['currentcolor']} />, title: "总览" },
  { value: "assets", icon: <IconPlusIcIctServers iconSize="1rem" iconColor={['currentcolor']} />, title: "资产管理" },
  { value: "monitor", icon: <IconPlusIcPublicHeartWaveform iconSize="1rem" iconColor={['currentcolor']} />, title: "监控告警" },
  { value: "log", icon: <IconPlusIcDigitalPowerLogManagement iconSize="1rem" iconColor={['currentcolor']} />, title: "操作日志" },
  { value: "settings", icon: <IconPlusIcPublicSetting iconSize="1rem" iconColor={['currentcolor']} />, title: "系统设置" },
];

export default function Sidebar({ collapsed, activeKey, onSelect }) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-brand">
        <IconPlusIcPublicTransverseRectangleTemplate iconSize="1.5rem" iconColor={['#0067D1']} />
        {!collapsed && <span className="sidebar-brand-text">运维控制台</span>}
      </div>
      <Accordion
        data={menuItems}
        selectedValue={activeKey}
        onClick={(node) => onSelect(node.value)}
        enableExpand={false}
        hideIcons
        hideTitleBar
        className="sidebar-menu"
      />
    </aside>
  );
}
