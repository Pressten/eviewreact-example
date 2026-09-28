import { useState } from "react";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

const NAV_ITEMS = [
  { key: "overview", icon: "layout-dashboard", msgId: "nav.overview" },
  {
    key: "strategy",
    icon: "scroll-text",
    msgId: "nav.strategy",
    children: [
      { key: "strategy-form", icon: "sliders-horizontal", msgId: "nav.strategy.form" },
      { key: "strategy-list", icon: "list-checks", msgId: "nav.strategy.list" },
      { key: "strategy-tpl", icon: "copy", msgId: "nav.strategy.template" },
    ],
  },
  {
    key: "device",
    icon: "network",
    msgId: "nav.device",
    children: [
      { key: "device-list", icon: "router", msgId: "nav.device.list" },
      { key: "device-group", icon: "users", msgId: "nav.device.group" },
      { key: "device-firmware", icon: "hard-drive", msgId: "nav.device.firmware" },
    ],
  },
  {
    key: "alarm",
    icon: "bell",
    msgId: "nav.alarm",
    children: [
      { key: "alarm-rule", icon: "triangle-alert", msgId: "nav.alarm.rule" },
      { key: "alarm-history", icon: "activity", msgId: "nav.alarm.history" },
    ],
  },
  { key: "report", icon: "chart-column", msgId: "nav.report" },
  { key: "audit", icon: "shield-check", msgId: "nav.audit" },
  { key: "settings", icon: "settings", msgId: "nav.settings" },
];

export default function SideNav() {
  const { collapsed } = useApp();
  const [current, setCurrent] = useState("strategy-form");
  const [openGroups, setOpenGroups] = useState({ strategy: true, device: true });
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const toggleGroup = (key) => {
    if (collapsed) return;
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (key) => setCurrent(key);

  return (
    <aside className={`side-nav${collapsed ? " is-collapsed" : ""}`}>
      <nav className="side-nav__menu">
        {NAV_ITEMS.map((item) => {
          const hasChildren = !!item.children?.length;
          const isOpen = openGroups[item.key];
          const isGroupActive = hasChildren && item.children.some((c) => c.key === current);

          if (!hasChildren) {
            return (
              <button
                key={item.key}
                type="button"
                className={`side-nav__item${current === item.key ? " is-active" : ""}`}
                onClick={() => handleSelect(item.key)}
                title={collapsed ? t(item.msgId) : undefined}
              >
                <span className="side-nav__item-icon">
                  <Icon name={item.icon} size={16} />
                </span>
                {!collapsed ? <span className="side-nav__item-text">{t(item.msgId)}</span> : null}
              </button>
            );
          }

          return (
            <div key={item.key} className="side-nav__group">
              <button
                type="button"
                className={`side-nav__item side-nav__item--group${isGroupActive ? " is-active" : ""}`}
                onClick={() => toggleGroup(item.key)}
                title={collapsed ? t(item.msgId) : undefined}
              >
                <span className="side-nav__item-icon">
                  <Icon name={item.icon} size={16} />
                </span>
                {!collapsed ? (
                  <>
                    <span className="side-nav__item-text">{t(item.msgId)}</span>
                    <span className={`side-nav__chevron${isOpen ? " is-open" : ""}`}>
                      <Icon name="chevron-down" size={12} />
                    </span>
                  </>
                ) : null}
              </button>
              {!collapsed && isOpen ? (
                <div className="side-nav__sub">
                  {item.children.map((child) => (
                    <button
                      key={child.key}
                      type="button"
                      className={`side-nav__item side-nav__item--sub${current === child.key ? " is-active" : ""}`}
                      onClick={() => handleSelect(child.key)}
                    >
                      <span className="side-nav__item-icon">
                        <Icon name={child.icon} size={16} />
                      </span>
                      <span className="side-nav__item-text">{t(child.msgId)}</span>
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
