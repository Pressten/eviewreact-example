import { useState } from "react";
import { Avatar, Badge, Button, Divider, Dropdown, Input, Popover, Tooltip, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
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

  const submitSearch = () => {
    const v = kw.trim();
    if (!v) return;
    setGlobalKeyword(v);
    setActiveMenu("management");
    message.success(`已跳转至数据管理，搜索关键词「${v}」`);
  };

  const notiContent = (
    <div className="hb-noti">
      <div className="hb-noti-head">
        <span>通知中心</span>
        <Badge count={notifyCount} size="small" />
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
        block
        size="small"
        onClick={() => {
          setNotifyCount(0);
          message.success("全部通知已标记为已读");
        }}
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
        <Input
          allowClear
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          onPressEnter={submitSearch}
          prefix={<Icon name="search" size={14} />}
          placeholder="搜索数据集、字段、任务，回车跳转"
        />
      </div>
      <div className="hb-right">
        <Tooltip title={isDark ? "切换亮色模式" : "切换暗色模式"}>
          <button type="button" className="hb-icon-btn" onClick={toggleDark}>
            <Icon name={isDark ? "sun" : "moon"} size={16} />
          </button>
        </Tooltip>
        <Popover content={notiContent} trigger="click" placement="bottomRight">
          <Badge count={notifyCount} size="small" offset={[-4, 4]}>
            <button type="button" className="hb-icon-btn">
              <Icon name="bell" size={16} />
            </button>
          </Badge>
        </Popover>
        <Divider type="vertical" />
        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: ({ key }) => message.info(`演示操作：${userMenuLabels[key] || key}`),
          }}
          placement="bottomRight"
        >
          <button type="button" className="hb-user">
            <Avatar size={28} src="./assets/uploads/user.png" />
            <span className="hb-user-name">陈志远</span>
            <Icon name="chevron-down" size={14} />
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
