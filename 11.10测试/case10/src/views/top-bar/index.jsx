// Layer 4: 顶部导航 — Logo + 主导航（自写 nav）+ 版号 Tag + 全局搜索 + 主题切换
import { useState } from "react";
import { Tag, Input } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { VERSION_META } from "../../mock/api-registry.js";
import "./index.css";

export default function TopBar() {
  const { isDark, toggleDark, version, setApiKeyword, setAnnouncementOpen } = useApp();
  const [draft, setDraft] = useState("");
  const meta = VERSION_META[version];

  // 全局搜索：回车 / 点击搜索图标 → 以关键词过滤接口列表并定位
  const runSearch = () => {
    setApiKeyword(draft.trim());
    const target = document.getElementById("apis");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="top-bar">
      <div className="brand">
        <Icon src="./assets/uploads/logo.svg" size="1.5rem" />
        <span className="brand-name">OpenCloud 开放平台</span>
      </div>

      <nav className="main-nav">
        <a className="nav-item active">文档</a>
        <a className="nav-item">控制台</a>
        <a className="nav-item">状态页</a>
      </nav>

      <div className="top-tools">
        <Tag color="processing" className="ver-tag">
          {meta.docTag}
        </Tag>
        <Input
          className="global-search"
          placeholder="搜索接口、路径或错误码"
          value={draft}
          onChange={(e) => {
            const value = e.target.value;
            setDraft(value);
            // 清空输入时同步清空列表关键词，保持即时生效
            if (value === "") setApiKeyword("");
          }}
          onPressEnter={runSearch}
          allowClear
          suffix={
            <Icon
              name="search"
              size="0.875rem"
              className="search-icon"
              title="搜索接口"
              onClick={runSearch}
            />
          }
        />
        <Icon
          name="bell"
          size="1.25rem"
          className="notice-toggle"
          title="版本更新公告"
          onClick={() => setAnnouncementOpen(true)}
        />
        <Icon
          name={isDark ? "sun" : "moon"}
          size="1.25rem"
          className="theme-toggle"
          title={isDark ? "切换为浅色模式" : "切换为深色模式"}
          onClick={toggleDark}
        />
      </div>
    </header>
  );
}
