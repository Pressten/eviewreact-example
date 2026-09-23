import { useState } from "react";
import Badge from "@nce/eview-react/Badge";
import Button from "@nce/eview-react/Button";
import Divider from "@nce/eview-react/Divider";
import TextField from "@nce/eview-react/TextField";
import TipBox from "@nce/eview-react/TipBox";
import DivMessage from "@nce/eview-react/DivMessage";
import { Icon } from "../../shared/icon.jsx";
import AppAvatar from "../../components/app-avatar/index.jsx";
import { useApp } from "../../context.jsx";
import { seedNotifications } from "../../mock/dataset.js";
import "./index.css";

const userMenuItems = [
  { key: "profile", icon: <Icon name="user" size={14} />, label: "个人中心" },
  { key: "settings", icon: <Icon name="settings" size={14} />, label: "账号设置" },
  { key: "lock", icon: <Icon name="lock" size={14} />, label: "锁定屏幕" },
  { type: "divider" },
  { key: "logout", icon: <Icon name="log-out" size={14} />, label: "退出登录", danger: true },
];

const userMenuLabels = { profile: "个人中心", settings: "账号设置", lock: "锁定屏幕", logout: "退出登录" };

export default function HeaderBar() {
  const { isDark, toggleDark, setActiveMenu, setGlobalKeyword, notifyCount, setNotifyCount } = useApp();
  const [kw, setKw] = useState("");
  const [notice, setNotice] = useState(null);
  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

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
        text="全部标记已读"
        style={{ width: "100%", marginTop: 4 }}
        onClick={() => {
          setNotifyCount(0);
          notify("success", "全部通知已标记为已读");
        }}
      />
    </div>
  );

  const userMenuContent = (
    <div className="app-user-menu" style={{ display: "flex", flexDirection: "column", minWidth: 168, padding: 4 }}>
      {userMenuItems.map((it, idx) =>
        it.type === "divider" ? (
          <div key={`d${idx}`} style={{ height: 1, background: "var(--divider)", margin: "4px 0" }} />
        ) : (
          <button
            key={it.key}
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 8px",
              border: "none",
              background: "transparent",
              borderRadius: "var(--radius-base)",
              cursor: "pointer",
              textAlign: "left",
              color: it.danger ? "var(--error)" : "var(--on-surface)",
              font: "var(--font-body-s)",
            }}
            onClick={() => notify("default", `演示操作：${userMenuLabels[it.key] || it.key}`)}
          >
            {it.icon}
            <span>{it.label}</span>
          </button>
        )
      )}
    </div>
  );

  return (
    <>
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
          <TextField
            value={kw}
            onChange={(value) => setKw(value)}
            leftIcon={<Icon name="search" size={14} />}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
            }}
            placeholder="搜索数据集、字段、任务，回车跳转"
          />
        </div>
        <div className="hb-right">
          <TipBox type="simple" content={isDark ? "切换亮色模式" : "切换暗色模式"} direction="bottom">
            <button type="button" className="hb-icon-btn" onClick={toggleDark}>
              <Icon name={isDark ? "sun" : "moon"} size={16} />
            </button>
          </TipBox>
          <TipBox content={notiContent} trigger="click" direction="bottomRight" isMouseLeaveClose={false}>
            <Badge content={notifyCount} offset={[-4, 4]}>
              <button type="button" className="hb-icon-btn">
                <Icon name="bell" size={16} />
              </button>
            </Badge>
          </TipBox>
          <Divider type="vertical" />
          <TipBox content={userMenuContent} trigger="click" direction="bottomRight" isMouseLeaveClose={false}>
            <button type="button" className="hb-user">
              <AppAvatar src="./assets/uploads/user.png" size={28} />
              <span className="hb-user-name">陈志远</span>
              <Icon name="chevron-down" size={14} />
            </button>
          </TipBox>
        </div>
      </header>
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={3000}
          onClose={() => setNotice(null)}
          style={{ position: "fixed", top: 56, right: 16, zIndex: 200, maxWidth: 360 }}
        />
      ) : null}
    </>
  );
}
