import Button from "@nce/eview-react/Button";
import Crumbs from "@nce/eview-react/Crumbs";
import SearchInput from "@nce/eview-react/SearchInput";
import TipBox from "@nce/eview-react/TipBox";
import { Icon } from "../../assets/shared/icons.js";
import { useApp } from "../context.jsx";
import { menuItems, breadcrumbs } from "../data.js";
import StepFlow from "./StepFlow.jsx";
import "./app-shell.css";

// Layer 4/5: 布局骨架 — 顶导航 + 侧菜单 + 主体(面包屑 → 步骤流)
export default function AppShell() {
  const { isDark, toggleDark } = useApp();
  const themeLabel = isDark ? "切换浅色" : "切换深色";

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
              leftIcon={<Icon name={isDark ? "sun" : "moon"} size={14} />}
              onClick={toggleDark}
            />
          </TipBox>
          <div className="shell-avatar" aria-label="当前用户">
            王
          </div>
        </div>
      </header>

      <div className="shell-body">
        <aside className="shell-sider">
          <nav className="shell-menu" aria-label="主导航">
            {menuItems.map((m) => (
              <button
                type="button"
                key={m.key}
                className={`shell-menu-item${m.key === "devices" ? " is-active" : ""}`}
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
            seprator="/"
            className="shell-breadcrumb"
          />
          <StepFlow />
        </main>
      </div>
    </div>
  );
}
