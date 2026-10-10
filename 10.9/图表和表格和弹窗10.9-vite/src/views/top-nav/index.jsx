import { useState } from "react";
import { IconPlusIcPublicBellClock, IconPlusIcPublicChevronDown, IconPlusIcPublicHeartWaveform, IconPlusIcPublicMenuCollapse, IconPlusIcPublicMoon, IconPlusIcPublicSearch, IconPlusIcPublicSun } from '@nce/icon-plus';
import TextField from "@nce/eview-react/TextField";
import { useApp } from "../../context.jsx";
import { navTabs } from "../../mock/dashboard.jsx";
import "./index.css";

export default function TopNav({ onToggleCollapse }) {
  const { isDark, toggleDark } = useApp();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <header className="top-nav">
      <div className="top-nav__left">
        <button className="top-nav__icon-btn" onClick={onToggleCollapse} title="展开 / 收起菜单">
          <IconPlusIcPublicMenuCollapse iconSize="1.25rem" iconColor={['currentcolor']} />
        </button>
        <div className="top-nav__brand">
          <span className="top-nav__logo">
            <IconPlusIcPublicHeartWaveform iconSize="1.25rem" iconColor={['currentcolor']} />
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
        <TextField
          className="top-nav__search"
          placeholder="搜索设备名称、编号或 IP"
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />}
        />
        <button
          className="top-nav__icon-btn"
          onClick={toggleDark}
          title={isDark ? "切换到浅色模式" : "切换到深色模式"}
        >
          {isDark ? <IconPlusIcPublicSun iconSize="1.25rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMoon iconSize="1.25rem" iconColor={['currentcolor']} />}
        </button>
        <button className="top-nav__icon-btn" title="消息通知">
          <IconPlusIcPublicBellClock iconSize="1.25rem" iconColor={['currentcolor']} />
          <span className="top-nav__badge">18</span>
        </button>
        <div className="top-nav__user">
          <img className="top-nav__avatar" src="/assets/uploads/user.png" alt="用户头像" />
          <span className="top-nav__username">张明远</span>
          <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} />
        </div>
      </div>
    </header>
  );
}
