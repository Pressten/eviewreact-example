// App entry — 少儿编程教务 · 学员管理
// Layer 5 layout：Provider + ConfigProvider + 顶栏/侧栏/主内容装配
//
// 全局状态：筛选条件 filters（校区/课程/班级/关键词/仅看待续费）、
// 当前查看学员 drawerStudent、侧栏折叠 collapsed。
// 列表由 filters 派生；概览统计基于全量数据。

import { useState, useMemo } from "react";
import { ConfigProvider, Empty, message } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { Icon } from "./assets/shared/icon.jsx";
import { AppProvider, useApp } from "./src/context.jsx";
import { STUDENTS, OVERVIEW, RENEWAL_THRESHOLD } from "./src/mock/student.js";

import Sidebar from "./src/views/sidebar/index.jsx";
import PageHeader from "./src/views/page-header/index.jsx";
import FilterBar from "./src/views/filter-bar/index.jsx";
import StatOverview from "./src/views/stat-overview/index.jsx";
import StudentTable from "./src/views/student-table/index.jsx";
import StudentDrawer from "./src/views/student-drawer/index.jsx";

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
        <Icon
          name="menu"
          size="1rem"
          className="app-topbar__collapse"
          title="折叠/展开侧栏"
          onClick={() => setCollapsed((c) => !c)}
        />
        <span className="app-topbar__brand">码趣少儿编程 · 教务平台</span>
        <span className="app-topbar__spacer" />
        <div className="app-topbar__tools">
          <Icon
            name={isDark ? "sun" : "moon"}
            size="1rem"
            className="app-topbar__tool"
            title="切换深浅主题"
            onClick={toggleDark}
          />
          <Icon name="bell" size="1rem" className="app-topbar__tool" title="通知中心" />
          <div className="app-topbar__user">
            <img src="./assets/uploads/user.png" alt="" />
            <span>王老师</span>
          </div>
        </div>
      </header>

      <div className="app-body">
        <Sidebar collapsed={collapsed} />
        <main className="app-main">
          <div className="app-main__inner">
            <PageHeader onExport={() => message.success("学员名册已导出")} />
            <StatOverview overview={OVERVIEW} />
            <FilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />
            <StudentTable students={filtered} onView={setDrawerStudent} />
          </div>
        </main>
      </div>

      <StudentDrawer student={drawerStudent} onClose={() => setDrawerStudent(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider
        locale={zhCN}
        wave={{ disabled: true }}
        renderEmpty={() => <Empty style={{ padding: "2rem 0" }} />}
        empty={{ image: "./assets/uploads/empty.svg" }}
        spin={{ indicator: <img src="./assets/uploads/loading.svg" alt="" className="custom-spin-indicator" /> }}
      >
        <Shell />
      </ConfigProvider>
    </AppProvider>
  );
}
