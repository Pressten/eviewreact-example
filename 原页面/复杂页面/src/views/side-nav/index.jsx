import { useState } from "react";
import { Menu } from "antd";
import { useIntl } from "react-intl";
import { Icon } from "../../../assets/shared/icons.js";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 侧边导航 — 一级模块 + 策略/设备二级菜单，支持折叠
export default function SideNav() {
  const { collapsed } = useApp();
  const [current, setCurrent] = useState("strategy-form");
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const items = [
    { key: "overview", icon: <Icon name="layout-dashboard" size={16} />, label: t("nav.overview") },
    {
      key: "strategy",
      icon: <Icon name="scroll-text" size={16} />,
      label: t("nav.strategy"),
      children: [
        { key: "strategy-form", icon: <Icon name="sliders-horizontal" size={16} />, label: t("nav.strategy.form") },
        { key: "strategy-list", icon: <Icon name="list-checks" size={16} />, label: t("nav.strategy.list") },
        { key: "strategy-tpl", icon: <Icon name="copy" size={16} />, label: t("nav.strategy.template") },
      ],
    },
    {
      key: "device",
      icon: <Icon name="network" size={16} />,
      label: t("nav.device"),
      children: [
        { key: "device-list", icon: <Icon name="router" size={16} />, label: t("nav.device.list") },
        { key: "device-group", icon: <Icon name="users" size={16} />, label: t("nav.device.group") },
        { key: "device-firmware", icon: <Icon name="hard-drive" size={16} />, label: t("nav.device.firmware") },
      ],
    },
    {
      key: "alarm",
      icon: <Icon name="bell" size={16} />,
      label: t("nav.alarm"),
      children: [
        { key: "alarm-rule", icon: <Icon name="triangle-alert" size={16} />, label: t("nav.alarm.rule") },
        { key: "alarm-history", icon: <Icon name="activity" size={16} />, label: t("nav.alarm.history") },
      ],
    },
    { key: "report", icon: <Icon name="chart-column" size={16} />, label: t("nav.report") },
    { key: "audit", icon: <Icon name="shield-check" size={16} />, label: t("nav.audit") },
    { key: "settings", icon: <Icon name="settings" size={16} />, label: t("nav.settings") },
  ];

  return (
    <aside className={`side-nav${collapsed ? " is-collapsed" : ""}`}>
      <Menu
        className="side-nav__menu"
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[current]}
        defaultOpenKeys={["strategy", "device"]}
        items={items}
        onClick={(e) => setCurrent(e.key)}
        style={{ borderRight: "none", width: collapsed ? 48 : "100%" }}
      />
      <div className="side-nav__footer">
        <Icon name="wifi" size={14} />
        {collapsed ? null : <span>{t("nav.version")}</span>}
      </div>
    </aside>
  );
}
