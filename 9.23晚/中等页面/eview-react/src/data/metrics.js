const metricList = [
  { id: "MTR-10001", code: "DM_USER_ACTIVE", name: "日活跃用户数", domain: "用户域", source: "dws_user_active_di", frequency: "T+1", owner: "张明", score: 96.4, rows: 1284560, status: "normal", updatedAt: "2026-09-19 08:12" },
  { id: "MTR-10002", code: "DM_USER_NEW", name: "新增注册用户数", domain: "用户域", source: "dws_user_register_di", frequency: "T+1", owner: "张明", score: 94.1, rows: 38620, status: "normal", updatedAt: "2026-09-19 08:14" },
  { id: "MTR-10003", code: "DM_USER_RETENTION", name: "用户次日留存率", domain: "用户域", source: "ads_user_retention_df", frequency: "T+1", owner: "李婉", score: 88.7, rows: 15240, status: "warning", updatedAt: "2026-09-19 09:02" },
  { id: "MTR-10004", code: "DM_ORDER_GMV", name: "交易总额（GMV）", domain: "交易域", source: "dws_order_pay_di", frequency: "小时", owner: "王海涛", score: 98.2, rows: 864230, status: "normal", updatedAt: "2026-09-20 10:00" },
  { id: "MTR-10005", code: "DM_ORDER_CNT", name: "有效订单量", domain: "交易域", source: "dws_order_valid_di", frequency: "小时", owner: "王海涛", score: 97.5, rows: 742180, status: "normal", updatedAt: "2026-09-20 10:00" },
  { id: "MTR-10006", code: "DM_ORDER_REFUND", name: "订单退款率", domain: "交易域", source: "ads_order_refund_df", frequency: "T+1", owner: "王海涛", score: 79.3, rows: 42310, status: "error", updatedAt: "2026-09-19 07:48" },
  { id: "MTR-10007", code: "DM_PAY_SUCCESS", name: "支付成功率", domain: "交易域", source: "dws_pay_result_di", frequency: "15分钟", owner: "陈嘉", score: 99.1, rows: 2310450, status: "normal", updatedAt: "2026-09-20 10:45" },
  { id: "MTR-10008", code: "DM_DEV_ONLINE", name: "在线设备数", domain: "设备域", source: "dws_device_online_di", frequency: "5分钟", owner: "刘晨", score: 95.8, rows: 4126800, status: "normal", updatedAt: "2026-09-20 10:50" },
  { id: "MTR-10009", code: "DM_DEV_FAULT", name: "设备故障率", domain: "设备域", source: "dws_device_fault_df", frequency: "T+1", owner: "刘晨", score: 82.6, rows: 96240, status: "warning", updatedAt: "2026-09-19 06:30" },
  { id: "MTR-10010", code: "DM_DEV_UPGRADE", name: "固件升级成功率", domain: "设备域", source: "ads_firmware_upgrade_df", frequency: "T+1", owner: "刘晨", score: 91.2, rows: 153870, status: "normal", updatedAt: "2026-09-19 06:42" },
  { id: "MTR-10011", code: "DM_NET_LATENCY", name: "网络平均时延", domain: "网络域", source: "dws_net_latency_di", frequency: "5分钟", owner: "赵启", score: 93.4, rows: 7820400, status: "normal", updatedAt: "2026-09-20 10:52" },
  { id: "MTR-10012", code: "DM_NET_LOSS", name: "网络丢包率", domain: "网络域", source: "dws_net_loss_di", frequency: "5分钟", owner: "赵启", score: 76.8, rows: 5612300, status: "error", updatedAt: "2026-09-20 10:52" },
  { id: "MTR-10013", code: "DM_NET_FLOW", name: "骨干网流量总量", domain: "网络域", source: "dws_net_flow_di", frequency: "小时", owner: "赵启", score: 96.9, rows: 3284500, status: "normal", updatedAt: "2026-09-20 10:00" },
  { id: "MTR-10014", code: "DM_ALARM_TOTAL", name: "告警总数", domain: "运维域", source: "dws_alarm_event_di", frequency: "实时", owner: "孙倩", score: 99.4, rows: 186320, status: "normal", updatedAt: "2026-09-20 10:59" },
  { id: "MTR-10015", code: "DM_ALARM_MTTR", name: "平均修复时长（MTTR）", domain: "运维域", source: "ads_alarm_mttr_df", frequency: "T+1", owner: "孙倩", score: 87.1, rows: 12480, status: "normal", updatedAt: "2026-09-19 05:20" },
  { id: "MTR-10016", code: "DM_SRV_AVAIL", name: "核心服务可用率", domain: "运维域", source: "dws_service_avail_di", frequency: "15分钟", owner: "孙倩", score: 99.8, rows: 92160, status: "normal", updatedAt: "2026-09-20 10:45" },
  { id: "MTR-10017", code: "DM_SRV_CPU", name: "CPU 平均利用率", domain: "资源域", source: "dws_resource_cpu_di", frequency: "5分钟", owner: "周航", score: 90.5, rows: 6540200, status: "normal", updatedAt: "2026-09-20 10:55" },
  { id: "MTR-10018", code: "DM_SRV_STORE", name: "存储使用量", domain: "资源域", source: "dws_resource_store_di", frequency: "小时", owner: "周航", score: 84.2, rows: 421860, status: "warning", updatedAt: "2026-09-20 10:00" },
  { id: "MTR-10019", code: "DM_MKT_CONV", name: "营销活动转化率", domain: "营销域", source: "ads_mkt_convert_df", frequency: "T+1", owner: "吴桐", score: 89.6, rows: 286400, status: "normal", updatedAt: "2026-09-19 09:30" },
  { id: "MTR-10020", code: "DM_MKT_COST", name: "获客成本（CAC）", domain: "营销域", source: "ads_mkt_cac_df", frequency: "T+1", owner: "吴桐", score: 81.7, rows: 35260, status: "offline", updatedAt: "2026-08-31 18:20" },
  { id: "MTR-10021", code: "DM_FIN_REVENUE", name: "营业收入", domain: "财务域", source: "dws_fin_revenue_df", frequency: "T+1", owner: "郑楠", score: 98.8, rows: 74520, status: "normal", updatedAt: "2026-09-19 04:10" },
  { id: "MTR-10022", code: "DM_FIN_COST", name: "成本支出", domain: "财务域", source: "dws_fin_cost_df", frequency: "T+1", owner: "郑楠", score: 92.3, rows: 68430, status: "audit", updatedAt: "2026-09-19 04:26" },
  { id: "MTR-10023", code: "DM_RISK_FRAUD", name: "风险交易拦截数", domain: "风控域", source: "dws_risk_fraud_di", frequency: "实时", owner: "何静", score: 95.1, rows: 24680, status: "normal", updatedAt: "2026-09-20 10:59" },
  { id: "MTR-10024", code: "DM_SEC_ATTACK", name: "安全攻击拦截次数", domain: "安全域", source: "dws_sec_attack_di", frequency: "实时", owner: "何静", score: 97.6, rows: 18340, status: "audit", updatedAt: "2026-09-20 10:58" },
];

const domainOptions = [
  { text: "全部数据域", value: "all" },
  { text: "用户域", value: "用户域" },
  { text: "交易域", value: "交易域" },
  { text: "设备域", value: "设备域" },
  { text: "网络域", value: "网络域" },
  { text: "运维域", value: "运维域" },
  { text: "资源域", value: "资源域" },
  { text: "营销域", value: "营销域" },
  { text: "财务域", value: "财务域" },
  { text: "风控域", value: "风控域" },
  { text: "安全域", value: "安全域" },
];

const frequencyOptions = [
  { text: "全部频率", value: "all" },
  { text: "实时", value: "实时" },
  { text: "5分钟", value: "5分钟" },
  { text: "15分钟", value: "15分钟" },
  { text: "小时", value: "小时" },
  { text: "T+1", value: "T+1" },
];

const statusOptions = [
  { text: "全部状态", value: "all" },
  { text: "正常", value: "normal" },
  { text: "预警", value: "warning" },
  { text: "异常", value: "error" },
  { text: "待审核", value: "audit" },
  { text: "已下线", value: "offline" },
];

export { metricList, domainOptions, frequencyOptions, statusOptions };
