import { useState } from "react";
import { IconPlusIcPublicBellClock, IconPlusIcPublicChevronDown, IconPlusIcPublicDashboard } from '@hui/icon-plus';
import Badge from "@nce/eview-react/Badge";
import { navItems, notifications, userMenuItems } from "../../mock/dashboard.jsx";
import "./index.css";

// ① 顶部导航 — Logo + 水平导航(5 项,手写)+ 铃铛 Badge 下拉 + 头像下拉
// antd Menu(水平)→手写水平导航（Accordion 为侧边多级，水平平铺用按钮手写更贴合）
// antd Badge→eview Badge（count→content）
// antd Dropdown×2→手写下拉面板（Dropdown 无 eview 直接对应；通知项含富布局、头像项含分隔线，PopUpMenu 不适用）
export default function TopNav() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const closeAll = () => {
    setNotifOpen(false);
    setAvatarOpen(false);
  };

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <div className="brand">
          <IconPlusIcPublicDashboard iconSize="1.5rem" iconColor={['var(--primary)']} />
          <span className="brand-name">CSM 运营总台</span>
          <span className="brand-sub">客户成功 · 续约守护</span>
        </div>

        <nav className="top-nav-menu">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`top-nav-menu-item ${item.key === "workbench" ? "active" : ""}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="top-nav-tools">
          <Badge content={9} offset={[-2, 2]}>
            <button
              className="tool-btn"
              type="button"
              aria-label="消息通知"
              onClick={() => {
                setAvatarOpen(false);
                setNotifOpen((o) => !o);
              }}
            >
              <IconPlusIcPublicBellClock iconSize="1.125rem" iconColor={['currentcolor']} />
            </button>
          </Badge>

          <button
            className="user-trigger"
            type="button"
            onClick={() => {
              setNotifOpen(false);
              setAvatarOpen((o) => !o);
            }}
          >
            <img src="/uploads/user.png" className="user-avatar" alt="李明轩头像" />
            <span className="user-name">李明轩</span>
            <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} className="user-chev" />
          </button>
        </div>
      </div>

      {notifOpen && (
        <>
          <div className="dropdown-backdrop" onClick={closeAll} />
          <div className="notif-dropdown">
            {notifications.map((n) => (
              <div key={n.id} className="notif-item">
                <span className={`notif-icon notif-${n.tone}`}>
                  {n.icon}
                </span>
                <span className="notif-text">{n.title}</span>
                <span className="notif-time">{n.time}</span>
              </div>
            ))}
            <div className="notif-divider" />
            <button type="button" className="notif-viewall" onClick={closeAll}>
              查看全部消息
            </button>
          </div>
        </>
      )}

      {avatarOpen && (
        <>
          <div className="dropdown-backdrop" onClick={closeAll} />
          <div className="avatar-dropdown">
            {userMenuItems.map((it, i) =>
              it.type === "divider" ? (
                <div key={`d-${i}`} className="avatar-divider" />
              ) : (
                <button
                  key={it.key}
                  type="button"
                  className={`avatar-menu-item ${it.danger ? "is-danger" : ""}`}
                  onClick={closeAll}
                >
                  {it.icon}
                  {it.label}
                </button>
              )
            )}
          </div>
        </>
      )}
    </header>
  );
}
