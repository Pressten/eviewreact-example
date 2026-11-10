import { useMemo } from "react";
import { Empty, Progress } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { DUTY_LIMIT_MIN, buildCrewPanel } from "../../mock/crew.js";
import { fmt } from "../../mock/flight.js";
import { OPS_MOMENT_MIN, useApp, useOpsTick } from "../../context.jsx";
import "./index.css";

// 进度条满刻度 16h —— 14h 上限刻度线位于 87.5%
const DUTY_SCALE_MIN = 960;
const NEAR_LIMIT_MIN = 720; // 12h 起进入预警色

// 区块⑤ 机组执勤面板 —— 随主表选中航班联动刷新
export default function CrewPanel() {
  const { dataset, selectedFlightId } = useApp();
  const tick = useOpsTick();
  const panel = useMemo(() => buildCrewPanel(dataset, selectedFlightId), [dataset, selectedFlightId]);

  if (!panel) {
    return (
      <section className="crew-panel">
        <div className="cp-title">
          <Icon name="users" size="1rem" />
          机组执勤
        </div>
        <div className="cp-empty">
          <Empty description="在主表选择航班，查看机组执勤" />
        </div>
      </section>
    );
  }

  const nowMin = OPS_MOMENT_MIN + tick / 60;
  const elapsed = Math.max(0, Math.min(nowMin - panel.report, panel.estMin));
  const percent = Math.min((panel.estMin / DUTY_SCALE_MIN) * 100, 100);
  const limitPos = (DUTY_LIMIT_MIN / DUTY_SCALE_MIN) * 100;
  const overLimit = panel.estMin > DUTY_LIMIT_MIN;
  const nearLimit = !overLimit && panel.estMin >= NEAR_LIMIT_MIN;
  const strokeColor = overLimit ? "var(--error)" : nearLimit ? "var(--critical)" : "var(--success)";
  const f = panel.flight;

  return (
    <section className="crew-panel">
      <div className="cp-title">
        <Icon name="users" size="1rem" />
        机组执勤
        <span className="cp-tail mono">{f.tailNo} · {f.acType}</span>
      </div>

      <div className="cp-flight">
        <span className="mono cp-f-no">{f.flightNo}</span>
        <span className="mono">{f.from}→{f.to}</span>
        <span className="cp-f-tag">{panel.pairing ? "接力配组" : "单段配组"}</span>
      </div>

      <div className="cp-crew">
        <span className="cp-member"><span className="cp-role">机长</span><b>{panel.captain}</b></span>
        <span className="cp-member"><span className="cp-role">副驾驶</span><b>{panel.firstOfficer}</b></span>
        <span className="cp-member"><span className="cp-role">乘务长</span><b>{panel.purser}</b></span>
        <span className="cp-member"><span className="cp-role">乘务组</span><b>{panel.cabinCount} 人</b></span>
      </div>

      <div className="cp-legs">
        {panel.legs.map((l) => (
          <span key={l.id} className="cp-leg mono" title={`${l.from}→${l.to} ${fmt(l.schedDep)}`}>{l.flightNo}</span>
        ))}
        <span className="cp-legs-label">当日执飞航段</span>
      </div>

      <div className="cp-duty">
        <div className="cp-duty-head">
          <span>当日执勤时长（上限 14h）</span>
          <span className={`cp-duty-value mono ${overLimit ? "v-err" : nearLimit ? "v-warn" : "v-ok"}`}>
            {(panel.estMin / 60).toFixed(1)}h
          </span>
        </div>
        <div className="cp-bar">
          <Progress percent={percent} showInfo={false} strokeColor={strokeColor} trailColor="var(--surface-variant)" size={["100%", "0.5rem"]} />
          <span className="cp-limit-mark" style={{ left: `${limitPos}%` }} title="14 小时执勤上限" />
        </div>
        <div className="cp-duty-meta mono">
          <span>已执勤 {(elapsed / 60).toFixed(1)}h</span>
          <span>计划 {(panel.planMin / 60).toFixed(1)}h</span>
          <span>报到 {fmt(panel.report)}</span>
        </div>
      </div>

      {overLimit || nearLimit ? (
        <div className={`cp-warning ${overLimit ? "w-err" : "w-warn"}`}>
          <Icon name="triangle-alert" size="0.75rem" />
          {overLimit
            ? `预计执勤超上限 ${((panel.estMin - DUTY_LIMIT_MIN) / 60).toFixed(1)}h，延误已传导至机组，需启动机组替换`
            : "接近执勤上限，关注后续延误传导风险"}
        </div>
      ) : null}
    </section>
  );
}
