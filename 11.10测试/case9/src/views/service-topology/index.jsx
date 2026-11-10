import { Fragment, useMemo } from "react";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { TOPOLOGY } from "../../mock/topology.js";
import { worstActiveLevel } from "../../mock/alarms.js";
import { fmtNum, liveQps } from "../../mock/services.js";
import "./index.css";

// 画布几何（px，与 CSS 网格严格一致）：4 条泳道 × 140px，行距 16px。
// bus1 单元纵向贯通整个画布（top 从 0 起算，用画布坐标）；
// bus2 单元仅占一格泳道（top 用泳道内相对坐标：核心 70 / MySQL 33 / Redis 107，
// 依赖节点 66px × 2 + 8px 间隙 = 140px，避免节点贴死与描边互串）。
const LANE_H = 140;
const LANE_GAP = 16;
const SPLIT_X = 36;
const STUB_W = 30;
const REL_CORE = 70;
const REL_DEP_TOP = 33;
const REL_DEP_BOTTOM = 107;
const laneTop = (i) => i * (LANE_H + LANE_GAP);
const laneCenter = (i) => laneTop(i) + REL_CORE;
const GW_CENTER = (3 * (LANE_H + LANE_GAP) + LANE_H) / 2; // 280px，网关垂直居中

const KIND_ICON = { gateway: "waypoints", service: "server", mysql: "database", redis: "zap" };
const KIND_LABEL = { gateway: "入口网关", service: "核心服务", mysql: "MySQL 主库", redis: "Redis 缓存" };

// 节点状态由告警列表推导：活动 P0 → 严重；活动 P1 → 告警；否则正常（异常节点必有对应告警）
function nodeStatus(node, alarms) {
  const worst = worstActiveLevel(alarms, node.id);
  if (worst && worst.level === "P0") return "critical";
  if (worst && worst.level === "P1") return "warning";
  return "healthy";
}

function TopoNode({ node, selected, onClick, big, tick }) {
  const st = node.status;
  const qps = liveQps(node.qps, node.id, tick);
  return (
    <div
      className={`tnode kind-${node.kind} st-${st}${selected ? " is-selected" : ""}${big ? " is-big" : ""}`}
      role="button"
      tabIndex={0}
      title={`${node.name} · ${KIND_LABEL[node.kind]} · QPS ${fmtNum(qps)} · 错误率 ${node.errRate}%`}
      onClick={() => onClick(node)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(node);
      }}
    >
      <div className="tnode-head">
        <Icon name={KIND_ICON[node.kind]} size="0.875rem" />
        <span className="tnode-name">{node.name}</span>
        <span className={`tnode-dot st-${st}`} />
      </div>
      <div className="tnode-meta">
        <span className="tnode-qps">
          {fmtNum(qps)}
          <i> QPS</i>
        </span>
        <span className={node.errRate > 0.5 ? "tnode-err is-bad" : "tnode-err"}>错误率 {node.errRate}%</span>
      </div>
    </div>
  );
}

