import { useState } from "react";
import TextField from "@nce/eview-react/TextField";
import Badge from "@nce/eview-react/Badge";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { headerNav, userMenu, currentUser } from "../../mock/nav.js";
import "./index.css";

// Layer 4: 顶部菜单栏（品牌 + 全局导航 + 全局工具）
// TODO(eview-react): Menu / Dropdown 无对应组件，当前手写横向导航与用户下拉
export default function HeaderBar() {
  const [activeKey, setActiveKey] = useState("planning");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isDark, toggleDark } = useApp();

  return (
    <header className="header-bar">
      <div className="header-brand">
        <span className="header-brand-mark">
          <Icon name="network" size={18} />
        </span>
        <span className="header-brand-name">NetPlan</span>
        <span className="header-brand-product">网络规划平台</span>
      </div>

      <nav className="header-nav">
        {headerNav.map((item) => (
          <button
            key={item.key}
            type="button"
            className={"header-nav-item" + (activeKey === item.key ? " is-active" : "")}
            onClick={() => setActiveKey(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-tools">
        <TextField
          className="header-search"
          placeholder="搜索站点 / 设备 / 网段"
          suffix={<Icon name="search" size={14} />}
        />
        {/* TODO(eview-react): 纯图标按钮可改用 IconButton + icon+ 静态导入 */}
        <button type="button" className="header-icon-btn" title="帮助中心">
          <Icon name="info" size={16} />
        </button>
        <button
          type="button"
          className="header-icon-btn"
          title={isDark ? "切换浅色模式" : "切换深色模式"}
          onClick={toggleDark}
        >
          <Icon name={isDark ? "sun" : "moon"} size={16} />
        </button>
        <button type="button" className="header-icon-btn" title="通知">
          <Badge content={6}>
            <Icon name="bell" size={16} />
          </Badge>
        </button>
        <span className="header-divider" />
        <div className="header-user-wrap">
          <button
            type="button"
            className="header-user"
            onClick={() => setUserMenuOpen((value) => !value)}
          >
            <img className="header-user-avatar" src={currentUser.avatar} alt="" />
            <span className="header-user-meta">
              <span className="header-user-name">{currentUser.name}</span>
              <span className="header-user-role">{currentUser.role}</span>
            </span>
            <Icon name="chevron-down" size={14} />
          </button>
          {userMenuOpen ? (
            <div className="header-user-menu">
              {userMenu.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="header-user-menu-item"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Icon name={item.icon} size={14} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
