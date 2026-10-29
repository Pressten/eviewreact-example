// Layer 4: 顶部导航 — Logo / 5 项主导航（原生 nav，选中项品牌色 + 2px 下划线）/ 消息铃铛 / 用户头像下拉
import { useEffect, useMemo, useState } from "react";
import { IconPlusIcCarUser, IconPlusIcDigitalPowerDpUserCluster, IconPlusIcIctLogOut, IconPlusIcPublicBellClock, IconPlusIcPublicChevronDown, IconPlusIcPublicHeart, IconPlusIcPublicMoon, IconPlusIcPublicSun } from '@hui/icon-plus';
import Badge from "@nce/eview-react/Badge";
import Tab from "@nce/eview-react/Tab";
import TabItem from "@nce/eview-react/TabItem";
import { CURRENT_USER, MAIN_NAV, NOTIFICATION_CATEGORIES, NOTIFICATIONS } from "../../mock/dashboard.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

const TONE_CLASS = {
  error: "is-error",
  critical: "is-critical",
  success: "is-success",
  info: "is-info",
};

const USER_MENU_ITEMS = [
  { key: "profile", label: "个人设置", icon: <IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "team", label: "团队管理", icon: <IconPlusIcDigitalPowerDpUserCluster iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "divider" },
  { key: "logout", label: "退出登录", icon: <IconPlusIcIctLogOut iconSize="0.875rem" iconColor={['currentcolor']} />, danger: true },
];

// 手写补位：antd Dropdown（eview-react 无对应，按 handwrite-templates 手写点击触发的下拉浮层）
function DropdownPanel({ trigger, placement = "right", panelClassName, children }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const id = setTimeout(() => document.addEventListener("click", close), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("click", close);
    };
  }, [open]);

  return (
    <span className={`top-nav-dropdown ${placement === "right" ? "is-right" : ""}`}>
      <span onClick={(event) => { event.stopPropagation(); setOpen((v) => !v); }}>{trigger}</span>
      {open ? (
        <div className={panelClassName} onClick={(event) => event.stopPropagation()}>
          {children}
        </div>
      ) : null}
    </span>
  );
}

// 通知下拉面板：系统 / 审批 / @我 三类页签，每类带未读计数，底部"查看全部"
function NotificationPanel({ notifications, onReadAll, onOpen }) {
  const [activeCategory, setActiveCategory] = useState("system");

  const unreadByCategory = useMemo(() => {
    const counts = {};
    NOTIFICATION_CATEGORIES.forEach((category) => {
      counts[category.key] = notifications.filter(
        (item) => item.category === category.key && item.unread
      ).length;
    });
    return counts;
  }, [notifications]);

  const activeIndex = Math.max(0, NOTIFICATION_CATEGORIES.findIndex((c) => c.key === activeCategory));
  const activeItems = notifications.filter((item) => item.category === activeCategory);

  return (
    <div className="notice-panel">
      <div className="notice-panel-head">
        <span className="notice-panel-title">消息通知</span>
        <a className="panel-link" onClick={onReadAll}>全部已读</a>
      </div>
      <Tab
        className="notice-tabs"
        draggable={false}
        selectedIndex={activeIndex}
        onClick={(index, title) => setActiveCategory(NOTIFICATION_CATEGORIES[index]?.key || activeCategory)}
      >
        {NOTIFICATION_CATEGORIES.map((category) => (
          <TabItem key={category.key} title={
            <span className="notice-tab">
              {category.label}
              {unreadByCategory[category.key] > 0 ? (
                <span className="notice-tab-count">{unreadByCategory[category.key]}</span>
              ) : null}
            </span>
          } />
        ))}
      </Tab>
      <ul className="notice-list">
        {activeItems.map((item) => (
          <li
            key={item.id}
            className={`notice-item ${item.unread ? "is-unread" : ""}`}
            onClick={() => onOpen(item)}
          >
            <span className={`notice-item-icon ${TONE_CLASS[item.tone] || "is-info"}`}>
              {item.icon}
            </span>
            <div className="notice-item-body">
              <p className="notice-item-title">{item.title}</p>
              <span className="notice-item-time">{item.time}</span>
            </div>
            {item.unread ? <span className="notice-dot" /> : null}
          </li>
        ))}
      </ul>
      <div className="notice-panel-foot">
        <a className="panel-link" onClick={() => {}}>查看全部</a>
      </div>
    </div>
  );
}

export default function TopNav() {
  const { isDark, toggleDark, notify } = useApp();
  const [activeNav, setActiveNav] = useState("workbench");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const unreadCount = notifications.filter((item) => item.unread).length;

  const handleReadAll = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
    notify("success", "已将全部消息标记为已读");
  };

  const handleOpenNotification = (item) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === item.id ? { ...notification, unread: false } : notification
      )
    );
    notify("info", `已打开消息：${item.title}`);
  };

  const handleUserMenu = (key) => {
    if (key === "logout") {
      notify("info", "已退出登录（演示环境）");
      return;
    }
    const label = key === "profile" ? "个人设置" : "团队管理";
    notify("success", `已打开「${label}」（演示）`);
  };

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <div className="brand">
          <span className="brand-mark">
            <IconPlusIcPublicHeart iconSize="1rem" iconColor={['currentcolor']} />
          </span>
          <span className="brand-text">
            <span className="brand-name">客成云</span>
            <span className="brand-sub">Customer Success</span>
          </span>
        </div>

        <nav className="main-nav">
          {MAIN_NAV.map((item) => (
            <a
              key={item.key}
              className={`main-nav-item ${activeNav === item.key ? "is-active" : ""}`}
              onClick={() => setActiveNav(item.key)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="top-nav-actions">
          <button
            type="button"
            className="nav-icon-btn"
            title={isDark ? "切换为亮色模式" : "切换为暗色模式"}
            aria-label="主题切换"
            onClick={toggleDark}
          >
            {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['currentcolor']} />}
          </button>
          <DropdownPanel
            trigger={
              <button type="button" className="nav-icon-btn" title="消息通知" aria-label="消息通知">
                <Badge content={unreadCount}>
                  <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />
                </Badge>
              </button>
            }
            panelClassName="top-nav-popover"
          >
            <NotificationPanel
              notifications={notifications}
              onReadAll={handleReadAll}
              onOpen={handleOpenNotification}
            />
          </DropdownPanel>

          <DropdownPanel
            trigger={
              <button type="button" className="user-chip" title="账号菜单" aria-label="账号菜单">
                <img className="user-chip-avatar" src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
                <span className="user-chip-name">{CURRENT_USER.name}</span>
                <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} />
              </button>
            }
            panelClassName="top-nav-popover"
          >
            <div className="user-menu-panel">
              <div className="user-menu-profile">
                <img className="user-menu-avatar" src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
                <div className="user-menu-info">
                  <span className="user-menu-name">{CURRENT_USER.name}</span>
                  <span className="user-menu-role">{CURRENT_USER.role} · 团队 {CURRENT_USER.teamSize} 人</span>
                </div>
              </div>
              {/* 手写补位：antd Menu（简单平铺列表，见 handwrite-templates §5） */}
              <nav className="user-menu">
                {USER_MENU_ITEMS.map((item) =>
                  item.key === "divider" ? (
                    <span key="divider" className="user-menu-divider" />
                  ) : (
                    <button
                      key={item.key}
                      type="button"
                      className={`user-menu-item ${item.danger ? "is-danger" : ""}`}
                      onClick={() => handleUserMenu(item.key)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  )
                )}
              </nav>
            </div>
          </DropdownPanel>
        </div>
      </div>
    </header>
  );
}
