import IconButton from "@nce/eview-react/IconButton";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

const NAV_ITEMS = [
  { key: "overview", icon: "layout-dashboard", label: "设备总览" },
  { key: "alarm", icon: "bell", label: "告警中心" },
  { key: "energy", icon: "gauge", label: "能耗分析" },
  { key: "workorder", icon: "clipboard-list", label: "工单管理" },
  { key: "report", icon: "chart-column", label: "报表中心" },
  { key: "setting", icon: "settings", label: "系统设置" }
];

// TODO(eview-react): antd Menu 无对应组件，当前手写横向导航（激活项静态为 overview，与源项目 selectedKeys 一致）
const ACTIVE_NAV_KEY = "overview";

export default function HeaderBar() {
  const { isDark, toggleDark } = useApp();

  return (
    <header className="header-bar">
      <div className="header-brand">
        <span className="brand-logo">
          <Icon name="radar" size={18} />
        </span>
        <span className="brand-name">智慧能源运维平台</span>
      </div>

      <nav className="header-nav" aria-label="主导航">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={
              "header-nav-item" + (item.key === ACTIVE_NAV_KEY ? " is-active" : "")
            }
            aria-current={item.key === ACTIVE_NAV_KEY ? "page" : undefined}
          >
            <Icon name={item.icon} size={14} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <IconButton
          size={24}
          iconName={<Icon name={isDark ? "sun" : "moon"} size={16} />}
          tipText="切换主题"
          onClick={toggleDark}
        />
        <IconButton
          size={24}
          tipText="通知"
          iconName={
            <span className="bell-wrap">
              <Icon name="bell" size={16} />
              <i className="bell-dot" />
            </span>
          }
        />
        <div className="header-user">
          <img className="user-avatar" src="uploads/user.png" alt="用户头像" />
          <span className="user-name">管理员</span>
          <Icon name="chevron-down" size={14} />
        </div>
      </div>
    </header>
  );
}
