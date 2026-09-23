export const typeOptions = ["时序数据", "日志数据", "用户行为", "交易数据", "影像资料", "文档资料"];
export const sourceOptions = ["MySQL", "Kafka", "REST API", "文件上传", "OCR 采集"];
export const ownerOptions = ["林晚晴", "陈志远", "苏婉宁", "顾承宇", "沈若彤", "韩景行", "温子墨", "白亦舒"];
export const deptOptions = ["能源事业部", "智能制造部", "消费互联网部", "金融科技部", "医疗健康部", "智慧城市部"];
export const hotTags = ["高频调用", "大数据量", "实时同步", "质量优秀"];
export const statusOptions = [
  { value: "published", label: "已发布" },
  { value: "draft", label: "草稿" },
  { value: "processing", label: "处理中" },
  { value: "offline", label: "已下线" },
];
export const typeIcons = {
  时序数据: "activity",
  日志数据: "file-text",
  用户行为: "users",
  交易数据: "file-spreadsheet",
  影像资料: "image",
  文档资料: "boxes",
};
export const accessLabels = { read: "只读", edit: "可编辑", export: "可导出", share: "可分享" };

export const seedDatasets = [
  { id: "DS-2026-0001", name: "华东光伏电站运行数据", type: "时序数据", source: "MySQL", owner: "林晚晴", department: "能源事业部", records: 12845000, sizeMB: 45210, quality: 4.5, status: "published", updated: "2026-09-20 14:32", createdAt: "2025-11-03", fields: 42, synced: true, views: 8421, desc: "覆盖 12 座光伏电站的功率、辐照与温度分钟级数据，服务于发电预测与设备健康评估。", tags: ["高频调用", "大数据量", "质量优秀"], access: ["read", "export"] },
  { id: "DS-2026-0002", name: "风机振动监测日志", type: "日志数据", source: "Kafka", owner: "陈志远", department: "能源事业部", records: 8320000, sizeMB: 30150, quality: 4.0, status: "processing", updated: "2026-09-21 09:12", createdAt: "2026-01-18", fields: 36, synced: true, views: 3120, desc: "主轴承振动频谱与报警事件流，用于风机故障预警模型训练。", tags: ["实时同步"], access: ["read"] },
  { id: "DS-2026-0003", name: "电商平台用户行为流", type: "用户行为", source: "Kafka", owner: "苏婉宁", department: "消费互联网部", records: 45230000, sizeMB: 98700, quality: 4.8, status: "published", updated: "2026-09-21 08:45", createdAt: "2025-08-22", fields: 58, synced: true, views: 15230, desc: "全端埋点行为流，包含浏览、加购、下单与分享链路。", tags: ["高频调用", "大数据量", "实时同步", "质量优秀"], access: ["read", "edit", "export"] },
  { id: "DS-2026-0004", name: "跨境支付交易明细", type: "交易数据", source: "MySQL", owner: "顾承宇", department: "金融科技部", records: 23180000, sizeMB: 76400, quality: 4.9, status: "published", updated: "2026-09-20 22:10", createdAt: "2025-06-30", fields: 64, synced: true, views: 9840, desc: "跨境清算交易流水，含币种、汇率与合规校验标记。", tags: ["高频调用", "质量优秀"], access: ["read", "export"] },
  { id: "DS-2026-0005", name: "医学影像标注样本库", type: "影像资料", source: "OCR 采集", owner: "沈若彤", department: "医疗健康部", records: 156000, sizeMB: 210300, quality: 4.2, status: "processing", updated: "2026-09-19 17:20", createdAt: "2026-02-14", fields: 28, synced: true, views: 2210, desc: "CT 与 MRI 影像标注样本，支持病灶检测算法迭代。", tags: ["大数据量"], access: ["read"] },
  { id: "DS-2026-0006", name: "设备巡检工单文档", type: "文档资料", source: "文件上传", owner: "韩景行", department: "智能制造部", records: 48200, sizeMB: 1560, quality: 3.6, status: "draft", updated: "2026-09-18 11:02", createdAt: "2026-03-08", fields: 22, synced: false, views: 320, desc: "巡检工单扫描件与结构化字段，正在补充 OCR 识别规则。", tags: [], access: ["read", "edit"] },
  { id: "DS-2026-0007", name: "储能电站充放电记录", type: "时序数据", source: "MySQL", owner: "林晚晴", department: "能源事业部", records: 9876000, sizeMB: 38900, quality: 4.6, status: "published", updated: "2026-09-21 07:30", createdAt: "2025-12-01", fields: 40, synced: true, views: 6410, desc: "储能簇级充放电曲线与 SOC 统计，支撑削峰填谷策略分析。", tags: ["高频调用", "质量优秀"], access: ["read", "export"] },
  { id: "DS-2026-0008", name: "网关访问日志汇总", type: "日志数据", source: "Kafka", owner: "温子墨", department: "消费互联网部", records: 56210000, sizeMB: 88200, quality: 3.9, status: "offline", updated: "2026-08-30 10:00", createdAt: "2025-05-17", fields: 33, synced: true, views: 1090, desc: "已迁移至冷存储，暂停在线服务，如需查询请提工单申请。", tags: ["大数据量"], access: ["read"] },
  { id: "DS-2026-0009", name: "App 埋点事件集", type: "用户行为", source: "REST API", owner: "苏婉宁", department: "消费互联网部", records: 31200000, sizeMB: 52300, quality: 4.3, status: "published", updated: "2026-09-21 06:15", createdAt: "2025-09-12", fields: 51, synced: true, views: 12050, desc: "移动端标准化埋点事件，T+1 聚合口径与实时明细双表。", tags: ["高频调用", "实时同步"], access: ["read", "export", "share"] },
  { id: "DS-2026-0010", name: "供应链对账单", type: "交易数据", source: "文件上传", owner: "白亦舒", department: "智能制造部", records: 96500, sizeMB: 4210, quality: 3.8, status: "draft", updated: "2026-09-15 15:47", createdAt: "2026-04-19", fields: 27, synced: false, views: 260, desc: "供应商月度对账单据，待财务确认字段口径后发布。", tags: [], access: ["read", "edit"] },
  { id: "DS-2026-0011", name: "卫星遥感影像切片", type: "影像资料", source: "文件上传", owner: "韩景行", department: "智慧城市部", records: 704000, sizeMB: 190600, quality: 4.4, status: "published", updated: "2026-09-17 09:33", createdAt: "2026-01-27", fields: 24, synced: true, views: 1870, desc: "城市级遥感影像瓦片服务，覆盖近三年四期采集。", tags: ["大数据量"], access: ["read"] },
  { id: "DS-2026-0012", name: "质检报告归档库", type: "文档资料", source: "OCR 采集", owner: "韩景行", department: "智能制造部", records: 132000, sizeMB: 8940, quality: 4.1, status: "published", updated: "2026-09-20 16:21", createdAt: "2026-02-05", fields: 19, synced: true, views: 1420, desc: "产线质检报告 OCR 结构化归档，支持按批次检索。", tags: [], access: ["read", "export"] },
  { id: "DS-2026-0013", name: "充电桩实时功率流", type: "时序数据", source: "Kafka", owner: "温子墨", department: "能源事业部", records: 18790000, sizeMB: 41500, quality: 4.2, status: "published", updated: "2026-09-21 09:40", createdAt: "2025-10-08", fields: 38, synced: true, views: 5230, desc: "全国充电桩秒级功率与订单状态流，服务运营监控大屏。", tags: ["实时同步", "大数据量"], access: ["read", "export"] },
  { id: "DS-2026-0014", name: "安防摄像头事件流", type: "日志数据", source: "Kafka", owner: "白亦舒", department: "智慧城市部", records: 26540000, sizeMB: 63700, quality: 3.5, status: "processing", updated: "2026-09-21 05:28", createdAt: "2025-11-11", fields: 45, synced: true, views: 2070, desc: "事件抽帧与目标检测结构化结果，正在回补历史数据。", tags: ["大数据量"], access: ["read"] },
  { id: "DS-2026-0015", name: "会员积分流水", type: "交易数据", source: "MySQL", owner: "顾承宇", department: "金融科技部", records: 15430000, sizeMB: 28700, quality: 4.7, status: "published", updated: "2026-09-20 20:05", createdAt: "2025-07-25", fields: 41, synced: true, views: 7380, desc: "会员体系积分获取与消耗流水，对账口径已通过审计。", tags: ["高频调用", "质量优秀"], access: ["read", "export"] },
  { id: "DS-2026-0016", name: "语音转写语料库", type: "文档资料", source: "文件上传", owner: "沈若彤", department: "医疗健康部", records: 36800, sizeMB: 9870, quality: 3.9, status: "draft", updated: "2026-09-12 13:18", createdAt: "2026-05-06", fields: 16, synced: false, views: 150, desc: "问诊语音转写文本语料，脱敏规则待复核。", tags: [], access: ["read"] },
  { id: "DS-2026-0017", name: "楼宇能耗监测数据", type: "时序数据", source: "REST API", owner: "温子墨", department: "智慧城市部", records: 7210000, sizeMB: 21900, quality: 4.3, status: "published", updated: "2026-09-21 08:02", createdAt: "2025-12-29", fields: 34, synced: true, views: 2960, desc: "园区楼宇水电燃气 15 分钟粒度能耗数据。", tags: ["质量优秀"], access: ["read", "export"] },
  { id: "DS-2026-0018", name: "客服会话记录", type: "日志数据", source: "MySQL", owner: "苏婉宁", department: "消费互联网部", records: 1982000, sizeMB: 9450, quality: 3.7, status: "offline", updated: "2026-09-02 18:44", createdAt: "2025-09-30", fields: 31, synced: true, views: 3340, desc: "在线客服会话全量记录，因合规审计要求临时下线。", tags: [], access: ["read"] },
  { id: "DS-2026-0019", name: "物流轨迹埋点", type: "用户行为", source: "REST API", owner: "白亦舒", department: "智能制造部", records: 11250000, sizeMB: 26400, quality: 3.4, status: "offline", updated: "2026-08-25 09:50", createdAt: "2025-10-21", fields: 29, synced: true, views: 890, desc: "业务下线，数据已转入归档库。", tags: [], access: ["read"] },
  { id: "DS-2026-0020", name: "保险理赔单据影像", type: "影像资料", source: "OCR 采集", owner: "沈若彤", department: "金融科技部", records: 89200, sizeMB: 134200, quality: 3.8, status: "draft", updated: "2026-09-16 10:26", createdAt: "2026-03-15", fields: 26, synced: false, views: 410, desc: "理赔申请单据扫描件，识别模板覆盖率 87%，补充中。", tags: [], access: ["read"] },
  { id: "DS-2026-0021", name: "工业视觉缺陷图集", type: "影像资料", source: "文件上传", owner: "韩景行", department: "智能制造部", records: 456000, sizeMB: 167800, quality: 4.5, status: "published", updated: "2026-09-19 14:11", createdAt: "2026-01-06", fields: 23, synced: true, views: 2530, desc: "产线缺陷检测图集，含像素级标注与缺陷分级。", tags: ["大数据量", "质量优秀"], access: ["read", "export"] },
  { id: "DS-2026-0022", name: "运营商信令采样集", type: "用户行为", source: "Kafka", owner: "林晚晴", department: "消费互联网部", records: 38900000, sizeMB: 92300, quality: 4.0, status: "draft", updated: "2026-09-14 17:39", createdAt: "2026-04-28", fields: 47, synced: false, views: 380, desc: "脱敏采样信令数据，供客流洞察模型离线训练。", tags: ["大数据量"], access: ["read"] },
];

