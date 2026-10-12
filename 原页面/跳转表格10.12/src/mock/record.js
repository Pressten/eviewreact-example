// Layer 2: 执行记录 mock 数据

export const RECORD_STAGES = ["调度下发", "资源分配", "任务执行", "结果写回", "完成确认"];

export const RECORD_STATUS = {
  running: { text: "执行中", tone: "info" },
  success: { text: "成功", tone: "success" },
  failed: { text: "失败", tone: "error" },
  retrying: { text: "重试中", tone: "warning" },
  skipped: { text: "已跳过", tone: "critical" },
};

export const RECORD_NODES = ["ODS 接入节点", "清洗集群 A", "特征计算集群", "模型训练集群", "校验服务"];

export const records = [
  { id: "EXE-20261012-0001", name: "用户行为埋点 ETL · 调度 #3", node: "清洗集群 A", typeLabel: "批量任务", source: "Hive-ODS", target: "Hive-DWD", owner: "张伟", status: "running", stage: 2, rows: "1,284 万", startTime: "2026-10-12 08:00", createdAt: "2026-10-12 08:00", duration: "42 分钟" },
  { id: "EXE-20261012-0002", name: "订单实时风控流 · 调度 #17", node: "特征计算集群", typeLabel: "实时任务", source: "Kafka", target: "Flink-Sink", owner: "李娜", status: "running", stage: 3, rows: "86 万", startTime: "2026-10-12 07:30", createdAt: "2026-10-12 07:30", duration: "1 小时 12 分" },
  { id: "EXE-20261012-0003", name: "商品画像离线计算 · 调度 #2", node: "模型训练集群", typeLabel: "批量任务", source: "Spark", target: "Hive-DWS", owner: "王强", status: "success", stage: 5, rows: "642 万", startTime: "2026-10-12 02:00", createdAt: "2026-10-12 02:00", duration: "58 分钟" },
  { id: "EXE-20261012-0004", name: "门店销售日汇总 · 调度 #1", node: "校验服务", typeLabel: "定时任务", source: "MySQL", target: "ClickHouse", owner: "赵敏", status: "success", stage: 5, rows: "218 万", startTime: "2026-10-12 01:00", createdAt: "2026-10-12 01:00", duration: "16 分钟" },
  { id: "EXE-20261012-0005", name: "支付对账链路 · 调度 #5", node: "结果写回服务", typeLabel: "批量任务", source: "GaussDB", target: "Hive-DWB", owner: "刘洋", status: "failed", stage: 3, rows: "—", startTime: "2026-10-12 03:20", createdAt: "2026-10-12 03:20", duration: "27 分钟" },
  { id: "EXE-20261012-0006", name: "用户留存模型训练 · 调度 #8", node: "模型训练集群", typeLabel: "批量任务", source: "Spark ML", target: "ModelHub", owner: "陈静", status: "running", stage: 4, rows: "392 万", startTime: "2026-10-12 06:10", createdAt: "2026-10-12 06:10", duration: "2 小时 05 分" },
  { id: "EXE-20261012-0007", name: "广告点击归因 · 调度 #24", node: "ODS 接入节点", typeLabel: "实时任务", source: "Flink", target: "Doris", owner: "杨帆", status: "running", stage: 1, rows: "46 万", startTime: "2026-10-12 08:05", createdAt: "2026-10-12 08:05", duration: "36 分钟" },
  { id: "EXE-20261012-0008", name: "库存同步任务 · 调度 #6", node: "调度中心", typeLabel: "定时任务", source: "MySQL", target: "Redis", owner: "周涛", status: "retrying", stage: 1, rows: "—", startTime: "2026-10-12 09:00", createdAt: "2026-10-12 09:00", duration: "重试 2 次" },
  { id: "EXE-20261011-0091", name: "会员等级刷新 · 调度 #1", node: "校验服务", typeLabel: "定时任务", source: "Hive", target: "MySQL", owner: "吴倩", status: "success", stage: 5, rows: "954 万", startTime: "2026-10-12 00:30", createdAt: "2026-10-12 00:30", duration: "31 分钟" },
  { id: "EXE-20261011-0092", name: "设备心跳采集 · 调度 #99", node: "清洗集群 A", typeLabel: "实时任务", source: "Kafka", target: "InfluxDB", owner: "郑凯", status: "running", stage: 2, rows: "1.6 亿", startTime: "2026-10-12 07:45", createdAt: "2026-10-12 07:45", duration: "持续运行" },
  { id: "EXE-20261011-0093", name: "风控特征回填 · 调度 #4", node: "特征计算集群", typeLabel: "批量任务", source: "Spark", target: "Hive-DWD", owner: "孙丽", status: "skipped", stage: 2, rows: "—", startTime: "2026-10-12 04:00", createdAt: "2026-10-12 04:00", duration: "已跳过" },
  { id: "EXE-20261011-0094", name: "财务流水清洗 · 调度 #2", node: "校验服务", typeLabel: "批量任务", source: "Hive", target: "Hive-DWB", owner: "黄磊", status: "success", stage: 5, rows: "327 万", startTime: "2026-10-11 23:40", createdAt: "2026-10-11 23:40", duration: "44 分钟" },
  { id: "EXE-20261011-0095", name: "搜索日志聚合 · 调度 #7", node: "ODS 接入节点", typeLabel: "批量任务", source: "ClickHouse", target: "Hive-DWS", owner: "徐强", status: "failed", stage: 1, rows: "—", startTime: "2026-10-11 22:10", createdAt: "2026-10-11 22:10", duration: "9 分钟" },
  { id: "EXE-20261011-0096", name: "推荐召回评估 · 调度 #3", node: "模型训练集群", typeLabel: "批量任务", source: "Spark ML", target: "ModelHub", owner: "马超", status: "running", stage: 3, rows: "512 万", startTime: "2026-10-12 05:20", createdAt: "2026-10-12 05:20", duration: "48 分钟" },
  { id: "EXE-20261011-0097", name: "优惠券核销统计 · 调度 #1", node: "校验服务", typeLabel: "定时任务", source: "MySQL", target: "Hive-DWS", owner: "林芳", status: "success", stage: 5, rows: "73 万", startTime: "2026-10-11 21:00", createdAt: "2026-10-11 21:00", duration: "12 分钟" },
  { id: "EXE-20261011-0098", name: "物流轨迹解析 · 调度 #56", node: "ODS 接入节点", typeLabel: "实时任务", source: "Flink", target: "HBase", owner: "何伟", status: "running", stage: 0, rows: "122 万", startTime: "2026-10-12 08:10", createdAt: "2026-10-12 08:10", duration: "18 分钟" },
  { id: "EXE-20261011-0099", name: "客服会话归档 · 调度 #2", node: "调度中心", typeLabel: "定时任务", source: "Hive", target: "HBase", owner: "高鹏", status: "retrying", stage: 0, rows: "—", startTime: "2026-10-12 10:00", createdAt: "2026-10-12 10:00", duration: "等待重试" },
  { id: "EXE-20261011-0100", name: "反欺诈规则计算 · 调度 #41", node: "结果写回服务", typeLabel: "实时任务", source: "Flink", target: "Redis", owner: "罗雪", status: "running", stage: 4, rows: "264 万", startTime: "2026-10-12 06:40", createdAt: "2026-10-12 06:40", duration: "1 小时 28 分" },
  { id: "EXE-20261011-0101", name: "商品价格监控 · 调度 #1", node: "校验服务", typeLabel: "定时任务", source: "MySQL", target: "ClickHouse", owner: "谢军", status: "success", stage: 5, rows: "189 万", startTime: "2026-10-11 20:30", createdAt: "2026-10-11 20:30", duration: "22 分钟" },
  { id: "EXE-20261011-0102", name: "用户分群更新 · 调度 #9", node: "清洗集群 A", typeLabel: "批量任务", source: "Hive", target: "MySQL", owner: "唐敏", status: "skipped", stage: 1, rows: "—", startTime: "2026-10-11 19:00", createdAt: "2026-10-11 19:00", duration: "已跳过" },
  { id: "EXE-20261011-0103", name: "内容审核同步 · 调度 #12", node: "清洗集群 A", typeLabel: "实时任务", source: "Kafka", target: "Elasticsearch", owner: "冯磊", status: "running", stage: 2, rows: "58 万", startTime: "2026-10-12 08:20", createdAt: "2026-10-12 08:20", duration: "26 分钟" },
  { id: "EXE-20261011-0104", name: "数据质量巡检 · 调度 #3", node: "结果写回服务", typeLabel: "定时任务", source: "Hive", target: "Hive-DWS", owner: "邓婷", status: "failed", stage: 4, rows: "—", startTime: "2026-10-11 18:30", createdAt: "2026-10-11 18:30", duration: "33 分钟" },
  { id: "EXE-20261010-0077", name: "订单实时风控流 · 调度 #16", node: "特征计算集群", typeLabel: "实时任务", source: "Kafka", target: "Flink-Sink", owner: "李娜", status: "success", stage: 5, rows: "79 万", startTime: "2026-10-10 23:10", createdAt: "2026-10-10 23:10", duration: "1 小时 04 分" },
  { id: "EXE-20261010-0078", name: "商品画像离线计算 · 调度 #1", node: "模型训练集群", typeLabel: "批量任务", source: "Spark", target: "Hive-DWS", owner: "王强", status: "success", stage: 5, rows: "631 万", startTime: "2026-10-10 22:00", createdAt: "2026-10-10 22:00", duration: "55 分钟" },
];
