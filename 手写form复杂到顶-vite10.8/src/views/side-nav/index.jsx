import Accordion from "@nce/eview-react/Accordion";
import TipBox from "@nce/eview-react/TipBox";
import { IconPlusIcDigitalPowerDpMenu, IconPlusIcPublicHeadphones, IconPlusIcPublicTransverseRectangleTemplate } from "@nce/icon-plus";
import { useApp } from "../../context.jsx";
import { sideMenu } from "../../mock/workorder.jsx";
import "./index.css";

export default function SideNav() {
  const { navCollapsed, toggleNav, activeSideKey, setActiveSideKey } = useApp();

  const data = sideMenu.map((group) => {
    const base = {
      value: group.key,
      title: group.label,
      icon: group.icon,
    };
    if (!group.children) return base;
    return {
      ...base,
      children: group.children.map((child) => ({ value: child.key, title: child.label })),
    };
  });

  const handleMenuClick = (node) => {
    if ((!node.children || node.children.length === 0) && node.value) {
      setActiveSideKey(node.value);
    }
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
            <IconPlusIcPublicTransverseRectangleTemplate iconSize="1rem" iconColor={['currentcolor']} />
          </button>
        </TipBox>
      </div>

      <div className="side-nav__menu">
        <Accordion
          data={data}
          selectedValue={activeSideKey}
          onClick={handleMenuClick}
          expanded={navCollapsed}
          onExpand={() => toggleNav()}
          enableMultiOpen
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
            <div className="app-progress">
              <div className="app-progress__bar" style={{ width: "86%", background: "var(--primary)" }} />
            </div>
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
