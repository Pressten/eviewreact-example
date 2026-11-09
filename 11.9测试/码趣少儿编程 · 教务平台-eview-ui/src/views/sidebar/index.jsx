// TODO(eview-ui): antd Menu → eview-ui Accordion 时 icon 字段是 url 字符串，
// 与保留的 <Icon> shim 类型不匹配；改为手写侧边导航以保留图标渲染。
import Icon from "@/shared/Icon";
import "./index.css";

const ITEMS = [
  { key: "dashboard", icon: "layout-dashboard", label: "工作台" },
  { key: "students", icon: "users", label: "学员管理" },
  { key: "classes", icon: "school", label: "班级管理" },
  { key: "courses", icon: "book-open", label: "课程管理" },
  { key: "schedule", icon: "calendar-days", label: "排课管理" },
  { key: "teachers", icon: "presentation", label: "教师管理" },
  { key: "finance", icon: "wallet", label: "缴费管理" },
  { key: "gallery", icon: "image", label: "作品墙" },
  { key: "stats", icon: "chart-column", label: "数据统计" },
];

export default function Sidebar({ collapsed }) {
  return (
    <aside className={"app-sidebar" + (collapsed ? " is-collapsed" : "")}>
      <div className="app-sidebar__brand">
        <Icon name="graduation-cap" size="1.5rem" color="#0067D1" />
        {!collapsed && <span className="app-sidebar__brand-text">码趣教务</span>}
      </div>
      <nav className="app-sidebar__menu">
        {ITEMS.map((it) => (
          <a
            key={it.key}
            className={"app-sidebar__item" + (it.key === "students" ? " is-active" : "")}
            href="#"
            onClick={(e) => e.preventDefault()}
            title={it.label}
          >
            <Icon name={it.icon} size="0.875rem" />
            {!collapsed && <span className="app-sidebar__item-text">{it.label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
}
