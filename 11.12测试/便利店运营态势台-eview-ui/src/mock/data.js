// Layer 2: mock 数据 — 连锁便利店「网点运营态势台」
// ②KPI / ③省份网格 / ④门店明细 / ⑥补给看板 / ⑦商圈绩效 共享同一份门店数据，保证口径一致。
// 数据由种子随机数生成，构建可复现。

// ---- 种子随机数（mulberry32，确定性）----
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const REGIONS = ["华东", "华南", "华北", "华中", "西南", "东北"];
export const REGION_OPTIONS = ["全部", ...REGIONS];

// 6 大区 24 省份，门店数合计 480
export const PROVINCE_META = {
  上海: { region: "华东", weight: 34, cities: ["上海"] },
  江苏: { region: "华东", weight: 30, cities: ["南京", "苏州", "无锡"] },
  浙江: { region: "华东", weight: 28, cities: ["杭州", "宁波", "温州"] },
  安徽: { region: "华东", weight: 18, cities: ["合肥", "芜湖"] },
  山东: { region: "华东", weight: 32, cities: ["济南", "青岛", "烟台"] },
  广东: { region: "华南", weight: 48, cities: ["广州", "深圳", "东莞", "佛山"] },
  广西: { region: "华南", weight: 20, cities: ["南宁", "柳州"] },
  海南: { region: "华南", weight: 8, cities: ["海口", "三亚"] },
  福建: { region: "华南", weight: 20, cities: ["福州", "厦门"] },
  北京: { region: "华北", weight: 22, cities: ["北京"] },
  天津: { region: "华北", weight: 14, cities: ["天津"] },
  河北: { region: "华北", weight: 24, cities: ["石家庄", "唐山"] },
  山西: { region: "华北", weight: 10, cities: ["太原"] },
  内蒙古: { region: "华北", weight: 8, cities: ["呼和浩特", "包头"] },
  河南: { region: "华中", weight: 24, cities: ["郑州", "洛阳"] },
  湖北: { region: "华中", weight: 22, cities: ["武汉", "宜昌"] },
  湖南: { region: "华中", weight: 20, cities: ["长沙", "株洲"] },
  四川: { region: "西南", weight: 26, cities: ["成都", "绵阳"] },
  重庆: { region: "西南", weight: 16, cities: ["重庆"] },
  云南: { region: "西南", weight: 10, cities: ["昆明"] },
  贵州: { region: "西南", weight: 6, cities: ["贵阳"] },
  辽宁: { region: "东北", weight: 18, cities: ["沈阳", "大连"] },
  吉林: { region: "东北", weight: 12, cities: ["长春", "吉林"] },
  黑龙江: { region: "东北", weight: 10, cities: ["哈尔滨"] },
};

export const BUSINESS_CIRCLES = ["社区", "写字楼", "交通枢纽", "学校"];

const CIRCLE_BASE = { 社区: 8800, 写字楼: 10200, 交通枢纽: 13500, 学校: 7800 };
const CIRCLE_AREA = { 社区: [85, 150], 写字楼: [55, 100], 交通枢纽: [80, 160], 学校: [65, 110] };

const MANAGERS = [
  "王芳", "李强", "张敏", "刘洋", "陈静", "杨帆", "赵磊", "周婷", "吴昊", "徐丽",
  "孙浩", "朱琳", "胡军", "郭燕", "林峰", "何平", "高翔", "罗娜", "郑凯", "梁晨",
];

const STREETS = [
  "中山路", "南京路", "人民路", "解放路", "淮海路", "长江路", "建设路", "和平路",
  "滨江道", "望江路", "科苑路", "梧桐路", "银杏路", "春熙路", "文化路", "曙光路",
  "湖滨路", "环湖路", "前进路", "光明路",
];

const OPEN_HOURS = ["06:30-23:30", "07:00-23:00", "07:00-22:30", "06:00-24:00", "24小时"];

export const PRODUCT_CATALOG = [
  { productName: "鲜牛奶 950ml", category: "鲜食" },
  { productName: "三明治·全蛋", category: "鲜食" },
  { productName: "饭团·金枪鱼", category: "鲜食" },
  { productName: "关东煮套餐", category: "鲜食" },
  { productName: "冰美式咖啡", category: "饮料" },
  { productName: "柠檬茶 500ml", category: "饮料" },
  { productName: "矿泉水 550ml", category: "饮料" },
  { productName: "薯片·黄瓜味", category: "休闲食品" },
  { productName: "泡面·红烧牛肉", category: "休闲食品" },
  { productName: "抽取式纸巾", category: "日用百货" },
  { productName: "湿巾 80 抽", category: "日用百货" },
  { productName: "5 号电池 2 粒", category: "日用百货" },
];

const LICENSE_TYPES = ["食品经营许可证", "烟草专卖零售许可证", "营业执照"];

