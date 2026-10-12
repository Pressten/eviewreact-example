// Layer 2: 任务清单 mock 数据

export const STAGES = ["数据接入", "清洗转换", "特征计算", "模型训练", "结果校验"];

export const TASK_STATUS = {
  running: { text: "执行中", tone: "info" },
  success: { text: "已完成", tone: "success" },
  failed: { text: "执行失败", tone: "error" },
  waiting: { text: "等待调度", tone: "warning" },
  paused: { text: "已暂停", tone: "critical" },
};

export const TASK_TYPE = {
  batch: "批量任务",
  realtime: "实时任务",
  scheduled: "定时任务",
  adhoc: "临时任务",
};

export const tasks = [
  { id: "T-240981", name: "用户行为埋点 ETL", type: "batch", typeLabel: "批量任务", source: "Hive-ODS", target: "Hive-DWD", owner: "张伟", status: "running", stage: 2, rows: "1,284 万", startTime: "2026-10-12 08:00", createdAt: "2026-10-11 22:14", duration: "42 分钟" },
  { id: "T-240982", name: "订单实时风控流", type: "realtime", typeLabel: "实时任务", source: "Kafka", target: "Flink-Sink", owner: "李娜", status: "running", stage: 3, rows: "86 万", startTime: "2026-10-12 07:30", createdAt: "2026-10-10 19:02", duration: "1 小时 12 分" },
  { id: "T-240983", name: "商品画像离线计算", type: "batch", typeLabel: "批量任务", source: "Spark", target: "Hive-DWS", owner: "王强", status: "success", stage: 5, rows: "642 万", startTime: "2026-10-12 02:00", createdAt: "2026-10-10 15:41", duration: "58 分钟" },
  { id: "T-240984", name: "门店销售日汇总", type: "scheduled", typeLabel: "定时任务", source: "MySQL", target: "ClickHouse", owner: "赵敏", status: "success", stage: 5, rows: "218 万", startTime: "2026-10-12 01:00", createdAt: "2026-10-09 11:20", duration: "16 分钟" },
  { id: "T-240985", name: "支付对账链路", type: "batch", typeLabel: "批量任务", source: "GaussDB", target: "Hive-DWB", owner: "刘洋", status: "failed", stage: 3, rows: "—", startTime: "2026-10-12 03:20", createdAt: "2026-10-09 09:35", duration: "27 分钟" },
  { id: "T-240986", name: "用户留存模型训练", type: "batch", typeLabel: "批量任务", source: "Spark ML", target: "ModelHub", owner: "陈静", status: "running", stage: 4, rows: "392 万", startTime: "2026-10-12 06:10", createdAt: "2026-10-08 20:00", duration: "2 小时 05 分" },
  { id: "T-240987", name: "广告点击归因", type: "realtime", typeLabel: "实时任务", source: "Flink", target: "Doris", owner: "杨帆", status: "running", stage: 1, rows: "46 万", startTime: "2026-10-12 08:05", createdAt: "2026-10-08 17:48", duration: "36 分钟" },
  { id: "T-240988", name: "库存同步任务", type: "scheduled", typeLabel: "定时任务", source: "MySQL", target: "Redis", owner: "周涛", status: "waiting", stage: 0, rows: "—", startTime: "2026-10-12 09:00", createdAt: "2026-10-08 14:12", duration: "—" },
  { id: "T-240989", name: "会员等级刷新", type: "scheduled", typeLabel: "定时任务", source: "Hive", target: "MySQL", owner: "吴倩", status: "success", stage: 5, rows: "954 万", startTime: "2026-10-12 00:30", createdAt: "2026-10-07 16:30", duration: "31 分钟" },
  { id: "T-240990", name: "设备心跳采集", type: "realtime", typeLabel: "实时任务", source: "Kafka", target: "InfluxDB", owner: "郑凯", status: "running", stage: 2, rows: "1.6 亿", startTime: "2026-10-12 07:45", createdAt: "2026-10-07 10:05", duration: "持续运行" },
  { id: "T-240991", name: "风控特征回填", type: "batch", typeLabel: "批量任务", source: "Spark", target: "Hive-DWD", owner: "孙丽", status: "paused", stage: 2, rows: "—", startTime: "2026-10-12 04:00", createdAt: "2026-10-06 19:22", duration: "已暂停" },
  { id: "T-240992", name: "财务流水清洗", type: "batch", typeLabel: "批量任务", source: "Hive", target: "Hive-DWB", owner: "黄磊", status: "success", stage: 5, rows: "327 万", startTime: "2026-10-11 23:40", createdAt: "2026-10-06 13:50", duration: "44 分钟" },
  { id: "T-240993", name: "搜索日志聚合", type: "batch", typeLabel: "批量任务", source: "ClickHouse", target: "Hive-DWS", owner: "徐强", status: "failed", stage: 1, rows: "—", startTime: "2026-10-11 22:10", createdAt: "2026-10-06 09:14", duration: "9 分钟" },
  { id: "T-240994", name: "推荐召回评估", type: "batch", typeLabel: "批量任务", source: "Spark ML", target: "ModelHub", owner: "马超", status: "running", stage: 3, rows: "512 万", startTime: "2026-10-12 05:20", createdAt: "2026-10-05 21:08", duration: "48 分钟" },
  { id: "T-240995", name: "优惠券核销统计", type: "scheduled", typeLabel: "定时任务", source: "MySQL", target: "Hive-DWS", owner: "林芳", status: "success", stage: 5, rows: "73 万", startTime: "2026-10-11 21:00", createdAt: "2026-10-05 15:33", duration: "12 分钟" },
  { id: "T-240996", name: "物流轨迹解析", type: "realtime", typeLabel: "实时任务", source: "Flink", target: "HBase", owner: "何伟", status: "running", stage: 0, rows: "122 万", startTime: "2026-10-12 08:10", createdAt: "2026-10-05 11:47", duration: "18 分钟" },
  { id: "T-240997", name: "客服会话归档", type: "scheduled", typeLabel: "定时任务", source: "Hive", target: "HBase", owner: "高鹏", status: "waiting", stage: 0, rows: "—", startTime: "2026-10-12 10:00", createdAt: "2026-10-04 18:20", duration: "—" },
  { id: "T-240998", name: "反欺诈规则计算", type: "realtime", typeLabel: "实时任务", source: "Flink", target: "Redis", owner: "罗雪", status: "running", stage: 4, rows: "264 万", startTime: "2026-10-12 06:40", createdAt: "2026-10-04 12:09", duration: "1 小时 28 分" },
  { id: "T-240999", name: "商品价格监控", type: "scheduled", typeLabel: "定时任务", source: "MySQL", target: "ClickHouse", owner: "谢军", status: "success", stage: 5, rows: "189 万", startTime: "2026-10-11 20:30", createdAt: "2026-10-03 16:55", duration: "22 分钟" },
  { id: "T-241000", name: "用户分群更新", type: "batch", typeLabel: "批量任务", source: "Hive", target: "MySQL", owner: "唐敏", status: "paused", stage: 1, rows: "—", startTime: "2026-10-11 19:00", createdAt: "2026-10-03 10:31", duration: "已暂停" },
  { id: "T-241001", name: "内容审核同步", type: "realtime", typeLabel: "实时任务", source: "Kafka", target: "Elasticsearch", owner: "冯磊", status: "running", stage: 2, rows: "58 万", startTime: "2026-10-12 08:20", createdAt: "2026-10-02 14:26", duration: "26 分钟" },
  { id: "T-241002", name: "数据质量巡检", type: "scheduled", typeLabel: "定时任务", source: "Hive", target: "Hive-DWS", owner: "邓婷", status: "failed", stage: 4, rows: "—", startTime: "2026-10-11 18:30", createdAt: "2026-10-02 09:03", duration: "33 分钟" },
];
