// Layer 2: 运营周报数据域（连锁零售）
// 单位约定: 金额 = 万元; 人数 = 人次; 比率 = %
// 门店级字面量 + 派生口径（漏斗人数、完成率）在本模块内确定性推导,保证 ④⑦⑧ 数据可对上。

/* ── 工具函数 ────────────────────────────────────────────── */

function round(value, digits = 1) {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

function sumBy(list, field) {
  return list.reduce((acc, item) => acc + item[field], 0);
}

export function formatNumber(value, digits = 0) {
  const fixed = Number(value).toFixed(digits);
  const [intPart, decimalPart] = fixed.split(".");
  const withSeparator = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimalPart ? `${withSeparator}.${decimalPart}` : withSeparator;
}

/* ── 周报元信息 ──────────────────────────────────────────── */

export const WEEK_INFO = {
  brandName: "云杉优选",
  weekNumber: 42,
  weekTitle: "第 42 周运营周报",
  dateRange: "2026-10-12 ~ 2026-10-18",
  weekdayNote: "周一至周日",
  monthRange: "2026-10-01 ~ 2026-10-18",
  monthElapsedRate: 58.1, // 时间进度: 18 / 31 天
  compileTime: "2026-10-19 08:30",
};

export const REGION_ORDER = ["华东", "华南", "华北", "西南", "华中", "东北"];

export const REGION_FULL_NAME = {
  华东: "华东大区",
  华南: "华南大区",
  华北: "华北大区",
  西南: "西南大区",
  华中: "华中大区",
  东北: "东北大区",
};

/* ── 门店基础数据（20 家 · 字面量）────────────────────────── */

const STORE_BASE = [
  { storeId: "ST001", storeName: "上海南京路旗舰店", city: "上海", region: "华东", offlineSales: 132.6, onlineSales: 58.4, avgTicket: 252, monthlyTarget: 520, monthlyActual: 503, addToCartRate: 0.6, dealFromCartRate: 0.49, repeatBuyRate: 0.31, memberRate: 0.17 },
  { storeId: "ST002", storeName: "上海徐家汇店", city: "上海", region: "华东", offlineSales: 96.8, onlineSales: 41.2, avgTicket: 246, monthlyTarget: 372, monthlyActual: 361, addToCartRate: 0.59, dealFromCartRate: 0.48, repeatBuyRate: 0.3, memberRate: 0.16 },
  { storeId: "ST003", storeName: "杭州西湖店", city: "杭州", region: "华东", offlineSales: 88.4, onlineSales: 35.6, avgTicket: 238, monthlyTarget: 336, monthlyActual: 322, addToCartRate: 0.58, dealFromCartRate: 0.48, repeatBuyRate: 0.29, memberRate: 0.18 },
  { storeId: "ST004", storeName: "南京新街口店", city: "南京", region: "华东", offlineSales: 82.2, onlineSales: 33.4, avgTicket: 244, monthlyTarget: 313, monthlyActual: 302, addToCartRate: 0.57, dealFromCartRate: 0.47, repeatBuyRate: 0.3, memberRate: 0.15 },
  { storeId: "ST005", storeName: "苏州工业园店", city: "苏州", region: "华东", offlineSales: 64.5, onlineSales: 26.8, avgTicket: 232, monthlyTarget: 249, monthlyActual: 238, addToCartRate: 0.56, dealFromCartRate: 0.47, repeatBuyRate: 0.28, memberRate: 0.15 },
  { storeId: "ST006", storeName: "广州天河店", city: "广州", region: "华南", offlineSales: 94.2, onlineSales: 38.6, avgTicket: 241, monthlyTarget: 358, monthlyActual: 334, addToCartRate: 0.6, dealFromCartRate: 0.5, repeatBuyRate: 0.3, memberRate: 0.17 },
  { storeId: "ST007", storeName: "深圳福田店", city: "深圳", region: "华南", offlineSales: 90.6, onlineSales: 44.2, avgTicket: 249, monthlyTarget: 362, monthlyActual: 338, addToCartRate: 0.61, dealFromCartRate: 0.49, repeatBuyRate: 0.32, memberRate: 0.18 },
  { storeId: "ST008", storeName: "深圳南山店", city: "深圳", region: "华南", offlineSales: 78.4, onlineSales: 36.8, avgTicket: 243, monthlyTarget: 310, monthlyActual: 288, addToCartRate: 0.6, dealFromCartRate: 0.48, repeatBuyRate: 0.31, memberRate: 0.17 },
  { storeId: "ST009", storeName: "佛山岭南店", city: "佛山", region: "华南", offlineSales: 52.6, onlineSales: 21.4, avgTicket: 228, monthlyTarget: 202, monthlyActual: 186, addToCartRate: 0.55, dealFromCartRate: 0.46, repeatBuyRate: 0.27, memberRate: 0.14 },
  { storeId: "ST010", storeName: "北京朝阳大悦城店", city: "北京", region: "华北", offlineSales: 102.4, onlineSales: 46.8, avgTicket: 258, monthlyTarget: 400, monthlyActual: 428, addToCartRate: 0.62, dealFromCartRate: 0.5, repeatBuyRate: 0.33, memberRate: 0.19 },
  { storeId: "ST011", storeName: "北京中关村店", city: "北京", region: "华北", offlineSales: 76.8, onlineSales: 34.2, avgTicket: 247, monthlyTarget: 298, monthlyActual: 315, addToCartRate: 0.61, dealFromCartRate: 0.49, repeatBuyRate: 0.31, memberRate: 0.18 },
  { storeId: "ST012", storeName: "天津滨江道店", city: "天津", region: "华北", offlineSales: 58.4, onlineSales: 23.6, avgTicket: 234, monthlyTarget: 221, monthlyActual: 218, addToCartRate: 0.57, dealFromCartRate: 0.47, repeatBuyRate: 0.29, memberRate: 0.15 },
  { storeId: "ST013", storeName: "成都春熙路店", city: "成都", region: "西南", offlineSales: 86.2, onlineSales: 33.8, avgTicket: 239, monthlyTarget: 324, monthlyActual: 302, addToCartRate: 0.59, dealFromCartRate: 0.49, repeatBuyRate: 0.3, memberRate: 0.18 },
  { storeId: "ST014", storeName: "成都高新店", city: "成都", region: "西南", offlineSales: 62.4, onlineSales: 28.6, avgTicket: 245, monthlyTarget: 246, monthlyActual: 229, addToCartRate: 0.58, dealFromCartRate: 0.48, repeatBuyRate: 0.31, memberRate: 0.16 },
  { storeId: "ST015", storeName: "重庆解放碑店", city: "重庆", region: "西南", offlineSales: 68.8, onlineSales: 27.2, avgTicket: 236, monthlyTarget: 259, monthlyActual: 242, addToCartRate: 0.58, dealFromCartRate: 0.47, repeatBuyRate: 0.29, memberRate: 0.17 },
  { storeId: "ST016", storeName: "武汉江汉路店", city: "武汉", region: "华中", offlineSales: 71.4, onlineSales: 29.8, avgTicket: 242, monthlyTarget: 273, monthlyActual: 251, addToCartRate: 0.57, dealFromCartRate: 0.48, repeatBuyRate: 0.29, memberRate: 0.16 },
  { storeId: "ST017", storeName: "长沙五一广场店", city: "长沙", region: "华中", offlineSales: 66.2, onlineSales: 27.4, avgTicket: 237, monthlyTarget: 253, monthlyActual: 232, addToCartRate: 0.58, dealFromCartRate: 0.47, repeatBuyRate: 0.28, memberRate: 0.16 },
  { storeId: "ST018", storeName: "郑州二七店", city: "郑州", region: "华中", offlineSales: 48.6, onlineSales: 19.8, avgTicket: 226, monthlyTarget: 185, monthlyActual: 168, addToCartRate: 0.54, dealFromCartRate: 0.46, repeatBuyRate: 0.27, memberRate: 0.14 },
  { storeId: "ST019", storeName: "沈阳中街店", city: "沈阳", region: "东北", offlineSales: 54.8, onlineSales: 22.6, avgTicket: 231, monthlyTarget: 209, monthlyActual: 193, addToCartRate: 0.56, dealFromCartRate: 0.46, repeatBuyRate: 0.28, memberRate: 0.15 },
  { storeId: "ST020", storeName: "大连星海店", city: "大连", region: "东北", offlineSales: 46.2, onlineSales: 18.4, avgTicket: 229, monthlyTarget: 174, monthlyActual: 160, addToCartRate: 0.55, dealFromCartRate: 0.46, repeatBuyRate: 0.28, memberRate: 0.14 },
];

// 派生门店口径: 漏斗人数由「销售额 → 成交人数 → 进店/加购/复购」逐级推导
export const STORES = STORE_BASE.map((base) => {
  const totalSales = round(base.offlineSales + base.onlineSales, 1);
  const dealCount = Math.round((totalSales * 10000) / base.avgTicket);
  const footfall = Math.round(dealCount / (base.addToCartRate * base.dealFromCartRate));
  const addToCartCount = Math.round(footfall * base.addToCartRate);
  const repeatBuyCount = Math.round(dealCount * base.repeatBuyRate);
  const memberNewCount = Math.round(dealCount * base.memberRate);
  return {
    ...base,
    totalSales,
    dealCount,
    footfall,
    addToCartCount,
    repeatBuyCount,
    memberNewCount,
    monthlyCompletion: round((base.monthlyActual / base.monthlyTarget) * 100, 1),
  };
});

/* ── 门店范围筛选 ────────────────────────────────────────── */

export function filterStoresByScope(scope) {
  if (!scope || scope === "ALL") return STORES;
  return STORES.filter((store) => store.region === scope);
}

export function buildScopeOptions() {
  return [
    { value: "ALL", label: `全部门店（${STORES.length} 家）` },
    ...REGION_ORDER.map((region) => ({
      value: region,
      label: `${REGION_FULL_NAME[region]}（${STORES.filter((store) => store.region === region).length} 家）`,
    })),
  ];
}

/* ── ② 周核心指标（口径固定为全部门店）───────────────────── */

const TREND_WEEKS = ["W35", "W36", "W37", "W38", "W39", "W40", "W41", "W42"];

const KPI_META = [
  { metricKey: "sales", metricName: "周销售额", unit: "万元", icon: "banknote", yoyRate: 8.6, digits: 1, trendFactors: [0.92, 0.88, 0.95, 0.9, 0.96, 0.93, 0.97, 1] },
  { metricKey: "footfall", metricName: "周客流量", unit: "万人次", icon: "users", yoyRate: -2.1, digits: 1, trendFactors: [0.95, 0.98, 0.93, 0.99, 0.94, 0.97, 0.99, 1] },
  { metricKey: "avgTicket", metricName: "客单价", unit: "元", icon: "receipt", yoyRate: 5.4, digits: 1, trendFactors: [0.96, 0.94, 0.97, 0.95, 0.98, 0.96, 0.99, 1] },
  { metricKey: "memberNew", metricName: "会员新增", unit: "人", icon: "user-plus", yoyRate: 12.4, digits: 0, trendFactors: [0.84, 0.9, 0.87, 0.94, 0.91, 0.96, 0.99, 1] },
];

export function buildKpiList() {
  const totalSales = round(sumBy(STORES, "totalSales"), 1);
  const totalFootfallWan = round(sumBy(STORES, "footfall") / 10000, 1);
  const totalDealCount = sumBy(STORES, "dealCount");
  const avgTicket = round((totalSales * 10000) / totalDealCount, 1);
  const totalMemberNew = sumBy(STORES, "memberNewCount");
  const currentValues = { sales: totalSales, footfall: totalFootfallWan, avgTicket, memberNew: totalMemberNew };

  return KPI_META.map((meta) => {
    const current = currentValues[meta.metricKey];
    const history = TREND_WEEKS.map((weekLabel, index) => {
      const factor = meta.trendFactors[index];
      return {
        weekLabel,
        current: round(current * factor, meta.digits),
        lastYear: round((current * factor) / (1 + meta.yoyRate / 100), meta.digits),
      };
    });
    return {
      ...meta,
      value: current,
      valueText: formatNumber(current, meta.digits),
      lastYearText: formatNumber(round(current / (1 + meta.yoyRate / 100), meta.digits), meta.digits),
      latestWeekLabel: TREND_WEEKS[TREND_WEEKS.length - 1],
      history,
    };
  });
}

/* ── ③ 门店销售对比（线上/线下双口径汇总）────────────────── */

export function buildChannelStats(storeList) {
  const offlineTotal = round(sumBy(storeList, "offlineSales"), 1);
  const onlineTotal = round(sumBy(storeList, "onlineSales"), 1);
  const total = round(offlineTotal + onlineTotal, 1);
  return {
    offlineTotal,
    onlineTotal,
    total,
    offlineText: formatNumber(offlineTotal, 1),
    onlineText: formatNumber(onlineTotal, 1),
    totalText: formatNumber(total, 1),
    onlineShare: total > 0 ? round((onlineTotal / total) * 100, 1) : 0,
    offlineShare: total > 0 ? round((offlineTotal / total) * 100, 1) : 0,
  };
}

/* ── ④ 销售漏斗（占比合计 100% · 逐级递减）───────────────── */

export const FUNNEL_STAGES = [
  { stageKey: "visit", stageName: "进店客流", countField: "footfall", prevField: null },
  { stageKey: "cart", stageName: "加购", countField: "addToCartCount", prevField: "footfall" },
  { stageKey: "deal", stageName: "成交", countField: "dealCount", prevField: "addToCartCount" },
  { stageKey: "repeat", stageName: "复购", countField: "repeatBuyCount", prevField: "dealCount" },
];

export function buildFunnel(storeList) {
  const counts = FUNNEL_STAGES.map((stage) => sumBy(storeList, stage.countField));
  const totalCount = counts.reduce((acc, count) => acc + count, 0);
  const shares = counts.map((count) => round((count / totalCount) * 100, 1));
  // 修正舍入残差,保证占比合计严格等于 100%
  const residual = round(100 - shares.reduce((acc, share) => acc + share, 0), 1);
  shares[0] = round(shares[0] + residual, 1);

  const stages = FUNNEL_STAGES.map((stage, index) => ({
    stageKey: stage.stageKey,
    stageName: stage.stageName,
    count: counts[index],
    countText: formatNumber(counts[index]),
    share: shares[index],
    conversionFromPrev: index === 0 ? null : round((counts[index] / counts[index - 1]) * 100, 1),
  }));
  return {
    totalCount,
    stages,
    // 进店 → 成交 的整体转化率（漏斗核心结论）
    overallConversion: round((counts[2] / counts[0]) * 100, 1),
    repeatRate: round((counts[3] / counts[2]) * 100, 1),
  };
}

export function buildStageStoreDetail(storeList, stageKey) {
  const stage = FUNNEL_STAGES.find((item) => item.stageKey === stageKey) || FUNNEL_STAGES[0];
  const stageTotal = sumBy(storeList, stage.countField);
  return storeList
    .map((store) => {
      const stageCount = store[stage.countField];
      return {
        storeId: store.storeId,
        storeName: store.storeName,
        city: store.city,
        region: store.region,
        regionFullName: REGION_FULL_NAME[store.region],
        stageCount,
        stageCountText: formatNumber(stageCount),
        stageShare: round((stageCount / stageTotal) * 100, 1),
        stageShareText: `${round((stageCount / stageTotal) * 100, 1)}%`,
        conversionFromPrev: stage.prevField
          ? round((stageCount / store[stage.prevField]) * 100, 1)
          : null,
      };
    })
    .sort((a, b) => b.stageCount - a.stageCount);
}

/* ── ⑤ 城市排行（绝对值 · 严格降序）──────────────────────── */

export function buildCityRank(storeList) {
  const cityMap = new Map();
  storeList.forEach((store) => {
    cityMap.set(store.city, round((cityMap.get(store.city) || 0) + store.totalSales, 1));
  });
  return [...cityMap.entries()]
    .map(([city, citySales]) => ({ city, citySales }))
    .sort((a, b) => b.citySales - a.citySales)
    .slice(0, 10);
}

/* ── ⑥ 品类毛利率排名（相对大小 · 严格降序）───────────────── */

export const CATEGORY_MARGINS = [
  { categoryName: "珠宝配饰", grossMarginRate: 58.6 },
  { categoryName: "美妆护肤", grossMarginRate: 54.2 },
  { categoryName: "香氛个护", grossMarginRate: 49.8 },
  { categoryName: "家居生活", grossMarginRate: 45.3 },
  { categoryName: "精品箱包", grossMarginRate: 42.1 },
  { categoryName: "数码配件", grossMarginRate: 38.7 },
  { categoryName: "时尚女装", grossMarginRate: 36.4 },
  { categoryName: "潮流鞋靴", grossMarginRate: 33.9 },
  { categoryName: "商务男装", grossMarginRate: 31.2 },
  { categoryName: "运动户外", grossMarginRate: 29.6 },
  { categoryName: "童装亲子", grossMarginRate: 27.4 },
  { categoryName: "食品滋补", grossMarginRate: 22.8 },
];

/* ── ⑦⑧ 目标完成度（六区域按目标加权,与仪表盘可对上）─────── */

export function buildRegionProgress(storeList) {
  const regionMap = new Map();
  storeList.forEach((store) => {
    const entry = regionMap.get(store.region) || { region: store.region, target: 0, actual: 0 };
    entry.target += store.monthlyTarget;
    entry.actual += store.monthlyActual;
    regionMap.set(store.region, entry);
  });
  return [...regionMap.values()]
    .map((entry) => ({
      ...entry,
      regionFullName: REGION_FULL_NAME[entry.region],
      storeCount: STORES.filter((store) => store.region === entry.region).length,
      completion: round((entry.actual / entry.target) * 100, 1),
    }))
    .sort((a, b) => b.completion - a.completion);
}

export function buildOverallCompletion(storeList) {
  const target = sumBy(storeList, "monthlyTarget");
  const actual = sumBy(storeList, "monthlyActual");
  const completion = round((actual / target) * 100, 1);
  return {
    target,
    actual,
    completion,
    targetText: formatNumber(target),
    actualText: formatNumber(actual),
    gap: round(target - actual, 1),
    gapText: formatNumber(round(target - actual, 1)),
    leadOverTime: round(completion - WEEK_INFO.monthElapsedRate, 1),
  };
}

/* ── ⑨ 周要闻与下周重点 ──────────────────────────────────── */

export const WEEK_EVENTS = [
  {
    eventId: "EV1",
    eventDate: "10-13",
    eventWeekday: "周一",
    eventTitle: "华南区「双倍积分」会员活动上线",
    eventDetail: "广州、深圳、佛山 4 店联动，会员新增环比 +38%，贡献会员销售 286 万元。",
    resultTag: { tagText: "超预期", tagLevel: "success" },
  },
  {
    eventId: "EV2",
    eventDate: "10-14",
    eventWeekday: "周二",
    eventTitle: "北京朝阳大悦城店焕新重装开业",
    eventDetail: "重装后首日销售额 58.3 万元，创单店单日历史新高，客流环比 +46%。",
    resultTag: { tagText: "达成", tagLevel: "success" },
  },
  {
    eventId: "EV3",
    eventDate: "10-15",
    eventWeekday: "周三",
    eventTitle: "全渠道库存中台切换新 WMS 系统",
    eventDetail: "线上线下库存实时同步上线，12 个品类库存准确率提升至 99.2%。",
    resultTag: { tagText: "运行中", tagLevel: "info" },
  },
  {
    eventId: "EV4",
    eventDate: "10-16",
    eventWeekday: "周四",
    eventTitle: "台风「海鸥」过境华南",
    eventDetail: "佛山岭南店闭店 1 天，广州、深圳 3 店客流下滑，预计影响销售约 12 万元。",
    resultTag: { tagText: "已恢复", tagLevel: "warning" },
  },
  {
    eventId: "EV5",
    eventDate: "10-17",
    eventWeekday: "周五",
    eventTitle: "秋季新品「绒·暖」系列全国首发",
    eventDetail: "周末档售罄率 71%，带动客单价环比 +3.1%，将持续补货至双十一前。",
    resultTag: { tagText: "热销", tagLevel: "success" },
  },
];

export const NEXT_WEEK_PLANS = [
  {
    planId: "PL1",
    planTitle: "双十一预售启动会与全渠道营销排期",
    planDetail: "确认预售价格策略、直播档期与门店体验专场分工。",
    ownerName: "李婉如",
    ownerRole: "市场部",
    progress: 45,
    dueDate: "10-21",
    priorityLevel: "高",
  },
  {
    planId: "PL2",
    planTitle: "华北大区超额达成激励方案宣导",
    planDetail: "针对月度完成率 104.6% 的超额表现，审批并宣导门店激励方案。",
    ownerName: "陈昊",
    ownerRole: "运营部",
    progress: 70,
    dueDate: "10-22",
    priorityLevel: "中",
  },
  {
    planId: "PL3",
    planTitle: "佛山岭南店台风损失盘点与理赔",
    planDetail: "完成受损货架与库存盘点，提交保险理赔申报材料。",
    ownerName: "赵铭",
    ownerRole: "行政部",
    progress: 20,
    dueDate: "10-24",
    priorityLevel: "高",
  },
];

/* ── 内容增强: 派生洞察（随门店范围联动重算）──────────────── */

// ③ 标杆门店与待提升门店
export function buildStoreExtremes(storeList) {
  if (!storeList.length) return null;
  const sorted = [...storeList].sort((a, b) => b.totalSales - a.totalSales);
  const topStore = sorted[0];
  const bottomStore = sorted[sorted.length - 1];
  return {
    topStoreName: topStore.storeName,
    topStoreSales: round(topStore.totalSales, 1),
    bottomStoreName: bottomStore.storeName,
    bottomStoreSales: round(bottomStore.totalSales, 1),
  };
}

// ⑤ 城市集中度洞察
export function buildCityInsights(storeList) {
  const cityRank = buildCityRank(storeList);
  const totalSales = round(sumBy(storeList, "totalSales"), 1);
  const cityCount = new Set(storeList.map((store) => store.city)).size;
  const top3Sales = round(
    cityRank.slice(0, 3).reduce((acc, city) => acc + city.citySales, 0),
    1
  );
  const topCity = cityRank[0] || { city: "—", citySales: 0 };
  return {
    cityCount,
    topCityName: topCity.city,
    topCitySales: topCity.citySales,
    top3Share: totalSales > 0 ? round((top3Sales / totalSales) * 100, 1) : 0,
  };
}

// ⑥ 品类毛利率洞察（排名单调一致,极差可验算）
export function buildCategoryInsights() {
  const highest = CATEGORY_MARGINS[0];
  const lowest = CATEGORY_MARGINS[CATEGORY_MARGINS.length - 1];
  return {
    highestName: highest.categoryName,
    highestRate: highest.grossMarginRate,
    lowestName: lowest.categoryName,
    lowestRate: lowest.grossMarginRate,
    spread: round(highest.grossMarginRate - lowest.grossMarginRate, 1),
  };
}

// ⑧ 区域洞察（平均完成率 / 超额区域 / 完成率区间 / 与时间进度对比）
export function buildRegionInsights(storeList) {
  const regions = buildRegionProgress(storeList);
  const overall = buildOverallCompletion(storeList);
  const averageCompletion = regions.length
    ? round(regions.reduce((acc, region) => acc + region.completion, 0) / regions.length, 1)
    : 0;
  const exceedRegions = regions.filter((region) => region.completion >= 100);
  const topRegion = regions[0];
  const bottomRegion = regions[regions.length - 1];
  const insightNote =
    regions.length === 1
      ? `${regions[0].regionFullName}完成率 ${regions[0].completion}%，${
          regions[0].completion >= 100 ? "已提前超额达成全月目标" : "按当前周速稳步推进中"
        }。`
      : `${topRegion.regionFullName}领跑（${topRegion.completion}%），${bottomRegion.regionFullName}暂列末位（${bottomRegion.completion}%）；建议关注末位区域的新品到店与促销节奏。`;
  return {
    regions,
    overall,
    averageCompletion,
    exceedCount: exceedRegions.length,
    exceedNames: exceedRegions.map((region) => region.regionFullName).join("、"),
    minCompletion: bottomRegion ? bottomRegion.completion : 0,
    maxCompletion: topRegion ? topRegion.completion : 0,
    insightNote,
  };
}

// ⑨ 经营提示（管理层一页速览的行动建议,数字与上方各区块口径一致）
export const MANAGEMENT_TIPS = [
  {
    tipId: "MT1",
    tipIcon: "target",
    tipTitle: "全月目标提前锁定在望",
    tipDetail: "整体完成率 95.7%，剩余缺口 254 万元约合 0.8 个销售日，建议提前规划超额激励分配。",
  },
  {
    tipId: "MT2",
    tipIcon: "trophy",
    tipTitle: "复制华北大区超额经验",
    tipDetail: "华北完成率 104.6% 率先超额，其焕新陈列与社群拼团打法建议向华东、华南输出。",
  },
  {
    tipId: "MT3",
    tipIcon: "shopping-cart",
    tipTitle: "线上占比冲刺 35%",
    tipDetail: "本周线上销售占比 29.9%，双十一预售前重点强化直播专场与到家业务引流。",
  },
  {
    tipId: "MT4",
    tipIcon: "package",
    tipTitle: "低毛利品类结构优化",
    tipDetail: "食品滋补毛利率 22.8% 为 12 品类最低，Q4 建议重谈供货价并收缩长尾 SKU。",
  },
];
