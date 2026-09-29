import Accordion from "@nce/eview-react/Accordion";
import TipBox from "@nce/eview-react/TipBox";
import { LineProgress } from "../../components/progress/index.jsx";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { sideMenu } from "../../mock/workorder.js";
import "./index.css";

// Layer 4: 侧边导航 — 使用 Accordion 组件承载多级导航
export default function SideNav() {
  const { navCollapsed, toggleNav, setNavCollapsed, activeSideKey, setActiveSideKey } = useApp();

  const menuData = sideMenu.map((group) => {
    const base = {
      title: group.label,
      value: group.key,
      icon: <Icon name={group.icon} size="1rem" />,
    };
    if (!group.children) return base;
    return {
      ...base,
      children: group.children.map((child) => ({ title: child.label, value: child.key })),
    };
  });

  const handleMenuClick = (node) => {
    if (node && node.value && (!node.children || !node.children.length)) {
      setActiveSideKey(node.value);
    }
  };

  return (
    <aside className={`side-nav ${navCollapsed ? "side-nav--collapsed" : ""}`}>
      <div className="side-nav__top">
        {navCollapsed ? null : (
          <span className="side-nav__caption">
            <Icon name="square-menu" size="0.875rem" />
            工作台导航
          </span>
        )}
        <TipBox type="simple" content={navCollapsed ? "展开导航" : "收起导航"} direction="right">
          <button type="button" className="side-nav__toggle" onClick={toggleNav}>
            <Icon name={navCollapsed ? "panel-left-open" : "panel-left-close"} size="1rem" />
          </button>
        </TipBox>
      </div>

      <div className="side-nav__menu">
        <Accordion
          data={menuData}
          selectedValue={activeSideKey}
          onClick={handleMenuClick}
          expanded={navCollapsed}
          onExpand={(flag) => setNavCollapsed(!flag)}
          hideTitleBar
          enableExpand
          enableMultiOpen
          keepExpandState
        />
      </div>

      {navCollapsed ? null : (
        <div className="side-nav__foot">
          <div className="quota">
            <div className="quota__head">
              <span className="quota__title">本月巡检额度</span>
              <span className="quota__value">86%</span>
            </div>
            <LineProgress percent={86} showInfo={false} size="small" strokeColor="var(--primary)" />
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
