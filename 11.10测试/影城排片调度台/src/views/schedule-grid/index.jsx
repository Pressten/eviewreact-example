import { Tag, Progress } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { halls } from "../../mock/hall.js";
import { films, filmMap } from "../../mock/film.js";
import { toMin, AXIS_START_MIN, SLOT_REM, hexToRgba } from "../../mock/showtime.js";
import "./index.css";

// 生成时间轴刻度 09:00 ~ 23:30（30 格）
const TICKS = [];
for (let i = 0; i < 30; i++) {
  const totalMin = AXIS_START_MIN + i * 30;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  TICKS.push({
    label: String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0"),
    isHour: m === 0,
  });
}

const VERSION_COLOR = { "2D": undefined, "3D": "blue", "IMAX": "purple", "激光": "cyan" };

function occColor(occ) {
  if (occ < 30) return "#E02128";
  if (occ <= 50) return "#F4840C";
  return "#09AA71";
}

export default function ScheduleGrid({ showtimes, selectedShowtimeId, optimizedShowtimes, onShowtimeClick }) {
  const optimizedSet = optimizedShowtimes || {};

  // 按影厅分组
  const byHall = {};
  halls.forEach(function (h) { byHall[h.hallNo] = []; });
  showtimes.forEach(function (st) {
    if (byHall[st.hallNo]) byHall[st.hallNo].push(st);
  });

  // 当前时间指示线
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const showNowLine = nowMin >= AXIS_START_MIN && nowMin <= AXIS_START_MIN + 30 * 30;
  const nowLeftRem = (nowMin - AXIS_START_MIN) / 30 * SLOT_REM;

  // 图例（只显示出现在当日排片中的影片）
  const usedFilmIds = {};
  showtimes.forEach(function (st) { usedFilmIds[st.filmId] = true; });
  const legendFilms = films.filter(function (f) { return usedFilmIds[f.filmId]; });

  return (
    <div className="schedule-section">
      <div className="schedule-header">
        <div className="schedule-title">
          <Icon name="calendar-days" size="1.25rem" color="#0067D1" />
          <span>排片主网格</span>
        </div>
        <div className="schedule-legend">
          {legendFilms.map(function (f) {
            return (
              <div key={f.filmId} className="legend-item">
                <span className="legend-dot" style={{ background: f.posterColor }} />
                <span>{f.filmName}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="schedule-grid">
        {/* 左侧影厅列 */}
        <div className="grid-hall-col">
          <div className="grid-corner">影厅 / 时间</div>
          {halls.map(function (h) {
            return (
              <div key={h.hallNo} className="grid-hall-cell">
                <span className="grid-hall-name">{h.hallName}</span>
                <span className="grid-hall-seats">{h.seatCount} 座</span>
                <div className="grid-hall-versions">
                  {h.supportedVersions.map(function (v) {
                    return <Tag key={v} color={VERSION_COLOR[v]} style={{ fontSize: "0.625rem", margin: 0, lineHeight: "1.125rem", padding: "0 0.25rem" }}>{v}</Tag>;
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 右侧时间轴 + 网格 */}
        <div className="grid-time-area">
          <div className="time-axis">
            {TICKS.map(function (tick, i) {
              return (
                <div key={i} className={"time-tick" + (tick.isHour ? " hour" : "")}>
                  {tick.isHour ? tick.label : ""}
                </div>
              );
            })}
          </div>
          <div className="grid-rows">
            {showNowLine && (
              <div className="now-line" style={{ left: nowLeftRem + "rem" }}>
                <div className="now-line-dot" />
              </div>
            )}
            {halls.map(function (h) {
              const rowShowtimes = byHall[h.hallNo] || [];
              return (
                <div key={h.hallNo} className="hall-row" style={{ width: (30 * SLOT_REM) + "rem" }}>
                  {rowShowtimes.map(function (st) {
                    const film = filmMap[st.filmId];
                    const color = film ? film.posterColor : "#777777";
                    const leftRem = (toMin(st.startTime) - AXIS_START_MIN) / 30 * SLOT_REM;
                    const widthRem = st.duration / 30 * SLOT_REM;
                    const isOngoing = st.status === "进行中";
                    const isSelected = selectedShowtimeId === st.showtimeId;
                    const isOptimized = !!optimizedSet[st.showtimeId];

                    let cardCls = "showtime-card";
                    if (isOngoing) cardCls += " ongoing";
                    if (isSelected) cardCls += " selected";
                    if (isOptimized) cardCls += " optimized";

                    let borderColor = hexToRgba(color, 0.5);
                    let borderWidth = "1px";
                    if (isOngoing) { borderColor = "var(--success)"; borderWidth = "2px"; }
                    else if (isSelected) { borderColor = "var(--primary)"; borderWidth = "2px"; }
                    else if (isOptimized) { borderColor = "var(--info)"; borderWidth = "2px"; }

                    const occ = st.occupancy;

                    return (
                      <div
                        key={st.showtimeId}
                        className={cardCls}
                        style={{
                          left: leftRem + "rem",
                          width: widthRem + "rem",
                          background: color,
                          borderColor: borderColor,
                          borderWidth: borderWidth,
                        }}
                        onClick={function () { onShowtimeClick(st); }}
                        title={st.filmName + " " + st.startTime + "-" + st.endTime}
                      >
                        {isOptimized && (
                          <Tag color="blue" className="st-optimized-tag" style={{ fontSize: "0.5625rem", margin: 0, lineHeight: "1rem", padding: "0 0.1875rem" }}>已优化</Tag>
                        )}
                        <div className="st-card-top">
                          <span className="st-card-name">{st.filmName}</span>
                          {isOngoing && <span className="st-live-dot" />}
                        </div>
                        <div className="st-card-time">
                          <span>{st.startTime}-{st.endTime}</span>
                          <Tag color={VERSION_COLOR[st.version]} style={{ fontSize: "0.5625rem", margin: 0, lineHeight: "1rem", padding: "0 0.1875rem" }}>{st.version}</Tag>
                        </div>
                        <div className="st-card-progress">
                          <Progress
                            percent={occ}
                            size="small"
                            strokeColor={occColor(occ)}
                            showInfo={false}
                          />
                        </div>
                        <div className="st-card-bottom">
                          <span className="st-card-occupancy">{st.seatSold}/{st.seatTotal}</span>
                          <span className="st-card-occupancy">{occ}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
