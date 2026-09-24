import Switch from "@nce/eview-react/Switch";
import { useApp } from "../../context.jsx";
import { Icon } from "../../shared/icon.jsx";
import "./index.css";

// Layer 4: 头部导航栏 — 全局导航 + 换肤开关 + 用户区
// TODO(eview-react): Menu 无对应组件,当前手写横向导航列表(参考 handwrite-templates.md §5)
const NAV_ITEMS = [
  { key: "home", icon: <Icon name="house" size={16} />, label: "首页" },
  { key: "device", icon: <Icon name="server" size={16} />, label: "设备管理" },
  { key: "alarm", icon: <Icon name="bell" size={16} />, label: "告警中心" },
  { key: "system", icon: <Icon name="settings" size={16} />, label: "系统设置" },
];

export default function HeaderBar() {
  const { isDark, toggleDark, activeTab, setActiveTab } = useApp();

  // 配置管理归到设备管理高亮
  const activeNavKey = activeTab === "config" ? "device" : activeTab;

  return (
    <header className="header-bar">
      <div className="header-bar__brand">
        <Icon name="shield-check" size={22} color="var(--primary)" />
        <span className="header-bar__brand-name">ICT 智能管理平台</span>
      </div>
      <nav className="header-bar__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`header-bar__nav-item ${activeNavKey === item.key ? "active" : ""}`}
            onClick={() => setActiveTab(item.key)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="header-bar__tools">
        <span className="header-bar__theme-label">
          <Icon name={isDark ? "moon" : "sun"} size={14} />
          换肤
        </span>
        <Switch
          data={[false, true]}
          toggled={isDark}
          onToggle={toggleDark}
          taggledChildren={<Icon name="moon" size={12} />}
          unTaggledChildren={<Icon name="sun" size={12} />}
        />
        <span className="header-bar__divider" />
        <Icon name="circle-user" size={20} color="var(--on-surface-variant)" />
        <span className="header-bar__user">管理员</span>
      </div>
    </header>
  );
}