export const apiTrendFull = [
  { 日期: "09-08", 调用量: 39820, 错误数: 118 },
  { 日期: "09-09", 调用量: 42150, 错误数: 96 },
  { 日期: "09-10", 调用量: 38760, 错误数: 142 },
  { 日期: "09-11", 调用量: 44680, 错误数: 88 },
  { 日期: "09-12", 调用量: 46930, 错误数: 105 },
  { 日期: "09-13", 调用量: 40120, 错误数: 74 },
  { 日期: "09-14", 调用量: 43870, 错误数: 92 },
  { 日期: "09-15", 调用量: 45210, 错误数: 110 },
  { 日期: "09-16", 调用量: 48360, 错误数: 98 },
  { 日期: "09-17", 调用量: 47140, 错误数: 126 },
  { 日期: "09-18", 调用量: 50280, 错误数: 84 },
  { 日期: "09-19", 调用量: 46790, 错误数: 71 },
  { 日期: "09-20", 调用量: 51240, 错误数: 95 },
  { 日期: "09-21", 调用量: 48216, 错误数: 68 },
];

export const deptStorage = [
  { 部门: "能源事业部", 存储量: 1.62 },
  { 部门: "消费互联网部", 存储量: 1.38 },
  { 部门: "金融科技部", 存储量: 0.92 },
  { 部门: "智能制造部", 存储量: 0.71 },
  { 部门: "智慧城市部", 存储量: 0.62 },
  { 部门: "医疗健康部", 存储量: 0.55 },
];

