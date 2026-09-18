import { useState } from "react";
import Button from "@nce/eview-react/Button";
import SearchInput from "@nce/eview-react/SearchInput";
import Crumbs from "@nce/eview-react/Crumbs";
import { Icon } from "../icons.jsx";
import { useApp } from "../context.jsx";
import { menuItems, breadcrumbs } from "../data.js";
import StepFlow from "./StepFlow.jsx";
import "./app-shell.css";

// TODO(eview-react): Layout 有导出名但无 Reference，当前手写 CSS 布局
// TODO(eview-react): Menu 有导出名但无 Reference，当前手写侧导航
// TODO(eview-react): Avatar 无导出，当前手写圆形占位

// 头像（antd Avatar → 手写 div 圆形）
function AppAvatar({ text, size = 32 }) {
  return (
    <div
      className="shell-avatar"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "var(--primary)",
        color: "var(--on-primary)",
        fontSize: `${size * 0.4}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {text}
    </div>
  );
}

// Layer 4/5: 布局骨架 — 顶导航 + 侧菜单 + 主体(面包屑 → 步骤流)
export default function AppShell() {
  const { isDark, toggleDark } = useApp();
  const [activeKey, setActiveKey] = useState("devices");

  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-brand">
          <Icon name="zap" size={22} className="shell-brand-icon" />
          <span className="shell-brand-text">电力接入平台</span>
        </div>
        <div className="shell-tools">
          <SearchInput placeholder="搜索设备 / 站点" className="shell-search" />
          <Button onClick={toggleDark} title={isDark ? "切换浅色" : "切换深色"}>
            <Icon name={isDark ? "sun" : "moon"} size={14} />
          </Button>
          <AppAvatar text="王" size={32} />
        </div>
      </header>

      <div className="shell-body">
        <aside className="shell-sider">
          <nav className="app-menu">
            {menuItems.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`app-menu-item ${activeKey === m.key ? "active" : ""}`}
                onClick={() => setActiveKey(m.key)}
              >
                <Icon name={m.icon} size={14} style={{ marginRight: "8px" }} />
                {m.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="shell-content">
          <Crumbs
            data={breadcrumbs.map((b) => ({ title: b }))}
            className="shell-breadcrumb"
          />
          <StepFlow />
        </main>
      </div>
    </div>
  );
}
