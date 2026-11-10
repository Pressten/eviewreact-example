// Layer 2: 机组执勤与备用机 mock —— 按注册号组织的机组配组(pairing)、备用机列表
// 执勤口径: 报到 = 首段计划起飞前 60 分, 解除 = 末段(计划/预计)到达后 30 分
// 预计执勤随主表延误状态联动(getTimePair 预计到达时刻) —— 延误传导会推高预计执勤时长
import { getTimePair } from "./flight.js";

// 机组资源池 —— 单段航班自动配组与行悬浮信息卡共用
export const CAPTAINS = ["张伟", "刘志强", "王建国", "陈志明", "李海峰", "周天宇", "吴建军", "郑海涛"];
export const FIRST_OFFICERS = ["刘洋", "赵鹏", "孙浩", "王磊", "李明", "张健", "马晓东", "郭川"];
export const PURSERS = ["陈思羽", "林悦", "赵梦琪", "郑雅", "何静", "苏晴", "唐蕊", "沈丹", "陆璐", "韩雪", "方圆", "宋佳"];
export const DISPATCHERS = ["李强（A 席）", "王芳（B 席）", "陈静（C 席）", "周敏（D 席）"];

const CABIN_BY_TYPE = {
  "A330-300": 8, "A350-900": 10, "B787-9": 10,
  "A321neo": 5, "A320neo": 5, "B737-800": 5,
};

const hashCode = (s) => s.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

// 机组配组 —— 同一注册号当日接力链条按机组拆段执飞
// dutyLimitMin: 执勤上限 840 分(14 小时)
export const DUTY_LIMIT_MIN = 840;

const PAIRINGS = [
  // PEK · B-6012 (京沪快线轮换)
  { tailNo: "B-6012", legIds: ["PK1", "PK2", "PK3", "PK4"], captain: "张伟", firstOfficer: "刘洋", purser: "陈思羽", cabinCount: 8, report: 520, release: 1335 },
  { tailNo: "B-6012", legIds: ["PK5"], captain: "周天宇", firstOfficer: "王磊", purser: "林悦", cabinCount: 8, report: 1305, release: 1520 },
  // PEK · B-32AR (杭京短程轮换)
  { tailNo: "B-32AR", legIds: ["PK6", "PK7", "PK8", "PK9"], captain: "李海峰", firstOfficer: "孙浩", purser: "赵梦琪", cabinCount: 5, report: 785, release: 1580 },
  // PKX · B-301B (沪京快线轮换)
  { tailNo: "B-301B", legIds: ["KX1", "KX2", "KX3"], captain: "吴建军", firstOfficer: "马晓东", purser: "郑雅", cabinCount: 10, report: 460, release: 1170 },
  { tailNo: "B-301B", legIds: ["KX4", "KX5"], captain: "郭川", firstOfficer: "张健", purser: "何静", cabinCount: 10, report: 1145, release: 1550 },
  // PKX · B-1129 (杭京短程轮换)
  { tailNo: "B-1129", legIds: ["KX6", "KX7", "KX8"], captain: "刘志强", firstOfficer: "李明", purser: "苏晴", cabinCount: 5, report: 800, release: 1435 },
  { tailNo: "B-1129", legIds: ["KX9"], captain: "陈志明", firstOfficer: "赵鹏", purser: "唐蕊", cabinCount: 5, report: 1405, release: 1630 },
  // PVG · B-612W (深沪快线轮换)
  { tailNo: "B-612W", legIds: ["PG1", "PG2", "PG3", "PG4"], captain: "王建国", firstOfficer: "郭川", purser: "沈丹", cabinCount: 10, report: 435, release: 1405 },
  { tailNo: "B-612W", legIds: ["PG5"], captain: "张伟", firstOfficer: "刘洋", purser: "陆璐", cabinCount: 10, report: 1405, release: 1600 },
  // PVG · B-20AE (长沙短程轮换)
  { tailNo: "B-20AE", legIds: ["PG6", "PG7", "PG8"], captain: "郑海涛", firstOfficer: "王磊", purser: "韩雪", cabinCount: 5, report: 795, release: 1430 },
  { tailNo: "B-20AE", legIds: ["PG9"], captain: "李海峰", firstOfficer: "孙浩", purser: "方圆", cabinCount: 5, report: 1400, release: 1630 },
];

