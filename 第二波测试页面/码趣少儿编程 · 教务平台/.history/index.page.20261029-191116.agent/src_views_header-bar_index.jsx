import { useState } from "react";
import { Dropdown, Input } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
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

  const userMenu = {
    items: [
      { key: "profile", icon: <Icon name="user" size="0.875rem" />, label: "个人中心" },
      { key: "setting", icon: <Icon name="settings" size="0.875rem" />, label: "账号设置" },
      { type: "divider" },
      { key: "logout", icon: <Icon name="log-out" size="0.875rem" />, label: "退出登录" },
    ],
  };

  return (
    <header className="header-bar">
      {/* 品牌 + 主导航 */}
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

      {/* 全局搜索（聚焦显示历史与热门） */}
      <div className="header-search">
        <Dropdown
          trigger={[]}
          open={searchFocused && (searchHistory.length > 0 || searchHot.length > 0)}
          dropdownRender={() => (
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
          )}
        >
          <Input
            className="search-input"
            size="large"
            placeholder="搜索文件、文件夹、空间"
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 160)}
            onPressEnter={() => setSearchFocused(false)}
            suffix={<Icon name="search" size="0.875rem" color="#AEAEAE" />}
          />
        </Dropdown>
      </div>

      {/* 容量指示 + 用户区 */}
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

        <Dropdown menu={userMenu} placement="bottomRight" trigger={["click"]}>
          <div className="user-area">
            <img className="user-avatar" src="./assets/uploads/user.png" alt={currentUser.name} />
            <span className="user-name">{currentUser.name}</span>
            <Icon name="chevron-down" size="0.875rem" color="#777777" />
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
