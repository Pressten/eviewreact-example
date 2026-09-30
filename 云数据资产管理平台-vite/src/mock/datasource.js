// Layer 2: 数据源管理 — 领域 mock 数据与枚举字典

export const TYPE_OPTIONS = [
  { value: "MySQL", text: "MySQL" },
  { value: "Oracle", text: "Oracle" },
  { value: "PostgreSQL", text: "PostgreSQL" },
  { value: "Hive", text: "Hive" },
  { value: "ClickHouse", text: "ClickHouse" },
  { value: "Kafka", text: "Kafka" },
  { value: "Doris", text: "Apache Doris" },
  { value: "API", text: "API 接口" },
];

export const DEPT_OPTIONS = [
  { value: "零售运营部", text: "零售运营部" },
  { value: "供应链管理部", text: "供应链管理部" },
  { value: "财务共享中心", text: "财务共享中心" },
  { value: "客户服务部", text: "客户服务部" },
  { value: "市场营销部", text: "市场营销部" },
  { value: "风控合规部", text: "风控合规部" },
  { value: "数据平台部", text: "数据平台部" },
  { value: "人力资源部", text: "人力资源部" },
];

export const FREQ_OPTIONS = [
  { value: "实时", text: "实时" },
  { value: "分钟级", text: "分钟级" },
  { value: "小时级", text: "小时级" },
  { value: "天级", text: "天级" },
  { value: "周级", text: "周级" },
];

export const STATUS_META = {
  online: { label: "已上线", tone: "success" },
  syncing: { label: "同步中", tone: "warning" },
  error: { label: "异常", tone: "error" },
  draft: { label: "草稿", tone: "info" },
  offline: { label: "已下线", tone: "neutral" },
};

export const STATUS_OPTIONS = Object.keys(STATUS_META).map((key) => ({
  value: key,
  text: STATUS_META[key].label,
}));

