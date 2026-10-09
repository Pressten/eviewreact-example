import { useState } from "react";
import { Menu, Button, Dropdown, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
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

const USER_MENU = {
  items: [
    { key: "profile", label: "个人中心" },
    { key: "role", label: "切换角色" },
    { key: "setting", label: "偏好设置" },
    { type: "divider" },
    { key: "logout", label: "退出登录" },
  ],
};

export default function HeaderBar() {
  const { isDark, toggleDark } = useApp();
  const [active, setActive] = useState("data");

  return (
    <header className="header-bar">
      <div className="header-bar__brand">
        <span className="header-bar__logo">
          <Icon name="database" size="1rem" color="#FFFFFF" />
        </span>
        <span className="header-bar__name">云数据资产管理平台</span>
      </div>

      <nav className="header-bar__nav">
        <Menu
          mode="horizontal"
          selectedKeys={[active]}
          items={NAV_ITEMS}
          onClick={(e) => setActive(e.key)}
        />
      </nav>

      <div className="header-bar__tools">
        <Tooltip title="帮助中心">
          <Button type="text" shape="circle" icon={<Icon name="circle-question-mark" size="1rem" />} />
        </Tooltip>
        <Tooltip title="通知">
          <Button type="text" shape="circle" icon={<Icon name="bell" size="1rem" />} />
        </Tooltip>
        <Tooltip title={isDark ? "切换浅色" : "切换深色"}>
          <Button
            type="text"
            shape="circle"
            icon={<Icon name={isDark ? "sun" : "moon"} size="1rem" />}
            onClick={toggleDark}
          />
        </Tooltip>
        <Dropdown menu={USER_MENU} trigger={["click"]} placement="bottomRight">
          <button type="button" className="header-bar__user">
            <img className="header-bar__avatar" src="./assets/uploads/user.png" alt="" />
            <span className="header-bar__username">张伟</span>
            <Icon name="chevron-down" size="0.875rem" className="header-bar__caret" />
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
