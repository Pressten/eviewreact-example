import { Switch } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

export default function HeaderBar({ collapsed, onToggleSidebar }) {
  const { isDark, toggleDark } = useApp();

  return (
    <header className="header-bar">
      <button
        type="button"
        className="header-collapse-btn"
        onClick={onToggleSidebar}
        title={collapsed ? "展开侧边栏" : "收起侧边栏"}
      >
        <Icon name={collapsed ? "panel-left-open" : "panel-left-close"} size="1rem" />
      </button>

      <h1 className="header-title">资产管理</h1>

      <div className="header-tools">
        <div className="header-search">
          <Icon name="search" size="0.875rem" className="header-search-icon" />
          <input className="header-search-input" placeholder="搜索资源..." />
        </div>

        <div className="header-dark-toggle">
          <Icon name={isDark ? "moon" : "sun"} size="0.875rem" className="header-dark-icon" />
          <Switch checked={isDark} onChange={toggleDark} />
        </div>

        <Icon name="bell" size="1.25rem" className="header-bell" title="通知" />
      </div>
    </header>
  );
}
