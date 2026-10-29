import { Dropdown, Tag } from "antd";
import { useApp } from "../../context.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// 顶部主导航 — 原生 nav 实现（不使用 Menu 组件）
const NAV_ITEMS = [
  { key: "overview", label: "概览", icon: "gauge" },
  { key: "org", label: "组织", icon: "folder-tree", active: true },
  { key: "app", label: "应用", icon: "app-window" },
  { key: "log", label: "日志", icon: "scroll-text" },
  { key: "settings", label: "设置", icon: "settings" },
];

export default function TopNav() {
  const { isDark, toggleDark, viewMode, setViewMode } = useApp();

  const identityMenu = {
    items: [
      { key: "admin", label: "管理员视角", icon: <Icon name="shield-check" size="0.875rem" /> },
      { key: "auditor", label: "审计员视角", icon: <Icon name="eye" size="0.875rem" /> },
      { type: "divider" },
      { key: "profile", label: "个人资料", icon: <Icon name="user" size="0.875rem" /> },
      { key: "logout", label: "退出登录", icon: <Icon name="log-out" size="0.875rem" /> },
    ],
    onClick: ({ key }) => {
      if (key === "admin" || key === "auditor") setViewMode(key);
    },
  };

  return (
    <header className="top-nav">
      <div className="top-nav__brand">
        <Icon name="building-2" size="1.25rem" className="top-nav__brand-icon" />
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
            <Icon name={item.icon} size="0.875rem" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="top-nav__tools">
        <button type="button" className="top-nav__tool-btn" onClick={toggleDark} title={isDark ? "切换到亮色" : "切换到暗色"}>
          <Icon name={isDark ? "sun" : "moon"} size="1rem" />
        </button>
        <button type="button" className="top-nav__tool-btn" title="通知">
          <Icon name="bell" size="1rem" />
        </button>
        <Dropdown menu={identityMenu} placement="bottomRight" trigger={["click"]}>
          <button type="button" className="top-nav__identity">
            <img src="./assets/uploads/user.png" alt="管理员头像" className="top-nav__avatar" />
            <span className="top-nav__identity-name">邵文渊</span>
            <Tag bordered={false} color={viewMode === "admin" ? "red" : "purple"} className="top-nav__identity-tag">
              {viewMode === "admin" ? "管理员" : "审计员"}
            </Tag>
            <Icon name="chevron-down" size="0.875rem" className="top-nav__identity-chev" />
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
