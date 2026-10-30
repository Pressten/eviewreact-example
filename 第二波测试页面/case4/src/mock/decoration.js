// Layer 2: 店铺装修业务 mock — 12 种组件类型 / 4 个页面的楼层 / 发布记录 / 预览商品

// ── 12 种楼层组件类型（添加面板下拉 + 类型 Tag + 表格图标）──
export const COMPONENT_TYPES = [
  { key: "carousel", label: "轮播图", icon: "images", tagColor: "blue" },
  { key: "seckill", label: "秒杀模块", icon: "zap", tagColor: "red" },
  { key: "recommend", label: "商品推荐", icon: "package", tagColor: "green" },
  { key: "imageText", label: "图文卡片", icon: "file-text", tagColor: "purple" },
  { key: "video", label: "视频模块", icon: "video", tagColor: "cyan" },
  { key: "coupon", label: "优惠券", icon: "ticket-percent", tagColor: "orange" },
  { key: "searchBar", label: "搜索栏", icon: "search", tagColor: "geekblue" },
  { key: "notice", label: "公告栏", icon: "megaphone", tagColor: "gold" },
  { key: "navGrid", label: "导航宫格", icon: "layout-grid", tagColor: "lime" },
  { key: "floatService", label: "悬浮客服", icon: "headset", tagColor: "magenta" },
  { key: "countdownBanner", label: "倒计时横幅", icon: "timer", tagColor: "volcano" },
  { key: "memberRights", label: "会员权益", icon: "crown", tagColor: "geekblue" },
];

export function findType(key) {
  return COMPONENT_TYPES.find((t) => t.key === key) || COMPONENT_TYPES[0];
}

// 支持替换图片素材的楼层类型（素材库「替换」按钮的目标范围）
export const IMAGE_FLOOR_TYPES = ["carousel", "imageText", "video", "countdownBanner"];

// ── 每种类型的默认内容配置（新增组件 / 编辑弹窗字段来源）──
const TYPE_DEFAULT_CONFIG = {
  carousel: { title: "轮播图", imageIds: ["mat-01", "mat-02"], autoPlay: true, interval: 3 },
  seckill: { title: "限时秒杀", endsAt: "2026-10-30 20:00", productCount: 3 },
  recommend: { title: "猜你喜欢", productCount: 6 },
  imageText: { title: "图文卡片", subtitle: "填写副标题文案", imageId: "mat-05", link: "/page/story" },
  video: { title: "品牌视频", imageId: "mat-06", duration: "02:15" },
  coupon: { title: "领券中心", couponCount: 3 },
  searchBar: { hint: "搜索商品关键词" },
  notice: { content: "新店开业全场满 299 减 50，10 月 31 日截止！" },
  navGrid: { columnCount: 4, entryCount: 8 },
  floatService: { labelText: "在线客服" },
  countdownBanner: { title: "双 11 预售开启", endsAt: "2026-10-31 20:00", imageId: "mat-03" },
  memberRights: { title: "会员权益", levelText: "黑金会员" },
};

// 样式默认值（编辑弹窗「样式设置」页签）
const STYLE_DEFAULTS = { showTitle: true, bgTheme: "default", radius: 8, spacing: 6 };

export function createFloor(typeKey, seq) {
  const type = findType(typeKey);
  return {
    id: `f-new-${seq}`,
    name: `新建${type.label} ${String(seq).padStart(2, "0")}`,
    type: typeKey,
    status: true,
    uvShare: 0,
    config: { ...STYLE_DEFAULTS, ...TYPE_DEFAULT_CONFIG[typeKey] },
  };
}

function floor(id, name, type, uvShare, status, config, scheduledAt = null) {
  return {
    id,
    name,
    type,
    status,
    uvShare,
    scheduledAt,
    config: { ...STYLE_DEFAULTS, ...TYPE_DEFAULT_CONFIG[type], ...config },
  };
}

