const lineageList = [
  { id: "LN-001", nodeCode: "ODS.USER.001", level: "上游", nodeType: "ODS", nodeName: "用户登录日志原始表", tableName: "ods.ods_user_login_log", owner: "数据平台组", rows: 98203400, latency: "实时", status: "normal", updatedAt: "2026-09-20 10:59" },
  { id: "LN-002", nodeCode: "ODS.USER.002", level: "上游", nodeType: "ODS", nodeName: "用户注册流水表", tableName: "ods.ods_user_register_log", owner: "数据平台组", rows: 4218600, latency: "实时", status: "normal", updatedAt: "2026-09-20 10:59" },
  { id: "LN-003", nodeCode: "ODS.DEV.011", level: "上游", nodeType: "ODS", nodeName: "设备心跳上报表", tableName: "ods.ods_device_heartbeat", owner: "设备接入组", rows: 428061000, latency: "实时", status: "normal", updatedAt: "2026-09-20 10:58" },
  { id: "LN-004", nodeCode: "DWD.USER.101", level: "上游", nodeType: "DWD", nodeName: "登录会话明细", tableName: "dwd.dwd_user_login_di", owner: "用户数据组", rows: 126402300, latency: "T+1", status: "normal", updatedAt: "2026-09-20 01:12" },
  { id: "LN-005", nodeCode: "DWD.USER.102", level: "上游", nodeType: "DWD", nodeName: "注册用户明细", tableName: "dwd.dwd_user_register_di", owner: "用户数据组", rows: 6421800, latency: "T+1", status: "normal", updatedAt: "2026-09-20 02:03" },
  { id: "LN-006", nodeCode: "DWD.DEV.121", level: "上游", nodeType: "DWD", nodeName: "设备状态快照", tableName: "dwd.dwd_device_status_di", owner: "设备数据组", rows: 96012400, latency: "5分钟", status: "warning", updatedAt: "2026-09-20 09:13" },
  { id: "LN-007", nodeCode: "DWS.USER.201", level: "当前", nodeType: "DWS", nodeName: "用户活跃轻度汇总", tableName: "dws.dws_user_active_di", owner: "用户数据组", rows: 1284560, latency: "T+1", status: "normal", updatedAt: "2026-09-20 08:12" },
  { id: "LN-008", nodeCode: "DWS.USER.202", level: "当前", nodeType: "DWS", nodeName: "用户留存宽表", tableName: "dws.dws_user_retention_di", owner: "用户数据组", rows: 15240, latency: "T+1", status: "warning", updatedAt: "2026-09-20 09:02" },
  { id: "LN-009", nodeCode: "DWS.DEV.221", level: "当前", nodeType: "DWS", nodeName: "设备在线汇总", tableName: "dws.dws_device_online_di", owner: "设备数据组", rows: 4126800, latency: "5分钟", status: "normal", updatedAt: "2026-09-20 10:50" },
  { id: "LN-010", nodeCode: "ADS.USER.301", level: "下游", nodeType: "ADS", nodeName: "用户指标看板", tableName: "ads.ads_user_metric_df", owner: "指标平台组", rows: 86420, latency: "T+1", status: "normal", updatedAt: "2026-09-20 09:30" },
  { id: "LN-011", nodeCode: "ADS.MKT.302", level: "下游", nodeType: "ADS", nodeName: "营销转化分析表", tableName: "ads.ads_mkt_convert_df", owner: "营销数据组", rows: 286400, latency: "T+1", status: "normal", updatedAt: "2026-09-20 19:10" },
  { id: "LN-012", nodeCode: "ADS.FIN.303", level: "下游", nodeType: "ADS", nodeName: "财务收入口径表", tableName: "ads.ads_fin_revenue_df", owner: "财务数据组", rows: 74520, latency: "T+1", status: "normal", updatedAt: "2026-09-19 04:10" },
  { id: "LN-013", nodeCode: "API.USER.401", level: "下游", nodeType: "API", nodeName: "指标查询开放接口", tableName: "api.metric.query.v2", owner: "指标平台组", rows: 0, latency: "实时", status: "normal", updatedAt: "2026-09-20 10:59" },
  { id: "LN-014", nodeCode: "API.RISK.402", level: "下游", nodeType: "API", nodeName: "风控指标订阅接口", tableName: "api.risk.metric.subscribe", owner: "风控数据组", rows: 0, latency: "实时", status: "normal", updatedAt: "2026-09-20 10:59" },
  { id: "LN-015", nodeCode: "ADS.OPS.304", level: "下游", nodeType: "ADS", nodeName: "运维告警分析表", tableName: "ads.ads_ops_alarm_df", owner: "运维数据组", rows: 186320, latency: "实时", status: "audit", updatedAt: "2026-09-20 14:01" },
  { id: "LN-016", nodeCode: "ADS.RES.305", level: "下游", nodeType: "ADS", nodeName: "资源水位报表", tableName: "ads.ads_resource_level_df", owner: "资源数据组", rows: 421860, latency: "小时", status: "offline", updatedAt: "2026-08-31 18:20" },
];

const levelOptions = [
  { text: "全部层级", value: "all" },
  { text: "上游", value: "上游" },
  { text: "当前", value: "当前" },
  { text: "下游", value: "下游" },
];

const nodeTypeOptions = [
  { text: "全部类型", value: "all" },
  { text: "ODS", value: "ODS" },
  { text: "DWD", value: "DWD" },
  { text: "DWS", value: "DWS" },
  { text: "ADS", value: "ADS" },
  { text: "API", value: "API" },
];

export { lineageList, levelOptions, nodeTypeOptions };
