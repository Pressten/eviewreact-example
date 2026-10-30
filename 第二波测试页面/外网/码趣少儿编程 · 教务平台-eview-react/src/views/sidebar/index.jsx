// Layer 4: 侧边导航（教务系统模块菜单）
import Accordion from "@nce/eview-react/Accordion";
import { IconPlusIcPublicDashboard, IconPlusIcCarUser, IconPlusIcPublicBuilding, IconPlusIcPublicBook, IconPlusIcPublicCalendar, IconPlusIcPublicChart, IconPlusIcPublicCreditcard, IconPlusIcPublicImage, IconPlusIcPublicChartBar, IconPlusIcPublicStudy } from '@hui/icon-plus';
import "./index.css";

const ITEMS = [
  { value: "dashboard", icon: <IconPlusIcPublicDashboard iconSize="0.875rem" iconColor={['currentcolor']} />, title: "工作台" },
  { value: "students", icon: <IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} />, title: "学员管理" },
  { value: "classes", icon: <IconPlusIcPublicBuilding iconSize="0.875rem" iconColor={['currentcolor']} />, title: "班级管理" },
  { value: "courses", icon: <IconPlusIcPublicBook iconSize="0.875rem" iconColor={['currentcolor']} />, title: "课程管理" },
  { value: "schedule", icon: <IconPlusIcPublicCalendar iconSize="0.875rem" iconColor={['currentcolor']} />, title: "排课管理" },
  { value: "teachers", icon: <IconPlusIcPublicChart iconSize="0.875rem" iconColor={['currentcolor']} />, title: "教师管理" },
  { value: "finance", icon: <IconPlusIcPublicCreditcard iconSize="0.875rem" iconColor={['currentcolor']} />, title: "缴费管理" },
  { value: "gallery", icon: <IconPlusIcPublicImage iconSize="0.875rem" iconColor={['currentcolor']} />, title: "作品墙" },
  { value: "stats", icon: <IconPlusIcPublicChartBar iconSize="0.875rem" iconColor={['currentcolor']} />, title: "数据统计" },
];

export default function Sidebar({ collapsed }) {
  return (
    <aside className={"app-sidebar" + (collapsed ? " is-collapsed" : "")}>
      <div className="app-sidebar__brand">
        <IconPlusIcPublicStudy iconSize="1.5rem" iconColor={['#0067D1']} />
        {!collapsed && <span className="app-sidebar__brand-text">码趣教务</span>}
      </div>
      <Accordion
        data={ITEMS}
        selectedValue="students"
        onClick={(_node) => {}}
        expanded={collapsed}
        onExpand={(flag) => {}}
        className="app-sidebar__menu"
        hideTitleBar
      />
    </aside>
  );
}
