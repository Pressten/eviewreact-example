// ① 顶部导航：平台 Logo / 导航（店铺·商品·营销·装修）/ 店铺切换下拉 / 发布状态 Tag / 用户区
// 顶部导航栏按规范自写原生 nav（不使用 Menu 组件）
import { useState } from "react";
import { IconPlusIcHuaweiCloudStoreNew, IconPlusIcIctLogOut, IconPlusIcPublicAlarmClock, IconPlusIcPublicCheckmark, IconPlusIcPublicChevronDown, IconPlusIcPublicHorn, IconPlusIcPublicMoon, IconPlusIcPublicNotice, IconPlusIcPublicPaintbrush, IconPlusIcPublicPerson, IconPlusIcPublicSecurity, IconPlusIcPublicShoppingBag, IconPlusIcPublicSuccess, IconPlusIcPublicSun } from '@hui/icon-plus';
import Badge from "@nce/eview-react/Badge";
import AppDropdown from "@/shared/AppDropdown";
import Tag from "@/shared/Tag";
import { toast } from "@/shared/AppToast";
import Icon from "@/shared/Icon";
import { useApp, useDecoration } from "../../context.jsx";
import "./index.css";

const NAV_ITEMS = [
  { key: "store", label: "店铺", icon: <IconPlusIcHuaweiCloudStoreNew iconSize="1rem" iconColor={['currentcolor']} /> },
  { key: "goods", label: "商品", icon: <IconPlusIcPublicShoppingBag iconSize="1rem" iconColor={['currentcolor']} /> },
  { key: "marketing", label: "营销", icon: <IconPlusIcPublicHorn iconSize="1rem" iconColor={['currentcolor']} /> },
  { key: "decoration", label: "装修", icon: <IconPlusIcPublicPaintbrush iconSize="1rem" iconColor={['currentcolor']} /> },
];

const STORES = [
  { key: "digital", name: "潮品数码旗舰店", role: "主店铺" },
  { key: "life", name: "潮品生活馆", role: "子店铺" },
  { key: "baby", name: "潮品母婴专营店", role: "子店铺" },
];

// 站内消息（点击标记已读，角标实时减少）
const NOTICE_ITEMS = [
  { id: "n-01", icon: <IconPlusIcPublicCheckmark iconSize="0.875rem" iconColor={['currentcolor']} />, title: "「双11主会场轮播」素材审核已通过，可用于发布", time: "10 分钟前" },
  { id: "n-02", icon: <IconPlusIcPublicAlarmClock iconSize="0.875rem" iconColor={['currentcolor']} />, title: "「满减神券提醒」将于 10-28 10:00 自动上线，请确认素材就绪", time: "1 小时前" },
  { id: "n-03", icon: <IconPlusIcPublicHorn iconSize="0.875rem" iconColor={['currentcolor']} />, title: "大促指挥部：请于 10-30 前完成全部页面装修发布", time: "昨天 20:15" },
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
        icon: n.icon,
        label: (
          <span className={`notice-item ${readNoticeIds.includes(n.id) ? "notice-item-read" : ""}`}>
            <span className="notice-title">{n.title}</span>
            <span className="notice-time">{n.time}</span>
          </span>
        ),
      })),
      { type: "divider" },
      { key: "all-read", icon: <IconPlusIcPublicSuccess iconSize="0.875rem" iconColor={['currentcolor']} />, label: "全部标记已读" },
    ],
    onClick: ({ key }) => {
      if (key === "all-read") {
        setReadNoticeIds(NOTICE_ITEMS.map((n) => n.id));
        toast.success("全部消息已标记为已读");
      } else {
        setReadNoticeIds((prev) => (prev.includes(key) ? prev : [...prev, key]));
      }
    },
  };

  const storeMenu = {
    items: STORES.map((s) => ({
      key: s.key,
      icon: <IconPlusIcHuaweiCloudStoreNew iconSize="0.875rem" iconColor={['currentcolor']} />,
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
      toast.success(`已切换至「${target.name}」`);
    },
  };

  const userMenu = {
    items: [
      { key: "profile", icon: <IconPlusIcPublicPerson iconSize="0.875rem" iconColor={['currentcolor']} />, label: "个人设置" },
      { key: "security", icon: <IconPlusIcPublicSecurity iconSize="0.875rem" iconColor={['currentcolor']} />, label: "账号安全" },
      { type: "divider" },
      { key: "logout", icon: <IconPlusIcIctLogOut iconSize="0.875rem" iconColor={['currentcolor']} />, label: "退出登录" },
    ],
    onClick: ({ key }) => {
      if (key === "logout") toast.info("已退出登录（演示环境）");
      else toast.info("功能建设中（演示环境）");
    },
  };

  return (
    <header className="top-nav">
      <div className="top-nav-brand">
        <Icon src="/uploads/logo.svg" size="1.5rem" />
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
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="top-nav-tools">
        <AppDropdown menu={storeMenu} placement="bottomRight" trigger={["click"]}>
          <span className="store-switcher" title="切换店铺">
            <IconPlusIcHuaweiCloudStoreNew iconSize="0.875rem" iconColor={['currentcolor']} />
            <span className="store-switcher-name">{store.name}</span>
            <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} className="store-caret" />
          </span>
        </AppDropdown>

        <Tag className="pub-tag" color={hasUnpublished ? "orange" : "green"} bordered={false}>
          <span className={`pub-dot ${hasUnpublished ? "pub-dot-pulse" : ""}`} />
          {hasUnpublished ? "未发布更改" : "已发布"}
        </Tag>

        <AppDropdown menu={noticeMenu} placement="bottomRight" trigger={["click"]}>
          <span className="nav-tool-bell" title="消息通知">
            <Badge content={unreadCount} offset={[4, -4]}>
              <IconPlusIcPublicNotice iconSize="1.25rem" iconColor={['currentcolor']} className="bell-icon" />
            </Badge>
          </span>
        </AppDropdown>

        {isDark ? <IconPlusIcPublicSun iconSize="1.25rem" iconColor={['currentcolor']} className="nav-tool-icon" /> : <IconPlusIcPublicMoon iconSize="1.25rem" iconColor={['currentcolor']} className="nav-tool-icon" />}

        <AppDropdown menu={userMenu} placement="bottomRight" trigger={["click"]}>
          <span className="user-chip" title="账号菜单">
            <img src="/uploads/user.png" alt="用户头像" className="user-avatar" />
            <span className="user-name">李婉晴</span>
            <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} className="user-caret" />
          </span>
        </AppDropdown>
      </div>
    </header>
  );
}
