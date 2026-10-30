// Layer 2: 合同与账单中心 — 全量 mock 数据（语义化字段）
// 口径：套餐月费 107,333.33 → 季付基础费 322,000.00 → 年付合同金额 1,288,000.00

// ---------- ① 页头 / ② 合同概览 ----------
export const contract = {
  enterpriseName: "中远数智科技有限公司",
  logoText: "中远数智",
  contractNo: "HT-2024-0886-ZY",
  // status: success=生效中 / warning=即将到期 / error=已终止
  status: "warning",
  statusText: "即将到期",
  signDate: "2024-03-01",
  expireDate: "2026-12-15",
  renewalDays: 47,
  contractType: "企业版 SaaS 订阅服务",
  signMethod: "电子签",
  amount: "￥1,288,000.00",
  paymentCycle: "季付",
  autoRenewal: true,
  partyA: {
    company: "中远数智科技有限公司",
    contact: "陈志远",
    title: "采购总监",
    phone: "138-0013-8800",
  },
  partyB: {
    company: "云启智能科技有限公司（SaaS 平台主体）",
    contact: "平台客户成功中心",
    phone: "400-820-8866",
  },
};

// ---------- ③ 套餐与计费 ----------
export const plan = {
  name: "企业旗舰版",
  version: "v3.2",
  seats: 500,
  monthlyFee: "￥107,333.33",
  modules: [
    { name: "协同办公", desc: "文档/表格/日历/在线会议" },
    { name: "客户管理 CRM", desc: "线索/商机/合同/回款" },
    { name: "数据智能", desc: "BI 看板/自定义报表" },
    { name: "开放平台 API", desc: "100 万次/季调用额度" },
    { name: "直播与培训", desc: "1000 小时/季直播时长" },
    { name: "智能工单", desc: "1000 单/季工单额度" },
  ],
  // 计费说明折叠面板：基础费 + 超额阶梯 3 段
  billingNotes: [
    {
      key: "base",
      title: "基础订阅费",
      content:
        "按季预付，季费 ￥322,000.00（含 500 座位、6 大核心模块标准额度）。座位列于标准额度内的使用不再另行计费，开票周期与账单周期一致。",
    },
    {
      key: "tier1",
      title: "超额阶梯计费 · 第一档（≤120% 额度）",
      content:
        "当任一模块用量超出标准额度但未超过额度的 120% 时，按超额量×阶梯单价计费：API 调用 0.8 元/百次、短信 0.05 元/条、直播时长 25 元/小时、工单 5 元/单、存储 0.6 元/GB。",
    },
    {
      key: "tier2",
      title: "超额阶梯计费 · 第二档（>120% 额度）",
      content:
        "当模块用量超过标准额度的 120% 时，超出 120% 部分单价上浮 50%；建议提前升配以降低成本，升配后额度即时生效并按天补差。",
    },
    {
      key: "tier3",
      title: "退款与冲减规则",
      content:
        "因平台原因导致的不可用时段按 SLA 约定折算月费冲减；客户主动降配/暂停期间不产生退费，额度冻结至下一计费周期。",
    },
  ],
  // 与上一版套餐差异（Tooltip 展示）
  diffFromPrev: [
    { item: "座位数", prev: "450", curr: "500", type: "up" },
    { item: "API 调用额度", prev: "80 万次/季", curr: "100 万次/季", type: "up" },
    { item: "直播时长额度", prev: "800 小时/季", curr: "1000 小时/季", type: "up" },
    { item: "月费", prev: "￥98,000", curr: "￥107,333.33", type: "up" },
    { item: "短信额度", prev: "6000 条/季", curr: "5000 条/季", type: "down" },
  ],
};

