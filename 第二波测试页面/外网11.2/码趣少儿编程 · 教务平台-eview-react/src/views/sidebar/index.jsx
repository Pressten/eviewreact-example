// Layer 4: 侧边导航（教务系统模块菜单）
import Accordion from "@nce/eview-react/Accordion";
import { IconPlusIcPublicImage, IconPlusIcPublicDashboard, IconPlusIcDigitalPowerDpUserCluster, IconPlusIcIctCampusView, IconPlusIcPublicBook, IconPlusIcPublicCalendar, IconPlusIcPublicProjector, IconPlusIcPublicMoneyCircle, IconPlusIcPublicChart, IconPlusIcIctTrophy } from '@hui/icon-plus';
import "./index.css";

const ITEMS = [
  { key: "dashboard", icon: <IconPlusIcPublicDashboard iconSize="0.875rem" iconColor={['currentcolor']} />, label: "工作台" },
  { key: "students", icon: <IconPlusIcDigitalPowerDpUserCluster iconSize="0.875rem" iconColor={['currentcolor']} />, label: "学员管理" },
  { key: "classes", icon: <IconPlusIcIctCampusView iconSize="0.875rem" iconColor={['currentcolor']} />, label: "班级管理" },
  { key: "courses", icon: <IconPlusIcPublicBook iconSize="0.875rem" iconColor={['currentcolor']} />, label: "课程管理" },
  { key: "schedule", icon: <IconPlusIcPublicCalendar iconSize="0.875rem" iconColor={['currentcolor']} />, label: "排课管理" },
  { key: "teachers", icon: <IconPlusIcPublicProjector iconSize="0.875rem" iconColor={['currentcolor']} />, label: "教师管理" },
  { key: "finance", icon: <IconPlusIcPublicMoneyCircle iconSize="0.875rem" iconColor={['currentcolor']} />, label: "缴费管理" },
  { key: "gallery", icon: <IconPlusIcPublicImage iconSize="0.875rem" iconColor={['currentcolor']} />, label: "作品墙" },
  { key: "stats", icon: <IconPlusIcPublicChart iconSize="0.875rem" iconColor={['currentcolor']} />, label: "数据统计" },
];

export default function Sidebar({ collapsed }) {
  return (
    <aside className={"app-sidebar" + (collapsed ? " is-collapsed" : "")}>
      <div className="app-sidebar__brand">
        <IconPlusIcIctTrophy iconSize="1.5rem" iconColor={['#0067D1']} />
        {!collapsed && <span className="app-sidebar__brand-text">码趣教务</span>}
      </div>
      <Accordion
        data={ITEMS.map(item => ({ value: item.key, title: item.label, icon: item.icon }))}
        selectedValue="students"
        expanded={collapsed}
        enableExpand={false}
        hideIcons={true}
        hideTitleBar={true}
        className="app-sidebar__menu"
      />
    </aside>
  );
}
