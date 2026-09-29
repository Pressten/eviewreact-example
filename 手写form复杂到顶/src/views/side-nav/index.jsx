import { useState } from "react";
import { Menu, Progress, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { sideMenu } from "../../mock/workorder.js";
import "./index.css";

// Layer 4: 侧边导航 — 使用 Menu 组件承载多级导航
export default function SideNav() {
  const { navCollapsed, toggleNav, activeSideKey, setActiveSideKey } = useApp();
  const [openKeys, setOpenKeys] = useState(["grp-order", "grp-device"]);

  const items = sideMenu.map((group) => {
    const base = {
      key: group.key,
      icon: <Icon name={group.icon} size="1rem" />,
      label: group.label,
    };
    if (!group.children) return base;
    return {
      ...base,
      children: group.children.map((child) => ({ key: child.key, label: child.label })),
    };
  });

  return (
    <aside className={`side-nav ${navCollapsed ? "side-nav--collapsed" : ""}`}>
      <div className="side-nav__top">
        {navCollapsed ? null : (
          <span className="side-nav__caption">
            <Icon name="square-menu" size="0.875rem" />
            工作台导航
          </span>
        )}
        <Tooltip title={navCollapsed ? "展开导航" : "收起导航"} placement="right">
          <button type="button" className="side-nav__toggle" onClick={toggleNav}>
            <Icon name={navCollapsed ? "panel-left-open" : "panel-left-close"} size="1rem" />
          </button>
        </Tooltip>
      </div>

      <div className="side-nav__menu">
        <Menu
          mode="inline"
          theme="light"
          inlineCollapsed={navCollapsed}
          selectedKeys={[activeSideKey]}
          openKeys={navCollapsed ? [] : openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          onClick={({ key }) => setActiveSideKey(key)}
          items={items}
        />
      </div>

      {navCollapsed ? null : (
        <div className="side-nav__foot">
          <div className="quota">
            <div className="quota__head">
              <span className="quota__title">本月巡检额度</span>
              <span className="quota__value">86%</span>
            </div>
            <Progress percent={86} showInfo={false} size="small" strokeColor="var(--primary)" />
            <p className="quota__desc">已完成 172 / 200 次巡检，剩余 5 天</p>
          </div>
          <a className="side-nav__help">
            <Icon name="headphones" size="0.875rem" />
            运维值班热线 400-820-1120
          </a>
        </div>
      )}
    </aside>
  );
}