export const sourceDist = [
  { name: "MySQL", value: 5 },
  { name: "Kafka", value: 6 },
  { name: "REST API", value: 3 },
  { name: "文件上传", value: 5 },
  { name: "OCR 采集", value: 3 },
];

export const syncProgressData = [
  { name: "MySQL 主库集群", value: 76 },
  { name: "Kafka 行为流", value: 43 },
  { name: "冷数据归档", value: 18 },
  { name: "OCR 影像管线", value: 100 },
  { name: "卫星影像导入", value: 100 },
];

export const dailySync = [
  { 日期: "09-15", 同步量: 218 },
  { 日期: "09-16", 同步量: 312 },
  { 日期: "09-17", 同步量: 286 },
  { 日期: "09-18", 同步量: 348 },
  { 日期: "09-19", 同步量: 265 },
  { 日期: "09-20", 同步量: 402 },
  { 日期: "09-21", 同步量: 376 },
];

export const recentActivities = [
  { tone: "success", title: "「华东光伏电站运行数据」完成质量校验，评分 4.5", time: "10 分钟前" },
  { tone: "processing", title: "「医学影像标注样本库」正在重建索引，预计 20 分钟完成", time: "26 分钟前" },
  { tone: "error", title: "「财务对账文件同步」失败：源端 SFTP 连接超时", time: "32 分钟前" },
  { tone: "neutral", title: "陈志远 创建了「语音转写语料库」的导出任务", time: "1 小时前" },
  { tone: "neutral", title: "林晚晴 更新了「运营商信令采样集」的字段结构", time: "2 小时前" },
  { tone: "neutral", title: "管理员 开启了回收站自动清理策略（保留 30 天）", time: "昨天 20:15" },
];

