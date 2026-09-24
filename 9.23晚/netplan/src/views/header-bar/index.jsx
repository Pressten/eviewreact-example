import { useState } from "react";
import { Menu, Input, Badge, Dropdown } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { headerNav, userMenu, currentUser } from "../../mock/nav.js";
import "./index.css";

// Layer 4: 顶部菜单栏（品牌 + 全局导航 + 全局工具）
export default function HeaderBar() {
  const [activeKey, setActiveKey] = useState("planning");
  const { isDark, toggleDark } = useApp();

  const navItems = headerNav.map((item) => ({ key: item.key, label: item.label }));
  const userItems = userMenu.map((item) => ({
    key: item.key,
    label: item.label,
    icon: <Icon name={item.icon} size={14} />,
  }));

  return (
    <header className="header-bar">
      <div className="header-brand">
        <span className="header-brand-mark">
          <Icon name="network" size={18} />
        </span>
        <span className="header-brand-name">NetPlan</span>
        <span className="header-brand-product">网络规划平台</span>
      </div>

      <Menu
        className="header-nav"
        mode="horizontal"
        selectedKeys={[activeKey]}
        onClick={(info) => setActiveKey(info.key)}
        items={navItems}
        style={{ flex: 1, minWidth: 0, borderBottom: "none", background: "transparent" }}
      />

      <div className="header-tools">
        <Input
          className="header-search"
          placeholder="搜索站点 / 设备 / 网段"
          suffix={<Icon name="search" size={14} />}
        />
        <button type="button" className="header-icon-btn" title="帮助中心">
          <Icon name="info" size={16} />
        </button>
        <button
          type="button"
          className="header-icon-btn"
          title={isDark ? "切换浅色模式" : "切换深色模式"}
          onClick={toggleDark}
        >
          <Icon name={isDark ? "sun" : "moon"} size={16} />
        </button>
        <button type="button" className="header-icon-btn" title="通知">
          <Badge count={6} size="small" offset={[2, -2]}>
            <Icon name="bell" size={16} />
          </Badge>
        </button>
        <span className="header-divider" />
        <Dropdown menu={{ items: userItems }} placement="bottomRight" trigger={["click"]}>
          <button type="button" className="header-user">
            <img className="header-user-avatar" src={currentUser.avatar} alt="" />
            <span className="header-user-meta">
              <span className="header-user-name">{currentUser.name}</span>
              <span className="header-user-role">{currentUser.role}</span>
            </span>
            <Icon name="chevron-down" size={14} />
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
