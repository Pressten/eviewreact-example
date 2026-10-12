import { Menu, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { sideMenu } from "../../mock/dashboard.js";
import "./index.css";

function toItems(nodes) {
  return nodes.map((n) => ({
    key: n.key,
    icon: <Icon name={n.icon} size="1rem" />,
    label: n.label,
    children: n.children ? n.children.map((c) => ({ key: c.key, label: c.label })) : undefined,
  }));
}

export default function SideNav() {
  const { navCollapsed, toggleNav, activeNav, setActiveNav } = useApp();

  return (
    <aside className={`side-nav ${navCollapsed ? "is-collapsed" : ""}`}>
      <div className="side-nav__scroll">
        <Menu
          className="side-nav__menu"
          mode="inline"
          theme="light"
          inlineCollapsed={navCollapsed}
          selectedKeys={[activeNav]}
          defaultOpenKeys={["resource", "alarm"]}
          items={toItems(sideMenu)}
          onClick={({ key }) => setActiveNav(key)}
        />
      </div>

      <div className="side-nav__foot">
        <Tooltip title={navCollapsed ? "展开导航" : "收起导航"} placement="right">
          <button type="button" className="side-nav__collapse" onClick={toggleNav}>
            <Icon name={navCollapsed ? "panel-left-open" : "panel-left-close"} size="1rem" />
            {!navCollapsed ? <span>收起导航</span> : null}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
