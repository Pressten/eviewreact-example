import { useState, useRef, useEffect } from "react";
import Badge from "@nce/eview-react/Badge";
import Button from "@nce/eview-react/Button";
import Divider from "@nce/eview-react/Divider";
import TextField from "@nce/eview-react/TextField";
import TipBox from "@nce/eview-react/TipBox";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { useNotice } from "../../components/notice/index.jsx";
import { seedNotifications } from "../../mock/dataset.js";
import "./index.css";

const userMenuItems = [
  { key: "profile", icon: "user", label: "个人中心" },
  { key: "settings", icon: "settings", label: "账号设置" },
  { key: "lock", icon: "lock", label: "锁定屏幕" },
  { key: "logout", icon: "log-out", label: "退出登录", danger: true },
];

const userMenuLabels = { profile: "个人中心", settings: "账号设置", lock: "锁定屏幕", logout: "退出登录" };

export default function HeaderBar() {
  const { isDark, toggleDark, setActiveMenu, setGlobalKeyword, notifyCount, setNotifyCount } = useApp();
  const { notify } = useNotice();
  const [kw, setKw] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  const submitSearch = () => {
    const v = kw.trim();
    if (!v) return;
    setGlobalKeyword(v);
    setActiveMenu("management");
    notify("success", `已跳转至数据管理，搜索关键词「${v}」`);
  };

  const notiContent = (
    <div className="hb-noti">
      <div className="hb-noti-head">
        <span>通知中心</span>
        <Badge content={notifyCount} />
      </div>
      {seedNotifications.map((n) => (
        <div key={n.id} className={`hb-noti-item${n.unread ? " unread" : ""}`}>
          <span className={`hb-noti-dot tone-${n.tone}`} />
          <div className="hb-noti-main">
            <p>{n.title}</p>
            <span>{n.desc}</span>
            <i>{n.time}</i>
          </div>
        </div>
      ))}
      <Button
        size="small"
        onClick={() => {
          setNotifyCount(0);
          notify("success", "全部通知已标记为已读");
        }}
        style={{ width: "100%", marginTop: 4 }}
      >
        全部标记已读
      </Button>
    </div>
  );

  return (
    <header className="hb-bar">
      <div className="hb-left">
        <span className="hb-logo">
          <Icon name="database" size={18} />
        </span>
        <div className="hb-brand">
          <strong>DataHub</strong>
          <span>数据管理平台</span>
        </div>
        <span className="hb-env">生产环境</span>
      </div>
      <div className="hb-search">
        <span className="hb-search-icon">
          <Icon name="search" size={14} />
        </span>
        <TextField
          placeholder="搜索数据集、字段、任务，回车跳转"
          value={kw}
          onChange={(value) => setKw(value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitSearch();
          }}
          inputStyle={{ paddingLeft: 30, height: 32 }}
        />
      </div>
      <div className="hb-right">
        <TipBox type="simple" content={isDark ? "切换亮色模式" : "切换暗色模式"} direction="bottom">
          <button type="button" className="hb-icon-btn" onClick={toggleDark}>
            <Icon name={isDark ? "sun" : "moon"} size={16} />
          </button>
        </TipBox>
        <TipBox content={notiContent} trigger="click" direction="bottomRight" isMouseLeaveClose={false} isClosable={false}>
          <Badge content={notifyCount} offset={[-4, 4]}>
            <button type="button" className="hb-icon-btn">
              <Icon name="bell" size={16} />
            </button>
          </Badge>
        </TipBox>
        <Divider type="vertical" />
        <div className="hb-user-wrap" ref={menuRef}>
          <button
            type="button"
            className="hb-user"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="hb-avatar">
              <img src="/uploads/user.png" width={28} height={28} alt="" />
            </span>
            <span className="hb-user-name">陈志远</span>
            <Icon name="chevron-down" size={14} />
          </button>
          {menuOpen ? (
            <div className="hb-user-menu" role="menu">
              {userMenuItems.map((it) => (
                <div key={it.key}>
                  {it.key === "logout" ? <div className="hb-menu-divider" /> : null}
                  <button
                    type="button"
                    className={`hb-menu-item${it.danger ? " danger" : ""}`}
                    onClick={() => {
                      setMenuOpen(false);
                      notify("info", `演示操作：${userMenuLabels[it.key] || it.key}`);
                    }}
                  >
                    <Icon name={it.icon} size={14} />
                    <span>{it.label}</span>
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