// ---------- ④ 账单记录 ----------
// 10 行，状态 3 种（已付/待付/逾期），金额与季费口径一致
export const bills = [
  { key: "1", billNo: "BL-2024Q1-0088", billingCycle: "2024-Q1", amount: 322000.0, itemCount: 6, issueDate: "2024-04-02", status: "paid" },
  { key: "2", billNo: "BL-2024Q2-0091", billingCycle: "2024-Q2", amount: 322000.0, itemCount: 6, issueDate: "2024-07-03", status: "paid" },
  { key: "3", billNo: "BL-2024Q3-0103", billingCycle: "2024-Q3", amount: 335500.0, itemCount: 8, issueDate: "2024-10-05", status: "paid" },
  { key: "4", billNo: "BL-2024Q4-0118", billingCycle: "2024-Q4", amount: 322000.0, itemCount: 6, issueDate: "2025-01-04", status: "paid" },
  { key: "5", billNo: "BL-2025Q1-0126", billingCycle: "2025-Q1", amount: 348200.0, itemCount: 9, issueDate: "2025-04-03", status: "paid" },
  { key: "6", billNo: "BL-2025Q2-0139", billingCycle: "2025-Q2", amount: 322000.0, itemCount: 6, issueDate: "2025-07-04", status: "paid" },
  { key: "7", billNo: "BL-2025Q3-0151", billingCycle: "2025-Q3", amount: 361800.0, itemCount: 10, issueDate: "2025-10-05", status: "paid" },
  { key: "8", billNo: "BL-2025Q4-0167", billingCycle: "2025-Q4", amount: 322000.0, itemCount: 6, issueDate: "2026-01-04", status: "paid" },
  { key: "9", billNo: "BL-2026Q1-0182", billingCycle: "2026-Q1", amount: 374600.0, itemCount: 11, issueDate: "2026-04-03", status: "pending" },
  { key: "10", billNo: "BL-2026Q2-0195", billingCycle: "2026-Q2", amount: 322000.0, itemCount: 6, issueDate: "2026-07-04", status: "overdue" },
];

// 账单明细（查看明细 Drawer）
export const billDetails = {
  "BL-2026Q1-0182": {
    billNo: "BL-2026Q1-0182",
    billingCycle: "2026-Q1",
    amount: 374600.0,
    issueDate: "2026-04-03",
    status: "pending",
    items: [
      { name: "基础订阅费（500 座位）", period: "2026-01 ~ 2026-03", amount: 322000.0 },
      { name: "API 调用超额（25 万次）", period: "2026-Q1", amount: 2000.0 },
      { name: "短信超额（1200 条）", period: "2026-Q1", amount: 60.0 },
      { name: "直播时长超额（150 小时）", period: "2026-Q1", amount: 3750.0 },
      { name: "智能工单超额（320 单）", period: "2026-Q1", amount: 1600.0 },
      { name: "存储超额（按天补差）", period: "2026-Q1", amount: 44190.0 },
    ],
  },
};

// ---------- ⑤ 用量与超额 ----------
// 6 模块：已用 / 上限 / 三态（normal/warning/overage）
export const usage = [
  { key: "seats", module: "座位数", unit: "个", used: 480, limit: 500, ratio: 96, state: "warning" },
  { key: "storage", module: "存储容量", unit: "GB", used: 820, limit: 1000, ratio: 82, state: "normal" },
  { key: "api", module: "API 调用", unit: "万次", used: 125, limit: 100, ratio: 125, state: "overage" },
  { key: "sms", module: "短信发送", unit: "条", used: 6200, limit: 5000, ratio: 124, state: "overage" },
  { key: "live", module: "直播时长", unit: "小时", used: 1150, limit: 1000, ratio: 115, state: "overage" },
  { key: "ticket", module: "智能工单", unit: "单", used: 1320, limit: 1000, ratio: 132, state: "overage" },
];

// 超额明细 4 行（与条形图超额项对应）
export const overageDetails = [
  { key: "api", module: "API 调用", used: 125, limit: 100, overage: 25, fee: 2000.0, period: "2026-Q1" },
  { key: "sms", module: "短信发送", used: 6200, limit: 5000, overage: 1200, fee: 60.0, period: "2026-Q1" },
  { key: "live", module: "直播时长", used: 1150, limit: 1000, overage: 150, fee: 3750.0, period: "2026-Q1" },
  { key: "ticket", module: "智能工单", used: 1320, limit: 1000, overage: 320, fee: 1600.0, period: "2026-Q1" },
];

// ---------- ⑥ 付款与发票 ----------
export const payment = {
  account: "**** **** **** 8866",
  bank: "招商银行上海陆家嘴支行",
  accountHolder: "中远数智科技有限公司",
  defaultInvoiceType: "增值税专用发票",
};

