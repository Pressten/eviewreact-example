// Layer 4/5: 布局骨架 — 顶导航 + 侧菜单 + 主体(面包屑 → 步骤流)
// Layout/Header/Sider/Content、Menu、Avatar 在 eview-react 无对应,手写补位
import { useState } from "react";
import Button from "@nce/eview-react/Button";
import SearchInput from "@nce/eview-react/SearchInput";
import Crumbs from "@nce/eview-react/Crumbs";
import { useApp } from "../context.jsx";
import { menuItems, crumbsData } from "../data.js";
import StepFlow from "./StepFlow.jsx";
import "./app-shell.css";

export default function AppShell() {
  const { isDark, toggleDark } = useApp();
  const [keyword, setKeyword] = useState("");
  const [activeMenu, setActiveMenu] = useState("devices");

  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-brand">
          <span className="shell-brand-mark" aria-hidden="true" />
          <span className="shell-brand-text">电力接入平台</span>
        </div>
        <div className="shell-tools">
          <SearchInput
            className="shell-search"
            placeholder="搜索设备 / 站点"
            value={keyword}
            onChange={(value) => setKeyword(value)}
            onSearch={(value) => setKeyword(value)}
            onClear={() => setKeyword("")}
          />
          <Button onClick={toggleDark} text={isDark ? "切换浅色" : "切换深色"} />
          {/* TODO(eview-react): Avatar 无对应,手写圆形占位 */}
          <div className="shell-avatar" title="王">
            王
          </div>
        </div>
      </header>

      <div className="shell-body">
        <aside className="shell-sider">
          {/* TODO(eview-react): Menu 无对应,手写侧导航 */}
          <nav className="shell-menu">
            {menuItems.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`shell-menu-item ${activeMenu === m.key ? "active" : ""}`}
                onClick={() => setActiveMenu(m.key)}
              >
                {m.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="shell-content">
          <Crumbs data={crumbsData} seprator="/" className="shell-breadcrumb" />
          <StepFlow />
        </main>
      </div>
    </div>
  );
}