export const INITIAL_DATASOURCES = [
  { id: "DS-2026-0001", name: "门店交易明细库", type: "MySQL", dept: "零售运营部", owner: "张伟", tables: 128, rows: 86420000, freq: "小时级", status: "online", address: "10.62.18.31:3306/retail_trade", createdAt: "2026-03-12", updatedAt: "2026-09-28 14:32", desc: "全渠道门店 POS 交易明细，含商品、支付方式与优惠分摊。" },
  { id: "DS-2026-0002", name: "会员主数据平台", type: "Oracle", dept: "客户服务部", owner: "李静", tables: 64, rows: 12400000, freq: "天级", status: "online", address: "10.62.11.7:1521/member_mds", createdAt: "2025-11-04", updatedAt: "2026-09-28 06:10", desc: "会员唯一身份、等级与积分主数据，作为全域会员视图基准。" },
  { id: "DS-2026-0003", name: "供应链库存快照", type: "Hive", dept: "供应链管理部", owner: "王强", tables: 210, rows: 1568000000, freq: "天级", status: "online", address: "hive://bigdata-cluster/ods.scm_stock_snapshot", createdAt: "2025-08-21", updatedAt: "2026-09-28 02:45", desc: "全国仓网 SKU 级日终库存快照，支撑缺货预警与调拨决策。" },
  { id: "DS-2026-0004", name: "财务总账凭证库", type: "PostgreSQL", dept: "财务共享中心", owner: "陈晨", tables: 45, rows: 3280000, freq: "天级", status: "online", address: "10.62.24.16:5432/fin_gl", createdAt: "2025-06-09", updatedAt: "2026-09-27 23:18", desc: "总账凭证与科目余额数据，月结报表与审计追溯统一取数口径。" },
  { id: "DS-2026-0005", name: "营销活动埋点流", type: "Kafka", dept: "市场营销部", owner: "赵敏", tables: 18, rows: 426000000, freq: "实时", status: "online", address: "kafka://10.62.30.5:9092/topic_mkt_track", createdAt: "2026-01-15", updatedAt: "2026-09-28 15:02", desc: "App / 小程序 / 门店屏全端互动埋点实时流，用于活动效果归因。" },
  { id: "DS-2026-0006", name: "风控评分结果集", type: "ClickHouse", dept: "风控合规部", owner: "刘洋", tables: 32, rows: 98000000, freq: "小时级", status: "online", address: "10.62.41.22:8123/risk_score", createdAt: "2026-02-27", updatedAt: "2026-09-28 13:40", desc: "交易与账户风险评分结果，异常名单实时下发风控引擎。" },
  { id: "DS-2026-0007", name: "商品主数据", type: "Doris", dept: "零售运营部", owner: "周涛", tables: 156, rows: 54600000, freq: "天级", status: "online", address: "10.62.33.9:9030/goods_master", createdAt: "2025-10-30", updatedAt: "2026-09-28 04:22", desc: "商品基础属性、包装规格与价格主数据，全渠道商品域唯一来源。" },
  { id: "DS-2026-0008", name: "客服会话记录库", type: "MySQL", dept: "客户服务部", owner: "吴迪", tables: 27, rows: 21500000, freq: "分钟级", status: "syncing", address: "10.62.19.44:3306/cs_session", createdAt: "2026-04-02", updatedAt: "2026-09-28 15:26", desc: "在线客服与热线会话文本记录，NLP 质检与满意度分析输入源。" },
  { id: "DS-2026-0009", name: "员工组织架构表", type: "Oracle", dept: "人力资源部", owner: "孙悦", tables: 12, rows: 86000, freq: "周级", status: "online", address: "10.62.11.9:1521/hr_org", createdAt: "2025-05-16", updatedAt: "2026-09-26 09:05", desc: "组织、岗位与汇报关系数据，权限模型与数据授权的基础维度。" },
  { id: "DS-2026-0010", name: "门店选址分析库", type: "Hive", dept: "市场营销部", owner: "郑凯", tables: 88, rows: 421000000, freq: "天级", status: "offline", address: "hive://bigdata-cluster/dw.market_site_select", createdAt: "2025-09-12", updatedAt: "2026-08-30 17:44", desc: "商圈热力、竞品分布与人流数据，新店选址模型训练集。" },
  { id: "DS-2026-0011", name: "支付流水归档库", type: "PostgreSQL", dept: "财务共享中心", owner: "冯磊", tables: 39, rows: 1680000000, freq: "天级", status: "online", address: "10.62.24.18:5432/fin_pay_archive", createdAt: "2025-07-25", updatedAt: "2026-09-28 01:30", desc: "三方支付渠道流水归档，支撑日终对账与资金差异排查。" },
  { id: "DS-2026-0012", name: "物流轨迹实时流", type: "Kafka", dept: "供应链管理部", owner: "何欣", tables: 9, rows: 312000000, freq: "实时", status: "online", address: "kafka://10.62.30.7:9092/topic_logistics_track", createdAt: "2026-03-08", updatedAt: "2026-09-28 15:28", desc: "承运商与自营配送轨迹事件流，支撑履约时效看板。" },
  { id: "DS-2026-0013", name: "优惠券核销明细", type: "MySQL", dept: "市场营销部", owner: "张伟", tables: 22, rows: 18700000, freq: "小时级", status: "online", address: "10.62.18.34:3306/mkt_coupon", createdAt: "2026-01-26", updatedAt: "2026-09-28 14:05", desc: "券发放、领取与核销明细，活动 ROI 测算与费用核销依据。" },
  { id: "DS-2026-0014", name: "反欺诈名单库", type: "ClickHouse", dept: "风控合规部", owner: "李静", tables: 7, rows: 640000, freq: "天级", status: "online", address: "10.62.41.25:8123/risk_blacklist", createdAt: "2025-12-11", updatedAt: "2026-09-27 21:10", desc: "黑灰产设备与账号名单，实时拦截策略的名单数据源。" },
  { id: "DS-2026-0015", name: "设备心跳日志", type: "Doris", dept: "数据平台部", owner: "王强", tables: 41, rows: 2450000000, freq: "分钟级", status: "error", address: "10.62.33.12:9030/ops_device_heartbeat", createdAt: "2025-11-19", updatedAt: "2026-09-28 11:58", desc: "门店终端与 IoT 设备心跳日志，故障预警与在线率统计。" },
  { id: "DS-2026-0016", name: "商品评价数据", type: "API", dept: "零售运营部", owner: "陈晨", tables: 4, rows: 9600000, freq: "天级", status: "online", address: "https://open.api.internal/v2/goods/comment", createdAt: "2026-05-14", updatedAt: "2026-09-28 07:16", desc: "外部电商平台商品评价接口，口碑分析与选品洞察输入。" },
  { id: "DS-2026-0017", name: "供应商主数据", type: "Oracle", dept: "供应链管理部", owner: "赵敏", tables: 53, rows: 2100000, freq: "周级", status: "draft", address: "10.62.11.12:1521/scm_supplier", createdAt: "2026-09-02", updatedAt: "2026-09-25 16:40", desc: "供应商准入、资质与结算信息，采购域主数据治理对象。" },
  { id: "DS-2026-0018", name: "预算执行明细", type: "Hive", dept: "财务共享中心", owner: "刘洋", tables: 96, rows: 35800000, freq: "天级", status: "online", address: "hive://bigdata-cluster/dw.fin_budget_exec", createdAt: "2025-08-05", updatedAt: "2026-09-28 03:12", desc: "部门科目级预算下达与执行明细，费用管控与偏差预警。" },
  { id: "DS-2026-0019", name: "客户画像标签库", type: "ClickHouse", dept: "数据平台部", owner: "周涛", tables: 168, rows: 726000000, freq: "天级", status: "online", address: "10.62.41.30:8123/cdp_user_tag", createdAt: "2025-09-28", updatedAt: "2026-09-28 05:50", desc: "全域客户标签画像，支撑圈人投放与个性化推荐。" },
  { id: "DS-2026-0020", name: "工单处理记录", type: "MySQL", dept: "客户服务部", owner: "吴迪", tables: 31, rows: 14200000, freq: "小时级", status: "syncing", address: "10.62.19.48:3306/cs_workorder", createdAt: "2026-02-03", updatedAt: "2026-09-28 15:20", desc: "服务工单流转与处理时长记录，服务质量考核数据源。" },
  { id: "DS-2026-0021", name: "培训考核结果库", type: "PostgreSQL", dept: "人力资源部", owner: "孙悦", tables: 15, rows: 420000, freq: "周级", status: "draft", address: "10.62.24.21:5432/hr_training", createdAt: "2026-08-18", updatedAt: "2026-09-22 10:34", desc: "员工课程学习与考核成绩，人才梯队盘点输入数据。" },
  { id: "DS-2026-0022", name: "渠道归因分析库", type: "Hive", dept: "市场营销部", owner: "郑凯", tables: 74, rows: 512000000, freq: "天级", status: "offline", address: "hive://bigdata-cluster/dw.mkt_attribution", createdAt: "2025-10-07", updatedAt: "2026-09-01 18:26", desc: "多触点归因模型中间表，渠道投放预算分配依据。" },
  { id: "DS-2026-0023", name: "门禁通行记录", type: "Kafka", dept: "人力资源部", owner: "冯磊", tables: 6, rows: 58000000, freq: "实时", status: "online", address: "kafka://10.62.30.11:9092/topic_access_record", createdAt: "2026-04-21", updatedAt: "2026-09-28 15:24", desc: "园区与办公区门禁通行事件流，考勤与安防联动。" },
  { id: "DS-2026-0024", name: "数据资产目录", type: "API", dept: "数据平台部", owner: "何欣", tables: 11, rows: 3200000, freq: "天级", status: "online", address: "https://open.api.internal/v1/catalog/assets", createdAt: "2026-06-30", updatedAt: "2026-09-28 08:02", desc: "全量数据资产元信息与血缘关系，数据目录检索服务。" },
  { id: "DS-2026-0025", name: "出口报关单库", type: "Oracle", dept: "供应链管理部", owner: "张伟", tables: 34, rows: 8700000, freq: "天级", status: "error", address: "10.62.11.15:1521/scm_customs", createdAt: "2025-07-02", updatedAt: "2026-09-27 20:15", desc: "跨境出口报关单与商品清单，通关时效与合规核查数据。" },
  { id: "DS-2026-0026", name: "商圈客流指数", type: "Hive", dept: "市场营销部", owner: "李静", tables: 62, rows: 194000000, freq: "分钟级", status: "online", address: "hive://bigdata-cluster/dw.market_traffic_index", createdAt: "2026-03-19", updatedAt: "2026-09-28 15:22", desc: "门店级客流实时指数，排班优化与客流预警数据源。" },
];

export function formatRows(value) {
  if (value >= 100000000) return `${(value / 100000000).toFixed(2)} 亿`;
  if (value >= 10000) return `${(value / 10000).toFixed(1)} 万`;
  return String(value);
}
