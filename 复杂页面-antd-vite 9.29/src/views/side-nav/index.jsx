import { useState } from "react";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

export default function SideNav() {
  const { collapsed } = useApp();
  const [current, setCurrent] = useState("strategy-form");
  const [openKeys, setOpenKeys] = useState(["strategy", "device"]);
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

  const toggleOpen = (key) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <aside className={`side-nav${collapsed ? " is-collapsed" : ""}`}>
      <nav className="side-nav__menu app-side-nav">
        {items.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openKeys.includes(item.key);

          if (collapsed) {
            return (
              <button
                key={item.key}
                type="button"
                className={`app-side-item${current === item.key ? " active" : ""}`}
                title={item.label}
                onClick={() => setCurrent(item.key)}
              >
                {item.icon}
              </button>
            );
          }

          return (
            <div key={item.key} className="app-side-group">
              <button
                type="button"
                className={`app-side-item${current === item.key ? " active" : ""}`}
                onClick={() => (hasChildren ? toggleOpen(item.key) : setCurrent(item.key))}
              >
                {item.icon}
                <span className="app-side-item__label">{item.label}</span>
                {hasChildren ? (
                  <Icon name={isOpen ? "chevron-down" : "chevron-right"} size={14} />
                ) : null}
              </button>
              {hasChildren && isOpen ? (
                <div className="app-side-sub">
                  {item.children.map((child) => (
                    <button
                      key={child.key}
                      type="button"
                      className={`app-side-sub-item${current === child.key ? " active" : ""}`}
                      onClick={() => setCurrent(child.key)}
                    >
                      {child.icon}
                      <span>{child.label}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
      <div className="side-nav__footer">
        <Icon name="wifi" size={14} />
        {collapsed ? null : <span>{t("nav.version")}</span>}
      </div>
    </aside>
  );
}
