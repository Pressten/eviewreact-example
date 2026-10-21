import { IconPlusIcDigitalPowerDpMenu, IconPlusIcHuaweiCloudNetwork, IconPlusIcPublicBellClock, IconPlusIcPublicMoon, IconPlusIcPublicSearch, IconPlusIcPublicSun } from '@hui/icon-plus';
import { navItems } from "../../mock/network.js";
import { useApp } from "../../context.jsx";
import "./index.css";

export default function TopNav() {
  const { isDark, toggleDark } = useApp();
  return (
    <header className="topnav">
      <div className="topnav-inner">
        <div className="topnav-left">
          <button className="topnav-icon-btn" title="菜单">
            <IconPlusIcDigitalPowerDpMenu iconSize="1.25rem" iconColor={['var(--on-surface)']} />
          </button>
          <div className="topnav-brand">
            <span className="topnav-logo">
              <IconPlusIcHuaweiCloudNetwork iconSize="1.75rem" iconColor={['var(--primary)']} />
            </span>
            <span className="topnav-product">iMaster NCE-Fabric</span>
            <span className="topnav-divider">|</span>
            <span className="topnav-module">网络规建</span>
          </div>
        </div>
        <nav className="topnav-links">
          {navItems.map((item, i) => (
            <a
              key={item}
              href="#"
              className={"topnav-link" + (i === 1 ? " active" : "")}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="topnav-right">
          <button className="topnav-icon-btn" title="换肤" onClick={toggleDark}>
            {isDark ? <IconPlusIcPublicSun iconSize="1.125rem" iconColor={['var(--on-surface-variant)']} /> : <IconPlusIcPublicMoon iconSize="1.125rem" iconColor={['var(--on-surface-variant)']} />}
          </button>
          <button className="topnav-icon-btn" title="搜索">
            <IconPlusIcPublicSearch iconSize="1.125rem" iconColor={['var(--on-surface-variant)']} />
          </button>
          <button className="topnav-icon-btn" title="告警">
            <IconPlusIcPublicBellClock iconSize="1.125rem" iconColor={['var(--on-surface-variant)']} />
          </button>
          <span className="topnav-user">Admin</span>
          <div className="topnav-avatar">A</div>
        </div>
      </div>
    </header>
  );
}
