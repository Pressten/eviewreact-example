import { useState } from "react";
import { Input, Dropdown, Badge } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4 — 顶部导航栏（原生 nav 自写，不使用 antd Menu）
const TOP_NAV = [
  { key: "workbench", label: "工作台" },
  { key: "order", label: "业务受理" },
  { key: "resource", label: "资源管理" },
  { key: "analysis", label: "运营分析" },
  { key: "service", label: "客户服务" },
];

const USER_MENU = {
  items: [
    { key: "profile", label: "个人中心", icon: <Icon name="user-round" size="0.875rem" /> },
    { key: "setting", label: "账号设置", icon: <Icon name="settings-2" size="0.875rem" /> },
    { key: "switch", label: "切换组织", icon: <Icon name="arrow-left-right" size="0.875rem" /> },
    { type: "divider" },
    { key: "logout", label: "退出登录", icon: <Icon name="log-out" size="0.875rem" /> },
  ],
};

export default function HeaderBar() {
  const { isDark, toggleDark } = useApp();
  const [active, setActive] = useState("order");

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="brand-mark">
          <Icon name="radio-tower" size="1.25rem" color="var(--on-primary)" />
        </span>
        <span className="brand-name">鲲鹏云网运营平台</span>
      </div>

      <nav className="topbar-nav">
        {TOP_NAV.map((item) => (
          <button
            key={item.key}
            type="button"
            className={"topnav-item" + (active === item.key ? " is-active" : "")}
            onClick={() => setActive(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="topbar-tools">
        <Input
          className="topbar-search"
          allowClear
          placeholder="搜索客户、订单编号或资源"
          suffix={<Icon name="search" size="0.875rem" />}
          onPressEnter={() => {}}
        />
        <Badge count={3} size="small" offset={[-2, 4]}>
          <Icon name="bell" size="1rem" className="tool-icon" title="通知中心" onClick={() => {}} />
        </Badge>
        <Icon
          name={isDark ? "sun" : "moon"}
          size="1rem"
          className="tool-icon"
          title={isDark ? "切换为浅色模式" : "切换为深色模式"}
          onClick={toggleDark}
        />
        <Dropdown menu={USER_MENU} trigger={["click"]} placement="bottomRight">
          <button type="button" className="topbar-user">
            <img className="user-avatar" src="./assets/uploads/user.png" alt="用户头像" />
            <span className="user-meta">
              <span className="user-name">王海涛</span>
              <span className="user-role">政企客户经理</span>
            </span>
            <Icon name="chevron-down" size="0.875rem" className="user-caret" />
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
