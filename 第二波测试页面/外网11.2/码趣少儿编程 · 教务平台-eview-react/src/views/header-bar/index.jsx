import { useState } from "react";
import { IconPlusIcCarUser, IconPlusIcIctLogOut, IconPlusIcPublicChevronDown, IconPlusIcPublicClock, IconPlusIcPublicSearch, IconPlusIcPublicSetting, IconPlusIcIctTree, IconPlusIcPublicSortUp, IconPlusIcIctHardIsk, IconPlusIcPublicBellClock } from '@hui/icon-plus';
import TextField from "@/shared/TextField";
import SimpleDropdown from "../../components/simple-dropdown/index.jsx";
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

  const userItems = [
    { key: "profile", icon: <IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} />, label: "个人中心" },
    { key: "setting", icon: <IconPlusIcPublicSetting iconSize="0.875rem" iconColor={['currentcolor']} />, label: "账号设置" },
    { type: "divider" },
    { key: "logout", icon: <IconPlusIcIctLogOut iconSize="0.875rem" iconColor={['currentcolor']} />, label: "退出登录" },
  ];

  return (
    <header className="header-bar">
      {/* 品牌 + 主导航 */}
      <div className="header-left">
        <a className="header-brand" href="#">
          <span className="brand-logo">
            <IconPlusIcIctTree iconSize="1.25rem" iconColor={['currentcolor']} />
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
      <div className="header-search" style={{ position: 'relative' }}>
        <TextField
          className="search-input"
          size="large"
          placeholder="搜索文件、文件夹、空间"
          value={keyword}
          onChange={(value) => setKeyword(value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 160)}
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['#AEAEAE']} />}
        />
        {searchFocused && (searchHistory.length > 0 || searchHot.length > 0) && (
          <div className="search-panel" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000 }}>
            {searchHistory.length > 0 && (
              <div className="search-section">
                <div className="search-section-title">
                  <IconPlusIcPublicClock iconSize="0.875rem" iconColor={['currentcolor']} />
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
                <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} />
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
      </div>

      {/* 容量指示 + 用户区 */}
      <div className="header-right">
        <div className={`capacity-indicator${overLimit ? " capacity-indicator--warn" : ""}`} title={`已用 ${storage.used} / ${storage.total} ${storage.unit}`}>
          <IconPlusIcIctHardIsk iconSize="1rem" iconColor={['currentcolor']} />
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
          <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} />
          <span className="icon-dot" />
        </button>

        <SimpleDropdown items={userItems} placement="bottomRight" onSelect={() => {}}>
          <div className="user-area">
            <img className="user-avatar" src="/uploads/user.png" alt={currentUser.name} />
            <span className="user-name">{currentUser.name}</span>
            <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['#777777']} />
          </div>
        </SimpleDropdown>
      </div>
    </header>
  );
}