// ── 4 个装修页面及楼层（排序号 = 数组顺序，UV 占比合计 ≤ 100%）──
export const INITIAL_PAGES = {
  home: {
    key: "home",
    title: "首页",
    draftCount: 3,
    floors: [
      floor("f-h01", "双11主会场轮播", "carousel", 30.2, true, { title: "双11主会场", imageIds: ["mat-01", "mat-02", "mat-08"], autoPlay: true, interval: 3 }),
      floor("f-h02", "整点秒杀专区", "seckill", 17.5, true, { title: "整点秒杀", endsAt: "2026-10-30 20:00", productCount: 3 }, "2026-10-29 10:00"),
      floor("f-h03", "新人专享优惠券", "coupon", 14.8, true, { title: "新人专享", couponCount: 3 }),
      floor("f-h04", "爆款推荐瀑布流", "recommend", 9.1, true, { title: "爆款推荐", productCount: 6 }),
      floor("f-h05", "品牌故事图文", "imageText", 6.3, true, { title: "品牌故事", subtitle: "十年匠心 · 只为热爱", imageId: "mat-05", link: "/page/brand" }),
      floor("f-h06", "品牌宣传片头", "video", 5.0, true, { title: "品牌宣传片", imageId: "mat-06", duration: "02:15" }),
      floor("f-h07", "开业公告栏", "notice", 3.2, false, { content: "全场满 299 减 50，10 月 31 日截止！" }),
      floor("f-h08", "品类导航宫格", "navGrid", 2.6, true, { columnCount: 4, entryCount: 8 }),
      floor("f-h09", "猜你喜欢推荐", "recommend", 2.1, true, { title: "猜你喜欢", productCount: 4 }),
      floor("f-h10", "会员权益说明卡", "imageText", 1.7, false, { title: "会员权益说明", subtitle: "黑金会员享 12 项专属权益", imageId: "mat-05", link: "/page/member" }),
      floor("f-h11", "满减神券提醒", "coupon", 1.2, true, { title: "满减神券", couponCount: 2 }, "2026-10-28 10:00"),
      floor("f-h12", "顶部搜索栏", "searchBar", 0.9, true, { hint: "搜索商品关键词" }),
    ],
  },
  detail: {
    key: "detail",
    title: "商品详情页",
    draftCount: 1,
    floors: [
      floor("f-d01", "相关商品推荐", "recommend", 22.4, true, { title: "相关推荐", productCount: 6 }),
      floor("f-d02", "规格参数图文", "imageText", 15.6, true, { title: "规格参数", subtitle: "核心参数一图速览", imageId: "mat-05", link: "/page/spec" }),
      floor("f-d03", "实拍测评视频", "video", 12.3, true, { title: "实拍测评", imageId: "mat-06", duration: "04:32" }),
      floor("f-d04", "下单立减券", "coupon", 8.9, true, { title: "下单立减", couponCount: 2 }),
      floor("f-d05", "搭配购买宫格", "navGrid", 5.2, true, { columnCount: 4, entryCount: 8 }),
      floor("f-d06", "物流时效公告", "notice", 3.0, true, { content: "大促期间订单 48 小时内发出，偏远地区顺延 1-2 天" }),
    ],
  },
  activity: {
    key: "activity",
    title: "活动页",
    draftCount: 2,
    floors: [
      floor("f-a01", "双11倒计时横幅", "countdownBanner", 28.6, true, { title: "双 11 狂欢开启", endsAt: "2026-10-31 20:00", imageId: "mat-03" }),
      floor("f-a02", "限时闪购秒杀", "seckill", 21.4, true, { title: "限时闪购", endsAt: "2026-10-29 22:00", productCount: 3 }),
      floor("f-a03", "大促神券包", "coupon", 16.8, true, { title: "大促神券", couponCount: 3 }),
      floor("f-a04", "会场氛围轮播", "carousel", 12.5, true, { title: "会场氛围", imageIds: ["mat-08", "mat-04"], autoPlay: true, interval: 4 }),
      floor("f-a05", "玩法攻略图文", "imageText", 9.2, true, { title: "玩法攻略", subtitle: "跨店满减 + 叠加神券", imageId: "mat-05", link: "/page/guide" }),
      floor("f-a06", "会员专属权益", "memberRights", 6.8, true, { title: "会员权益", levelText: "黑金会员" }),
      floor("f-a07", "爆款清单推荐", "recommend", 4.4, true, { title: "爆款清单", productCount: 4 }),
    ],
  },
  custom: {
    key: "custom",
    title: "自定义页",
    draftCount: 0,
    floors: [
      floor("f-c01", "搜索发现栏", "searchBar", 18.2, true, { hint: "搜索好物关键词" }),
      floor("f-c02", "品牌旗舰图文", "imageText", 12.6, true, { title: "品牌旗舰", subtitle: "源头工厂 · 直采直发", imageId: "mat-05", link: "/page/flagship" }),
      floor("f-c03", "店长精选推荐", "recommend", 9.4, true, { title: "店长精选", productCount: 4 }),
      floor("f-c04", "悬浮客服入口", "floatService", 4.8, true, { labelText: "在线客服" }),
    ],
  },
};

