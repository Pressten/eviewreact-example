import { useState } from "react";
import Button from "@nce/eview-react/Button";
import SearchInput from "@nce/eview-react/SearchInput";
import Crumbs from "@nce/eview-react/Crumbs";
import TipBox from "@nce/eview-react/TipBox";
import { Icon } from "../icons.jsx";
import { useApp } from "../context.jsx";
import { menuItems, breadcrumbs } from "../data.js";
import StepFlow from "./StepFlow.jsx";
import "./app-shell.css";

// Layer 4/5: 布局骨架 — 顶导航 + 侧菜单 + 主体(面包屑 → 步骤流)
// antd Layout/Header/Sider/Content/Menu/Avatar/Breadcrumb/Input 在 eview-react 无直接对应或无 Reference:
//   Layout/Header/Sider/Content → 手写 CSS 布局;Menu → 手写导航列表;Avatar → 手写圆形;
//   Breadcrumb → Crumbs;Input(prefix search) → SearchInput(自带搜索图标)。
export default function AppShell() {
  const { isDark, toggleDark } = useApp();
  const [activeKey, setActiveKey] = useState("devices");

  const themeLabel = isDark ? "切换浅色" : "切换深色";

  // Crumbs data:[{title}],最后一项无 url。
  const breadcrumbData = breadcrumbs.map((b) => ({ title: b }));

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
          <TipBox content={themeLabel} direction="bottom">
            <Button
              status="text"
              aria-label={themeLabel}
              onClick={toggleDark}
              leftIcon={<Icon name={isDark ? "sun" : "moon"} size={14} />}
            />
          </TipBox>
          <div className="shell-avatar" title="王">
            王
          </div>
        </div>
      </header>

      <div className="shell-body">
        <aside className="shell-sider">
          <nav className="shell-menu">
            {menuItems.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`shell-menu-item ${activeKey === m.key ? "is-active" : ""}`}
                onClick={() => setActiveKey(m.key)}
              >
                <span className="shell-menu-item-icon">
                  <Icon name={m.icon} size={14} />
                </span>
                <span>{m.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="shell-content">
          <Crumbs data={breadcrumbData} className="shell-breadcrumb" />
          <StepFlow />
        </main>
      </div>
    </div>
  );
}
