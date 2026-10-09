// Layer 4: 侧边导航栏（Accordion 多级导航菜单）
import { useState } from "react";
import { IconPlusIcHuaweiCloudDatabase, IconPlusIcIctAlarm, IconPlusIcIctCpu, IconPlusIcPublicSetting } from '@nce/icon-plus';
import Accordion from "@nce/eview-react/Accordion";
import "./index.css";

const MENU_ITEMS = [
  {
    title: "数据采集",
    value: "acquisition",
    icon: <IconPlusIcHuaweiCloudDatabase iconSize="1rem" iconColor={['currentcolor']} />,
    isExpand: true,
    children: [
      { title: "采集规则配置", value: "rule-config" },
      { title: "数据源管理", value: "source-manage" },
      { title: "点位字典", value: "point-dict" },
      { title: "采集任务监控", value: "task-monitor" },
    ],
  },
  {
    title: "告警中心",
    value: "alarm",
    icon: <IconPlusIcIctAlarm iconSize="1rem" iconColor={['currentcolor']} />,
    isExpand: true,
    children: [
      { title: "告警规则", value: "alarm-rule" },
      { title: "通知渠道", value: "notify-channel" },
    ],
  },
  {
    title: "设备资产",
    value: "asset",
    icon: <IconPlusIcIctCpu iconSize="1rem" iconColor={['currentcolor']} />,
    children: [
      { title: "设备台账", value: "device-ledger" },
      { title: "网关管理", value: "gateway" },
    ],
  },
  {
    title: "系统设置",
    value: "system",
    icon: <IconPlusIcPublicSetting iconSize="1rem" iconColor={['currentcolor']} />,
    children: [
      { title: "用户与权限", value: "user-role" },
      { title: "操作日志", value: "op-log" },
    ],
  },
];

const isLeaf = (node) => !node.children || node.children.length === 0;

export default function AppSidebar() {
  const [selectedValue, setSelectedValue] = useState("rule-config");

  const handleMenuClick = (node) => {
    if (isLeaf(node) && node.value) {
      setSelectedValue(node.value);
    }
  };

  return (
    <aside className="app-sider">
      <Accordion
        data={MENU_ITEMS}
        selectedValue={selectedValue}
        onClick={handleMenuClick}
        enableExpand={false}
        hideIcons
        hideTitleBar
        enableMultiOpen
        style={{ borderInlineEnd: "none", background: "transparent" }}
      />
    </aside>
  );
}
