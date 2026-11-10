import { Drawer, Table, Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { filmMap } from "../../mock/film.js";
import { halls } from "../../mock/hall.js";
import { toMin, hexToRgba } from "../../mock/showtime.js";
import "./index.css";

const VERSION_COLOR = { "2D": undefined, "3D": "blue", "IMAX": "purple", "激光": "cyan" };
const STATUS_COLOR = { "进行中": "success", "已结束": "default", "预售中": "processing", "草稿": "warning" };

function checkConflicts(target, allShowtimes) {
  if (!target) return [];
  const sameHall = allShowtimes.filter(function (st) {
    return st.hallNo === target.hallNo && st.showtimeId !== target.showtimeId;
  });
  const conflicts = [];
  const tStart = toMin(target.startTime);
  const tEnd = toMin(target.endTime);
  sameHall.forEach(function (other) {
    const oStart = toMin(other.startTime);
    const oEnd = toMin(other.endTime);
    if (tStart < oEnd && oStart < tEnd) {
      conflicts.push({
        type: "timeClash",
        message: "与「" + other.filmName + "」（" + other.startTime + "-" + other.endTime + "）时段重叠",
      });
    }
    const gapBefore = tStart - oEnd;
    if (gapBefore > 0 && gapBefore < 15) {
      conflicts.push({
        type: "gap",
        message: "与上一场「" + other.filmName + "」（" + other.startTime + "-" + other.endTime + "）间隔仅 " + gapBefore + " 分钟，建议留 20 分钟清洁时间",
      });
    }
    const gapAfter = oStart - tEnd;
    if (gapAfter > 0 && gapAfter < 15) {
      conflicts.push({
        type: "gap",
        message: "与下一场「" + other.filmName + "」（" + other.startTime + "-" + other.endTime + "）间隔仅 " + gapAfter + " 分钟，建议留 20 分钟清洁时间",
      });
    }
  });
  return conflicts;
}

function genSeatZones(occupancy) {
  const weights = [
    ["前排左", 0.3], ["前排中", 0.45], ["前排右", 0.3],
    ["中排左", 0.55], ["中排中", 0.85], ["中排右", 0.55],
    ["后排左", 0.4], ["后排中", 0.6], ["后排右", 0.4],
  ];
  return weights.map(function (w) {
    const pct = Math.min(100, Math.round(occupancy * w[1] * 1.15));
    return { zone: w[0], pct: pct };
  });
}

export default function ShowtimeDetail({ open, showtime, allShowtimes, onClose }) {
  if (!showtime) return null;
  const film = filmMap[showtime.filmId];
  const hall = halls.find(function (h) { return h.hallNo === showtime.hallNo; });
  const conflicts = checkConflicts(showtime, allShowtimes);
  const zones = genSeatZones(showtime.occupancy);
  const totalRevenue = showtime.priceTiers.reduce(function (s, t) { return s + t.price * t.sold; }, 0);

  const columns = [
    { title: "票价档", dataIndex: "tier", key: "tier" },
    { title: "票价(元)", dataIndex: "price", key: "price", align: "right", sorter: function (a, b) { return a.price - b.price; } },
    { title: "已售", dataIndex: "sold", key: "sold", align: "right", sorter: function (a, b) { return a.sold - b.sold; } },
    {
      title: "票房(元)", key: "revenue", align: "right", sorter: function (a, b) { return a.price * a.sold - b.price * b.sold; },
      render: function (_, r) { return r.price * r.sold; },
    },
  ];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="场次详情"
      width={460}
      placement="right"
    >
      <div className="st-detail-header">
        <span className="st-detail-film-name">{showtime.filmName}</span>
        <Tag color={STATUS_COLOR[showtime.status]}>{showtime.status}</Tag>
        <Tag color={VERSION_COLOR[showtime.version]}>{showtime.version}</Tag>
      </div>

      {/* 影片基本信息 */}
      <div className="st-detail-section">
        <div className="st-detail-section-title">
          <Icon name="info" size="1rem" color="#0067D1" />
          影片基本信息
        </div>
        <div className="st-info-grid">
          <div className="st-info-item">
            <span className="st-info-label">片名</span>
            <span className="st-info-value">{film.filmName}</span>
          </div>
          <div className="st-info-item">
            <span className="st-info-label">时长</span>
            <span className="st-info-value">{film.duration} 分钟</span>
          </div>
          <div className="st-info-item">
            <span className="st-info-label">类型</span>
            <span className="st-info-value">{film.genre}</span>
          </div>
          <div className="st-info-item">
            <span className="st-info-label">发行方</span>
            <span className="st-info-value">{film.distributor}</span>
          </div>
          <div className="st-info-item">
            <span className="st-info-label">影厅</span>
            <span className="st-info-value">{hall.hallName}（{hall.seatCount}座）</span>
          </div>
          <div className="st-info-item">
            <span className="st-info-label">场次时间</span>
            <span className="st-info-value">{showtime.startTime} - {showtime.endTime}</span>
          </div>
        </div>
      </div>

      {/* 票价档明细 */}
      <div className="st-detail-section">
        <div className="st-detail-section-title">
          <Icon name="ticket" size="1rem" color="#0067D1" />
          票价档明细（合计 {totalRevenue} 元）
        </div>
        <Table
          dataSource={showtime.priceTiers}
          columns={columns}
          pagination={false}
          size="small"
          rowKey="tier"
          sortDirections={["ascend", "descend", "ascend"]}
          showSorterTooltip={false}
        />
      </div>

      {/* 座位预售分布 */}
      <div className="st-detail-section">
        <div className="st-detail-section-title">
          <Icon name="layout-grid" size="1rem" color="#0067D1" />
          座位预售分布
        </div>
        <div className="screen-bar">银 幕</div>
        <div className="seat-heatmap">
          {zones.map(function (z) {
            const alpha = 0.15 + z.pct / 100 * 0.7;
            return (
              <div key={z.zone} className="seat-zone-cell" style={{ background: hexToRgba("#2070f3", alpha) }}>
                <span className="seat-zone-label">{z.zone}</span>
                <span className="seat-zone-label">{z.pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 排片冲突提示 */}
      <div className="st-detail-section">
        <div className="st-detail-section-title">
          <Icon name="shield-alert" size="1rem" color="#0067D1" />
          排片冲突检测
        </div>
        {conflicts.length === 0 ? (
          <div className="st-conflict-ok">
            <Icon name="circle-check" size="1rem" color="#09AA71" />
            <span>无冲突，场次间隔正常</span>
          </div>
        ) : (
          <div className="st-conflict-list">
            {conflicts.map(function (c, i) {
              return (
                <div key={i} className="st-conflict-item">
                  <Icon name={c.type === "timeClash" ? "circle-x" : "triangle-alert"} size="1rem" color="#E02128" />
                  <span>{c.message}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Drawer>
  );
}
