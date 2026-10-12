import { Input, Dropdown, Badge, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { topNav } from "../../mock/dashboard.js";
import "./index.css";

const userMenu = {
  items: [
    { key: "profile", icon: <Icon name="user" size="0.875rem" />, label: "个人中心" },
    { key: "security", icon: <Icon name="shield-check" size="0.875rem" />, label: "安全设置" },
    { type: "divider" },
    { key: "logout", icon: <Icon name="log-out" size="0.875rem" />, label: "退出登录" },
  ],
};

export default function TopBar() {
  const { isDark, toggleDark, activeTop, setActiveTop } = useApp();

  return (
    <header className="top-bar">
      <div className="top-bar__brand">
        <span className="top-bar__logo">
          <Icon name="cloud-cog" size="1.5rem" color="var(--color-text-inverse)" />
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
        <Input
          className="top-bar__search"
          size="small"
          allowClear
          placeholder="搜索实例名称、ID 或 IP"
          suffix={<Icon name="search" size="0.875rem" />}
        />

        <Tooltip title={isDark ? "切换浅色主题" : "切换深色主题"}>
          <span className="top-bar__icon-btn">
            <Icon name={isDark ? "sun" : "moon"} size="1rem" onClick={toggleDark} title="切换主题" />
          </span>
        </Tooltip>

        <Tooltip title="通知">
          <span className="top-bar__icon-btn">
            <Badge count={5} size="small" offset={[2, -2]}>
              <Icon name="bell" size="1rem" />
            </Badge>
          </span>
        </Tooltip>

        <Tooltip title="帮助">
          <span className="top-bar__icon-btn">
            <Icon name="circle-question-mark" size="1rem" />
          </span>
        </Tooltip>

        <span className="top-bar__divider" />

        <Dropdown menu={userMenu} placement="bottomRight" trigger={["click"]}>
          <span className="top-bar__user">
            <img className="top-bar__avatar" src="./assets/uploads/user.png" alt="" />
            <span className="top-bar__user-meta">
              <span className="top-bar__user-name">张伟</span>
              <span className="top-bar__user-role">平台运维</span>
            </span>
            <Icon name="chevron-down" size="0.875rem" />
          </span>
        </Dropdown>
      </div>
    </header>
  );
}
