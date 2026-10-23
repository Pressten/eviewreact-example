import PopUpMenu from "@nce/eview-react/PopUpMenu";
import { IconPlusIcCarUser, IconPlusIcIctLogOut, IconPlusIcPublicChevronDown, IconPlusIcPublicEye, IconPlusIcPublicMoon, IconPlusIcPublicSun, IconPlusIcDigitalPowerDpCheck, IconPlusIcPublicBuilding, IconPlusIcPublicBellClock, IconPlusIcPublicDashboard, IconPlusIcIctTree, IconPlusIcIctApp, IconPlusIcDigitalPowerDpDocText, IconPlusIcPublicSetting } from '@hui/icon-plus';
import Tag from "@/shared/Tag";
import { useApp } from "../../context.jsx";
import "./index.css";

// 顶部主导航 — 原生 nav 实现（不使用 Menu 组件）
const NAV_ITEMS = [
  { key: "overview", label: "概览", icon: <IconPlusIcPublicDashboard iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "org", label: "组织", icon: <IconPlusIcIctTree iconSize="0.875rem" iconColor={['currentcolor']} />, active: true },
  { key: "app", label: "应用", icon: <IconPlusIcIctApp iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "log", label: "日志", icon: <IconPlusIcDigitalPowerDpDocText iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "settings", label: "设置", icon: <IconPlusIcPublicSetting iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

export default function TopNav() {
  const { isDark, toggleDark, viewMode, setViewMode } = useApp();

  const identityOptions = [
     { id: "admin", text: "管理员视角", serialno: "admin", iconUrl: <IconPlusIcDigitalPowerDpCheck iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { id: "auditor", text: "审计员视角", serialno: "auditor", iconUrl: <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { id: "profile", text: "个人资料", serialno: "profile", iconUrl: <IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { id: "logout", text: "退出登录", serialno: "logout", iconUrl: <IconPlusIcIctLogOut iconSize="0.875rem" iconColor={['currentcolor']} /> },
  ];

  const handleIdentityClick = (evt) => {
    const key = evt.value;
    if (key === "admin" || key === "auditor") setViewMode(key);
  };

  return (
    <header className="top-nav">
      <div className="top-nav__brand">
        <IconPlusIcPublicBuilding iconSize="1.25rem" iconColor={['currentcolor']} className="top-nav__brand-icon" />
        <span className="top-nav__brand-name">星辰云管</span>
        <Tag bordered={false} color="blue" className="top-nav__brand-tag">企业版</Tag>
      </div>
      <nav className="top-nav__menu">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.key}
            href="#"
            className={`top-nav__item ${item.active ? "is-active" : ""}`}
            onClick={(e) => e.preventDefault()}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="top-nav__tools">
        <button type="button" className="top-nav__tool-btn" onClick={toggleDark} title={isDark ? "切换到亮色" : "切换到暗色"}>
          {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['currentcolor']} />}
        </button>
        <button type="button" className="top-nav__tool-btn" title="通知">
          <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />
        </button>
        <PopUpMenu options={identityOptions} onClick={handleIdentityClick}>
          <button type="button" className="top-nav__identity">
            <img src="/uploads/user.png" alt="管理员头像" className="top-nav__avatar" />
            <span className="top-nav__identity-name">邵文渊</span>
            <Tag bordered={false} color={viewMode === "admin" ? "red" : "purple"} className="top-nav__identity-tag">
              {viewMode === "admin" ? "管理员" : "审计员"}
            </Tag>
            <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} className="top-nav__identity-chev" />
          </button>
        </PopUpMenu>
      </div>
    </header>
  );
}
