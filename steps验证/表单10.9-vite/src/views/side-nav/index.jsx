import { useState } from "react";
import { IconPlusIcDigitalPowerDpFile, IconPlusIcHuaweiCloudNetwork, IconPlusIcHuaweiCloudUserCluster, IconPlusIcPublicBarChart, IconPlusIcPublicClipboard, IconPlusIcPublicDashboard, IconPlusIcPublicInvoice, IconPlusIcPublicMenuCollapse, IconPlusIcPublicMenuExpansion, IconPlusIcPublicSetting, IconPlusIcPublicWrench } from '@nce/icon-plus';
import Accordion from "@nce/eview-react/Accordion";
import "./index.css";

// Layer 4 — 侧边导航栏（eview Accordion，一级带图标，二级不带图标）
const MENU_ITEMS = [
  { value: "home", icon: <IconPlusIcPublicDashboard iconSize="1rem" iconColor={['currentcolor']} />, title: "首页概览" },
  { value: "customer", icon: <IconPlusIcHuaweiCloudUserCluster iconSize="1rem" iconColor={['currentcolor']} />, title: "客户管理" },
  {
    value: "order",
    icon: <IconPlusIcPublicClipboard iconSize="1rem" iconColor={['currentcolor']} />,
    title: "业务受理",
    children: [
      { value: "order-create", title: "企业专线开通" },
      { value: "order-broadband", title: "宽带报装" },
      { value: "order-cloud", title: "云专线受理" },
      { value: "order-change", title: "移机与变更" },
    ],
  },
  { value: "ticket", icon: <IconPlusIcDigitalPowerDpFile iconSize="1rem" iconColor={['currentcolor']} />, title: "订单工单" },
  {
    value: "resource",
    icon: <IconPlusIcHuaweiCloudNetwork iconSize="1rem" iconColor={['currentcolor']} />,
    title: "资源管理",
    children: [
      { value: "res-line", title: "传输资源" },
      { value: "res-ip", title: "IP 地址池" },
      { value: "res-fiber", title: "光缆资源" },
      { value: "res-room", title: "机房与端口" },
    ],
  },
  { value: "billing", icon: <IconPlusIcPublicInvoice iconSize="1rem" iconColor={['currentcolor']} />, title: "计费中心" },
  { value: "dispatch", icon: <IconPlusIcPublicWrench iconSize="1rem" iconColor={['currentcolor']} />, title: "工单调度" },
  { value: "report", icon: <IconPlusIcPublicBarChart iconSize="1rem" iconColor={['currentcolor']} />, title: "运营报表" },
  { value: "settings", icon: <IconPlusIcPublicSetting iconSize="1rem" iconColor={['currentcolor']} />, title: "系统设置" },
];

export default function SideNav() {
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState("order-create");

  return (
    <aside className={"sidenav" + (collapsed ? " is-collapsed" : "")}>
      <div className="sidenav-scroll">
        <Accordion
          data={MENU_ITEMS}
          selectedValue={selected}
          onClick={(node) => { if (node.value) setSelected(node.value); }}
          expanded={collapsed}
          onExpand={(flag) => setCollapsed(!flag)}
          hideTitleBar
          className="sidenav-menu"
        />
      </div>
      <button type="button" className="sidenav-fold" onClick={() => setCollapsed((c) => !c)}>
        {collapsed ? <IconPlusIcPublicMenuExpansion iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMenuCollapse iconSize="1rem" iconColor={['currentcolor']} />}
        {!collapsed ? <span>收起导航</span> : null}
      </button>
    </aside>
  );
}
