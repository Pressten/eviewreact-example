// Layer 2: 航班动态 mock 数据 —— 3 个基地机场(PEK/PKX/PVG) × 3 个运行日(昨日/今日/明日)
// 时间口径: 分钟数(从当日 00:00 起算), 跨零点航班直接写 ≥1440 的分钟值, fmt() 负责回显
// 语义字段: flightNo 航班号 / tailNo 注册号 / from,to 航段 / dir 出港|进港 / acType 机型
//           schedDep,schedArr 计划起降 / gate 登机口 / paxCount 旅客数 / transferPax 中转旅客数

export const AIRPORTS = [
  { code: "PEK", name: "首都", fullName: "北京首都" },
  { code: "PKX", name: "大兴", fullName: "北京大兴" },
  { code: "PVG", name: "浦东", fullName: "上海浦东" },
];

// 机场代码 → 城市名(用于航段全称展示与中文搜索)
export const CITY_NAMES = {
  PEK: "北京首都", PKX: "北京大兴", PVG: "上海浦东", SHA: "上海虹桥",
  CAN: "广州", SZX: "深圳", HGH: "杭州", CSX: "长沙", NKG: "南京",
  HRB: "哈尔滨", XIY: "西安", KMG: "昆明", URC: "乌鲁木齐", DLC: "大连",
  TAO: "青岛", TSN: "天津", SJW: "石家庄", TNA: "济南", KWE: "贵阳",
  HKG: "香港", XMN: "厦门", SYX: "三亚", CKG: "重庆", HAK: "海口",
};

const t = (s) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));

