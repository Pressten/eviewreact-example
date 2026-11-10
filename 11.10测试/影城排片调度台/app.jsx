import { useState, Component } from "react";
import { ConfigProvider, Empty, message, Modal, Steps, Button } from "antd";
import dayjs from "dayjs";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider, useApp } from "./src/context.jsx";
import { Icon } from "./assets/shared/icon.jsx";
import Toolbar from "./src/views/toolbar/index.jsx";
import OverviewCards from "./src/views/overview-cards/index.jsx";
import ScheduleGrid from "./src/views/schedule-grid/index.jsx";
import ShowtimeDetail from "./src/views/showtime-detail/index.jsx";
import BoxOfficeTrend from "./src/views/box-office-trend/index.jsx";
import FilmLibrary from "./src/views/film-library/index.jsx";
import SuggestionPanel from "./src/views/suggestion-panel/index.jsx";
import BottomBar from "./src/views/bottom-bar/index.jsx";
import NewShowtimeModal from "./src/views/new-showtime-modal/index.jsx";
import { getShowtimes, computeOverview } from "./src/mock/showtime.js";
import { halls } from "./src/mock/hall.js";
import "./app.css";

// Error Boundary — catches rendering errors and displays them
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(err) {
    return { hasError: true, error: err };
  }
  componentDidCatch(err, info) {
    console.error("Render Error:", err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", color: "#E02128", fontSize: "0.875rem" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>页面渲染出错</h2>
          <p style={{ marginBottom: "0.5rem" }}>{String(this.state.error && this.state.error.message || this.state.error)}</p>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.75rem", color: "#777" }}>
            {this.state.error && this.state.error.stack ? String(this.state.error.stack).substring(0, 500) : ""}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function PageContent() {
  const appCtx = useApp() || {};
  const isDark = appCtx.isDark || false;
  const toggleDark = appCtx.toggleDark || function () {};

  const [selectedCinema, setSelectedCinema] = useState("A");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [publishStatus, setPublishStatus] = useState("草稿");
  const [extraShowtimes, setExtraShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFilmId, setModalFilmId] = useState(undefined);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [adoptedSuggestions, setAdoptedSuggestions] = useState({});
  const [optimizedShowtimes, setOptimizedShowtimes] = useState({});

  function safeMsg(type, text) {
    try { if (message && message[type]) message[type](text); } catch (e) { console.log("[" + type + "]", text); }
  }

  const baseShowtimes = getShowtimes(selectedCinema);
  const cinemaExtras = extraShowtimes.filter(function (st) { return st.cinemaId === selectedCinema; });
  const showtimes = baseShowtimes.concat(cinemaExtras);
  const overview = computeOverview(showtimes, halls);

  function handleCinemaChange(cinemaId) {
    setSelectedCinema(cinemaId);
    setSelectedShowtime(null);
    setDrawerOpen(false);
  }

  function handleDateChange(date) {
    setSelectedDate(date);
  }

  function handleCopyYesterday() {
    setPublishStatus("草稿");
    safeMsg("success", "已复制昨日排片，共 " + showtimes.length + " 场已生成草稿");
  }

  function handleShowtimeClick(st) {
    setSelectedShowtime(st);
    setDrawerOpen(true);
  }

  function handleNewShowtime() {
    setModalFilmId(undefined);
    setModalOpen(true);
  }

  function handleQuickNew(film) {
    setModalFilmId(film.filmId);
    setModalOpen(true);
  }

  function handleSaveShowtime(newSt) {
    setExtraShowtimes(function (prev) { return prev.concat([newSt]); });
    setModalOpen(false);
    safeMsg("success", "场次已新建：" + newSt.filmName + " " + newSt.startTime + "-" + newSt.endTime);
  }

  function handleAdoptSuggestion(s) {
    setAdoptedSuggestions(function (prev) {
      const next = {};
      Object.keys(prev).forEach(function (k) { next[k] = prev[k]; });
      next[s.suggestionId] = true;
      return next;
    });
    setOptimizedShowtimes(function (prev) {
      const next = {};
      Object.keys(prev).forEach(function (k) { next[k] = prev[k]; });
      s.affectedShowtimes.forEach(function (id) { next[id] = true; });
      return next;
    });
    safeMsg("success", "已采纳建议：" + s.title);
  }

  function handlePublish() {
    if (publishStatus === "草稿") {
      setPublishStatus("已发布");
      safeMsg("success", "排片方案已发布，各影厅终端已同步");
    } else {
      setPublishStatus("草稿");
      safeMsg("info", "已撤回发布，排片恢复草稿状态");
    }
  }

  function handleSave() {
    safeMsg("success", "排片草稿已保存（" + showtimes.length + " 场）");
  }

  function handleExport(key) {
    safeMsg("success", "正在导出 " + (key === "pdf" ? "PDF" : "Excel") + "...");
  }

  function handleAutoSchedule() {
    setWizardOpen(true);
  }

  function handleGenerate() {
    setWizardOpen(false);
    setPublishStatus("草稿");
    safeMsg("success", "智能排片已生成 " + showtimes.length + " 场草稿方案，请审核后发布");
  }

  function handleBatchSchedule() {
    safeMsg("info", "批量排片：请在网格中选中多场场次后进行批量复制/移动/删除");
  }

  return (
    <div className="app-root">
      <header className="page-header">
        <div className="page-title">
          <Icon name="clapperboard" size="1.5rem" color="#0067D1" />
          <span>排片调度台</span>
          <span className="page-title-badge">连锁影城总部 · 排片管理</span>
        </div>
        <div className="page-header-right">
          <span className="dark-toggle" onClick={toggleDark} title={isDark ? "切换浅色" : "切换深色"}>
            <Icon name={isDark ? "sun" : "moon"} size="1.25rem" />
          </span>
        </div>
      </header>

      <div className="page-container">
        <ErrorBoundary>
          <Toolbar
            selectedCinema={selectedCinema}
            onCinemaChange={handleCinemaChange}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onCopyYesterday={handleCopyYesterday}
            onAutoSchedule={handleAutoSchedule}
            onExport={handleExport}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <OverviewCards overview={overview} />
        </ErrorBoundary>

        <ErrorBoundary>
          <ScheduleGrid
            showtimes={showtimes}
            selectedShowtimeId={selectedShowtime ? selectedShowtime.showtimeId : null}
            optimizedShowtimes={optimizedShowtimes}
            onShowtimeClick={handleShowtimeClick}
          />
        </ErrorBoundary>

        <div className="two-col-row">
          <ErrorBoundary>
            <BoxOfficeTrend />
          </ErrorBoundary>
          <ErrorBoundary>
            <SuggestionPanel
              adoptedSet={adoptedSuggestions}
              onAdopt={handleAdoptSuggestion}
            />
          </ErrorBoundary>
        </div>

        <BottomBar
          publishStatus={publishStatus}
          onNewShowtime={handleNewShowtime}
          onBatchSchedule={handleBatchSchedule}
          onPublish={handlePublish}
          onSave={handleSave}
        />

        <ErrorBoundary>
          <FilmLibrary onQuickNew={handleQuickNew} />
        </ErrorBoundary>
      </div>

      <ShowtimeDetail
        open={drawerOpen}
        showtime={selectedShowtime}
        allShowtimes={showtimes}
        onClose={function () { setDrawerOpen(false); }}
      />

      <NewShowtimeModal
        open={modalOpen}
        preSelectedFilmId={modalFilmId}
        cinemaId={selectedCinema}
        existingShowtimes={showtimes}
        onClose={function () { setModalOpen(false); }}
        onSave={handleSaveShowtime}
      />

      <Modal
        open={wizardOpen}
        title="一键智能排片向导"
        width={520}
        onCancel={function () { setWizardOpen(false); }}
        footer={[
          <Button key="cancel" onClick={function () { setWizardOpen(false); }}>取消</Button>,
          <Button key="gen" type="primary" onClick={handleGenerate}>智能生成排片</Button>,
        ]}
      >
        <Steps
          className="wizard-steps"
          current={1}
          size="small"
          items={[
            { title: "选择日期", description: selectedDate.format("YYYY-MM-DD") },
            { title: "分析影片热度", description: "8 部在映影片" },
            { title: "生成排片", description: "待执行" },
          ]}
        />
        <p className="wizard-desc">
          系统将根据影片累计票房、场均上座率、黄金时段需求及影厅版本支持能力，自动编排今日 6 个影厅的完整排片方案。生成后排片状态为"草稿"，可在网格中逐场调整后发布。
        </p>
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider
        locale={zhCN}
        wave={{ disabled: true }}
        renderEmpty={function () { return <Empty style={{ padding: "2rem 0" }} />; }}
        empty={{ image: "./assets/uploads/empty.svg" }}
        spin={{ indicator: <img src="./assets/uploads/loading.svg" alt="" className="custom-spin-indicator" /> }}
      >
        <ErrorBoundary>
          <PageContent />
        </ErrorBoundary>
      </ConfigProvider>
    </AppProvider>
  );
}
