import { useState } from "react";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import TipBox from "@nce/eview-react/TipBox";
import {
  IconPlusIcHuaweiCloudDatabase,
  IconPlusIcPublicQuestionmarkCircle,
  IconPlusIcPublicBellClock,
  IconPlusIcPublicSun,
  IconPlusIcPublicMoon,
  IconPlusIcPublicChevronDown,
} from "@nce/icon-plus";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 顶部导航栏 — 品牌 / 主导航 / 全局工具区
const NAV_ITEMS = [
  { key: "workbench", label: "工作台" },
  { key: "data", label: "数据管理" },
  { key: "service", label: "数据服务" },
  { key: "quality", label: "质量监控" },
  { key: "admin", label: "系统管理" },
];

export default function HeaderBar() {
  const { isDark, toggleDark } = useApp();
  const [active, setActive] = useState("data");

  return (
    <header className="header-bar">
      <div className="header-bar__brand">
        <span className="header-bar__logo">
          <IconPlusIcHuaweiCloudDatabase iconSize="1rem" iconColor={["#FFFFFF"]} />
        </span>
        <span className="header-bar__name">云数据资产管理平台</span>
      </div>

      <nav className="header-bar__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`app-nav-item${active === item.key ? " active" : ""}`}
            onClick={() => setActive(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-bar__tools">
        <IconButton
          iconName={<IconPlusIcPublicQuestionmarkCircle iconSize="1rem" iconColor={["currentcolor"]} />}
          tipText="帮助中心"
        />
        <IconButton
          iconName={<IconPlusIcPublicBellClock iconSize="1rem" iconColor={["currentcolor"]} />}
          tipText="通知"
        />
        <IconButton
          iconName={
            isDark ? (
              <IconPlusIcPublicSun iconSize="1rem" iconColor={["currentcolor"]} />
            ) : (
              <IconPlusIcPublicMoon iconSize="1rem" iconColor={["currentcolor"]} />
            )
          }
          tipText={isDark ? "切换浅色" : "切换深色"}
          onClick={toggleDark}
        />
        <TipBox
          trigger="click"
          direction="bottomRight"
          isMouseLeaveClose
          content={
            <div className="app-dropdown-menu">
              <button type="button" className="app-dropdown-item">个人中心</button>
              <button type="button" className="app-dropdown-item">切换角色</button>
              <button type="button" className="app-dropdown-item">偏好设置</button>
              <div className="app-dropdown-divider" />
              <button type="button" className="app-dropdown-item app-dropdown-item--danger">退出登录</button>
            </div>
          }
        >
          <button type="button" className="header-bar__user">
            <img className="header-bar__avatar" src="./assets/uploads/user.png" alt="" />
            <span className="header-bar__username">张伟</span>
            <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={["currentcolor"]} className="header-bar__caret" />
          </button>
        </TipBox>
      </div>
    </header>
  );
}
