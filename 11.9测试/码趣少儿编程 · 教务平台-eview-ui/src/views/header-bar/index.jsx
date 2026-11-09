import { useState } from "react";
import Dropdown from "eview-ui/Dropdown";
import TextField from "eview-ui/TextField";
import Icon from "@/shared/Icon";
import { currentUser, storage, searchHistory, searchHot } from "../../mock/drive.js";
import "./index.css";

const NAV_ITEMS = [
  { key: "mine", label: "我的文件" },
  { key: "shared", label: "共享" },
  { key: "trash", label: "回收站" },
  { key: "admin", label: "管理" },
];

export default function HeaderBar() {
  const [activeNav, setActiveNav] = useState("mine");
  const [searchFocused, setSearchFocused] = useState(false);
  const [keyword, setKeyword] = useState("");

  const usagePct = Math.round((storage.used / storage.total) * 100);
  const overLimit = usagePct >= 80;

  const userOverlay = (
    <div className="user-menu">
      <div className="user-menu-item">
        <Icon name="user" size="0.875rem" /> <span>个人中心</span>
      </div>
      <div className="user-menu-item">
        <Icon name="settings" size="0.875rem" /> <span>账号设置</span>
      </div>
      <div className="user-menu-divider" />
      <div className="user-menu-item">
        <Icon name="log-out" size="0.875rem" /> <span>退出登录</span>
      </div>
    </div>
  );

  const searchOverlay = (
    <div className="search-panel">
      {searchHistory.length > 0 && (
        <div className="search-section">
          <div className="search-section-title">
            <Icon name="clock" size="0.875rem" />
            <span>搜索历史</span>
          </div>
          <div className="search-chips">
            {searchHistory.map((h) => (
              <a
                key={h}
                className="search-chip"
                onClick={(e) => {
                  e.preventDefault();
                  setKeyword(h);
                  setSearchFocused(false);
                }}
                href="#"
              >
                {h}
              </a>
            ))}
          </div>
        </div>
      )}
      <div className="search-section">
        <div className="search-section-title">
          <Icon name="trending-up" size="0.875rem" />
          <span>热门搜索</span>
        </div>
        <div className="search-chips">
          {searchHot.map((h) => (
            <a
              key={h}
              className="search-chip search-chip--hot"
              onClick={(e) => {
                e.preventDefault();
                setKeyword(h);
                setSearchFocused(false);
              }}
              href="#"
            >
              {h}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <header className="header-bar">
      <div className="header-left">
        <a className="header-brand" href="#">
          <span className="brand-logo">
            <Icon name="folder-tree" size="1.25rem" />
          </span>
          <span className="brand-name">智盘 CloudDisk</span>
        </a>
        <nav className="header-nav">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.key}
              className={`nav-item${activeNav === item.key ? " nav-item--active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveNav(item.key);
              }}
              href="#"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="header-search">
        <Dropdown
          trigger={["hover", "click"]}
          visible={searchFocused && (searchHistory.length > 0 || searchHot.length > 0)}
          overlay={searchOverlay}
        >
          <div className="search-input-wrap">
            <Icon name="search" size="0.875rem" color="#AEAEAE" style={{ marginRight: "0.25rem" }} />
            <TextField
              className="search-input"
              size="large"
              placeholder="搜索文件、文件夹、空间"
              value={keyword}
              onChange={(v) => setKeyword(v)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 160)}
            />
          </div>
        </Dropdown>
      </div>

      <div className="header-right">
        <div className={`capacity-indicator${overLimit ? " capacity-indicator--warn" : ""}`} title={`已用 ${storage.used} / ${storage.total} ${storage.unit}`}>
          <Icon name="hard-drive" size="1rem" />
          <div className="capacity-bar">
            <div className="capacity-bar-track">
              <div className="capacity-bar-fill" style={{ width: usagePct + "%" }} />
            </div>
            <span className="capacity-text">
              {storage.used}/{storage.total}{storage.unit}
            </span>
          </div>
        </div>

        <button
          className="icon-btn"
          title="消息通知"
          onClick={() => {}}
        >
          <Icon name="bell" size="1rem" />
          <span className="icon-dot" />
        </button>

        <Dropdown overlay={userOverlay} placement="bottomRight" trigger={["click"]}>
          <div className="user-area">
            <img className="user-avatar" src="/uploads/user.png" alt={currentUser.name} />
            <span className="user-name">{currentUser.name}</span>
            <Icon name="chevron-down" size="0.875rem" color="#777777" />
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
