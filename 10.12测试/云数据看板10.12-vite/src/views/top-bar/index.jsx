import TextField from "@/shared/TextField";
import { IconPlusIcCarUser, IconPlusIcIctLogOut, IconPlusIcPublicBellClock, IconPlusIcPublicChevronDown, IconPlusIcPublicCloud, IconPlusIcPublicMoon, IconPlusIcPublicQuestionmarkCircle, IconPlusIcPublicSearch, IconPlusIcPublicSecurity, IconPlusIcPublicSun } from '@nce/icon-plus';
import Badge from "@nce/eview-react/Badge";
import TipBox from "@nce/eview-react/TipBox";
import { useApp } from "../../context.jsx";
import { topNav } from "../../mock/dashboard.jsx";
import "./index.css";

const userMenuItems = [
  { key: "profile", icon: <IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} />, label: "个人中心" },
  { key: "security", icon: <IconPlusIcPublicSecurity iconSize="0.875rem" iconColor={['currentcolor']} />, label: "安全设置" },
  { divider: true },
  { key: "logout", icon: <IconPlusIcIctLogOut iconSize="0.875rem" iconColor={['currentcolor']} />, label: "退出登录" },
];

export default function TopBar() {
  const { isDark, toggleDark, activeTop, setActiveTop } = useApp();

  return (
    <header className="top-bar">
      <div className="top-bar__brand">
        <span className="top-bar__logo">
          <IconPlusIcPublicCloud iconSize="1.5rem" iconColor={['var(--color-text-inverse)']} />
        </span>
        <span className="top-bar__name">云平台运营中心</span>
      </div>

      <nav className="top-bar__nav">
        {topNav.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`top-bar__nav-item ${activeTop === item.key ? "is-active" : ""}`}
            onClick={() => setActiveTop(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="top-bar__tools">
        <TextField
          className="top-bar__search"
          placeholder="搜索实例名称、ID 或 IP"
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />}
        />

        <TipBox type="simple" content={isDark ? "切换浅色主题" : "切换深色主题"} direction="top">
          <span className="top-bar__icon-btn">
            {isDark ? <IconPlusIcPublicSun onClick={toggleDark} title="切换主题" iconSize="1rem" iconColor={['currentcolor']} style={{ cursor: 'pointer' }} /> : <IconPlusIcPublicMoon onClick={toggleDark} title="切换主题" iconSize="1rem" iconColor={['currentcolor']} style={{ cursor: 'pointer' }} />}
          </span>
        </TipBox>

        <TipBox type="simple" content="通知" direction="top">
          <span className="top-bar__icon-btn">
            <Badge content={5} offset={[2, -2]}>
              <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />
            </Badge>
          </span>
        </TipBox>

        <TipBox type="simple" content="帮助" direction="top">
          <span className="top-bar__icon-btn">
            <IconPlusIcPublicQuestionmarkCircle iconSize="1rem" iconColor={['currentcolor']} />
          </span>
        </TipBox>

        <span className="top-bar__divider" />

        <TipBox
          trigger="click"
          direction="bottomRight"
          type="simple"
          content={
            <div className="app-dropdown-menu">
              {userMenuItems.map((item, i) =>
                item.divider ? (
                  <div key={i} className="app-dropdown-divider" />
                ) : (
                  <button key={item.key} type="button" className="app-dropdown-item">
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                )
              )}
            </div>
          }
        >
          <span className="top-bar__user">
            <img className="top-bar__avatar" src="./assets/uploads/user.png" alt="" />
            <span className="top-bar__user-meta">
              <span className="top-bar__user-name">张伟</span>
              <span className="top-bar__user-role">平台运维</span>
            </span>
            <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} />
          </span>
        </TipBox>
      </div>
    </header>
  );
}
