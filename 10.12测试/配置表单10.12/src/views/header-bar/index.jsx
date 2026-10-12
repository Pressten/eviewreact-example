import { Input, Badge, Dropdown, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

const NAV = [
  { key: "config", label: "业务开通" },
  { key: "resources", label: "资源管理" },
  { key: "billing", label: "账单结算" },
  { key: "insight", label: "数据洞察" },
  { key: "settings", label: "系统设置" },
];

const USER_MENU = {
  items: [
    { key: "profile", label: "个人中心", icon: <Icon name="user" size="0.875rem" /> },
    { key: "org", label: "组织与权限", icon: <Icon name="shield-check" size="0.875rem" /> },
    { type: "divider" },
    { key: "logout", label: "退出登录", icon: <Icon name="log-out" size="0.875rem" /> },
  ],
};

const NOTICE_MENU = {
  items: [
    { key: "n1", label: "工单 GD-2026-009820 已进入配置阶段" },
    { key: "n2", label: "华北资源池利用率已达 82%" },
    { key: "n3", label: "工单 GD-2026-009810 被驳回，请复核" },
  ],
};

export default function HeaderBar() {
  const { isDark, toggleDark } = useApp();
  // 头部导航为自写 nav（不使用 antd Menu）；当前示例仅高亮"业务开通"
  const current = "config";

  return (
    <header className="hd-bar">
      <div className="hd-brand">
        <span className="hd-logo">
          <Icon name="network" size="1.25rem" color="var(--on-primary-fixed)" />
        </span>
        <span className="hd-brand-text">云网运营中心</span>
      </div>

      <nav className="hd-nav" aria-label="主导航">
        {NAV.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`hd-nav-item${current === item.key ? " active" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="hd-tools">
        <Input
          className="hd-search"
          size="small"
          allowClear
          placeholder="搜索工单号、客户或电路编号"
          suffix={<Icon name="search" size="0.875rem" color="var(--on-surface-variant)" />}
        />
        <Dropdown menu={NOTICE_MENU} placement="bottomRight" arrow>
          <button type="button" className="hd-icon-btn" title="通知">
            <Badge count={3} size="small" offset={[2, -2]}>
              <Icon name="bell" size="1rem" color="var(--on-surface)" />
            </Badge>
          </button>
        </Dropdown>
        <Tooltip title={isDark ? "切换浅色模式" : "切换深色模式"}>
          <button type="button" className="hd-icon-btn" onClick={toggleDark}>
            <Icon name={isDark ? "sun" : "moon"} size="1rem" color="var(--on-surface)" />
          </button>
        </Tooltip>
        <Dropdown menu={USER_MENU} placement="bottomRight" arrow>
          <button type="button" className="hd-user">
            <img src="./assets/uploads/user.png" alt="" className="hd-avatar" />
            <span className="hd-user-name">王云峰</span>
            <Icon name="chevron-down" size="0.75rem" color="var(--on-surface-variant)" />
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
