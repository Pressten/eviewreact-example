import { useState } from "react";
import Crumbs from "@nce/eview-react/Crumbs";
import SearchInput from "@nce/eview-react/SearchInput";
import Button from "@nce/eview-react/Button";
import { Icon } from "../components/Icon.jsx";
import { useApp } from "../context.jsx";
import { menuItems, breadcrumbs } from "../data.js";
import StepFlow from "./StepFlow.jsx";
import "./app-shell.css";

// Layer 4/5: 布局骨架 — 顶导航 + 侧菜单 + 主体(面包屑 → 步骤流)
// eview-react 无 Layout/Menu/Avatar 对应,按手写补位(CSS 用原始 token)
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
          <SearchInput
            placeholder="搜索设备 / 站点"
            className="shell-search"
          />
          <Button
            leftIcon={<Icon name={isDark ? "sun" : "moon"} size={14} />}
            text={isDark ? "浅色" : "深色"}
            onClick={toggleDark}
          />
          <div className="shell-avatar" title="王">王</div>
        </div>
      </header>

      <div className="shell-body">
        <aside className="shell-sider">
          <nav className="shell-menu">
            {menuItems.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`shell-menu-item ${activeKey === m.key ? "active" : ""}`}
                onClick={() => setActiveKey(m.key)}
              >
                <Icon name={m.icon} size={14} />
                <span>{m.label}</span>
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
