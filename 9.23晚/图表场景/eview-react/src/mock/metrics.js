// Layer 2: 指标判断领域 mock 数据

// 判断规则：达成率区间 -> 结论
export const verdictRules = [
  { key: "pass", label: "达标", desc: "达成率 ≥ 98%", tone: "success" },
  { key: "warn", label: "预警", desc: "94% ≤ 达成率 < 98%", tone: "critical" },
  { key: "fail", label: "异常", desc: "达成率 < 94%", tone: "error" },
];

export const verdictMap = {
  pass: { label: "达标", tone: "success" },
  warn: { label: "预警", tone: "critical" },
  fail: { label: "异常", tone: "error" },
};

// eview-react Select 选项字段为 text（非 antd 的 label）
export const domainOptions = [
  { value: "all", text: "全部业务域" },
  { value: "生产运行", text: "生产运行" },
  { value: "设备健康", text: "设备健康" },
  { value: "安全环保", text: "安全环保" },
  { value: "经营效益", text: "经营效益" },
  { value: "客户服务", text: "客户服务" },
  { value: "能源消耗", text: "能源消耗" },
];

export const verdictOptions = [
  { value: "all", text: "全部结论" },
  { value: "pass", text: "达标" },
  { value: "warn", text: "预警" },
  { value: "fail", text: "异常" },
];

// 指标判断明细：达成率、同比、结论
export const metricRows = [
  { code: "M-PR-001", name: "发电量完成率", domain: "生产运行", owner: "张伟", region: "华北区域", current: 102.4, target: 100, unit: "%", rate: 102.4, yoy: 3.2, verdict: "pass", updated: "2026-09-21 08:00" },
  { code: "M-PR-002", name: "设备可利用率", domain: "生产运行", owner: "李静", region: "华北区域", current: 99.2, target: 99, unit: "%", rate: 100.2, yoy: 0.6, verdict: "pass", updated: "2026-09-21 08:00" },
  { code: "M-PR-003", name: "综合厂用电率", domain: "生产运行", owner: "王磊", region: "华东区域", current: 4.62, target: 4.5, unit: "%", rate: 97.4, yoy: -0.08, verdict: "warn", updated: "2026-09-21 08:00" },
  { code: "M-PR-004", name: "计划检修完成率", domain: "生产运行", owner: "陈涛", region: "华东区域", current: 96.0, target: 98, unit: "%", rate: 98.0, yoy: 1.4, verdict: "pass", updated: "2026-09-20 18:00" },
  { code: "M-EQ-011", name: "主设备完好率", domain: "设备健康", owner: "赵敏", region: "华南区域", current: 99.6, target: 99, unit: "%", rate: 100.6, yoy: 0.3, verdict: "pass", updated: "2026-09-21 08:00" },
  { code: "M-EQ-012", name: "缺陷消除及时率", domain: "设备健康", owner: "孙鹏", region: "华南区域", current: 88.5, target: 95, unit: "%", rate: 93.2, yoy: -2.6, verdict: "fail", updated: "2026-09-20 20:00" },
  { code: "M-EQ-013", name: "非计划停机时长", domain: "设备健康", owner: "周琳", region: "华北区域", current: 12.4, target: 10, unit: "小时", rate: 80.6, yoy: -3.1, verdict: "fail", updated: "2026-09-21 06:00" },
  { code: "M-EQ-014", name: "定期巡检计划完成率", domain: "设备健康", owner: "吴迪", region: "西南区域", current: 97.8, target: 96, unit: "%", rate: 101.9, yoy: 2.2, verdict: "pass", updated: "2026-09-20 18:00" },
  { code: "M-SF-021", name: "安全事故发生率", domain: "安全环保", owner: "郑凯", region: "全公司", current: 0, target: 0, unit: "次", rate: 100, yoy: 0, verdict: "pass", updated: "2026-09-21 08:00" },
  { code: "M-SF-022", name: "隐患整改闭环率", domain: "安全环保", owner: "冯洁", region: "华东区域", current: 94.6, target: 98, unit: "%", rate: 96.5, yoy: 1.8, verdict: "warn", updated: "2026-09-20 17:00" },
  { code: "M-SF-023", name: "环保排放达标率", domain: "安全环保", owner: "何军", region: "全公司", current: 100, target: 100, unit: "%", rate: 100, yoy: 0.2, verdict: "pass", updated: "2026-09-21 07:00" },
  { code: "M-SF-024", name: "安全培训覆盖率", domain: "安全环保", owner: "许阳", region: "西南区域", current: 96.4, target: 98, unit: "%", rate: 98.4, yoy: 4.5, verdict: "pass", updated: "2026-09-19 16:00" },
  { code: "M-BZ-031", name: "度电成本", domain: "经营效益", owner: "林芳", region: "全公司", current: 0.286, target: 0.28, unit: "元/kWh", rate: 97.9, yoy: 0.004, verdict: "warn", updated: "2026-09-21 08:00" },
  { code: "M-BZ-032", name: "营业收入完成率", domain: "经营效益", owner: "高翔", region: "全公司", current: 104.8, target: 100, unit: "%", rate: 104.8, yoy: 6.3, verdict: "pass", updated: "2026-09-21 08:00" },
  { code: "M-BZ-033", name: "运维费用控制率", domain: "经营效益", owner: "钱进", region: "华东区域", current: 101.2, target: 100, unit: "%", rate: 98.8, yoy: -1.5, verdict: "pass", updated: "2026-09-20 18:00" },
  { code: "M-BZ-034", name: "应收账款周转率", domain: "经营效益", owner: "马超", region: "全公司", current: 7.1, target: 7.5, unit: "次", rate: 94.7, yoy: -0.4, verdict: "warn", updated: "2026-09-18 10:00" },
  { code: "M-CS-041", name: "供电可靠率", domain: "客户服务", owner: "刘晓", region: "华南区域", current: 99.98, target: 99.95, unit: "%", rate: 100.03, yoy: 0.01, verdict: "pass", updated: "2026-09-21 08:00" },
  { code: "M-CS-042", name: "客户投诉响应及时率", domain: "客户服务", owner: "曹静", region: "华东区域", current: 95.2, target: 98, unit: "%", rate: 97.1, yoy: 0.9, verdict: "warn", updated: "2026-09-20 21:00" },
  { code: "M-CS-043", name: "服务满意度评分", domain: "客户服务", owner: "范磊", region: "全公司", current: 4.7, target: 4.5, unit: "分", rate: 104.4, yoy: 0.2, verdict: "pass", updated: "2026-09-19 15:00" },
  { code: "M-CS-044", name: "平均故障修复时长", domain: "客户服务", owner: "邓涛", region: "华南区域", current: 3.6, target: 3.5, unit: "小时", rate: 97.2, yoy: -0.3, verdict: "warn", updated: "2026-09-20 19:00" },
  { code: "M-EN-051", name: "单位产值能耗", domain: "能源消耗", owner: "曾毅", region: "全公司", current: 0.412, target: 0.4, unit: "吨标煤/万元", rate: 97.1, yoy: 0.006, verdict: "warn", updated: "2026-09-21 08:00" },
  { code: "M-EN-052", name: "绿电消纳占比", domain: "能源消耗", owner: "彭丽", region: "西南区域", current: 32.6, target: 35, unit: "%", rate: 93.1, yoy: 4.2, verdict: "fail", updated: "2026-09-20 18:00" },
  { code: "M-EN-053", name: "综合能源利用率", domain: "能源消耗", owner: "苏航", region: "华北区域", current: 86.4, target: 85, unit: "%", rate: 101.6, yoy: 1.1, verdict: "pass", updated: "2026-09-21 08:00" },
  { code: "M-EN-054", name: "碳排放强度", domain: "能源消耗", owner: "卢俊", region: "全公司", current: 0.78, target: 0.75, unit: "吨/万元", rate: 96.2, yoy: -0.03, verdict: "warn", updated: "2026-09-19 14:00" },
];

