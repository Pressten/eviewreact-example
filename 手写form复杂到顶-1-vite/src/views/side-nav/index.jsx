import Accordion from "@nce/eview-react/Accordion";
import { IconPlusIcDigitalPowerDpMenu, IconPlusIcPublicBox, IconPlusIcPublicExpand, IconPlusIcPublicHeadphones } from '@nce/icon-plus';
import TipBox from "@nce/eview-react/TipBox";
import AppProgress from "../../components/app-progress/index.jsx";
import { useApp } from "../../context.jsx";
import { sideMenu } from "../../mock/workorder.jsx";
import "./index.css";

const INITIAL_OPEN_KEYS = ["grp-order", "grp-device"];

// Layer 4: 侧边导航 — 使用 Accordion 组件承载多级导航
export default function SideNav() {
  const { navCollapsed, setNavCollapsed, toggleNav, activeSideKey, setActiveSideKey } = useApp();

  const items = sideMenu.map((group) => {
    const base = {
      title: group.label,
      value: group.key,
      icon: group.icon,
      isExpand: INITIAL_OPEN_KEYS.includes(group.key),
    };
    if (!group.children) return base;
    return {
      ...base,
      children: group.children.map((child) => ({ title: child.label, value: child.key })),
    };
  });

  const handleMenuClick = (node) => {
    if (node && node.value) setActiveSideKey(node.value);
  };

  return (
    <aside className={`side-nav ${navCollapsed ? "side-nav--collapsed" : ""}`}>
      <div className="side-nav__top">
        {navCollapsed ? null : (
          <span className="side-nav__caption">
            <IconPlusIcDigitalPowerDpMenu iconSize="0.875rem" iconColor={['currentcolor']} />
            工作台导航
          </span>
        )}
        <TipBox type="simple" content={navCollapsed ? "展开导航" : "收起导航"} direction="right">
          <button type="button" className="side-nav__toggle" onClick={toggleNav}>
            {navCollapsed ? <IconPlusIcPublicExpand iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicBox iconSize="1rem" iconColor={['currentcolor']} />}
          </button>
        </TipBox>
      </div>

      <div className="side-nav__menu">
        <Accordion
          data={items}
          selectedValue={activeSideKey}
          onClick={handleMenuClick}
          enableExpand
          enableMultiOpen
          keepExpandState
          expanded={navCollapsed}
          onExpand={(flag) => setNavCollapsed(!flag)}
          hideTitleBar
        />
      </div>

      {navCollapsed ? null : (
        <div className="side-nav__foot">
          <div className="quota">
            <div className="quota__head">
              <span className="quota__title">本月巡检额度</span>
              <span className="quota__value">86%</span>
            </div>
            <AppProgress percent={86} strokeColor="var(--primary)" />
            <p className="quota__desc">已完成 172 / 200 次巡检，剩余 5 天</p>
          </div>
          <a className="side-nav__help">
            <IconPlusIcPublicHeadphones iconSize="0.875rem" iconColor={['currentcolor']} />
            运维值班热线 400-820-1120
          </a>
        </div>
      )}
    </aside>
  );
}
