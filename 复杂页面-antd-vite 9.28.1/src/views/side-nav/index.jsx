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
    { key: "overview", icon: "layout-dashboard", label: t("nav.overview") },
    {
      key: "strategy",
      icon: "scroll-text",
      label: t("nav.strategy"),
      children: [
        { key: "strategy-form", icon: "sliders-horizontal", label: t("nav.strategy.form") },
        { key: "strategy-list", icon: "list-checks", label: t("nav.strategy.list") },
        { key: "strategy-tpl", icon: "copy", label: t("nav.strategy.template") },
      ],
    },
    {
      key: "device",
      icon: "network",
      label: t("nav.device"),
      children: [
        { key: "device-list", icon: "router", label: t("nav.device.list") },
        { key: "device-group", icon: "users", label: t("nav.device.group") },
        { key: "device-firmware", icon: "hard-drive", label: t("nav.device.firmware") },
      ],
    },
    {
      key: "alarm",
      icon: "bell",
      label: t("nav.alarm"),
      children: [
        { key: "alarm-rule", icon: "triangle-alert", label: t("nav.alarm.rule") },
        { key: "alarm-history", icon: "activity", label: t("nav.alarm.history") },
      ],
    },
    { key: "report", icon: "chart-column", label: t("nav.report") },
    { key: "audit", icon: "shield-check", label: t("nav.audit") },
    { key: "settings", icon: "settings", label: t("nav.settings") },
  ];

  const toggleSubMenu = (key) => {
    if (collapsed) return;
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <aside className={`side-nav${collapsed ? " is-collapsed" : ""}`}>
      <div className="side-nav__menu">
        {items.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openKeys.includes(item.key);
          const childActive = hasChildren && item.children.some((c) => c.key === current);

          return (
            <div key={item.key} className="side-nav__item-wrapper">
              <button
                type="button"
                className={`side-nav__item ${current === item.key || childActive ? "active" : ""}`}
                onClick={() => (hasChildren ? toggleSubMenu(item.key) : setCurrent(item.key))}
              >
                <Icon name={item.icon} size={16} />
                {collapsed ? null : <span>{item.label}</span>}
                {collapsed || !hasChildren ? null : (
                  <Icon
                    name={isOpen ? "chevron-down" : "chevron-right"}
                    size={12}
                    className="side-nav__arrow"
                  />
                )}
              </button>
              {hasChildren && isOpen && !collapsed ? (
                <div className="side-nav__sub">
                  {item.children.map((child) => (
                    <button
                      key={child.key}
                      type="button"
                      className={`side-nav__sub-item ${current === child.key ? "active" : ""}`}
                      onClick={() => setCurrent(child.key)}
                    >
                      <Icon name={child.icon} size={14} />
                      <span>{child.label}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="side-nav__footer">
        <Icon name="wifi" size={14} />
        {collapsed ? null : <span>{t("nav.version")}</span>}
      </div>
    </aside>
  );
}