// ── 发布记录（时间递增，最新在前）──
export const INITIAL_VERSION = "V2.4.0";

export const INITIAL_RECORDS = [
  { id: "rec-05", version: "V2.4.0", operator: "李婉晴", time: "2026-10-26 22:10:36", note: "双十一预热第 2 轮：新增会员权益楼层，秒杀区更换大促素材。", isCurrent: true },
  { id: "rec-04", version: "V2.3.0", operator: "陈子昂", time: "2026-10-24 18:42:10", note: "首页轮播更换双十一主视觉，推荐瀑布流扩展至 6 个坑位。" },
  { id: "rec-03", version: "V2.2.1", operator: "李婉晴", time: "2026-10-21 09:15:44", note: "修复图文卡片跳转链接丢失问题，停用旧版公告栏。" },
  { id: "rec-02", version: "V2.2.0", operator: "王一舟", time: "2026-10-17 20:05:21", note: "商品详情页装修上线：新增视频模块与图文卡片。" },
  { id: "rec-01", version: "V2.1.0", operator: "陈子昂", time: "2026-10-12 11:30:08", note: "活动页首版发布：秒杀模块 + 优惠券组合楼层。" },
];

// ── A/B 实验数据（版本 A = 当前版本实验组，版本 B = 上一发布版本对照组）──
// gmv 单位为万元；图表中换算为百万元展示以平衡柱高
export const AB_EXPERIMENT = {
  winner: "A",
  confidence: { level: "95%", pValue: "p<0.05", sampleSize: "84,600" },
  datasets: {
    week: {
      rangeLabel: "近 7 天",
      versionA: { uv: 12.8, conv: 3.6, gmv: 486.2, uvDelta: "+23.1%", convDelta: "+0.7pp", gmvDelta: "+37.9%" },
      versionB: { uv: 10.4, conv: 2.9, gmv: 352.7 },
    },
    month: {
      rangeLabel: "近 30 天",
      versionA: { uv: 48.6, conv: 3.2, gmv: 1826.5, uvDelta: "+18.0%", convDelta: "+0.4pp", gmvDelta: "+31.5%" },
      versionB: { uv: 41.2, conv: 2.8, gmv: 1389.4 },
    },
  },
};

// ── 操作动态（初始历史 + 运行时由 reducer 自动追加，最新在前）──
export const INITIAL_ACTIVITY = [
  { id: "act-03", icon: "toggle-left", text: "「开业公告栏」已停用", time: "10-27 18:24" },
  { id: "act-02", icon: "image", text: "「品牌故事图文」配图替换为「图文卡片配图」", time: "10-27 16:05" },
  { id: "act-01", icon: "arrow-up", text: "「爆款推荐瀑布流」楼层顺序调整（排序号 5→4）", time: "10-27 15:40" },
];

// ── 大促冲刺工作台静态数据 ──
export const SPRINT_META = {
  name: "双 11 开门红",
  endsAt: "2026-11-01 00:00",
  stats: [
    { key: "uv", icon: "users", label: "今日访客", value: "4.2 万", delta: "+18.2%" },
    { key: "conv", icon: "percent", label: "支付转化率", value: "3.6%", delta: "+0.2pp" },
    { key: "gmv", icon: "wallet", label: "今日 GMV", value: "¥36.4 万", delta: "+12.5%" },
  ],
  checklist: [
    { key: "copyright", label: "主视觉素材版权校验" },
    { key: "stock", label: "秒杀库存与价格核对" },
    { key: "coupon", label: "优惠券预算与有效期" },
    { key: "links", label: "楼层跳转链接抽检" },
    { key: "schedule", label: "定时发布时间核对" },
    { key: "mobile", label: "移动端适配检查" },
  ],
};
