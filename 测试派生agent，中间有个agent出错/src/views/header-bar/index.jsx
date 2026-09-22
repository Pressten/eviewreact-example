import { useState } from "react";
import Badge from "@nce/eview-react/Badge";
import Button from "@nce/eview-react/Button";
import Divider from "@nce/eview-react/Divider";
import SearchInput from "@nce/eview-react/SearchInput";
import TipBox from "@nce/eview-react/TipBox";
import { Icon } from "../../shared/icon.jsx";
import { AppAvatar, Dropdown } from "../../shared/common.jsx";
import { useToast } from "../../shared/toast.jsx";
import { useApp } from "../../context.jsx";
import { seedNotifications } from "../../mock/dataset.js";
import "./index.css";

const userMenuItems = [
  { key: "profile", icon: <Icon name="user" size={14} />, label: "个人中心" },
  { key: "settings", icon: <Icon name="settings" size={14} />, label: "账号设置" },
  { key: "lock", icon: <Icon name="lock" size={14} />, label: "锁定屏幕" },
  { divider: true },
  { key: "logout", icon: <Icon name="log-out" size={14} />, label: "退出登录", danger: true },
];

const userMenuLabels = { profile: "个人中心", settings: "账号设置", lock: "锁定屏幕", logout: "退出登录" };

export default function HeaderBar() {
  const { isDark, toggleDark, setActiveMenu, setGlobalKeyword, notifyCount, setNotifyCount } = useApp();
  const toast = useToast();
  const [kw, setKw] = useState("");

  const submitSearch = (value) => {
    const v = (value ?? kw).trim();
    if (!v) return;
    setGlobalKeyword(v);
    setActiveMenu("management");
    toast.success(`已跳转至数据管理，搜索关键词「${v}」`);
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
        style={{ width: "100%" }}
        onClick={() => {
          setNotifyCount(0);
          toast.success("全部通知已标记为已读");
        }}
      />
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
        <SearchInput
          value={kw}
          onChange={(value) => setKw(value)}
          onSearch={(value) => submitSearch(value)}
          onClear={() => setKw("")}
          placeholder="搜索数据集、字段、任务，回车跳转"
        />
      </div>
      <div className="hb-right">
        <TipBox type="simple" content={isDark ? "切换亮色模式" : "切换暗色模式"} direction="top">
          <button type="button" className="hb-icon-btn" onClick={toggleDark}>
            <Icon name={isDark ? "sun" : "moon"} size={16} />
          </button>
        </TipBox>
        <TipBox content={notiContent} trigger="click" direction="bottomRight" isMouseLeaveClose={false}>
          <Badge content={notifyCount}>
            <button type="button" className="hb-icon-btn">
              <Icon name="bell" size={16} />
            </button>
          </Badge>
        </TipBox>
        <Divider type="vertical" />
        <Dropdown
          trigger={
            <button type="button" className="hb-user">
              <AppAvatar src="/uploads/user.png" size={28} />
              <span className="hb-user-name">陈志远</span>
              <Icon name="chevron-down" size={14} />
            </button>
          }
          items={userMenuItems}
          onSelect={(key) => toast.info(`演示操作：${userMenuLabels[key] || key}`)}
          placement="bottomRight"
        />
      </div>
    </header>
  );
}
