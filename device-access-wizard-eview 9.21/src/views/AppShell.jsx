import { useState } from "react";
import SearchInput from "@nce/eview-react/SearchInput";
import Crumbs from "@nce/eview-react/Crumbs";
import Toggle from "@nce/eview-react/Toggle";
import { IconPlusIcPublicTransverseRectangleTemplate } from "@nce/icon-plus";
import { useApp } from "../context.jsx";
import { menuItems, breadcrumbs } from "../data.js";
import StepFlow from "./StepFlow.jsx";
import "./app-shell.css";

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

export default function AppShell() {
  const { isDark, toggleDark } = useApp();
  const [activeKey, setActiveKey] = useState("devices");

  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-brand">
          <IconPlusIcPublicTransverseRectangleTemplate className="shell-brand-icon" />
          <span className="shell-brand-text">电力接入平台</span>
        </div>
        <div className="shell-tools">
          <SearchInput placeholder="搜索设备 / 站点" className="shell-search" />
          <Toggle
            toggled={isDark}
            onToggle={toggleDark}
            taggledChildren="深色"
            unTaggledChildren="浅色"
          />
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
                <IconPlusIcPublicTransverseRectangleTemplate
                  className="app-menu-icon"
                />
                {m.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="shell-content">
          <Crumbs
            data={breadcrumbs.map((b, i) =>
              i < breadcrumbs.length - 1 ? { title: b, url: "#" } : { title: b }
            )}
            seprator="/"
            className="shell-breadcrumb"
          />
          <StepFlow />
        </main>
      </div>
    </div>
  );
}
