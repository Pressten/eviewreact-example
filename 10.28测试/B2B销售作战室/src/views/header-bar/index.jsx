import { Badge, Dropdown } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../../src/context.jsx";
import { teams, teamMap } from "../../../src/mock/teams.js";
import { opportunities } from "../../../src/mock/opportunities.js";
import "./index.css";

const navItems = [
  { key: "warroom", label: "作战室", active: true },
  { key: "customer", label: "客户", active: false },
  { key: "opp", label: "商机", active: false, badge: true },
  { key: "contract", label: "合同", active: false },
  { key: "report", label: "报表", active: false },
];

const userMenu = {
  items: [
    { key: "profile", label: "个人中心" },
    { key: "settings", label: "偏好设置" },
    { type: "divider" },
    { key: "logout", label: "退出登录", danger: true },
  ],
  onClick: () => {},
};

export default function HeaderBar() {
  const { team, setTeam, isDark, toggleDark } = useApp();
  const currentTeam = teamMap[team];
  const oppCount = opportunities.filter((o) => o.team === team).length;

  const teamMenu = {
    items: teams.map((t) => ({ key: t.key, label: t.name })),
    onClick: ({ key }) => setTeam(key),
    selectable: true,
    selectedKeys: [team],
  };

  return (
    <header className="hdr">
      <div className="hdr__brand">
        <span className="hdr__logo">
          <Icon name="radar" size="1.5rem" color="#FFFFFF" />
        </span>
        <span className="hdr__name">销售作战室</span>
        <span className="hdr__ver">v3.2</span>
      </div>

      <nav className="hdr__nav">
        {navItems.map((it) => (
          <a key={it.key} className={`hdr__nav-item ${it.active ? "is-active" : ""}`}>
            {it.label}
            {it.badge && (
              <Badge count={oppCount} size="small" color="#E02128" offset={[4, -2]} />
            )}
          </a>
        ))}
      </nav>

      <div className="hdr__right">
        <Dropdown menu={teamMenu} trigger={["click"]} placement="bottomRight">
          <button className="hdr__team" type="button">
            <span className="hdr__team-dot" style={{ background: currentTeam.color }} />
            <span className="hdr__team-name">{currentTeam.name}</span>
            <Icon name="chevron-down" size="0.875rem" color="var(--on-surface-variant)" />
          </button>
        </Dropdown>

        <button className="hdr__icon-btn" type="button" title={isDark ? "切换浅色" : "切换深色"} onClick={toggleDark}>
          <Icon name={isDark ? "sun" : "moon"} size="1.125rem" />
        </button>

        <button className="hdr__icon-btn" type="button" title="通知中心">
          <Badge dot color="#E02128">
            <Icon name="bell" size="1.125rem" />
          </Badge>
        </button>

        <Dropdown menu={userMenu} trigger={["click"]} placement="bottomRight">
          <button className="hdr__user" type="button">
            <span className="hdr__user-av">陈</span>
            <span className="hdr__user-name">陈经理</span>
            <Icon name="chevron-down" size="0.875rem" color="var(--on-surface-variant)" />
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