function pad4(n) {
  return String(n).padStart(4, "0");
}

// ---- 门店主数据（唯一事实来源）----
function buildStores() {
  const rnd = mulberry32(20261109);
  const list = [];
  let no = 0;
  Object.keys(PROVINCE_META).forEach((prov) => {
    const meta = PROVINCE_META[prov];
    for (let k = 0; k < meta.weight; k++) {
      no += 1;
      const city = meta.cities[k % meta.cities.length];
      const businessCircle = BUSINESS_CIRCLES[Math.floor(rnd() * 4)];
      const majorStockout = (no - 1) % 61 === 30; // 8 家重点缺货门店，均匀散布各大区

      let status = "营业中";
      const sr = rnd();
      if (sr < 0.032) status = "歇业";
      else if (sr < 0.058) status = "装修中";
      if (majorStockout) status = "营业中"; // 重点缺货门店保持营业

      const base = CIRCLE_BASE[businessCircle] * (0.72 + rnd() * 0.62);
      const operating = status === "营业中";
      const dailySales = operating ? Math.round(base / 10) * 10 : 0;
      const yesterdaySales = Math.round((base * (1.12 + rnd() * 0.3)) / 10) * 10;
      const ticket = 11.5 + rnd() * 5.5;
      const customerCount = operating ? Math.round(dailySales / ticket) : 0;

      let stockoutSku = 0;
      let lastRestockTime = null;
      if (majorStockout) {
        stockoutSku = 22 + Math.floor(rnd() * 25); // 22-46
      } else if (rnd() < 0.11) {
        stockoutSku = 1 + Math.floor(rnd() * 18); // 1-18
      }
      if (stockoutSku > 0) {
        lastRestockTime = `11-0${6 + Math.floor(rnd() * 3)} ${10 + Math.floor(rnd() * 12)}:${rnd() < 0.5 ? "20" : "50"}`;
      }

      const [aLo, aHi] = CIRCLE_AREA[businessCircle];
      const areaSqm = Math.round(aLo + rnd() * (aHi - aLo));

      list.push({
        no,
        storeId: `HL${pad4(no)}`,
        storeName: `${city}·${STREETS[(no + k * 3) % STREETS.length]}店`,
        province: prov,
        region: meta.region,
        city,
        businessCircle,
        status,
        managerName: MANAGERS[Math.floor(rnd() * MANAGERS.length)],
        areaSqm,
        openHours: OPEN_HOURS[Math.floor(rnd() * OPEN_HOURS.length)],
        licenseStatus: rnd() < 0.94 ? "有效" : "年审中",
        dailySales,
        yesterdaySales,
        customerCount,
        stockoutSku,
        lastRestockTime,
        inspectionScore: 78 + Math.floor(rnd() * 20),
        restocked: false,
      });
    }
  });
  return list;
}

const STORES = buildStores();

// ---- 巡检问题（6 条，绑定真实门店；高危未整改 → 门店计入异常）----
const ISSUE_SEEDS = [
  { no: 51, type: "临期商品未下架", severity: "高", occurredAt: "11-08 15:42", status: "待整改" },
  { no: 134, type: "乳制品温控超标", severity: "高", occurredAt: "11-08 09:20", status: "待整改" },
  { no: 217, type: "卫生不达标", severity: "中", occurredAt: "11-07 16:05", status: "整改中" },
  { no: 300, type: "消防通道堆物", severity: "高", occurredAt: "11-07 10:48", status: "待整改" },
  { no: 383, type: "证照未悬挂", severity: "中", occurredAt: "11-06 11:30", status: "整改中" },
  { no: 466, type: "收银小票缺失", severity: "低", occurredAt: "11-05 18:12", status: "已整改" },
];

export const INSPECTION_ISSUES = ISSUE_SEEDS.map((seed, i) => {
  const st = STORES.find((s) => s.no === seed.no);
  st.inspectionScore = 62 + ((seed.no * 7) % 12); // 问题门店评分偏低 62-73
  return {
    id: `ISSUE-${1000 + i}`,
    storeId: st.storeId,
    storeName: st.storeName,
    province: st.province,
    region: st.region,
    type: seed.type,
    severity: seed.severity,
    occurredAt: seed.occurredAt,
    status: seed.status,
  };
});

// ---- 证照到期提醒（3 条，剩余 <30 天 Badge 红色）----
const LICENSE_SEEDS = [
  {
    no: 12,
    licenseType: LICENSE_TYPES[0],
    expiryDate: "2026-11-21",
    daysLeft: 12,
    agency: "上海浦东新区政务服务中心",
    handler: "证照专员·徐丽",
    estimate: "5 个工作日",
  },
  {
    no: 199,
    licenseType: LICENSE_TYPES[1],
    expiryDate: "2026-12-04",
    daysLeft: 25,
    agency: "广州天河区政务服务中心",
    handler: "证照专员·郭燕",
    estimate: "7 个工作日",
  },
  {
    no: 350,
    licenseType: LICENSE_TYPES[2],
    expiryDate: "2027-01-11",
    daysLeft: 63,
    agency: "武汉江汉区政务服务中心",
    handler: "证照专员·罗娜",
    estimate: "5 个工作日",
  },
];

