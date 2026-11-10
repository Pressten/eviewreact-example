import { useState } from "react";
import { Tag, Dropdown, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

const NAV_ITEMS = [
  { key: "org", label: "组织", icon: "network" },
  { key: "perm", label: "角色权限", icon: "shield-check" },
  { key: "security", label: "安全策略", icon: "lock" },
  { key: "audit", label: "审计", icon: "scroll-text" },
  { key: "integration", label: "集成", icon: "plug" },
];

const OP_MENU_LABELS = {
  profile: "个人中心",
  manual: "操作手册",
  logout: "退出登录",
};

export default function TopBar() {
  const { isDark, toggleDark } = useApp();
  const [activeNav, setActiveNav] = useState("perm");

  const handleNav = (item) => {
    setActiveNav(item.key);
    if (item.key !== "perm") {
      message.info(`已切换至「${item.label}」导航（演示原型内容聚焦权限与安全）`);
    }
  };

  const opMenu = {
    items: [
      { key: "profile", label: OP_MENU_LABELS.profile, icon: <Icon name="user-round" size="0.875rem" /> },
      { key: "manual", label: OP_MENU_LABELS.manual, icon: <Icon name="book-open" size="0.875rem" /> },
      { key: "logout", label: OP_MENU_LABELS.logout, icon: <Icon name="log-out" size="0.875rem" /> },
    ],
    onClick: ({ key }) => {
      if (key === "logout") {
        message.warning("演示原型：退出登录已拦截（审计员需要回溯当前会话）");
      } else {
        message.info(`演示原型：打开「${OP_MENU_LABELS[key]}」`);
      }
    },
  };

  return (
    <header className="top-bar">
      <div className="brand">
        <span className="brand-mark">
          <Icon name="shield-check" size="1rem" />
        </span>
        <span className="brand-meta">
          <span className="brand-name">星联科技 · 设置中心</span>
          <span className="brand-sub">权限与安全管理平台</span>
        </span>
        <Tag className="env-tag" color="blue">生产环境</Tag>
      </div>
      <nav className="main-nav">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.key}
            className={"nav-item" + (activeNav === item.key ? " active" : "")}
            onClick={() => handleNav(item)}
          >
            <Icon name={item.icon} size="0.875rem" className="nav-icon" />
            {item.label}
          </a>
        ))}
      </nav>
      <div className="top-tools">
        <Icon
          name={isDark ? "sun" : "moon"}
          size="1rem"
          className="icon-btn"
          title={isDark ? "切换为浅色模式" : "切换为深色模式"}
          onClick={toggleDark}
        />
        <span className="divider-v" />
        <Dropdown menu={opMenu} placement="bottomRight" trigger={["click"]}>
          <div className="operator">
            <img className="op-avatar" src="./assets/uploads/user.png" alt="" />
            <span className="op-meta">
              <span className="op-name">陈志远</span>
              <span className="op-role">系统管理员</span>
            </span>
            <Icon name="chevron-down" size="0.875rem" className="op-chevron" />
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
