import { useRef, useState } from "react";
import Tag from "@cloudsop/eview-ui/Tag";
import Dropdown from "@cloudsop/eview-ui/Dropdown";
import Menu from "@cloudsop/eview-ui/Menu";
import Icon from "@/shared/Icon";
import Notify from "@/shared/Notify";
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
  const notifyRef = useRef(null);

  const handleNav = (item) => {
    setActiveNav(item.key);
    if (item.key !== "perm") {
      notifyRef.current && notifyRef.current.show("info", `已切换至「${item.label}」导航（演示原型内容聚焦权限与安全）`);
    }
  };

  const handleOpClick = (key) => {
    if (key === "logout") {
      notifyRef.current && notifyRef.current.show("warn", "演示原型：退出登录已拦截（审计员需要回溯当前会话）");
    } else {
      notifyRef.current && notifyRef.current.show("info", `演示原型：打开「${OP_MENU_LABELS[key]}」`);
    }
  };

  // antd v5 menu={{items}} 数组形态 → eview-ui Menu children JSX（Menu.Item 带 icon）
  const opOverlay = (
    <Menu onClick={(event) => handleOpClick(event.key)}>
      <Menu.Item key="profile" icon={<Icon name="user-round" size="0.875rem" />}>
        {OP_MENU_LABELS.profile}
      </Menu.Item>
      <Menu.Item key="manual" icon={<Icon name="book-open" size="0.875rem" />}>
        {OP_MENU_LABELS.manual}
      </Menu.Item>
      <Menu.Item key="logout" icon={<Icon name="log-out" size="0.875rem" />}>
        {OP_MENU_LABELS.logout}
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="top-bar">
      <Notify ref={notifyRef} />
      <div className="brand">
        <span className="brand-mark">
          <Icon name="shield-check" size="1rem" />
        </span>
        <span className="brand-meta">
          <span className="brand-name">星联科技 · 设置中心</span>
          <span className="brand-sub">权限与安全管理平台</span>
        </span>
        {/* Tag：color 枚举 default/primary/success/warning/danger/caution；antd blue→primary（仅 status/dot 类型生效） */}
        <Tag className="env-tag" type="status" color="primary">生产环境</Tag>
      </div>
      <nav className="main-nav">
        {(NAV_ITEMS || []).map((item) => (
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
        {/* Dropdown：保留 overlay/trigger/placement；menu={{items}}→overlay={<Menu>...} */}
        <Dropdown overlay={opOverlay} placement="bottomRight" trigger={["click"]}>
          <div className="operator">
            <img className="op-avatar" src="/uploads/user.png" alt="" />
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
