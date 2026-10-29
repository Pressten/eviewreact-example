import Tag from "@/shared/Tag";
import {
  IconPlusIcCarUser,
  IconPlusIcIctLogOut,
  IconPlusIcPublicBell,
  IconPlusIcPublicChevronDown,
  IconPlusIcPublicEye,
  IconPlusIcPublicGauge,
  IconPlusIcPublicFolderTree,
  IconPlusIcPublicAppWindow,
  IconPlusIcPublicScrollText,
  IconPlusIcPublicSettings,
  IconPlusIcPublicMoon,
  IconPlusIcPublicSun,
  IconPlusIcPublicShieldCheck,
  IconPlusIcIctBuilding2,
} from '@hui/icon-plus';
import DropdownMenu from "../../components/dropdown-menu/index.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

// 顶部主导航 — 原生 nav 实现（不使用 Menu 组件）
const NAV_ITEMS = [
  { key: "overview", label: "概览", icon: <IconPlusIcPublicGauge iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "org", label: "组织", icon: <IconPlusIcPublicFolderTree iconSize="0.875rem" iconColor={['currentcolor']} />, active: true },
  { key: "app", label: "应用", icon: <IconPlusIcPublicAppWindow iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "log", label: "日志", icon: <IconPlusIcPublicScrollText iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "settings", label: "设置", icon: <IconPlusIcPublicSettings iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

export default function TopNav() {
  const { isDark, toggleDark, viewMode, setViewMode } = useApp();

  const identityItems = [
    { key: "admin", label: "管理员视角", icon: <IconPlusIcPublicShieldCheck iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { key: "auditor", label: "审计员视角", icon: <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { type: "divider" },
    { key: "profile", label: "个人资料", icon: <IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { key: "logout", label: "退出登录", icon: <IconPlusIcIctLogOut iconSize="0.875rem" iconColor={['currentcolor']} /> },
  ];
  const onIdentitySelect = (key) => {
    if (key === "admin" || key === "auditor") setViewMode(key);
  };

  return (
    <header className="top-nav">
      <div className="top-nav__brand">
        <IconPlusIcIctBuilding2 iconSize="1.25rem" iconColor={['currentcolor']} className="top-nav__brand-icon" />
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
          <IconPlusIcPublicBell iconSize="1rem" iconColor={['currentcolor']} />
        </button>
        <DropdownMenu items={identityItems} onSelect={onIdentitySelect} placement="bottomRight">
          <button type="button" className="top-nav__identity">
            <img src="/uploads/user.png" alt="管理员头像" className="top-nav__avatar" />
            <span className="top-nav__identity-name">邵文渊</span>
            <Tag bordered={false} color={viewMode === "admin" ? "red" : "purple"} className="top-nav__identity-tag">
              {viewMode === "admin" ? "管理员" : "审计员"}
            </Tag>
            <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} className="top-nav__identity-chev" />
          </button>
        </DropdownMenu>
      </div>
    </header>
  );
}
