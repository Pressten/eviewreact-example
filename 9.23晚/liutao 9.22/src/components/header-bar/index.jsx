import { Menu, Switch } from "antd";
import { useApp } from "../../context.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// Layer 4: 头部导航栏 — 全局导航(Menu) + 换肤开关 + 用户区
// 顶部导航必须使用 Menu,不使用 Tabs
const NAV_ITEMS = [
  { key: "home", icon: <Icon name="house" size={16} />, label: "首页" },
  { key: "device", icon: <Icon name="server" size={16} />, label: "设备管理" },
  { key: "alarm", icon: <Icon name="bell" size={16} />, label: "告警中心" },
  { key: "system", icon: <Icon name="settings" size={16} />, label: "系统设置" },
];

export default function HeaderBar() {
  const { isDark, toggleDark, activeTab, setActiveTab } = useApp();

  return (
    <header className="header-bar">
      <div className="header-bar__brand">
        <Icon name="shield-check" size={22} color="var(--primary)" />
        <span className="header-bar__brand-name">ICT 智能管理平台</span>
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[activeTab === "config" ? "device" : activeTab]}
        items={NAV_ITEMS}
        onClick={({ key }) => setActiveTab(key)}
        className="header-bar__nav"
      />
      <div className="header-bar__tools">
        <span className="header-bar__theme-label">
          <Icon name={isDark ? "moon" : "sun"} size={14} />
          换肤
        </span>
        <Switch
          checked={isDark}
          onChange={toggleDark}
          checkedChildren={<Icon name="moon" size={12} />}
          unCheckedChildren={<Icon name="sun" size={12} />}
        />
        <span className="header-bar__divider" />
        <Icon name="circle-user" size={20} color="var(--on-surface-variant)" />
        <span className="header-bar__user">管理员</span>
      </div>
    </header>
  );
}
