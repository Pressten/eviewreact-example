import { useState } from "react";
import { IconPlusIcCarUser, IconPlusIcHuaweiCloudDatabase, IconPlusIcPublicBellClock, IconPlusIcPublicChevronDown, IconPlusIcPublicMoon, IconPlusIcPublicSearch, IconPlusIcPublicSun } from '@nce/icon-plus';
import TextField from "@/shared/TextField";
import { useApp } from "../../context.jsx";
import "./index.css";

const NAV = [
  { key: "workbench", label: "工作台" },
  { key: "data", label: "数据管理" },
  { key: "resource", label: "资源目录" },
  { key: "monitor", label: "监控中心" },
  { key: "setting", label: "系统设置" },
];

// Layer 4: 顶部导航栏 — 原生 nav 自写,不使用 Menu
export default function HeaderBar() {
  const { isDark, toggleDark, setActiveTab } = useApp();
  const [active, setActive] = useState("data");

  const onNav = (key) => {
    setActive(key);
    if (key === "data") setActiveTab("task");
  };

  return (
    <header className="header-bar">
      <div className="header-bar__brand">
        <span className="header-bar__logo">
          <IconPlusIcHuaweiCloudDatabase iconSize="1.25rem" iconColor={['currentcolor']} />
        </span>
        <span className="header-bar__title">数据中台 DataHub</span>
      </div>

      <nav className="header-bar__nav">
        {NAV.map((item) => (
          <button
            key={item.key}
            type="button"
            className={"header-nav-item" + (active === item.key ? " is-active" : "")}
            onClick={() => onNav(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-bar__tools">
        <TextField
          className="header-bar__search"
          placeholder="搜索任务、执行 ID 或资源"
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />}
        />
        <button type="button" className="header-icon-btn" onClick={toggleDark} title={isDark ? "切换浅色" : "切换深色"}>
          {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['currentcolor']} />}
        </button>
        <button type="button" className="header-icon-btn" title="通知">
          <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />
          <span className="header-icon-btn__dot" />
        </button>
        <div className="header-bar__user">
          <span className="header-bar__avatar">
            <IconPlusIcCarUser iconSize="0.875rem" iconColor={['var(--on-primary)']} />
          </span>
          <span className="header-bar__user-meta">
            <span className="header-bar__user-name">张伟</span>
            <span className="header-bar__user-role">数据工程师</span>
          </span>
          <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />
        </div>
      </div>
    </header>
  );
}
