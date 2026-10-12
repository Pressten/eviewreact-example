import Accordion from "@nce/eview-react/Accordion";
import { IconPlusIcDigitalPowerDpUserCluster, IconPlusIcHuaweiCloudDatabase, IconPlusIcPublicBox, IconPlusIcPublicClose, IconPlusIcPublicDashboard, IconPlusIcPublicExpand, IconPlusIcPublicHeart, IconPlusIcPublicSetting } from '@nce/icon-plus';
import { useApp } from "../../context.jsx";
import "./index.css";

const TABS = ["task", "record", "detail"];

// Layer 4: 侧边导航 — 使用 Accordion 组件
export default function SideNav() {
  const { collapsed, toggleCollapsed, activeTab, setActiveTab } = useApp();

  const data = [
    { title: "工作台", value: "workbench", icon: <IconPlusIcPublicDashboard iconSize="1rem" iconColor={['currentcolor']} /> },
    {
      title: "数据管理",
      value: "data",
      icon: <IconPlusIcHuaweiCloudDatabase iconSize="1rem" iconColor={['currentcolor']} />,
      children: [
        { title: "任务清单", value: "task" },
        { title: "执行记录", value: "record" },
        { title: "链路详情", value: "detail" },
      ],
    },
    { title: "资源目录", value: "resource", icon: <IconPlusIcPublicBox iconSize="1rem" iconColor={['currentcolor']} /> },
    { title: "监控告警", value: "monitor", icon: <IconPlusIcPublicHeart iconSize="1rem" iconColor={['currentcolor']} /> },
    { title: "用户权限", value: "user", icon: <IconPlusIcDigitalPowerDpUserCluster iconSize="1rem" iconColor={['currentcolor']} /> },
    { title: "系统设置", value: "setting", icon: <IconPlusIcPublicSetting iconSize="1rem" iconColor={['currentcolor']} /> },
  ];

  const onSelect = (node) => {
    if (node && TABS.indexOf(node.value) > -1) setActiveTab(node.value);
  };

  return (
    <aside className={"side-nav" + (collapsed ? " is-collapsed" : "")}>
      <Accordion
        className="side-nav__menu"
        data={data}
        selectedValue={TABS.indexOf(activeTab) > -1 ? activeTab : ""}
        expanded={collapsed}
        enableExpand={false}
        hideIcons
        hideTitleBar
        onClick={onSelect}
      />
      <button type="button" className="side-nav__toggle" onClick={toggleCollapsed} title={collapsed ? "展开侧栏" : "收起侧栏"}>
        {collapsed ? <IconPlusIcPublicExpand iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicClose iconSize="1rem" iconColor={['currentcolor']} />}
        {!collapsed && <span>收起侧栏</span>}
      </button>
    </aside>
  );
}
