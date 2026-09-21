// Layer 2: 采集明细 mock 数据（二级页签数据源）
// 语义化字段：batch / task / node / partition / rows / cost / quality / status / finishedAt

export const recordList = [
  { id: "REC-20260920-01", batch: "BATCH_20260920_0100", task: "DWS 用户活跃日汇总", node: "dwd_user_login_di", partition: "2026-09-20 01:00", rows: 1284560, cost: "12m 34s", quality: 98.2, status: "success", finishedAt: "2026-09-20 01:12" },
  { id: "REC-20260920-02", batch: "BATCH_20260920_0200", task: "新增注册用户聚合", node: "dwd_user_register_di", partition: "2026-09-20 02:00", rows: 38620, cost: "3m 08s", quality: 97.4, status: "success", finishedAt: "2026-09-20 02:03" },
  { id: "REC-20260920-03", batch: "BATCH_20260920_0300", task: "次日留存计算", node: "dws_user_retention_di", partition: "2026-09-20 03:00", rows: 15240, cost: "8m 41s", quality: 86.5, status: "warning", finishedAt: "2026-09-20 03:09" },
  { id: "REC-20260920-04", batch: "BATCH_20260920_0400", task: "交易支付明细归集", node: "dwd_order_pay_di", partition: "2026-09-20 04:00", rows: 864230, cost: "15m 02s", quality: 99.0, status: "success", finishedAt: "2026-09-20 04:15" },
  { id: "REC-20260920-05", batch: "BATCH_20260920_0500", task: "有效订单口径清洗", node: "dws_order_valid_di", partition: "2026-09-20 05:00", rows: 742180, cost: "11m 27s", quality: 98.6, status: "success", finishedAt: "2026-09-20 05:11" },
  { id: "REC-20260920-06", batch: "BATCH_20260920_0600", task: "退款率回溯重算", node: "ads_order_refund_df", partition: "2026-09-20 06:00", rows: 42310, cost: "6m 55s", quality: 68.9, status: "failed", finishedAt: "2026-09-20 06:07" },
  { id: "REC-20260920-07", batch: "BATCH_20260920_0700", task: "支付结果实时汇总", node: "dws_pay_result_di", partition: "2026-09-20 07:00", rows: 2310450, cost: "4m 12s", quality: 99.4, status: "success", finishedAt: "2026-09-20 07:04" },
  { id: "REC-20260920-08", batch: "BATCH_20260920_0800", task: "在线设备心跳归集", node: "dws_device_online_di", partition: "2026-09-20 08:00", rows: 4126800, cost: "9m 38s", quality: 96.1, status: "success", finishedAt: "2026-09-20 08:10" },
  { id: "REC-20260920-09", batch: "BATCH_20260920_0900", task: "设备故障归因分析", node: "dws_device_fault_df", partition: "2026-09-20 09:00", rows: 96240, cost: "13m 20s", quality: 81.3, status: "warning", finishedAt: "2026-09-20 09:13" },
  { id: "REC-20260920-10", batch: "BATCH_20260920_1000", task: "固件升级结果统计", node: "ads_firmware_upgrade_df", partition: "2026-09-20 10:00", rows: 153870, cost: "5m 46s", quality: 92.7, status: "success", finishedAt: "2026-09-20 10:06" },
  { id: "REC-20260920-11", batch: "BATCH_20260920_1100", task: "网络时延分钟级聚合", node: "dwd_net_latency_di", partition: "2026-09-20 11:00", rows: 7820400, cost: "18m 09s", quality: 94.8, status: "success", finishedAt: "2026-09-20 11:18" },
  { id: "REC-20260920-12", batch: "BATCH_20260920_1200", task: "丢包率异常检测", node: "dws_net_loss_di", partition: "2026-09-20 12:00", rows: 5612300, cost: "16m 32s", quality: 71.2, status: "failed", finishedAt: "2026-09-20 12:17" },
  { id: "REC-20260920-13", batch: "BATCH_20260920_1300", task: "骨干网流量结算", node: "dws_net_flow_di", partition: "2026-09-20 13:00", rows: 3284500, cost: "14m 51s", quality: 97.9, status: "success", finishedAt: "2026-09-20 13:15" },
  { id: "REC-20260920-14", batch: "BATCH_20260920_1400", task: "告警事件流式入库", node: "dwd_alarm_event_di", partition: "2026-09-20 14:00", rows: 186320, cost: "1m 24s", quality: 99.6, status: "success", finishedAt: "2026-09-20 14:01" },
  { id: "REC-20260920-15", batch: "BATCH_20260920_1500", task: "工单修复时长统计", node: "ads_alarm_mttr_df", partition: "2026-09-20 15:00", rows: 12480, cost: "2m 37s", quality: 88.4, status: "success", finishedAt: "2026-09-20 15:03" },
  { id: "REC-20260920-16", batch: "BATCH_20260920_1600", task: "服务可用率巡检", node: "dws_service_avail_di", partition: "2026-09-20 16:00", rows: 92160, cost: "4m 05s", quality: 99.9, status: "success", finishedAt: "2026-09-20 16:04" },
  { id: "REC-20260920-17", batch: "BATCH_20260920_1700", task: "CPU 利用率采样归集", node: "dws_resource_cpu_di", partition: "2026-09-20 17:00", rows: 6540200, cost: "10m 18s", quality: 91.6, status: "success", finishedAt: "2026-09-20 17:10" },
  { id: "REC-20260920-18", batch: "BATCH_20260920_1800", task: "存储水位巡检", node: "dws_resource_store_di", partition: "2026-09-20 18:00", rows: 421860, cost: "7m 22s", quality: 83.5, status: "warning", finishedAt: "2026-09-20 18:07" },
  { id: "REC-20260920-19", batch: "BATCH_20260920_1900", task: "营销转化漏斗计算", node: "ads_mkt_convert_df", partition: "2026-09-20 19:00", rows: 286400, cost: "9m 47s", quality: 90.2, status: "success", finishedAt: "2026-09-20 19:10" },
  { id: "REC-20260920-20", batch: "BATCH_20260920_2000", task: "获客成本口径核对", node: "ads_mkt_cac_df", partition: "2026-09-20 20:00", rows: 35260, cost: "3m 51s", quality: 0, status: "skipped", finishedAt: "2026-09-20 20:04" },
  { id: "REC-20260920-21", batch: "BATCH_20260920_2100", task: "风控拦截实时统计", node: "dws_risk_fraud_di", partition: "2026-09-20 21:00", rows: 24680, cost: "1m 09s", quality: 95.7, status: "success", finishedAt: "2026-09-20 21:01" },
  { id: "REC-20260920-22", batch: "BATCH_20260920_2200", task: "安全攻击事件归集", node: "dws_sec_attack_di", partition: "2026-09-20 22:00", rows: 18340, cost: "1m 43s", quality: 97.8, status: "success", finishedAt: "2026-09-20 22:02" },
];

export const recordStatusOptions = [
  { label: "全部状态", value: "all" },
  { label: "成功", value: "success" },
  { label: "预警", value: "warning" },
  { label: "失败", value: "failed" },
  { label: "已跳过", value: "skipped" },
];