// ④ 服务拓扑（主视觉）：入口 → 4 核心服务 → 各自 MySQL/Redis，13 节点 12 边；
// 拓扑主体居中，异常调用链警示色高亮并标注延迟毫秒数；QPS 随刷新频率实时跳动。
export default function ServiceTopology() {
  const app = useApp();
  const topo = TOPOLOGY[app.env];

  const nodes = useMemo(
    () => topo.nodes.map((n) => ({ ...n, status: nodeStatus(n, app.alarms) })),
    [topo, app.alarms]
  );

  const gw = nodes.find((n) => n.kind === "gateway");
  const cores = nodes.filter((n) => n.kind === "service");
  const edgeOf = (from, to) => topo.edges.find((e) => e.from === from && e.to === to);
  const depOf = (lane, kind) => nodes.find((n) => n.kind === kind && n.lane === lane);
  const nodeById = (id) => nodes.find((n) => n.id === id);

  // 节点点击联动：服务/网关 → 联动 ⑤ 实时图表；数据节点 → 联动 ⑥ 告警列表搜索
  const onNodeClick = (node) => {
    if (node.kind === "mysql" || node.kind === "redis") {
      app.setAlarmQuery(node.id);
      const el = document.getElementById("alarm-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    app.setSelectedService(node.id);
    const el = document.getElementById("realtime-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 异常链路行点击 → 检索该对象告警
  const jumpChain = (e) => {
    app.setAlarmQuery(e.to);
    const el = document.getElementById("alarm-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 总线 1（画布坐标）：网关干线 → 垂直分配 → 各核心服务（方向：左 → 右）
  const bus1 = [
    <div key="trunk" className="edge-h ec-ok" style={{ left: 0, top: GW_CENTER - 1, width: SPLIT_X }} />,
    <div
      key="rail"
      className="edge-v ec-ok"
      style={{ left: SPLIT_X - 1, top: laneCenter(0) - 1, height: laneCenter(3) - laneCenter(0) + 2 }}
    />,
  ];
  cores.forEach((core, i) => {
    const e = edgeOf("api-gateway", core.id);
    const y = laneCenter(i);
    bus1.push(
      <div key={`h-${core.id}`} className={`edge-h ec-${e.status}`} style={{ left: SPLIT_X, top: y - 1, width: STUB_W }} />
    );
    bus1.push(
      <span key={`a-${core.id}`} className={`edge-arrow ec-${e.status}`} style={{ left: SPLIT_X + STUB_W, top: y - 4 }} />
    );
    if (e.status !== "ok") {
      bus1.push(
        <span
          key={`c-${core.id}`}
          className={`edge-chip edge-chip-${e.status}`}
          style={{ left: 2, top: y - 4, transform: "translateY(-100%)" }}
        >
          {fmtNum(e.latencyMs)} ms
        </span>
      );
    }
  });

  // 总线 2（泳道内相对坐标）：核心服务 → 垂直分叉 → 各自 MySQL / Redis
  const renderBus2 = (core, i) => {
    const mysql = depOf(i, "mysql");
    const redis = depOf(i, "redis");
    const eM = edgeOf(core.id, mysql.id);
    const eR = edgeOf(core.id, redis.id);
    const worst =
      eM.status === "critical" || eR.status === "critical"
        ? "critical"
        : eM.status === "warn" || eR.status === "warn"
          ? "warn"
          : "ok";
    const yCore = REL_CORE;
    const yM = REL_DEP_TOP;
    const yR = REL_DEP_BOTTOM;
    const items = [
      <div key="trunk" className={`edge-h ec-${worst}`} style={{ left: 0, top: yCore - 1, width: SPLIT_X }} />,
      <div key="rail" className={`edge-v ec-${worst}`} style={{ left: SPLIT_X - 1, top: yM - 1, height: yR - yM + 2 }} />,
    ];
    [
      [yM, eM, "m"],
      [yR, eR, "r"],
    ].forEach(([y, e, k]) => {
      items.push(
        <div key={`h-${k}`} className={`edge-h ec-${e.status}`} style={{ left: SPLIT_X, top: y - 1, width: STUB_W }} />
      );
      items.push(
        <span key={`a-${k}`} className={`edge-arrow ec-${e.status}`} style={{ left: SPLIT_X + STUB_W, top: y - 4 }} />
      );
      if (e.status !== "ok") {
        items.push(
          <span
            key={`c-${k}`}
            className={`edge-chip edge-chip-${e.status}`}
            style={{ left: 2, top: y - 4, transform: "translateY(-100%)" }}
          >
            {fmtNum(e.latencyMs)} ms
          </span>
        );
      }
    });
    return items;
  };

  const abnormal = topo.edges.filter((e) => e.status !== "ok");

  return (
    <SectionCard
      id="topology-section"
      icon="network"
      title="服务拓扑 · 实时调用链"
      className="topo-section"
      extra={
        <span className="topo-extra">
          {topo.nodes.length} 节点 · {topo.edges.length} 条调用边 · 每 {app.refreshRate} 秒自动刷新
        </span>
      }
    >
      <div className="topo-wrap">
        <div className="topo-tiers">
          <span>入口层</span>
          <span aria-hidden="true" />
          <span>核心服务层</span>
          <span aria-hidden="true" />
          <span>数据与缓存层</span>
        </div>
        <div className="topo-graph">
          <div className="topo-cell topo-gw">
            <TopoNode node={gw} selected={app.selectedService === gw.id} onClick={onNodeClick} big tick={app.refreshTick} />
          </div>
          <div className="topo-cell topo-bus">{bus1}</div>
          {[0, 1, 2, 3].map((i) => {
            const core = cores[i];
            return (
              <Fragment key={core.id}>
                <div className="topo-cell topo-core">
                  <TopoNode
                    node={core}
                    selected={app.selectedService === core.id}
                    onClick={onNodeClick}
                    tick={app.refreshTick}
                  />
                </div>
                <div className="topo-cell topo-bus2">{renderBus2(core, i)}</div>
                <div className="topo-cell topo-dep">
                  <TopoNode node={depOf(i, "mysql")} selected={false} onClick={onNodeClick} tick={app.refreshTick} />
                  <TopoNode node={depOf(i, "redis")} selected={false} onClick={onNodeClick} tick={app.refreshTick} />
                </div>
              </Fragment>
            );
          })}
        </div>
        {/* 说明条：置于拓扑图下方 —— 左侧异常调用链，右侧图例 */}
        <div className="topo-footer">
          <div className="topo-panel-block">
            <div className="topo-panel-title">
              <Icon name="octagon-alert" size="0.875rem" />
              异常调用链
            </div>
            {abnormal.length === 0 ? (
              <div className="topo-panel-empty">当前环境调用链路全部正常</div>
            ) : (
              abnormal.map((e) => (
                <div
                  key={`${e.from}-${e.to}`}
                  className={`topo-chain is-${e.status}`}
                  onClick={() => jumpChain(e)}
                  title="点击检索该对象的告警"
                >
                  <span className="chain-level">{e.status === "critical" ? "P0" : "P1"}</span>
                  <span className="chain-path">
                    {nodeById(e.from).name} → {nodeById(e.to).name}
                  </span>
                  <span className="chain-latency">
                    {fmtNum(e.latencyMs)} ms{e.label ? ` · ${e.label}` : ""}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="topo-panel-block">
            <div className="topo-panel-title">
              <Icon name="list-checks" size="0.875rem" />
              图例与说明
            </div>
            <div className="topo-legend">
              <span>
                <i className="lg-dot lg-healthy" />
                节点正常
              </span>
              <span>
                <i className="lg-dot lg-warning" />
                节点告警
              </span>
              <span>
                <i className="lg-dot lg-critical" />
                节点严重
              </span>
              <span>
                <i className="lg-line ec-ok" />
                正常调用
              </span>
              <span>
                <i className="lg-line ec-warn" />
                延迟告警
              </span>
              <span>
                <i className="lg-line ec-critical" />
                异常链路
              </span>
            </div>
            <div className="topo-note">
              节点显示实时 QPS 与错误率（QPS 随刷新频率轻微跳动）；异常链路高亮并标注调用延迟（ms）。点击服务节点联动实时图表，点击数据节点或异常链路行检索其告警。
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