export const LICENSE_ALERTS = LICENSE_SEEDS.map((seed, i) => {
  const st = STORES.find((s) => s.no === seed.no);
  st.licenseStatus = "即将到期";
  return {
    id: `LIC-${100 + i}`,
    storeId: st.storeId,
    storeName: st.storeName,
    province: st.province,
    region: st.region,
    licenseType: seed.licenseType,
    expiryDate: seed.expiryDate,
    daysLeft: seed.daysLeft,
    agency: seed.agency,
    handler: seed.handler,
    estimate: seed.estimate,
  };
});

export const INITIAL_STORES = STORES;

// ---- 异常门店口径：非营业态 / 缺货>20 / 高危巡检未闭环（全页统一）----
export function isStoreAbnormal(store) {
  if (store.status !== "营业中") return true;
  if (store.stockoutSku > 20) return true;
  const issue = INSPECTION_ISSUES.find((it) => it.storeId === store.storeId);
  return !!(issue && issue.severity === "高" && issue.status !== "已整改");
}

// ---- 补货紧急度口径：缺货越多越紧急（补给看板/门店明细一致）----
export function stockoutUrgency(store) {
  if (store.stockoutSku >= 25) return "2小时";
  if (store.stockoutSku >= 12) return "当日";
  return "次日";
}

// ---- 近 30 日全国趋势（末位=今日实时合计，昨日=昨日营业额合计，与 KPI 同口径）----
function buildTrend(stores) {
  const r = mulberry32(4321);
  const todaySales = stores.reduce((a, s) => a + s.dailySales, 0);
  const todayCust = stores.reduce((a, s) => a + s.customerCount, 0);
  const ySales = stores.reduce((a, s) => a + s.yesterdaySales, 0);
  const yCust = Math.round(stores.reduce((a, s) => a + s.yesterdaySales / 13.8, 0));
  const arr = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(2026, 10, 9 - i);
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const date = `${mm}-${dd}`;
    if (i === 0) {
      arr.push({ date, dailySales: todaySales, customerCount: todayCust });
    } else if (i === 1) {
      arr.push({ date, dailySales: ySales, customerCount: yCust });
    } else {
      const wkSales = 4460000 * (0.94 + r() * 0.12) * (weekend ? 1.32 : 1);
      const wkCust = 336000 * (0.95 + r() * 0.1) * (weekend ? 1.38 : 1);
      arr.push({
        date,
        dailySales: Math.round(wkSales / 1000) * 1000,
        customerCount: Math.round(wkCust / 100) * 100,
      });
    }
  }
  return arr;
}

export const TREND_30D = buildTrend(STORES);

// ---- 门店详情：近 7 日营业额（周一→周日周期内，周末上浮）----
export function storeWeekSeries(store) {
  const r = mulberry32(store.no * 131 + 7);
  const dates = ["11-03", "11-04", "11-05", "11-06", "11-07", "11-08", "11-09"];
  const weekend = [0, 0, 0, 0, 1, 1, 0];
  const base = store.yesterdaySales || 9000;
  return dates.map((d, i) => ({
    日期: d,
    营业额: Math.round((base * (0.8 + r() * 0.4) * (weekend[i] ? 1.25 : 1)) / 10) * 10,
  }));
}

// ---- 门店详情：今日分时客流（午晚双峰）----
export function storeHourlySeries(store) {
  const r = mulberry32(store.no * 313 + 11);
  const hours = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"];
  const weights = [4, 5, 7, 9, 11, 10, 7, 6, 6, 9, 13, 12, 8, 5, 3];
  const totalW = weights.reduce((a, b) => a + b, 0);
  const total = store.customerCount || 420;
  return hours.map((h, i) => ({
    时段: `${h}:00`,
    客流: Math.max(1, Math.round((total * weights[i]) / totalW * (0.9 + r() * 0.2))),
  }));
}

// ---- 门店详情：缺货 TOP5 商品 ----
export function storeStockTop5(store) {
  const r = mulberry32(store.no * 517 + 3);
  const pool = [...PRODUCT_CATALOG];
  const picked = [];
  const start = Math.floor(r() * pool.length);
  for (let i = 0; i < 5; i++) {
    picked.push(pool[(start + i * 2) % pool.length]);
  }
  return picked.map((p) => ({
    ...p,
    shelfRemaining: Math.floor(r() * 3), // 0-2 件
  }));
}