// 备用机列表 —— 更换飞机 Modal 使用; 剩余运力 = capacity - 航班旅客数(运行时计算)
export const SPARES = {
  PEK: [
    { tailNo: "B-601W", acType: "A330-300", capacity: 292, status: "可用", note: "停场 518 机位" },
    { tailNo: "B-78DK", acType: "B787-9", capacity: 296, status: "可用", note: "过站短停 · 18:30 后可用" },
    { tailNo: "B-32MP", acType: "A321neo", capacity: 184, status: "检修中", note: "APU 更换 · 明日 09:00 放行" },
    { tailNo: "B-11QT", acType: "B737-800", capacity: 164, status: "外站过夜", note: "当前在呼和浩特" },
  ],
  PKX: [
    { tailNo: "B-30LF", acType: "A350-900", capacity: 316, status: "可用", note: "停场 212 机位" },
    { tailNo: "B-78GT", acType: "B787-9", capacity: 296, status: "可用", note: "AOC 备班 · 即刻可用" },
    { tailNo: "B-20HR", acType: "A320neo", capacity: 174, status: "检修中", note: "起落架例行检查" },
    { tailNo: "B-11NV", acType: "B737-800", capacity: 164, status: "外站过夜", note: "当前在昆明" },
  ],
  PVG: [
    { tailNo: "B-60XS", acType: "A330-300", capacity: 292, status: "可用", note: "停场 T2 115 机位" },
    { tailNo: "B-78JY", acType: "B787-9", capacity: 296, status: "可用", note: "AOC 备班 · 即刻可用" },
    { tailNo: "B-20KZ", acType: "A320neo", capacity: 174, status: "检修中", note: "发动机孔探检查" },
    { tailNo: "B-32NT", acType: "A321neo", capacity: 184, status: "外站过夜", note: "当前在广州" },
  ],
};

const estArrivalOf = (leg) => {
  const pair = getTimePair(leg);
  if (pair && pair.arr) return pair.arr.t;
  return leg.schedArr;
};

// 机组执勤面板数据 —— 随主表选中航班联动
// 返回: 机组信息 + 执勤段航班 + 计划/预计执勤分钟 + 与上限的余量
export function buildCrewPanel(dataset, flightId) {
  const flight = dataset.find((r) => r.id === flightId);
  if (!flight) return null;

  const pairing = PAIRINGS.find((p) => p.legIds.includes(flightId));
  if (pairing) {
    const legs = dataset.filter((r) => pairing.legIds.includes(r.id)).sort((a, b) => a.schedDep - b.schedDep);
    const estRelease = Math.max(...legs.map(estArrivalOf)) + 30;
    return {
      flight,
      captain: pairing.captain,
      firstOfficer: pairing.firstOfficer,
      purser: pairing.purser,
      cabinCount: pairing.cabinCount,
      legs,
      report: pairing.report,
      planMin: pairing.release - pairing.report,
      estMin: Math.max(estRelease - pairing.report, 0),
      pairing: true,
    };
  }

  // 单段航班 —— 按航段自动配组(报到提前 60 分, 解除延后 30 分)
  const seed = hashCode(flight.flightNo + flight.tailNo);
  const report = flight.schedDep - 60;
  const estMin = estArrivalOf(flight) + 30 - report;
  return {
    flight,
    captain: CAPTAINS[seed % CAPTAINS.length],
    firstOfficer: FIRST_OFFICERS[seed % FIRST_OFFICERS.length],
    purser: PURSERS[seed % PURSERS.length],
    cabinCount: CABIN_BY_TYPE[flight.acType] || 5,
    legs: [flight],
    report,
    planMin: estMin,
    estMin,
    pairing: false,
  };
}
