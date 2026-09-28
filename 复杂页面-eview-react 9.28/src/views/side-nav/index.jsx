import { useState } from "react";
import { useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 侧边导航 — 一级模块 + 策略/设备二级菜单，支持折叠
// Menu 无对应，手写 app-sidenav（div + button + CSS 变量）
// 二级菜单：手写可折叠分组（openKeys state）
// TODO(eview-react): Menu 无对应，当前手写
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

  const toggleGroup = (key) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <aside className={`side-nav${collapsed ? " is-collapsed" : ""}`}>
      <nav className="app-sidenav">
        {items.map((m) => {
          const isOpen = openKeys.includes(m.key);
          if (!m.children) {
            return (
              <button
                key={m.key}
                type="button"
                className={`app-sidenav-item${current === m.key ? " active" : ""}`}
                onClick={() => setCurrent(m.key)}
                title={collapsed ? m.label : undefined}
              >
                <Icon name={m.icon} size={16} />
                {!collapsed ? <span>{m.label}</span> : null}
              </button>
            );
          }
          return (
            <div key={m.key} className="app-sidenav-group">
              <button
                type="button"
                className="app-sidenav-item app-sidenav-item--group"
                onClick={() => toggleGroup(m.key)}
                title={collapsed ? m.label : undefined}
              >
                <Icon name={m.icon} size={16} />
                {!collapsed ? <span>{m.label}</span> : null}
                {!collapsed ? (
                  <Icon
                    name={isOpen ? "chevron-down" : "chevron-right"}
                    size={12}
                  />
                ) : null}
              </button>
              {!collapsed && isOpen ? (
                <div className="app-sidenav-sub">
                  {m.children.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      className={`app-sidenav-item app-sidenav-item--sub${
                        current === c.key ? " active" : ""
                      }`}
                      onClick={() => setCurrent(c.key)}
                    >
                      <Icon name={c.icon} size={16} />
                      <span>{c.label}</span>
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
