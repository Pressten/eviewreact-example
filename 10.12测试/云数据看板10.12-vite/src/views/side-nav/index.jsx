import Accordion from "@nce/eview-react/Accordion";
import TipBox from "@nce/eview-react/TipBox";
import { IconPlusIcPublicMenuCollapse, IconPlusIcPublicMenuExpansion } from '@nce/icon-plus';
import { useApp } from "../../context.jsx";
import { sideMenu } from "../../mock/dashboard.jsx";
import "./index.css";

function toAccordionData(nodes) {
  return nodes.map((n) => ({
    value: n.key,
    title: n.label,
    icon: n.icon,
    isExpand: n.key === "resource" || n.key === "alarm",
    children: n.children
      ? n.children.map((c) => ({ value: c.key, title: c.label }))
      : undefined,
  }));
}

export default function SideNav() {
  const { navCollapsed, toggleNav, activeNav, setActiveNav } = useApp();

  const handleMenuClick = (node) => {
    if (node && node.value && (!node.children || node.children.length === 0)) {
      setActiveNav(node.value);
    }
  };

  return (
    <aside className={`side-nav ${navCollapsed ? "is-collapsed" : ""}`}>
      <div className="side-nav__scroll">
        <Accordion
          className="side-nav__menu"
          data={toAccordionData(sideMenu)}
          selectedValue={activeNav}
          onClick={handleMenuClick}
          expanded={navCollapsed}
          onExpand={(flag) => {
            if (flag === navCollapsed) toggleNav();
          }}
          hideTitleBar
          enableExpand={false}
          hideIcons
        />
      </div>

      <div className="side-nav__foot">
        <TipBox type="simple" content={navCollapsed ? "展开导航" : "收起导航"} direction="right">
          <button type="button" className="side-nav__collapse" onClick={toggleNav}>
            {navCollapsed ? <IconPlusIcPublicMenuExpansion iconSize="1rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMenuCollapse iconSize="1rem" iconColor={['currentcolor']} />}
            {!navCollapsed ? <span>收起导航</span> : null}
          </button>
        </TipBox>
      </div>
    </aside>
  );
}