export const seedTasks = [
  { id: "TASK-001", name: "MySQL 主库集群 → 数据湖", source: "MySQL", schedule: "每 5 分钟", status: "running", progress: 76, records: "1,284 万", lastRun: "2026-09-21 09:32", latency: "12s" },
  { id: "TASK-002", name: "Kafka 用户行为流接入", source: "Kafka", schedule: "实时", status: "running", progress: 43, records: "4,523 万", lastRun: "2026-09-21 09:40", latency: "3s" },
  { id: "TASK-003", name: "OCR 影像识别管线", source: "OCR 采集", schedule: "每日 02:00", status: "done", progress: 100, records: "15.6 万", lastRun: "2026-09-21 02:00", latency: "6m12s" },
  { id: "TASK-004", name: "IoT 传感网关汇聚", source: "REST API", schedule: "每 10 分钟", status: "queued", progress: 0, records: "21.0 万", lastRun: "—", latency: "—" },
  { id: "TASK-005", name: "财务对账文件同步", source: "文件上传", schedule: "每日 03:30", status: "failed", progress: 62, records: "9.6 万", lastRun: "2026-09-21 03:30", latency: "重试 3 次" },
  { id: "TASK-006", name: "卫星影像批量导入", source: "文件上传", schedule: "每周日 01:00", status: "done", progress: 100, records: "70.4 万", lastRun: "2026-09-14 01:00", latency: "42m" },
  { id: "TASK-007", name: "冷数据归档迁移", source: "MySQL", schedule: "每月 1 日", status: "running", progress: 18, records: "2,318 万", lastRun: "2026-09-01 09:00", latency: "5m" },
];

