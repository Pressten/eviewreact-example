import Tag from "@/shared/Tag";
import { IconPlusIcCarUser, IconPlusIcDigitalPowerDpApp, IconPlusIcDigitalPowerDpSetting, IconPlusIcIctLogOut, IconPlusIcIctTree, IconPlusIcDigitalPowerDpDocText, IconPlusIcPublicBellClock, IconPlusIcPublicBuilding, IconPlusIcPublicChevronDown, IconPlusIcPublicDashboard, IconPlusIcPublicEye, IconPlusIcPublicMoon, IconPlusIcPublicSecurity, IconPlusIcPublicSun } from '@hui/icon-plus';
import ActionMenu from "../../components/action-menu/index.jsx";
import { useApp } from "../../context.jsx";

import "./index.css";

// 椤堕儴涓诲鑸?鈥?鍘熺敓 nav 瀹炵幇锛堜笉浣跨敤 Menu 缁勪欢锛?const NAV_ITEMS = [
  { key: "overview", label: "姒傝", icon: <IconPlusIcPublicDashboard iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "org", label: "缁勭粐", icon: <IconPlusIcIctTree iconSize="0.875rem" iconColor={['currentcolor']} />, active: true },
  { key: "app", label: "搴旂敤", icon: <IconPlusIcDigitalPowerDpApp iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "log", label: "鏃ュ織", icon: <IconPlusIcDigitalPowerDpDocText iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "settings", label: "璁剧疆", icon: <IconPlusIcDigitalPowerDpSetting iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

export default function TopNav() {
  const { isDark, toggleDark, viewMode, setViewMode } = useApp();

  const identityMenu = {
    items: [
      { key: "admin", label: "绠＄悊鍛樿瑙?, icon: <IconPlusIcPublicSecurity iconSize="0.875rem" iconColor={['currentcolor']} /> },
      { key: "auditor", label: "瀹¤鍛樿瑙?, icon: <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['currentcolor']} /> },
      { type: "divider" },
      { key: "profile", label: "涓汉璧勬枡", icon: <IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} /> },
      { key: "logout", label: "閫€鍑虹櫥褰?, icon: <IconPlusIcIctLogOut iconSize="0.875rem" iconColor={['currentcolor']} /> },
    ],
    onClick: ({ key }) => {
      if (key === "admin" || key === "auditor") setViewMode(key);
    },
  };

  return (
    <header className="top-nav">
      <div className="top-nav__brand">
        <IconPlusIcPublicBuilding iconSize="1.25rem" iconColor={['currentcolor']} className="top-nav__brand-icon" />
        <span className="top-nav__brand-name">鏄熻景浜戠</span>
        <Tag bordered={false} color="blue" className="top-nav__brand-tag">浼佷笟鐗?/Tag>
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
        <button type="button" className="top-nav__tool-btn" onClick={toggleDark} title={isDark ? "鍒囨崲鍒颁寒鑹? : "鍒囨崲鍒版殫鑹?}>
          {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['currentcolor']} />}
        </button>
        <button type="button" className="top-nav__tool-btn" title="閫氱煡">
          <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />
        </button>
        <ActionMenu
          items={identityMenu.items}
          onMenuClick={(key) => identityMenu.onClick({ key })}
          placement="bottomRight"
        >
          <button type="button" className="top-nav__identity">
            <img src="/uploads/user.png" alt="绠＄悊鍛樺ご鍍? className="top-nav__avatar" />
            <span className="top-nav__identity-name">閭垫枃娓?/span>
            <Tag bordered={false} color={viewMode === "admin" ? "red" : "purple"} className="top-nav__identity-tag">
              {viewMode === "admin" ? "绠＄悊鍛? : "瀹¤鍛?}
            </Tag>
            <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} className="top-nav__identity-chev" />
          </button>
        </ActionMenu>
      </div>
    </header>
  );
}
