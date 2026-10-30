// App entry — NOC 监控告警中心
// Layer 5 layout：Provider + ConfigProvider + 全局交互状态装配
//
// 全局状态：环境切换（联动服务/指标/告警/图表）、选中服务（联动拓扑与实时图表）、
// 告警认领/静默（行状态变化）、静默配置弹窗。

import { useState, useMemo, useCallback } from "react";
import { ConfigProvider, Empty, message } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import {
  TIME_RANGES,
  REFRESH_RATES,
  DUTY,
  getServices,
  getGoldenMetrics,
  getAlerts,
} from "./src/mock/monitor.js";

import HeaderBar from "./src/views/header-bar/index.jsx";
import ServiceOverview from "./src/views/service-overview/index.jsx";
import GoldenMetrics from "./src/views/golden-metrics/index.jsx";
import ServiceTopology from "./src/views/service-topology/index.jsx";
import RealtimeCharts from "./src/views/realtime-charts/index.jsx";
import AlertList from "./src/views/alert-list/index.jsx";
import HandoverTimeline from "./src/views/handover-timeline/index.jsx";
import ChangeFeed from "./src/views/change-feed/index.jsx";
import SilenceModal from "./src/views/silence-modal/index.jsx";

import "./app.css";

export default function App() {
  const [env, setEnv] = useState("prod");
  const [timeRange, setTimeRange] = useState("1h");
  const [refreshRate, setRefreshRate] = useState("30s");
  const [selectedServiceId, setSelectedServiceId] = useState("payment-service");
  const [alerts, setAlerts] = useState(() => getAlerts("prod"));
  const [silenceOpen, setSilenceOpen] = useState(false);
  const [silenceTarget, setSilenceTarget] = useState(null);

  const services = useMemo(() => getServices(env), [env]);
  const goldenMetrics = useMemo(() => getGoldenMetrics(env), [env]);

  // 待处理告警计数（顶部铃铛 Badge）
  const pendingAlertCount = useMemo(
    () => alerts.filter((a) => a.status === "pending").length,
    [alerts]
  );

  // 静默对象候选：当前告警对象去重
  const objectOptions = useMemo(() => {
    const set = new Set(alerts.map((a) => a.object));
    return Array.from(set);
  }, [alerts]);

  // 环境切换全局联动：刷新服务、指标、告警数据
  const handleEnvChange = useCallback((next) => {
    setEnv(next);
    setAlerts(getAlerts(next));
    message.info(`已切换至${next === "staging" ? "预发" : "生产"}环境，监控数据已刷新`);
  }, []);

  // 服务卡 / 拓扑节点 / 告警对象跳转 → 联动实时图表与拓扑高亮
  const handleSelectService = useCallback((id) => {
    setSelectedServiceId(id);
  }, []);

  // 认领：行状态变化为「已认领」，负责人记为当前值班人
  const handleClaim = useCallback((id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "acknowledged", owner: DUTY.name } : a))
    );
    message.success(`告警 ${id} 已认领，负责人：${DUTY.name}`);
  }, []);

  // 静默（来自告警行）：打开弹窗并预填对象
  const handleSilenceRow = useCallback((alert) => {
    setSilenceTarget(alert.object);
    setSilenceOpen(true);
  }, []);

  // 静默（来自顶部按钮）：打开弹窗，无预填
  const handleOpenSilence = useCallback(() => {
    setSilenceTarget(null);
    setSilenceOpen(true);
  }, []);

  // 静默确认：将匹配对象的告警置为「已静默」
  const handleSilenceConfirm = useCallback(({ object }) => {
    setAlerts((prev) =>
      prev.map((a) => (a.object === object && a.status !== "silenced" ? { ...a, status: "silenced", owner: a.owner === "—" ? DUTY.name : a.owner } : a))
    );
  }, []);

  return (
    <AppProvider>
      <ConfigProvider
        locale={zhCN}
        wave={{ disabled: true }}
        renderEmpty={() => <Empty style={{ padding: "2rem 0" }} />}
        empty={{ image: "./assets/uploads/empty.svg" }}
        spin={{ indicator: <img src="./assets/uploads/loading.svg" alt="" className="custom-spin-indicator" /> }}
      >
        <div className="app-root">
          <HeaderBar
            env={env}
            onEnvChange={handleEnvChange}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            refreshRate={refreshRate}
            onRefreshRateChange={setRefreshRate}
            onOpenSilence={handleOpenSilence}
            alertCount={pendingAlertCount}
          />

          <main className="noc-content">
            <ServiceOverview
              services={services}
              selectedServiceId={selectedServiceId}
              onSelectService={handleSelectService}
            />

            <GoldenMetrics metrics={goldenMetrics} env={env} />

            <ServiceTopology
              selectedServiceId={selectedServiceId}
              onSelectService={handleSelectService}
            />

            <RealtimeCharts
              selectedServiceId={selectedServiceId}
              env={env}
              onSelectService={handleSelectService}
            />

            <div className="noc-bottom">
              <div className="noc-bottom-main">
                <AlertList
                  alerts={alerts}
                  env={env}
                  onClaim={handleClaim}
                  onSilence={handleSilenceRow}
                  onJump={handleSelectService}
                />
              </div>
              <div className="noc-bottom-side">
                <HandoverTimeline />
                <ChangeFeed />
              </div>
            </div>
          </main>

          <SilenceModal
            open={silenceOpen}
            target={silenceTarget}
            objectOptions={objectOptions}
            onClose={() => setSilenceOpen(false)}
            onConfirm={handleSilenceConfirm}
          />
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
