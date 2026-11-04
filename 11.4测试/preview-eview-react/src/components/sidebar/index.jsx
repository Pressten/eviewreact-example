import Accordion from "@nce/eview-react/Accordion";
import { IconPlusIcIctCustomShape, IconPlusIcIctServers, IconPlusIcIctViewingLogs, IconPlusIcPublicDashboard, IconPlusIcPublicNetworkMonitoring, IconPlusIcPublicSetting } from '@hui/icon-plus';
import "./index.css";

const menuItems = [
  { value: "overview", icon: <IconPlusIcPublicDashboard iconSize="1rem" iconColor={['currentcolor']} />, title: "总览" },
  { value: "assets", icon: <IconPlusIcIctServers iconSize="1rem" iconColor={['currentcolor']} />, title: "资产管理" },
  { value: "monitor", icon: <IconPlusIcPublicNetworkMonitoring iconSize="1rem" iconColor={['currentcolor']} />, title: "监控告警" },
  { value: "log", icon: <IconPlusIcIctViewingLogs iconSize="1rem" iconColor={['currentcolor']} />, title: "操作日志" },
  { value: "settings", icon: <IconPlusIcPublicSetting iconSize="1rem" iconColor={['currentcolor']} />, title: "系统设置" },
];

export default function Sidebar({ collapsed, activeKey, onSelect }) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-brand">
        <IconPlusIcIctCustomShape iconSize="1.5rem" iconColor={['#0067D1']} />
        {!collapsed && <span className="sidebar-brand-text">运维控制台</span>}
      </div>
      <Accordion
        data={menuItems}
        selectedValue={activeKey}
        onClick={(node) => node.value && onSelect(node.value)}
        enableExpand={false}
        hideTitleBar
        hideIcons
      />
    </aside>
  );
}
