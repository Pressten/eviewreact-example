// ① 顶部导航：平台 Logo / 导航（店铺·商品·营销·装修）/ 店铺切换下拉 / 发布状态 Tag / 用户区
// 顶部导航栏按规范自写原生 nav（不使用 Menu 组件）
import { useState } from "react";
import { Badge, Dropdown, Tag, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp, useDecoration } from "../../context.jsx";
import "./index.css";

const NAV_ITEMS = [
  { key: "store", label: "店铺", icon: "store" },
  { key: "goods", label: "商品", icon: "shopping-bag" },
  { key: "marketing", label: "营销", icon: "megaphone" },
  { key: "decoration", label: "装修", icon: "paintbrush" },
];

const STORES = [
  { key: "digital", name: "潮品数码旗舰店", role: "主店铺" },
  { key: "life", name: "潮品生活馆", role: "子店铺" },
  { key: "baby", name: "潮品母婴专营店", role: "子店铺" },
];

// 站内消息（点击标记已读，角标实时减少）
const NOTICE_ITEMS = [
  { id: "n-01", icon: "circle-check", title: "「双11主会场轮播」素材审核已通过，可用于发布", time: "10 分钟前" },
  { id: "n-02", icon: "alarm-clock", title: "「满减神券提醒」将于 10-28 10:00 自动上线，请确认素材就绪", time: "1 小时前" },
  { id: "n-03", icon: "megaphone", title: "大促指挥部：请于 10-30 前完成全部页面装修发布", time: "昨天 20:15" },
];

export default function TopNav() {
  const { isDark, toggleDark } = useApp();
  const { hasUnpublished } = useDecoration();
  const [activeNav, setActiveNav] = useState("decoration");
  const [storeKey, setStoreKey] = useState("digital");
  const [readNoticeIds, setReadNoticeIds] = useState([]);
  const store = STORES.find((s) => s.key === storeKey);
  const unreadCount = NOTICE_ITEMS.filter((n) => !readNoticeIds.includes(n.id)).length;

  const noticeMenu = {
    items: [
      ...NOTICE_ITEMS.map((n) => ({
        key: n.id,
        icon: <Icon name={n.icon} size="0.875rem" />,
        label: (
          <span className={`notice-item ${readNoticeIds.includes(n.id) ? "notice-item-read" : ""}`}>
            <span className="notice-title">{n.title}</span>
            <span className="notice-time">{n.time}</span>
          </span>
        ),
      })),
      { type: "divider" },
      { key: "all-read", icon: <Icon name="circle-check-big" size="0.875rem" />, label: "全部标记已读" },
    ],
    onClick: ({ key }) => {
      if (key === "all-read") {
        setReadNoticeIds(NOTICE_ITEMS.map((n) => n.id));
        message.success("全部消息已标记为已读");
      } else {
        setReadNoticeIds((prev) => (prev.includes(key) ? prev : [...prev, key]));
      }
    },
  };

  const storeMenu = {
    items: STORES.map((s) => ({
      key: s.key,
      icon: <Icon name="store" size="0.875rem" />,
      label: (
        <span className="store-menu-item">
          <span className="store-menu-name">{s.name}</span>
          <span className="store-menu-role">{s.role}</span>
        </span>
      ),
    })),
    selectedKeys: [storeKey],
    onClick: ({ key }) => {
      const target = STORES.find((s) => s.key === key);
      setStoreKey(key);
      message.success(`已切换至「${target.name}」`);
    },
  };

  const userMenu = {
    items: [
      { key: "profile", icon: <Icon name="user-round" size="0.875rem" />, label: "个人设置" },
      { key: "security", icon: <Icon name="shield-check" size="0.875rem" />, label: "账号安全" },
      { type: "divider" },
      { key: "logout", icon: <Icon name="log-out" size="0.875rem" />, label: "退出登录" },
    ],
    onClick: ({ key }) => {
      if (key === "logout") message.info("已退出登录（演示环境）");
      else message.info("功能建设中（演示环境）");
    },
  };

  return (
    <header className="top-nav">
      <div className="top-nav-brand">
        <Icon src="./assets/uploads/logo.svg" size="1.5rem" />
        <span className="brand-name">云铺商城</span>
        <span className="brand-suffix">装修工作台</span>
      </div>

      <nav className="top-nav-menu">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.key}
            className={`nav-item ${activeNav === item.key ? "nav-item-active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveNav(item.key);
            }}
            href="#"
          >
            <Icon name={item.icon} size="1rem" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="top-nav-tools">
        <Dropdown menu={storeMenu} placement="bottomRight" trigger={["click"]}>
          <span className="store-switcher" title="切换店铺">
            <Icon name="store" size="0.875rem" />
            <span className="store-switcher-name">{store.name}</span>
            <Icon name="chevron-down" size="0.875rem" className="store-caret" />
          </span>
        </Dropdown>

        <Tag className="pub-tag" color={hasUnpublished ? "orange" : "green"} bordered={false}>
          <span className={`pub-dot ${hasUnpublished ? "pub-dot-pulse" : ""}`} />
          {hasUnpublished ? "未发布更改" : "已发布"}
        </Tag>

        <Dropdown menu={noticeMenu} placement="bottomRight" trigger={["click"]}>
          <span className="nav-tool-bell" title="消息通知">
            <Badge count={unreadCount} size="small" offset={[4, -4]}>
              <Icon name="bell" size="1.25rem" className="bell-icon" />
            </Badge>
          </span>
        </Dropdown>

        <Icon
          name={isDark ? "sun" : "moon"}
          size="1.25rem"
          className="nav-tool-icon"
          onClick={toggleDark}
          title={isDark ? "切换为浅色主题" : "切换为深色主题"}
        />

        <Dropdown menu={userMenu} placement="bottomRight" trigger={["click"]}>
          <span className="user-chip" title="账号菜单">
            <img src="./assets/uploads/user.png" alt="用户头像" className="user-avatar" />
            <span className="user-name">李婉晴</span>
            <Icon name="chevron-down" size="0.875rem" className="user-caret" />
          </span>
        </Dropdown>
      </div>
    </header>
  );
}
