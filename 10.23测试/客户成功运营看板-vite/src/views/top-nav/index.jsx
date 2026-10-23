import { useState } from "react";
import { IconPlusIcPublicBellClock, IconPlusIcPublicChevronDown, IconPlusIcPublicDashboard } from '@hui/icon-plus';
import Badge from "@nce/eview-react/Badge";
import { navItems, notifications, userMenuItems } from "../../mock/dashboard.jsx";
import "./index.css";

// ① 顶部导航 — Logo + 水平 Menu(5 项)+ 铃铛 Badge 下拉 + 头像下拉
export default function TopNav() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
              className={`top-nav-item ${item.key === "workbench" ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="top-nav-tools">
          <Badge content={9}>
            <div className="dropdown-trigger">
              <button
                className="tool-btn"
                type="button"
                aria-label="消息通知"
                onClick={() => setNotifOpen((o) => !o)}
              >
                <IconPlusIcPublicBellClock iconSize="1.125rem" iconColor={['currentcolor']} />
              </button>
              {notifOpen && (
                <>
                  <div className="dropdown-backdrop" onClick={() => setNotifOpen(false)} />
                  <div className="notif-dropdown">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="dropdown-menu-item"
                        onClick={() => setNotifOpen(false)}
                      >
                        <div className="notif-item">
                          <span className={`notif-icon notif-${n.tone}`}>
                            {n.icon}
                          </span>
                          <span className="notif-text">{n.title}</span>
                          <span className="notif-time">{n.time}</span>
                        </div>
                      </div>
                    ))}
                    <div className="dropdown-divider" />
                    <div className="dropdown-menu-item" onClick={() => setNotifOpen(false)}>
                      <span className="notif-viewall">查看全部消息</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Badge>

          <div className="dropdown-trigger">
            <button
              className="user-trigger"
              type="button"
              onClick={() => setUserMenuOpen((o) => !o)}
            >
              <img src="/uploads/user.png" className="user-avatar" alt="李明轩头像" />
              <span className="user-name">李明轩</span>
              <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} className="user-chev" />
            </button>
            {userMenuOpen && (
              <>
                <div className="dropdown-backdrop" onClick={() => setUserMenuOpen(false)} />
                <div className="user-dropdown">
                  {userMenuItems.map((it, i) =>
                    it.type === "divider" ? (
                      <div key={`divider-${i}`} className="dropdown-divider" />
                    ) : (
                      <div
                        key={it.key}
                        className={`dropdown-menu-item ${it.danger ? "is-danger" : ""}`}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {it.icon}
                        <span>{it.label}</span>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