// 分钟数 → "HH:MM"
export const fmt = (min) => {
  const m = ((min % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

// 跨零点标记: 返回 0 / 1(+1 日)
export const plusDays = (min) => Math.floor(min / 1440);

// 字段序: id / flightNo / tailNo / from / to / dir / acType / dep / arr / gate / pax / tp
const f = (id, flightNo, tailNo, from, to, dir, acType, dep, arr, gate, pax, tp) => ({
  id, flightNo, tailNo, from, to, dir, acType,
  schedDep: dep, schedArr: arr, gate, paxCount: pax, transferPax: tp,
});

// 登机口调度网格使用的口位列表(与下方各机场 gate 字段严格一致)
export const GATE_LIST = ["C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08"];

// ---------------------------------------------------------------------------
// 航班计划表 —— 同一注册号(tailNo)构成当日接力轮换链条
// 轮换A: 宽体机 基地↔干线快线(5 段) / 轮换B: 窄体机 中短程(4 段) / 其余为单段航班
// 登机口统一收敛到 C01-C08(登机口调度网格口径)
// ---------------------------------------------------------------------------
const SCHEDULES = {
  PEK: [
    f("PK1", "HY1520", "B-6012", "SHA", "PEK", "arr", "A330-300", t("09:10"), t("11:15"), "C01", 262, 0),
    f("PK2", "HY1521", "B-6012", "PEK", "SHA", "dep", "A330-300", t("13:30"), t("15:35"), "C01", 286, 42),
    f("PK3", "HY1522", "B-6012", "SHA", "PEK", "arr", "A330-300", t("16:35"), t("18:40"), "C06", 271, 38),
    f("PK4", "HY1527", "B-6012", "PEK", "SHA", "dep", "A330-300", t("19:40"), t("21:45"), "C06", 265, 51),
    f("PK5", "HY1528", "B-6012", "SHA", "PEK", "arr", "A330-300", t("22:45"), 1490, "C07", 248, 33), // 到达 00:50(+1)
    f("PK6", "HY1835", "B-32AR", "PEK", "HGH", "dep", "A321neo", t("14:05"), t("16:10"), "C02", 172, 24),
    f("PK7", "HY1836", "B-32AR", "HGH", "PEK", "arr", "A321neo", t("17:20"), t("19:25"), "C08", 158, 19),
    f("PK8", "HY1717", "B-32AR", "PEK", "SHA", "dep", "A321neo", t("20:35"), t("22:40"), "C02", 162, 21),
    f("PK9", "HY1718", "B-32AR", "SHA", "PEK", "arr", "A321neo", t("23:45"), 1550, "C08", 139, 15), // 到达 01:50(+1)
    f("PK10", "HY1721", "B-78AE", "PEK", "CAN", "dep", "B787-9", t("07:25"), t("10:35"), "C02", 253, 0),
    f("PK11", "HY1798", "B-30LX", "HKG", "PEK", "arr", "A350-900", t("09:05"), t("12:20"), "C03", 231, 0),
    f("PK12", "HY1626", "B-20CT", "PEK", "XIY", "dep", "A320neo", t("11:40"), t("13:50"), "C02", 148, 0),
    f("PK13", "HY1567", "B-11QF", "SZX", "PEK", "arr", "B737-800", t("12:15"), t("15:20"), "C04", 207, 0),
    f("PK14", "HY1483", "B-60D9", "KMG", "PEK", "arr", "A330-300", t("12:55"), t("16:10"), "C05", 218, 0),
    f("PK15", "HY1267", "B-32BK", "PEK", "HRB", "dep", "A321neo", t("14:55"), t("16:50"), "C03", 132, 0),
    f("PK16", "HY1359", "B-20EM", "PEK", "CKG", "dep", "A320neo", t("15:10"), t("17:55"), "C04", 181, 0),
    f("PK17", "HY1585", "B-11RN", "PEK", "CSX", "dep", "B737-800", t("15:40"), t("18:25"), "C05", 195, 0),
    f("PK18", "HY1620", "B-20FN", "PEK", "NKG", "dep", "A320neo", t("18:25"), t("20:30"), "C06", 168, 0),
  ],
  PKX: [
    f("KX1", "HY2530", "B-301B", "SHA", "PKX", "arr", "A350-900", t("08:40"), t("10:45"), "C01", 294, 0),
    f("KX2", "HY2531", "B-301B", "PKX", "SHA", "dep", "A350-900", t("13:45"), t("15:50"), "C01", 301, 56),
    f("KX3", "HY2532", "B-301B", "SHA", "PKX", "arr", "A350-900", t("16:55"), t("19:00"), "C07", 288, 47),
    f("KX4", "HY2543", "B-301B", "PKX", "SHA", "dep", "A350-900", t("20:05"), t("22:10"), "C08", 276, 39),
    f("KX5", "HY2544", "B-301B", "SHA", "PKX", "arr", "A350-900", t("23:15"), 1520, "C07", 243, 31), // 到达 01:20(+1)
    f("KX6", "HY2715", "B-1129", "PKX", "HGH", "dep", "B737-800", t("14:20"), t("16:35"), "C03", 156, 18),
    f("KX7", "HY2716", "B-1129", "HGH", "PKX", "arr", "B737-800", t("17:45"), t("20:00"), "C05", 149, 14),
    f("KX8", "HY2623", "B-1129", "PKX", "HGH", "dep", "B737-800", t("21:10"), t("23:25"), "C06", 161, 17),
    f("KX9", "HY2624", "B-1129", "HGH", "PKX", "arr", "B737-800", 1465, 1600, "C08", 138, 12), // 00:25 起飞 / 02:45 到达(+1)
    f("KX10", "HY2821", "B-78BL", "PKX", "SZX", "dep", "B787-9", t("07:55"), t("11:15"), "C02", 247, 0),
    f("KX11", "HY2868", "B-20GL", "XMN", "PKX", "arr", "A320neo", t("09:35"), t("12:30"), "C02", 189, 0),
    f("KX12", "HY2762", "B-20HN", "PKX", "KWE", "dep", "A320neo", t("12:05"), t("15:10"), "C02", 142, 0),
    f("KX13", "HY2835", "B-32JP", "SYX", "PKX", "arr", "A321neo", t("11:20"), t("15:05"), "C05", 226, 0),
    f("KX14", "HY2850", "B-11KQ", "HRB", "PKX", "arr", "B737-800", t("12:40"), t("15:30"), "C06", 173, 0),
    f("KX15", "HY2912", "B-11LR", "PKX", "URC", "dep", "B737-800", t("14:50"), t("18:40"), "C04", 158, 0),
    f("KX16", "HY2935", "B-32MS", "PKX", "NKG", "dep", "A321neo", t("15:20"), t("17:30"), "C03", 177, 0),
    f("KX17", "HY2958", "B-11NT", "PKX", "DLC", "dep", "B737-800", t("16:40"), t("18:05"), "C04", 121, 0),
    f("KX18", "HY2971", "B-20PR", "PKX", "XIY", "dep", "A320neo", t("17:55"), t("20:05"), "C06", 166, 0),
  ],
  PVG: [
    f("PG1", "HY3315", "B-612W", "SZX", "PVG", "arr", "B787-9", t("08:15"), t("10:35"), "C01", 279, 0),
    f("PG2", "HY3316", "B-612W", "PVG", "SZX", "dep", "B787-9", t("13:40"), t("16:00"), "C01", 295, 49),
    f("PG3", "HY3317", "B-612W", "SZX", "PVG", "arr", "B787-9", t("17:10"), t("19:30"), "C07", 282, 41),
    f("PG4", "HY3331", "B-612W", "PVG", "SZX", "dep", "B787-9", t("20:40"), t("22:55"), "C08", 268, 37),
    f("PG5", "HY3332", "B-612W", "SZX", "PVG", "arr", "B787-9", t("23:55"), 1570, "C07", 231, 28), // 到达 02:10(+1)
    f("PG6", "HY3512", "B-20AE", "PVG", "CSX", "dep", "A320neo", t("14:15"), t("16:30"), "C03", 164, 16),
    f("PG7", "HY3513", "B-20AE", "CSX", "PVG", "arr", "A320neo", t("17:40"), t("19:55"), "C05", 157, 13),
    f("PG8", "HY3526", "B-20AE", "PVG", "CSX", "dep", "A320neo", t("21:05"), t("23:20"), "C06", 148, 15),
    f("PG9", "HY3527", "B-20AE", "CSX", "PVG", "arr", "A320neo", 1465, 1600, "C08", 133, 11), // 00:25 起飞 / 02:40 到达(+1)
    f("PG10", "HY3621", "B-78QW", "PVG", "PEK", "dep", "B787-9", t("08:05"), t("10:25"), "C01", 268, 0),
    f("PG11", "HY3688", "B-30RT", "CAN", "PVG", "arr", "A350-900", t("09:45"), t("12:35"), "C02", 242, 0),
    f("PG12", "HY3715", "B-32SV", "PVG", "HRB", "dep", "A321neo", t("11:50"), t("15:05"), "C04", 179, 0),
    f("PG13", "HY3654", "B-60TW", "SYX", "PVG", "arr", "A330-300", t("10:55"), t("14:20"), "C05", 233, 0),
    f("PG14", "HY3826", "B-30VX", "KMG", "PVG", "arr", "A350-900", t("12:35"), t("15:45"), "C04", 251, 0),
    f("PG15", "HY3855", "B-20YZ", "PVG", "TAO", "dep", "A320neo", t("14:53"), t("16:48"), "C02", 146, 0),
    f("PG16", "HY3877", "B-20ZB", "PVG", "NKG", "dep", "A320neo", t("15:35"), t("16:55"), "C06", 118, 0),
    f("PG17", "HY3892", "B-11CD", "PVG", "DLC", "dep", "B737-800", t("17:20"), t("19:10"), "C06", 129, 0),
    f("PG18", "HY3901", "B-78EF", "PVG", "HAK", "dep", "B787-9", t("16:15"), t("19:20"), "C03", 214, 0),
  ],
};

// ---------------------------------------------------------------------------
// 分日变体 —— 默认状态: 昨日=arrived(已收尾) / 今日与明日=scheduled, 差异在此打补丁
// delay: 延误分钟(状态=delayed) / projected: 计划态航班的预计传导延误
// divert: 备降信息 / reasons: 延误·取消·备降原因(悬浮卡与波及链展示)
// ---------------------------------------------------------------------------
const VARIANTS = {
  PEK: {
    yesterday: {
      status: { PK2: "delayed", PK3: "delayed", PK4: "delayed", PK5: "delayed", PK12: "cancelled", PK15: "cancelled", PK14: "diverted" },
      delay: { PK2: 38, PK3: 52, PK4: 74, PK5: 96 },
      divert: { PK14: { to: "TSN", at: t("15:55") } },
      reasons: {
        PK2: "虹桥雷雨 · 流量控制", PK3: "前段延误传导", PK4: "机务故障排除", PK5: "宵禁时隙受限",
        PK12: "目的地雷雨 · 调减取消", PK15: "机组临时病假 · 调减取消", PK14: "首都雷雨 · 备降天津",
      },
    },
    today: {
      status: {
        PK1: "arrived", PK10: "arrived", PK11: "arrived", PK12: "departed", PK13: "departed",
        PK14: "diverted", PK15: "boarding", PK16: "boarding", PK17: "cancelled", PK18: "cancelled",
        PK2: "delayed", PK3: "delayed", PK4: "delayed", PK5: "delayed", PK6: "delayed", PK7: "delayed",
      },
      delay: { PK2: 45, PK3: 60, PK4: 95, PK5: 130, PK6: 70, PK7: 105 },
      projected: { PK8: 140, PK9: 175 },
      divert: { PK14: { to: "TSN", at: t("15:42") } },
      reasons: {
        PK2: "虹桥雷雨 · 流量控制", PK3: "前段延误传导", PK4: "前段延误传导 · 登机口紧张",
        PK5: "宵禁时隙受限", PK6: "昨日过站晚到", PK7: "前段延误传导",
        PK14: "首都雷雨 · 备降天津", PK17: "目的地雷雨 · 取消", PK18: "机组执勤超时 · 取消",
      },
    },
    tomorrow: {
      status: { PK17: "cancelled", PK18: "cancelled" },
      reasons: { PK17: "台风预案 · 预防性调减", PK18: "台风预案 · 预防性调减" },
    },
  },
  PKX: {
    yesterday: {
      status: { KX2: "delayed", KX3: "delayed", KX4: "delayed", KX5: "delayed", KX13: "diverted", KX15: "cancelled", KX18: "cancelled" },
      delay: { KX2: 42, KX3: 68, KX4: 90, KX5: 117 },
      divert: { KX13: { to: "TNA", at: t("15:55") } },
      reasons: {
        KX2: "虹桥雷雨 · 流量控制", KX3: "前段延误传导", KX4: "前段延误传导 · 时隙紧张", KX5: "宵禁时隙受限",
        KX13: "大兴侧风超限 · 备降济南", KX15: "APU 故障 · 调减取消", KX18: "航路流量控制 · 取消",
      },
    },
    today: {
      status: {
        KX1: "arrived", KX10: "arrived", KX11: "arrived", KX12: "departed", KX13: "departed",
        KX14: "diverted", KX15: "boarding", KX16: "boarding", KX17: "cancelled", KX18: "cancelled",
        KX2: "delayed", KX3: "delayed", KX4: "delayed", KX5: "delayed", KX6: "delayed", KX7: "delayed",
      },
      delay: { KX2: 55, KX3: 75, KX4: 108, KX5: 142, KX6: 64, KX7: 92 },
      projected: { KX8: 126, KX9: 158 },
      divert: { KX14: { to: "SJW", at: t("15:12") } },
      reasons: {
        KX2: "虹桥雷雨 · 流量控制", KX3: "前段延误传导", KX4: "前段延误传导 · 时隙紧张", KX5: "宵禁时隙受限",
        KX6: "昨日过站晚到", KX7: "前段延误传导", KX14: "大兴侧风超限 · 备降石家庄",
        KX17: "运控调减取消", KX18: "航路流量控制 · 取消",
      },
    },
    tomorrow: {
      status: { KX12: "cancelled", KX18: "cancelled" },
      reasons: { KX12: "台风预案 · 预防性调减", KX18: "台风预案 · 预防性调减" },
    },
  },
  PVG: {
    yesterday: {
      status: { PG2: "delayed", PG3: "delayed", PG4: "delayed", PG5: "delayed", PG13: "diverted", PG12: "cancelled", PG15: "cancelled" },
      delay: { PG2: 44, PG3: 63, PG4: 85, PG5: 112 },
      divert: { PG13: { to: "NKG", at: t("13:46") } },
      reasons: {
        PG2: "深圳雷雨 · 流量控制", PG3: "前段延误传导", PG4: "前段延误传导 · 时隙紧张", PG5: "宵禁时隙受限",
        PG13: "浦东雷雨 · 备降南京", PG12: "目的地雷雨 · 调减取消", PG15: "机组资源调配 · 取消",
      },
    },
    today: {
      status: {
        PG1: "arrived", PG10: "arrived", PG11: "arrived", PG12: "departed", PG14: "departed",
        PG13: "diverted", PG15: "boarding", PG16: "boarding", PG17: "cancelled", PG18: "cancelled",
        PG2: "delayed", PG3: "delayed", PG4: "delayed", PG5: "delayed", PG6: "delayed", PG7: "delayed",
      },
      delay: { PG2: 50, PG3: 68, PG4: 96, PG5: 124, PG6: 58, PG7: 84 },
      projected: { PG8: 112, PG9: 139 },
      divert: { PG13: { to: "HGH", at: t("13:58") } },
      reasons: {
        PG2: "深圳雷雨 · 流量控制", PG3: "前段延误传导", PG4: "前段延误传导 · 时隙紧张", PG5: "宵禁时隙受限",
        PG6: "昨日过站晚到", PG7: "前段延误传导", PG13: "浦东雷雨 · 备降杭州",
        PG17: "空域流量限制 · 取消", PG18: "台风预案 · 取消",
      },
    },
    tomorrow: {
      status: { PG17: "cancelled", PG18: "cancelled" },
      reasons: { PG17: "台风预案 · 预防性调减", PG18: "台风预案 · 预防性调减" },
    },
  },
};

// 状态元数据 —— Tag 文案与 Lucide 图标
export const STATUS_META = {
  scheduled: { label: "计划", icon: "clock" },
  boarding: { label: "登机中", icon: "door-open" },
  departed: { label: "已起飞", icon: "plane-takeoff" },
  arrived: { label: "已到达", icon: "circle-check-big" },
  delayed: { label: "延误", icon: "triangle-alert" },
  cancelled: { label: "取消", icon: "circle-x" },
  diverted: { label: "备降", icon: "plane-landing" },
};
export const STATUS_KEYS = Object.keys(STATUS_META);

// 组装某一机场 × 运行日的完整数据集
// overrides: 运行处置覆盖(⑨ 操作栏发布) —— 按航班 id 覆盖 status/delayMinutes/tailNo/delayReason
export function buildDataset(airportCode, dayKey, overrides) {
  const schedule = SCHEDULES[airportCode];
  const variant = VARIANTS[airportCode][dayKey];
  const finished = dayKey === "yesterday";
  const rows = schedule.map((s) => {
    const status = (variant.status && variant.status[s.id]) || (finished ? "arrived" : "scheduled");
    const delay = (variant.delay && variant.delay[s.id]) || 0;
    const projected = (variant.projected && variant.projected[s.id]) || 0;
    const divert = variant.divert && variant.divert[s.id];
    const row = {
      ...s,
      status,
      delayMinutes: status === "delayed" ? delay : 0,
      projectedDelay: projected,
      divertTo: divert ? divert.to : null,
      divertAt: divert ? divert.at : null,
      delayReason: (variant.reasons && variant.reasons[s.id]) || "",
      finished,
    };
    const ov = overrides && overrides[s.id];
    if (ov) {
      if (ov.status) row.status = ov.status;
      if (typeof ov.delayMinutes === "number") row.delayMinutes = row.status === "delayed" ? ov.delayMinutes : 0;
      if (ov.tailNo) row.tailNo = ov.tailNo;
      if (ov.delayReason) row.delayReason = ov.delayReason;
    }
    return row;
  });
  return rows;
}

// 预计/实际起降时间对 —— dep/arr: { t 分钟, act 是否实际值, late 延误分钟, alt 备降机场 }
export function getTimePair(row) {
  switch (row.status) {
    case "cancelled":
      return null;
    case "diverted":
      return { dep: { t: row.schedDep, act: true }, arr: { t: row.divertAt, act: true, alt: row.divertTo } };
    case "arrived":
      return { dep: { t: row.schedDep, act: true }, arr: { t: row.schedArr, act: true } };
    case "departed":
      return { dep: { t: row.schedDep, act: true }, arr: { t: row.schedArr, act: false } };
    case "delayed": {
      const d = row.delayMinutes;
      return { dep: { t: row.schedDep + d, act: row.finished, late: d }, arr: { t: row.schedArr + d, act: row.finished, late: d } };
    }
    default:
      return { dep: { t: row.schedDep, act: false }, arr: { t: row.schedArr, act: false } };
  }
}

// 延误波及链 —— 同注册号、当日后续(最多 3 段)接力航班
// node: { leg 航班, cumulative 累计延误, propagated 本段传导, projected 是否为预计推算 }
export function buildChain(dataset, flightId) {
  const head = dataset.find((r) => r.id === flightId);
  if (!head) return null;
  const legs = dataset
    .filter((r) => r.tailNo === head.tailNo && r.schedDep > head.schedDep)
    .sort((a, b) => a.schedDep - b.schedDep)
    .slice(0, 3);
  let prev = head.delayMinutes || 0;
  const nodes = legs.map((leg) => {
    const cumulative = leg.status === "delayed" ? leg.delayMinutes : leg.projectedDelay || 0;
    const node = {
      leg,
      cumulative,
      propagated: Math.max(cumulative - prev, 0),
      projected: leg.status !== "delayed" && !!leg.projectedDelay,
    };
    prev = cumulative;
    return node;
  });
  return { head, nodes };
}
