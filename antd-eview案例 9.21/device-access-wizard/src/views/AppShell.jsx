import { useState } from "react";
import Button from "@nce/eview-react/Button";
import SearchInput from "@nce/eview-react/SearchInput";
import Crumbs from "@nce/eview-react/Crumbs";
import { Icon } from "../../assets/shared/icons.js";
import { useApp } from "../context.jsx";
import { menuItems, breadcrumbs } from "../data.js";
import StepFlow from "./StepFlow.jsx";
import "./app-shell.css";

// Layer 4/5: 布局骨架 — 顶导航 + 侧菜单 + 主体(面包屑 → 步骤流)
// TODO(eview-react): 布局骨架组件有导出名但无 Reference,当前手写 CSS 布局
// TODO(eview-react): 侧导航组件有导出名但无 Reference,当前手写
// TODO(eview-react): 圆形头像组件无导出,当前手写占位
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
            onClick={toggleDark}
            leftIcon={<Icon name={isDark ? "sun" : "moon"} size={14} />}
          />
          <div className="shell-avatar" title={isDark ? "切换浅色" : "切换深色"}>
            王
          </div>
        </div>
      </header>

      <div className="shell-body">
        <aside className="shell-sider">
          <nav className="app-menu">
            {menuItems.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`app-menu-item ${
                  activeKey === m.key ? "active" : ""
                }`}
                onClick={() => setActiveKey(m.key)}
              >
                <Icon name={m.icon} size={14} className="app-menu-icon" />
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
