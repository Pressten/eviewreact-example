import Badge from "@nce/eview-react/Badge";
import { IconPlusIcPublicChevronDown, IconPlusIcPublicMoon, IconPlusIcPublicSun, IconPlusIcCarRadar1, IconPlusIcPublicBellClock } from '@hui/icon-plus';
import Dropdown from "@/shared/Dropdown";
import { useApp } from "../../context.jsx";
import { teams, teamMap } from "../../mock/teams.js";
import { opportunities } from "../../mock/opportunities.js";
import "./index.css";

const navItems = [
  { key: "warroom", label: "作战室", active: true },
  { key: "customer", label: "客户", active: false },
  { key: "opp", label: "商机", active: false, badge: true },
  { key: "contract", label: "合同", active: false },
  { key: "report", label: "报表", active: false },
];

const userMenuItems = [
  { key: "profile", label: "个人中心" },
  { key: "settings", label: "偏好设置" },
  { type: "divider" },
  { key: "logout", label: "退出登录", danger: true },
];

export default function HeaderBar() {
  const { team, setTeam, isDark, toggleDark } = useApp();
  const currentTeam = teamMap[team];
  const oppCount = opportunities.filter((o) => o.team === team).length;

  const teamMenuItems = teams.map((t) => ({ key: t.key, label: t.name }));

  return (
    <header className="hdr">
      <div className="hdr__brand">
        <span className="hdr__logo">
          <IconPlusIcCarRadar1 iconSize="1.5rem" iconColor={['#FFFFFF']} />
        </span>
        <span className="hdr__name">销售作战室</span>
        <span className="hdr__ver">v3.2</span>
      </div>

      <nav className="hdr__nav">
        {navItems.map((it) => (
          <a key={it.key} className={`hdr__nav-item ${it.active ? "is-active" : ""}`}>
            {it.label}
            {it.badge && (
              <Badge content={oppCount} offset={[4, -2]} />
            )}
          </a>
        ))}
      </nav>

      <div className="hdr__right">
        <Dropdown
          trigger={
            <button className="hdr__team" type="button">
              <span className="hdr__team-dot" style={{ background: currentTeam.color }} />
              <span className="hdr__team-name">{currentTeam.name}</span>
              <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />
            </button>
          }
          items={teamMenuItems}
          selectedKey={team}
          onSelect={(key) => setTeam(key)}
        />

        <button className="hdr__icon-btn" type="button" title={isDark ? "切换浅色" : "切换深色"} onClick={toggleDark}>
          {isDark ? <IconPlusIcPublicSun iconSize="1.125rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMoon iconSize="1.125rem" iconColor={['currentcolor']} />}
        </button>

        <button className="hdr__icon-btn" type="button" title="通知中心">
          <Badge dot>
            <IconPlusIcPublicBellClock iconSize="1.125rem" iconColor={['currentcolor']} />
          </Badge>
        </button>

        <Dropdown
          trigger={
            <button className="hdr__user" type="button">
              <span className="hdr__user-av">陈</span>
              <span className="hdr__user-name">陈经理</span>
              <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />
            </button>
          }
          items={userMenuItems}
          align="right"
          onSelect={() => {}}
        />
      </div>
    </header>
  );
}
