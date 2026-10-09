// Layer 4: 顶部导航栏(原生 nav 自写,不使用 Menu)
import { useState } from "react";
import { Input } from "antd";
import { useApp } from "../../context.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import { navTabs } from "../../mock/dashboard.js";
import "./index.css";

export default function TopNav({ onToggleCollapse }) {
  const { isDark, toggleDark } = useApp();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <header className="top-nav">
      <div className="top-nav__left">
        <button className="top-nav__icon-btn" onClick={onToggleCollapse} title="展开 / 收起菜单">
          <Icon name="panel-left" size="1.25rem" />
        </button>
        <div className="top-nav__brand">
          <span className="top-nav__logo">
            <Icon name="activity" size="1.25rem" />
          </span>
          <span className="top-nav__title">智慧能源运维中心</span>
        </div>
        <nav className="top-nav__nav">
          {navTabs.map((t) => (
            <button
              key={t.key}
              className={"top-nav__tab" + (activeTab === t.key ? " is-active" : "")}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="top-nav__right">
        <Input
          size="small"
          className="top-nav__search"
          placeholder="搜索设备名称、编号或 IP"
          suffix={<Icon name="search" size="0.875rem" />}
          allowClear
        />
        <button
          className="top-nav__icon-btn"
          onClick={toggleDark}
          title={isDark ? "切换到浅色模式" : "切换到深色模式"}
        >
          <Icon name={isDark ? "sun" : "moon"} size="1.25rem" />
        </button>
        <button className="top-nav__icon-btn" title="消息通知">
          <Icon name="bell" size="1.25rem" />
          <span className="top-nav__badge">18</span>
        </button>
        <div className="top-nav__user">
          <img className="top-nav__avatar" src="./assets/uploads/user.png" alt="用户头像" />
          <span className="top-nav__username">张明远</span>
          <Icon name="chevron-down" size="0.875rem" />
        </div>
      </div>
    </header>
  );
}
