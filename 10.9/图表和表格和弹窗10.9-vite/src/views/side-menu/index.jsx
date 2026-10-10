import { useState } from "react";
import Accordion from "@nce/eview-react/Accordion";
import { menuItems } from "../../mock/dashboard.jsx";
import "./index.css";

function toAccordionData(list) {
  return list.map((it) => ({
    value: it.key,
    title: it.label,
    icon: it.icon,
    children: it.children
      ? it.children.map((c) => ({ value: c.key, title: c.label }))
      : undefined,
  }));
}

export default function SideMenu({ collapsed }) {
  const [selectedValue, setSelectedValue] = useState("dashboard");

  const handleClick = (node) => {
    const item = node;
    if (!item.children || item.children.length === 0) {
      if (item.value) setSelectedValue(item.value);
    }
  };

  return (
    <aside className={"side-menu" + (collapsed ? " is-collapsed" : "")}>
      <Accordion
        data={toAccordionData(menuItems)}
        selectedValue={selectedValue}
        onClick={handleClick}
        enableExpand={false}
        hideIcons
        hideTitleBar
        style={{ height: "100%" }}
      />
    </aside>
  );
}