export const syncLogs = [
  { tone: "running", title: "Kafka 用户行为流接入", desc: "消费延迟 3s，速率 1.2 万条/秒", time: "09:40:12" },
  { tone: "success", title: "MySQL 主库集群 → 数据湖", desc: "本轮同步 12.4 万条，校验全部通过", time: "09:32:45" },
  { tone: "error", title: "财务对账文件同步", desc: "SFTP 连接超时，已自动重试 3 次", time: "03:34:10" },
  { tone: "success", title: "OCR 影像识别管线", desc: "识别影像 15.6 万张，准确率 98.7%", time: "02:06:31" },
  { tone: "neutral", title: "冷数据归档迁移", desc: "已归档 2019 年前日志约 18%", time: "09:01:02" },
];

function recycleSeed(id, name, type, sizeMB, deletedBy, deletedAt, daysLeft, reason, snapshot) {
  return { id, deletedBy, deletedAt, daysLeft, reason, sizeMB, dataset: { id, name, type, ...snapshot } };
}

export const seedRecycleItems = [
  recycleSeed("DS-2025-0431", "旧版用户画像标签集", "用户行为", 4200, "苏婉宁", "2026-09-19 11:20", 28, "重复导入", { source: "MySQL", owner: "苏婉宁", department: "消费互联网部", records: 286000, quality: 3.2, fields: 18, synced: false, createdAt: "2025-03-11", updated: "2026-09-19 11:20", views: 210, desc: "旧版画像标签，已被新版标签体系替代。", tags: [], access: ["read"] }),
  recycleSeed("DS-2025-0388", "停用设备资产清单", "文档资料", 86, "韩景行", "2026-09-17 16:05", 26, "业务下线", { source: "文件上传", owner: "韩景行", department: "智能制造部", records: 4200, quality: 3.0, fields: 12, synced: false, createdAt: "2025-02-08", updated: "2026-09-17 16:05", views: 96, desc: "已由资产管理系统中的一级台账替代。", tags: [], access: ["read"] }),
  recycleSeed("DS-2025-0402", "门店客流试点数据", "时序数据", 15300, "温子墨", "2026-09-14 10:42", 23, "试点结束", { source: "REST API", owner: "温子墨", department: "智慧城市部", records: 2140000, quality: 3.4, fields: 25, synced: false, createdAt: "2025-04-19", updated: "2026-09-14 10:42", views: 460, desc: "试点门店客流采集数据，项目验收后归档。", tags: [], access: ["read"] }),
  recycleSeed("DS-2025-0456", "营销活动日志备份", "日志数据", 8800, "顾承宇", "2026-09-08 09:15", 17, "数据迁移", { source: "Kafka", owner: "顾承宇", department: "金融科技部", records: 3120000, quality: 3.6, fields: 21, synced: false, createdAt: "2025-06-02", updated: "2026-09-08 09:15", views: 130, desc: "618 活动日志备份，已迁移至新集群。", tags: [], access: ["read"] }),
  recycleSeed("DS-2025-0444", "测试环境埋点副本", "用户行为", 1200, "陈志远", "2026-08-28 18:30", 6, "临时数据", { source: "REST API", owner: "陈志远", department: "消费互联网部", records: 640000, quality: 2.8, fields: 30, synced: false, createdAt: "2025-08-10", updated: "2026-08-28 18:30", views: 12, desc: "压测产生的埋点副本数据。", tags: [], access: ["read"] }),
  recycleSeed("DS-2025-0439", "旧版质检图片缓存", "影像资料", 62000, "韩景行", "2026-08-26 14:22", 4, "版本过期", { source: "文件上传", owner: "韩景行", department: "智能制造部", records: 88000, quality: 3.1, fields: 14, synced: false, createdAt: "2025-07-27", updated: "2026-08-26 14:22", views: 88, desc: "旧版本视觉模型推理缓存图片。", tags: [], access: ["read"] }),
  recycleSeed("DS-2025-0420", "试点问卷原始数据", "文档资料", 210, "沈若彤", "2026-09-02 11:08", 9, "试点结束", { source: "文件上传", owner: "沈若彤", department: "医疗健康部", records: 5600, quality: 3.5, fields: 9, synced: false, createdAt: "2025-05-23", updated: "2026-09-02 11:08", views: 44, desc: "慢病管理试点问卷原始录入。", tags: [], access: ["read"] }),
  recycleSeed("DS-2025-0413", "旧计费引擎流水副本", "交易数据", 24500, "白亦舒", "2026-08-24 20:11", 2, "数据迁移", { source: "MySQL", owner: "白亦舒", department: "金融科技部", records: 5210000, quality: 3.3, fields: 38, synced: false, createdAt: "2025-04-30", updated: "2026-08-24 20:11", views: 150, desc: "旧计费引擎流水副本，已迁入新版账务库。", tags: [], access: ["read"] }),
];

