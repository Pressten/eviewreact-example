import Toggle from "@nce/eview-react/Toggle";
import { IconPlusIcPublicBellClock, IconPlusIcPublicBoxOpen, IconPlusIcPublicClose, IconPlusIcPublicMoon, IconPlusIcPublicSearch, IconPlusIcPublicSun } from '@hui/icon-plus';
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
        {collapsed ? <IconPlusIcPublicBoxOpen iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicClose iconSize="1rem" iconColor={['currentcolor']} />}
      </button>

      <h1 className="header-title">资产管理</h1>

      <div className="header-tools">
        <div className="header-search">
          <IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} className="header-search-icon" />
          <input className="header-search-input" placeholder="搜索资源..." />
        </div>

        <div className="header-dark-toggle">
          {isDark ? <IconPlusIcPublicMoon iconSize="0.875rem" iconColor={['currentcolor']} className="header-dark-icon" /> : <IconPlusIcPublicSun iconSize="0.875rem" iconColor={['currentcolor']} className="header-dark-icon" />}
          <Toggle data={[false, true]} toggled={isDark} onToggle={toggleDark} />
        </div>

        <IconPlusIcPublicBellClock iconSize="1.25rem" iconColor={['currentcolor']} className="header-bell" title="通知" />
      </div>
    </header>
  );
}
