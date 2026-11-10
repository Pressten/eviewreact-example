import { useMemo } from "react";
import { Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { GATE_LIST, fmt, getTimePair } from "../../mock/flight.js";
import { OPS_MOMENT_MIN, useApp, useOpsTick } from "../../context.jsx";
import "./index.css";

// 时间刻度: 08:00 – 22:00(分)
const DAY_START = 480;
const DAY_END = 1320;
const SPAN = DAY_END - DAY_START;
const MIN_TURNAROUND = 45; // 最低安全周转(分) —— 相邻航班对低于此值判定冲突
const DEP_WINDOW = 60;     // 出港航班登机占用窗口(分)
const ARR_WINDOW = 45;     // 进港航班到站下客占用窗口(分)

const pct = (min) => ((min - DAY_START) / SPAN) * 100;
const HOURS = [480, 600, 720, 840, 960, 1080, 1200, 1320];

// 由主表数据推导登机口占用条块 —— 登机口字段与主表严格一致
// 延误航班条块随预计时刻右移; 取消/备降航班按计划时刻渲染弱化占位(机位已释放)
// 同一口位时间重叠的条块分配到上下两条子轨道(track), 避免视觉叠压
function buildGateBlocks(dataset) {
  const raw = [];
  dataset.forEach((r) => {
    if (r.status === "cancelled" || r.status === "diverted") {
      const start = r.dir === "dep" ? r.schedDep - DEP_WINDOW : r.schedArr;
      raw.push({ flight: r, start, end: start + (r.dir === "dep" ? DEP_WINDOW : ARR_WINDOW), dim: true });
      return;
    }
    const pair = getTimePair(r);
    if (r.dir === "dep") {
      raw.push({ flight: r, start: pair.dep.t - DEP_WINDOW, end: pair.dep.t, dim: false });
    } else {
      raw.push({ flight: r, start: pair.arr.t, end: pair.arr.t + ARR_WINDOW, dim: false });
    }
  });
  const blocks = raw.filter((b) => b.end > DAY_START + 15 && b.start < DAY_END);

  const byGate = {};
  const trackCounts = {};
  GATE_LIST.forEach((g) => { byGate[g] = []; });
  blocks.forEach((b) => { if (byGate[b.flight.gate]) byGate[b.flight.gate].push(b); });

  const conflicts = [];
  GATE_LIST.forEach((g) => {
    const list = byGate[g].sort((a, b) => a.start - b.start);

    // 轨道分配: 与本轨道已有条块时间重叠的, 顺延到下一条子轨道
    const trackEnds = [];
    list.forEach((b) => {
      let ti = trackEnds.findIndex((end) => end <= b.start);
      if (ti === -1) { trackEnds.push(b.end); ti = trackEnds.length - 1; }
      else trackEnds[ti] = b.end;
      b.track = ti;
    });
    trackCounts[g] = Math.max(1, trackEnds.length);

    // 相邻航班对周转 < 45 分 → 冲突高亮(仅统计有效占用, 弱化占位不计)
    const active = list.filter((b) => !b.dim);
    for (let i = 1; i < active.length; i++) {
      const gap = active[i].start - active[i - 1].end;
      if (gap < MIN_TURNAROUND) {
        active[i].conflict = true;
        active[i - 1].conflict = true;
        active[i].prevGap = gap;
        active[i - 1].nextGap = gap;
        conflicts.push({ gate: g, gap, prev: active[i - 1], next: active[i] });
      }
    }
    // 非冲突的相邻周转间隔(悬浮详情)
    for (let i = 1; i < active.length; i++) {
      if (active[i].prevGap === undefined) active[i].prevGap = active[i].start - active[i - 1].end;
      if (active[i - 1].nextGap === undefined) active[i - 1].nextGap = active[i].start - active[i - 1].end;
    }
  });
  return { byGate, trackCounts, conflicts };
}

function blockClass(b, widthPct) {
  const narrow = widthPct < 4.5 ? " w-sm" : widthPct < 7 ? " w-md" : " w-lg";
  if (b.conflict) return `gg-block gg-conflict${narrow}`;
  if (b.dim) return `gg-block gg-dim${narrow}`;
  if (b.flight.status === "delayed") return `gg-block gg-delayed${narrow}`;
  return b.flight.dir === "dep" ? `gg-block gg-dep${narrow}` : `gg-block gg-arr${narrow}`;
}

const gapText = (gap) => (gap >= 0 ? `${gap} 分` : `重叠 ${-gap} 分`);

// 区块④ 登机口调度网格 —— C01-C08 × 08:00-22:00
export default function GateGrid() {
  const { dataset, setSelectedFlightId, requestLocate } = useApp();
  const tick = useOpsTick();
  const { byGate, trackCounts, conflicts } = useMemo(() => buildGateBlocks(dataset), [dataset]);

  const nowMin = OPS_MOMENT_MIN + tick / 60;
  const nowPct = nowMin <= DAY_END ? pct(nowMin) : null;
  const minGap = conflicts.length ? Math.min(...conflicts.map((c) => c.gap)) : null;
  const blockCount = GATE_LIST.reduce((s, g) => s + byGate[g].length, 0);

  const tooltipFor = (b) => {
    const f = b.flight;
    return (
      <div className="gg-tip">
        <div className="gt-title">
          <b className="mono">{f.flightNo}</b> {f.from} → {f.to} · {f.acType} · 登机口 {f.gate}
        </div>
        <div className="gt-line">机位占用：{fmt(b.start)} – {fmt(b.end)}（{b.end - b.start} 分）</div>
        <div className="gt-line">{f.dir === "dep" ? "出港登机窗口" : "进港下客窗口"} · {f.status === "delayed" ? `预计${f.dir === "dep" ? "起飞" : "到达"}已顺延` : "计划时刻"}</div>
        {!b.dim && b.prevGap !== undefined ? <div className="gt-line">与前段周转：{gapText(b.prevGap)}</div> : null}
        {!b.dim && b.nextGap !== undefined ? <div className="gt-line">与后段周转：{gapText(b.nextGap)}</div> : null}
        {b.conflict ? <div className="gt-warn">周转不足 45 分最低标准，已冲突高亮</div> : null}
        {b.dim ? (
          <div className="gt-line gt-dim">
            {f.status === "cancelled" ? "航班已取消 · 计划机位已释放" : `已备降 ${f.divertTo} · 计划机位已释放`}
          </div>
        ) : null}
        {f.delayReason ? <div className="gt-line">处置：{f.delayReason}</div> : null}
      </div>
    );
  };

  const renderBlock = (b, gate) => {
    const f = b.flight;
    const left = Math.max(pct(b.start), 0);
    const right = Math.min(pct(b.end), 100);
    const widthPct = right - left;
    const dur = b.end - b.start;
    // 双轨口位: 重叠条块上下分层渲染, 避免叠压
    const dual = trackCounts[gate] > 1;
    const posStyle = dual
      ? b.track === 0
        ? { top: "0.125rem", height: "calc(50% - 0.1875rem)", bottom: "auto" }
        : { top: "50%", height: "calc(50% - 0.1875rem)", bottom: "auto" }
      : {};
    return (
      <Tooltip key={f.id} title={tooltipFor(b)} mouseEnterDelay={0.12}>
        <div
          className={blockClass(b, widthPct)}
          style={{ left: `${left}%`, width: `${widthPct}%`, ...posStyle }}
          onClick={(e) => { e.stopPropagation(); setSelectedFlightId(f.id); requestLocate(f.id); }}
          title="点击定位主表航班行"
        >
          <span className="gg-b-no mono">{f.flightNo}</span>
          <span className="gg-b-route mono">{f.from}→{f.to}</span>
          <span className="gg-b-turn mono">{b.dim ? "已释放" : `${dur} 分`}</span>
          {b.conflict ? <Icon name="triangle-alert" size="0.75rem" className="gg-b-warn" /> : null}
        </div>
      </Tooltip>
    );
  };

  return (
    <section className="gate-grid">
      <div className="gg-header">
        <span className="gg-title">
          <Icon name="door-open" size="1rem" />
          登机口调度网格
          <span className="gg-meta mono">C01–C08 · 08:00 – 22:00 · {blockCount} 班占用</span>
        </span>
        <span className="gg-legend">
          <span className="lg lg-dep">出港</span>
          <span className="lg lg-arr">进港</span>
          <span className="lg lg-delayed">延误</span>
          <span className="lg lg-conflict">冲突</span>
        </span>
      </div>

      <div className="gg-scale">
        <span className="gg-gate-slot" />
        <div className="gg-scale-track">
          {HOURS.map((h) => (
            <span
              key={h}
              className={`gg-tick mono ${h === DAY_START ? "first" : h === DAY_END ? "last" : ""}`}
              style={{ left: `${pct(h)}%` }}
            >
              {fmt(h)}
            </span>
          ))}
        </div>
      </div>

      <div className="gg-body">
        {GATE_LIST.map((gate) => (
          <div className="gg-row" key={gate}>
            <span className="gg-gate mono">{gate}</span>
            <div className={`gg-lane${trackCounts[gate] > 1 ? " dual" : ""}`}>
              {byGate[gate].map((b) => renderBlock(b, gate))}
              {nowPct !== null ? <span className="gg-now" style={{ left: `${nowPct}%` }} title="当前时刻" /> : null}
            </div>
          </div>
        ))}
      </div>

      <div className="gg-footer">
        <span className={`gg-conflict-count ${conflicts.length ? "bad" : ""}`}>
          冲突对 <b className="mono">{conflicts.length}</b> 组{minGap !== null ? ` · 最低周转 ${gapText(minGap)}` : ""}
        </span>
        <span className="gg-hint">悬浮查看周转详情 · 点击条块定位主表航班</span>
      </div>
    </section>
  );
}