export const seedNotifications = [
  { id: "N-1", tone: "success", title: "同步任务完成", desc: "「MySQL 主库集群 → 数据湖」已完成本轮同步", time: "10 分钟前", unread: true },
  { id: "N-2", tone: "error", title: "同步失败告警", desc: "「财务对账文件同步」连续失败 3 次，请检查源端连接", time: "32 分钟前", unread: true },
  { id: "N-3", tone: "info", title: "权限变更", desc: "顾承宇 将你添加为「跨境支付交易明细」的维护者", time: "2 小时前", unread: true },
  { id: "N-4", tone: "neutral", title: "平台公告", desc: "9 月 25 日 02:00-04:00 存储集群升级维护，期间暂停同步", time: "昨天 18:00", unread: false },
];

export const fieldSchema = [
  { fieldName: "device_id", fieldType: "STRING", required: true, comment: "设备唯一编号" },
  { fieldName: "timestamp", fieldType: "TIMESTAMP", required: true, comment: "采样时间，毫秒精度" },
  { fieldName: "active_power", fieldType: "DOUBLE", required: true, comment: "有功功率，单位 kW" },
  { fieldName: "irradiance", fieldType: "DOUBLE", required: false, comment: "辐照度，单位 W/m²" },
  { fieldName: "module_temp", fieldType: "DOUBLE", required: false, comment: "组件温度，单位 ℃" },
  { fieldName: "env_temp", fieldType: "DOUBLE", required: false, comment: "环境温度，单位 ℃" },
  { fieldName: "station_code", fieldType: "STRING", required: true, comment: "电站编码" },
  { fieldName: "is_abnormal", fieldType: "BOOLEAN", required: false, comment: "是否异常采样" },
];

export const changeLogs = [
  { tone: "success", time: "2026-09-20 14:32", title: "完成质量校验", desc: "完整性 90%，时效性 84%，评分 4.5" },
  { tone: "info", time: "2026-09-12 10:05", title: "字段结构变更", desc: "林晚晴 新增字段 is_abnormal(BOOLEAN)" },
  { tone: "neutral", time: "2026-08-28 09:40", title: "导出记录", desc: "陈志远 导出 2026-08 月度数据（CSV，1.2 GB）" },
  { tone: "info", time: "2026-07-15 16:22", title: "同步策略调整", desc: "同步频率由每日调整为每 5 分钟" },
  { tone: "success", time: "2026-05-06 11:00", title: "发布上线", desc: "数据集通过安全评审，正式发布" },
  { tone: "neutral", time: "2025-11-03 09:30", title: "创建数据集", desc: "林晚晴 创建了该数据集" },
];

export const relatedTasks = [
  { name: "MySQL 主库集群 → 数据湖", status: "running", progress: 76 },
  { name: "冷数据归档迁移", status: "running", progress: 18 },
  { name: "财务对账文件同步", status: "failed", progress: 62 },
];
