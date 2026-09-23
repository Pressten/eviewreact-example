import { useState } from "react";
import Button from "@nce/eview-react/Button";
import Badge from "@nce/eview-react/Badge";
import Divider from "@nce/eview-react/Divider";
import TipBox from "@nce/eview-react/TipBox";
import SearchInput from "@nce/eview-react/SearchInput";
import { Icon } from "../../shared/icon.jsx";
import { useToast } from "../../shared/feedback.jsx";
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
  const [toastNode, notify] = useToast();

  // TODO(eview-react): SearchInput.onSearch 在值变化/回车/点图标时均触发（官方文档），
  // 原 antd Input 仅 onPressEnter 触发；当前映射为 onSearch，连续输入会多次触发跳转。
  const submitSearch = (v) => {
    const val = (v ?? kw).trim();
    if (!val) return;
    setGlobalKeyword(val);
    setActiveMenu("management");
    notify.success(`已跳转至数据管理，搜索关键词「${val}」`);
  };

  const userMenuContent = (
    <div className="hb-user-menu">
      {userMenuItems.map((it, idx) => {
        if (it.type === "divider") return <hr key={`div-${idx}`} className="hb-user-menu-divider" />;
        return (
          <button
            key={it.key}
            type="button"
            className={`hb-user-menu-item${it.danger ? " danger" : ""}`}
            onClick={() => notify.info(`演示操作：${userMenuLabels[it.key] || it.key}`)}
          >
            {it.icon}
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );

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
        style={{ width: "100%" }}
        onClick={() => {
          setNotifyCount(0);
          notify.success("全部通知已标记为已读");
        }}
      >
        全部标记已读
      </Button>
    </div>
  );

  return (
    <header className="hb-bar">
      {toastNode}
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
        <SearchInput
          value={kw}
          onChange={(value) => setKw(value)}
          onSearch={(value) => submitSearch(value)}
          onClear={() => setKw("")}
          placeholder="搜索数据集、字段、任务，回车跳转"
          style={{ width: "100%" }}
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
            <img
              src="./assets/uploads/user.png"
              width={28}
              height={28}
              alt="陈志远"
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
            <span className="hb-user-name">陈志远</span>
            <Icon name="chevron-down" size={14} />
          </button>
        </TipBox>
      </div>
    </header>
  );
}