// 近 12 个月综合达成率趋势
export const trendData = [
  { 月份: "2025-10", 综合达成率: 95.2, 达标指标率: 75.0 },
  { 月份: "2025-11", 综合达成率: 95.8, 达标指标率: 79.2 },
  { 月份: "2025-12", 综合达成率: 94.6, 达标指标率: 70.8 },
  { 月份: "2026-01", 综合达成率: 96.1, 达标指标率: 79.2 },
  { 月份: "2026-02", 综合达成率: 95.4, 达标指标率: 75.0 },
  { 月份: "2026-03", 综合达成率: 96.8, 达标指标率: 83.3 },
  { 月份: "2026-04", 综合达成率: 96.5, 达标指标率: 83.3 },
  { 月份: "2026-05", 综合达成率: 97.2, 达标指标率: 87.5 },
  { 月份: "2026-06", 综合达成率: 96.9, 达标指标率: 83.3 },
  { 月份: "2026-07", 综合达成率: 97.5, 达标指标率: 87.5 },
  { 月份: "2026-08", 综合达成率: 97.6, 达标指标率: 87.5 },
  { 月份: "2026-09", 综合达成率: 98.0, 达标指标率: 91.7 },
];

// 各业务域平均达成率
export const domainBarData = [
  { 业务域: "生产运行", 平均达成率: 99.5 },
  { 业务域: "设备健康", 平均达成率: 94.1 },
  { 业务域: "安全环保", 平均达成率: 98.7 },
  { 业务域: "经营效益", 平均达成率: 99.1 },
  { 业务域: "客户服务", 平均达成率: 99.7 },
  { 业务域: "能源消耗", 平均达成率: 97.0 },
];

// 记录表格行数便于概览统计
export const metricTotal = metricRows.length;
