// App entry — 少儿编程教务 · 学员管理
// Layer 5 layout：Provider + 顶栏/侧栏/主内容装配
//
// 全局状态：筛选条件 filters（校区/课程/班级/关键词/仅看待续费）、
// 当前查看学员 drawerStudent、侧栏折叠 collapsed。
// 列表由 filters 派生；概览统计基于全量数据。

import { useState, useMemo, useEffect } from "react";
import { IconPlusIcDigitalPowerDpMenu, IconPlusIcPublicMoon, IconPlusIcPublicSun, IconPlusIcPublicBellClock } from '@hui/icon-plus';
import DivMessage from "@nce/eview-react/DivMessage";
import { AppProvider, useApp } from "./context.jsx";
import { STUDENTS, OVERVIEW, RENEWAL_THRESHOLD } from "./mock/student.js";

import Sidebar from "./views/sidebar/index.jsx";
import PageHeader from "./views/page-header/index.jsx";
import FilterBar from "./views/filter-bar/index.jsx";
import StatOverview from "./views/stat-overview/index.jsx";
import StudentTable from "./views/student-table/index.jsx";
import StudentDrawer from "./views/student-drawer/index.jsx";
import Dashboard from "./views/dashboard/index.jsx";
import RenewalAlert from "./views/renewal-alert/index.jsx";
import RecentActivity from "./views/recent-activity/index.jsx";
import WorksGallery from "./views/works-gallery/index.jsx";

import "./app.css";

const DEFAULT_FILTERS = {
  campus: undefined,
  course: undefined,
  classId: undefined,
  keyword: "",
  lowHoursOnly: false,
};

function Shell() {
  const { isDark, toggleDark } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [drawerStudent, setDrawerStudent] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    document.body.classList.toggle('aui3_1_dark', isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const filtered = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase();
    return STUDENTS.filter((s) => {
      if (filters.campus && s.campus !== filters.campus) return false;
      if (filters.course && s.course !== filters.course) return false;
      if (filters.classId && s.classId !== filters.classId) return false;
      if (filters.lowHoursOnly && !(s.remainingHours < RENEWAL_THRESHOLD && s.status !== "结业")) return false;
      if (kw) {
        const hay = (
          s.name + s.id + s.parentPhone + s.courseLabel + s.classLabel + s.campusLabel
        ).toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  }, [filters]);

  const updateFilters = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="app-root">
      <header className="app-topbar">
        <IconPlusIcDigitalPowerDpMenu iconSize="1rem" iconColor={['currentcolor']} className="app-topbar__collapse" />
        <span className="app-topbar__brand">码趣少儿编程 · 教务平台</span>
        <span className="app-topbar__spacer" />
        <div className="app-topbar__tools">
          {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['currentcolor']} className="app-topbar__tool" /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['currentcolor']} className="app-topbar__tool" />}
          <IconPlusIcPublicBellClock iconSize="1rem" iconColor={['currentcolor']} className="app-topbar__tool" title="通知中心" />
          <div className="app-topbar__user">
            <img src="/uploads/user.png" alt="" />
            <span>王老师</span>
          </div>
        </div>
      </header>

      <div className="app-body">
        <Sidebar collapsed={collapsed} />
        <main className="app-main">
          <div className="app-main__inner">
            <PageHeader onExport={() => setNotice({ type: "success", text: "学员名册已导出" })} />
            <StatOverview overview={OVERVIEW} />
            <FilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />
            <StudentTable students={filtered} onView={setDrawerStudent} />
            <Dashboard />
            <div className="duo-grid">
              <RenewalAlert />
              <RecentActivity />
            </div>
            <WorksGallery />
          </div>
        </main>
      </div>

      <StudentDrawer student={drawerStudent} onClose={() => setDrawerStudent(null)} />

      {notice ? (
        <div
          style={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1050,
          }}
        >
          <DivMessage
            key={notice.text}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
