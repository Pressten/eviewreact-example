// Layer 4: 顶部导航栏 — 品牌识别 + 一级模块导航（原生 nav 自写,遵循头部导航规范）+ 全局工具与用户区
// 选中态: 品牌色文字 + 2px 品牌色下划线;未选中: 2px 透明占位,切换不跳动;hover 仅文字变品牌色
import { useState } from "react";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { WEEK_INFO } from "../../mock/weekly-report.js";
import "./index.css";

const NAV_ITEMS = [
  { navKey: "weekly-report", navLabel: "运营周报" },
  { navKey: "sales-analysis", navLabel: "销售分析" },
  { navKey: "store-manage", navLabel: "门店管理" },
  { navKey: "member-marketing", navLabel: "会员营销" },
  { navKey: "supply-chain", navLabel: "供应链" },
  { navKey: "report-center", navLabel: "报表中心" },
];

export default function GlobalNav() {
  const { isDark, toggleDark } = useApp();
  const [activeNavKey, setActiveNavKey] = useState("weekly-report");

  const handleNavKeyDown = (event, navKey) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveNavKey(navKey);
    }
  };

  return (
    <header className="global-nav no-print">
      <div className="global-nav-inner">
        <div className="nav-brand">
          <Icon src="./assets/uploads/logo.svg" size="1.5rem" />
          <span className="nav-brand-name">{WEEK_INFO.brandName}</span>
          <span className="nav-brand-sub">智慧运营平台</span>
        </div>

        <nav className="nav-links" aria-label="一级模块导航">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNavKey === item.navKey;
            return (
              <a
                key={item.navKey}
                className={`nav-link ${isActive ? "active" : ""}`}
                role="button"
                tabIndex={0}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setActiveNavKey(item.navKey)}
                onKeyDown={(event) => handleNavKeyDown(event, item.navKey)}
              >
                {item.navLabel}
              </a>
            );
          })}
        </nav>

        <div className="nav-tools">
          <Icon
            name={isDark ? "sun" : "moon"}
            size="1rem"
            title="切换明暗主题"
            onClick={toggleDark}
            className="nav-theme-toggle"
          />
          <div className="nav-user">
            <img className="nav-user-avatar" src="./assets/uploads/user.png" alt="用户头像" />
            <span className="nav-user-name">王志远</span>
            <span className="nav-user-role">区域总经理</span>
          </div>
        </div>
      </div>
    </header>
  );
}
