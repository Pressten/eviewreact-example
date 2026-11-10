import { films, filmMap } from "./film.js";
import { halls } from "./hall.js";

const hallMap = {};
halls.forEach(function (h) { hallMap[h.hallNo] = h; });

// 时间工具
export const toMin = function (t) {
  const p = t.split(":");
  return Number(p[0]) * 60 + Number(p[1]);
};
export const fmtTime = function (min) {
  let h = Math.floor(min / 60);
  const m = min % 60;
  if (h >= 24) h -= 24;
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
};

export const AXIS_START_MIN = 540;  // 09:00
export const AXIS_END_MIN = 1440;   // 24:00
export const SLOT_REM = 3;          // 每 30 分钟一格 = 3rem

// hex → rgba
export function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
}

// 生成票价档明细
function genPriceTiers(version, seatSold) {
  let base = 45;
  if (version === "IMAX") base = 80;
  else if (version === "激光") base = 65;
  else if (version === "3D") base = 55;
  const normalSold = Math.floor(seatSold * 0.55);
  const memberSold = Math.floor(seatSold * 0.32);
  const vipSold = Math.max(0, seatSold - normalSold - memberSold);
  return [
    { tier: "普通", price: base, sold: normalSold },
    { tier: "会员", price: Math.round(base * 0.82), sold: memberSold },
    { tier: "VIP", price: Math.round(base * 1.5), sold: vipSold },
  ];
}

// 影城 A 排片原始数据：[hallNo, startTime, filmId, version, seatSold, status]
const rawA = [
  // 1号 IMAX厅 380座
  [1, "09:00", "F01", "IMAX", 280, "已结束"],
  [1, "11:40", "F05", "IMAX", 320, "已结束"],
  [1, "14:10", "F01", "激光", 350, "已结束"],
  [1, "16:50", "F05", "IMAX", 365, "进行中"],
  [1, "19:20", "F01", "IMAX", 240, "预售中"],
  [1, "22:00", "F02", "激光", 180, "预售中"],
  // 2号 巨幕厅 260座
  [2, "09:00", "F04", "3D", 180, "已结束"],
  [2, "11:00", "F03", "2D", 220, "已结束"],
  [2, "13:15", "F04", "激光", 200, "已结束"],
  [2, "15:20", "F01", "激光", 250, "已结束"],
  [2, "18:00", "F05", "3D", 230, "进行中"],
  [2, "20:30", "F02", "2D", 160, "预售中"],
  [2, "22:55", "F07", "激光", 90, "预售中"],
  // 3号 标准厅 180座
  [3, "09:00", "F06", "2D", 120, "已结束"],
  [3, "11:10", "F08", "3D", 150, "已结束"],
  [3, "12:58", "F03", "2D", 80, "已结束"],
  [3, "15:20", "F08", "2D", 60, "已结束"],
  [3, "17:15", "F07", "2D", 140, "进行中"],
  [3, "19:35", "F03", "2D", 160, "预售中"],
  [3, "21:50", "F07", "激光", 100, "预售中"],
  // 4号 标准厅 160座
  [4, "09:00", "F08", "2D", 100, "已结束"],
  [4, "11:00", "F03", "2D", 130, "已结束"],
  [4, "13:15", "F07", "2D", 30, "已结束"],
  [4, "15:30", "F06", "2D", 90, "已结束"],
  [4, "17:40", "F05", "2D", 155, "进行中"],
  [4, "20:10", "F02", "2D", 120, "预售中"],
  [4, "22:35", "F06", "2D", 70, "预售中"],
  // 5号 标准厅 150座
  [5, "09:30", "F07", "2D", 28, "已结束"],
  [5, "11:50", "F08", "3D", 120, "已结束"],
  [5, "13:45", "F03", "2D", 30, "已结束"],
  [5, "16:00", "F04", "3D", 140, "已结束"],
  [5, "18:00", "F01", "3D", 145, "进行中"],
  [5, "20:40", "F07", "2D", 110, "预售中"],
  [5, "23:00", "F08", "2D", 40, "预售中"],
  // 6号 标准厅 140座
  [6, "09:00", "F03", "2D", 70, "已结束"],
  [6, "11:15", "F06", "2D", 90, "已结束"],
  [6, "13:20", "F08", "3D", 100, "已结束"],
  [6, "15:15", "F02", "2D", 130, "已结束"],
  [6, "17:40", "F07", "2D", 25, "进行中"],
  [6, "19:55", "F03", "2D", 135, "预售中"],
  [6, "22:10", "F06", "2D", 80, "预售中"],
];

// 影城 B 排片
const rawB = [
  [1, "09:30", "F01", "IMAX", 220, "已结束"],
  [1, "12:10", "F05", "IMAX", 280, "已结束"],
  [1, "15:00", "F01", "激光", 310, "已结束"],
  [1, "17:40", "F05", "IMAX", 340, "进行中"],
  [1, "20:10", "F01", "IMAX", 200, "预售中"],
  [2, "10:00", "F04", "3D", 150, "已结束"],
  [2, "12:00", "F03", "2D", 180, "已结束"],
  [2, "14:20", "F01", "激光", 240, "已结束"],
  [2, "17:10", "F05", "3D", 220, "已结束"],
  [2, "19:40", "F02", "2D", 140, "预售中"],
  [2, "22:10", "F07", "激光", 70, "预售中"],
  [3, "09:30", "F06", "2D", 90, "已结束"],
  [3, "11:40", "F08", "3D", 120, "已结束"],
  [3, "13:50", "F03", "2D", 60, "已结束"],
  [3, "16:10", "F07", "2D", 110, "进行中"],
  [3, "18:30", "F03", "2D", 150, "预售中"],
  [3, "20:50", "F07", "激光", 80, "预售中"],
  [4, "10:00", "F08", "2D", 80, "已结束"],
  [4, "12:00", "F03", "2D", 110, "已结束"],
  [4, "14:20", "F07", "2D", 40, "已结束"],
  [4, "16:40", "F05", "2D", 140, "进行中"],
  [4, "19:10", "F02", "2D", 100, "预售中"],
  [5, "10:00", "F07", "2D", 22, "已结束"],
  [5, "12:20", "F08", "3D", 100, "已结束"],
  [5, "16:30", "F04", "3D", 130, "进行中"],
  [5, "18:40", "F01", "3D", 135, "进行中"],
  [5, "21:20", "F07", "2D", 90, "预售中"],
  [6, "09:30", "F03", "2D", 60, "已结束"],
  [6, "11:50", "F06", "2D", 80, "已结束"],
  [6, "14:00", "F08", "3D", 90, "已结束"],
  [6, "18:20", "F07", "2D", 20, "进行中"],
  [6, "20:40", "F03", "2D", 120, "预售中"],
];