// 发票 6 行（与已付账单匹配），状态：已开具/寄送中/已作废
export const invoices = [
  { key: "1", invoiceNo: "FP-2025-0731", type: "special", amount: 322000.0, issueDate: "2025-01-06", status: "issued" },
  { key: "2", invoiceNo: "FP-2025-0882", type: "general", amount: 348200.0, issueDate: "2025-04-07", status: "issued" },
  { key: "3", invoiceNo: "FP-2025-1023", type: "special", amount: 322000.0, issueDate: "2025-07-07", status: "issued" },
  { key: "4", invoiceNo: "FP-2025-1186", type: "special", amount: 361800.0, issueDate: "2025-10-07", status: "shipping" },
  { key: "5", invoiceNo: "FP-2026-0241", type: "general", amount: 322000.0, issueDate: "2026-01-06", status: "issued" },
  { key: "6", invoiceNo: "FP-2025-0512", type: "special", amount: 335500.0, issueDate: "2024-10-08", status: "void" },
];

// 开票信息（Popover 展示）
export const invoiceInfo = {
  title: "中远数智科技有限公司",
  taxNo: "91310115MA1K3XQ886",
  address: "上海市浦东新区世纪大道 886 号 12 层",
  phone: "021-5888-8866",
  bank: "招商银行上海陆家嘴支行",
  account: "1219 0886 6610 8866",
};

// ---------- ⑦ 续约与变更 ----------
export const renewal = {
  expireDate: "2026-12-15",
  renewalDays: 47,
  // 合同进度（已度过比例）
  progress: 98,
  // 推荐续约方案 2 张
  plans: [
    {
      key: "flagship",
      name: "企业旗舰版 v4.0（推荐）",
      seats: 600,
      monthlyFee: "￥118,000.00",
      save: "升配优惠 15%，锁定 3 年价格",
      highlight: true,
    },
    {
      key: "standard",
      name: "企业标准版 v4.0",
      seats: 400,
      monthlyFee: "￥78,000.00",
      save: "适配精简团队，节省 27%",
      highlight: false,
    },
  ],
  // 历史变更 Timeline 5 节点（动作不重复）
  history: [
    { time: "2024-03-01", action: "续约", desc: "签订企业旗舰版年度合同（500 座位）", operator: "陈志远" },
    { time: "2024-09-12", action: "升配", desc: "座位数 300 → 450，新增直播与培训模块", operator: "李 静" },
    { time: "2025-03-05", action: "降配", desc: "短信配额下调至 5000 条/季，调整月费", operator: "陈志远" },
    { time: "2025-06-20", action: "暂停", desc: "API 模块临时暂停（客户系统迁移期）", operator: "王 强" },
    { time: "2025-07-08", action: "恢复", desc: "API 模块恢复服务，额度即时生效", operator: "王 强" },
  ],
};

// ---------- ⑧ SLA 与支持 ----------
export const slaLevels = [
  { key: "1", metric: "服务可用性", target: "≥ 99.9%（月度）", note: "不可用时长按分钟折算月费冲减" },
  { key: "2", metric: "故障响应时效", target: "紧急 ≤15 分钟 / 一般 ≤2 小时", note: "7×24 小时值守，工单+电话双通道" },
  { key: "3", metric: "故障恢复承诺", target: "紧急 ≤4 小时 / 严重 ≤8 小时", note: "超时按 SLA 倍率赔付" },
  { key: "4", metric: "数据保障", target: "RPO ≤1 小时 / RTO ≤4 小时", note: "异地双活备份，每日全量校验" },
];

export const accountManager = {
  name: "王思齐",
  title: "高级客户成功经理",
  phone: "138-0011-2233",
  wechat: "Hcloud-WangSQ",
  email: "wangsiqi@cloudqitech.com",
};

export const faqs = [
  {
    key: "1",
    q: "账单出账后多久需要完成付款？",
    a: "账单出账后 30 个自然日内为付款周期，逾期将按合同约定收取违约金并可能影响服务可用性。建议开通自动扣款或设置付款提醒。",
  },
  {
    key: "2",
    q: "超额费用是如何计算的？",
    a: "超额费用按阶梯单价计算：未超过标准额度 120% 的部分按第一档单价，超过 120% 的部分单价上浮 50%。您可在「用量与超额」区块查看当前周期明细。",
  },
  {
    key: "3",
    q: "续约后座位数和额度何时生效？",
    a: "续约或升配方案确认后，新座位数与额度即时生效，已支付费用按天补差或冲抵下一周期。降配方案则在下一计费周期生效。",
  },
  {
    key: "4",
    q: "如何申请账单复核或开具发票？",
    a: "在账单记录行操作中选择「申请复核」提交异议，或联系客户经理处理；发票可在「付款与发票」区块按已付账单申请开具，专票一般 3 个工作日内寄出。",
  },
];
