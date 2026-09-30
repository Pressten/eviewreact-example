import Accordion from "@nce/eview-react/Accordion";
import Button from "@nce/eview-react/Button";
import TipBox from "@nce/eview-react/TipBox";
import {
  IconPlusIcPublicHome2,
  IconPlusIcHuaweiCloudDatabase,
  IconPlusIcDevBranch,
  IconPlusIcPublicSecurity,
  IconPlusIcPublicClipboard,
  IconPlusIcPublicSetting,
  IconPlusIcPublicMenuExpansion,
  IconPlusIcPublicMenuCollapse,
} from "@nce/icon-plus";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 侧边菜单栏 — 248px 展开 / 48px 收起
const isLeaf = (node) => !node?.children || node.children.length === 0;

export default function SideNav() {
  const { collapsed, toggleCollapsed, setCollapsed, activeNav, setActiveNav } = useApp();

  const menuData = [
    {
      title: "数据工作台",
      value: "workbench",
      icon: <IconPlusIcPublicHome2 iconSize="1rem" iconColor={["currentcolor"]} />,
    },
    {
      title: "数据管理",
      value: "data",
      icon: <IconPlusIcHuaweiCloudDatabase iconSize="1rem" iconColor={["currentcolor"]} />,
      isExpand: true,
      children: [
        { title: "数据源管理", value: "datasource" },
        { title: "数据集管理", value: "dataset" },
        { title: "数据字典", value: "dictionary" },
        { title: "数据血缘", value: "lineage" },
        { title: "回收站", value: "recycle" },
      ],
    },
    {
      title: "任务调度",
      value: "schedule",
      icon: <IconPlusIcDevBranch iconSize="1rem" iconColor={["currentcolor"]} />,
      isExpand: true,
      children: [
        { title: "同步任务", value: "sync-task" },
        { title: "校验任务", value: "check-task" },
        { title: "调度日志", value: "task-log" },
      ],
    },
    {
      title: "质量监控",
      value: "quality",
      icon: <IconPlusIcPublicSecurity iconSize="1rem" iconColor={["currentcolor"]} />,
    },
    {
      title: "操作审计",
      value: "audit",
      icon: <IconPlusIcPublicClipboard iconSize="1rem" iconColor={["currentcolor"]} />,
    },
    {
      title: "系统设置",
      value: "setting",
      icon: <IconPlusIcPublicSetting iconSize="1rem" iconColor={["currentcolor"]} />,
    },
  ];

  const handleMenuClick = (node) => {
    if (isLeaf(node) && node.value) {
      setActiveNav(node.value);
    }
  };

  return (
    <aside className={`side-nav${collapsed ? " is-collapsed" : ""}`}>
      <div className="side-nav__scroll">
        {!collapsed && <div className="side-nav__caption">数据资产中心</div>}
        <Accordion
          data={menuData}
          selectedValue={activeNav}
          onClick={handleMenuClick}
          hideTitleBar
          enableExpand
          enableMultiOpen
          expanded={collapsed}
          onExpand={(flag) => setCollapsed(!flag)}
          style={{ height: "100%" }}
        />
      </div>
      <div className="side-nav__foot">
        <TipBox type="simple" content={collapsed ? "展开菜单" : "收起菜单"} direction="right">
          <Button
            status="text"
            style={{ width: collapsed ? undefined : "100%" }}
            leftIcon={
              collapsed ? (
                <IconPlusIcPublicMenuExpansion iconSize="1rem" iconColor={["currentcolor"]} />
              ) : (
                <IconPlusIcPublicMenuCollapse iconSize="1rem" iconColor={["currentcolor"]} />
              )
            }
            text={collapsed ? "" : "收起菜单"}
            onClick={toggleCollapsed}
          />
        </TipBox>
      </div>
    </aside>
  );
}