// 影城 C 排片
const rawC = [
  [1, "10:00", "F01", "IMAX", 260, "已结束"],
  [1, "12:40", "F05", "IMAX", 300, "已结束"],
  [1, "15:30", "F01", "激光", 330, "已结束"],
  [1, "18:10", "F01", "IMAX", 350, "进行中"],
  [1, "20:50", "F05", "IMAX", 190, "预售中"],
  [2, "09:30", "F04", "3D", 160, "已结束"],
  [2, "11:30", "F03", "2D", 190, "已结束"],
  [2, "13:50", "F04", "激光", 170, "已结束"],
  [2, "16:00", "F01", "激光", 240, "已结束"],
  [2, "18:40", "F05", "3D", 220, "进行中"],
  [2, "21:10", "F02", "2D", 150, "预售中"],
  [3, "09:30", "F06", "2D", 100, "已结束"],
  [3, "11:40", "F08", "3D", 130, "已结束"],
  [3, "14:00", "F03", "2D", 70, "已结束"],
  [3, "16:20", "F08", "2D", 50, "已结束"],
  [3, "18:10", "F07", "2D", 130, "进行中"],
  [3, "20:30", "F03", "2D", 155, "预售中"],
  [4, "10:00", "F08", "2D", 90, "已结束"],
  [4, "11:50", "F03", "2D", 120, "已结束"],
  [4, "14:00", "F06", "2D", 80, "已结束"],
  [4, "16:10", "F07", "2D", 35, "已结束"],
  [4, "18:20", "F05", "2D", 150, "进行中"],
  [4, "20:50", "F02", "2D", 110, "预售中"],
  [5, "10:00", "F08", "3D", 110, "已结束"],
  [5, "12:00", "F03", "2D", 25, "已结束"],
  [5, "14:10", "F04", "3D", 130, "已结束"],
  [5, "16:10", "F01", "3D", 140, "进行中"],
  [5, "18:50", "F07", "2D", 100, "预售中"],
  [6, "09:30", "F03", "2D", 65, "已结束"],
  [6, "11:50", "F06", "2D", 85, "已结束"],
  [6, "14:10", "F02", "2D", 125, "已结束"],
  [6, "16:40", "F07", "2D", 18, "进行中"],
  [6, "19:00", "F03", "2D", 130, "预售中"],
  [6, "21:20", "F06", "2D", 75, "预售中"],
];

const rawMap = { A: rawA, B: rawB, C: rawC };

function build(raw, cinemaId) {
  const seqByHall = {};
  const result = [];
  raw.forEach(function (r) {
    const hallNo = r[0], startTime = r[1], filmId = r[2], version = r[3], seatSold = r[4], status = r[5];
    const film = filmMap[filmId];
    const hall = hallMap[hallNo];
    seqByHall[hallNo] = (seqByHall[hallNo] || 0) + 1;
    const seq = seqByHall[hallNo];
    const startMin = toMin(startTime);
    const endMin = startMin + film.duration;
    const endTime = fmtTime(endMin);
    const seatTotal = hall.seatCount;
    const occupancy = Math.round(seatSold / seatTotal * 100);
    result.push({
      showtimeId: "ST-" + hallNo + "-" + seq,
      cinemaId: cinemaId,
      hallNo: hallNo,
      filmId: filmId,
      filmName: film.filmName,
      startTime: startTime,
      endTime: endTime,
      duration: film.duration,
      version: version,
      priceTiers: genPriceTiers(version, seatSold),
      seatSold: seatSold,
      seatTotal: seatTotal,
      occupancy: occupancy,
      status: status,
    });
  });
  return result;
}

export function getShowtimes(cinemaId) {
  const raw = rawMap[cinemaId] || rawA;
  return build(raw, cinemaId);
}

// 概览统计
export function computeOverview(showtimes, hallsData) {
  const totalShowtimes = showtimes.length;
  const totalSeats = hallsData.reduce(function (s, h) { return s + h.seatCount; }, 0);
  let totalSold = 0;
  let totalCapacity = 0;
  let preSaleRevenue = 0;
  showtimes.forEach(function (st) {
    totalSold += st.seatSold;
    totalCapacity += st.seatTotal;
    st.priceTiers.forEach(function (t) {
      preSaleRevenue += t.price * t.sold;
    });
  });
  const avgOccupancy = totalCapacity > 0 ? Math.round(totalSold / totalCapacity * 100) : 0;
  return {
    totalShowtimes: totalShowtimes,
    totalSeats: totalSeats,
    preSaleBoxOffice: (preSaleRevenue / 10000).toFixed(1),
    avgOccupancy: avgOccupancy,
  };
}
