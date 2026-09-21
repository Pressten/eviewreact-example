// data.js — Layer 2: mock 数据 + 筛选下拉选项
// Select 选项字段为 text/value（eview-react Select 用 text 显示，非 antd 的 label）

// ---- 指标清单 ----
const metricList = [
  { id: 'MTR-10001', code: 'DM_USER_ACTIVE', name: '日活跃用户数', domain: '用户域', source: 'dws_user_active_di', frequency: 'T+1', owner: '张明', score: 96.4, rows: 1284560, status: 'normal', updatedAt: '2026-09-19 08:12' },
  { id: 'MTR-10002', code: 'DM_USER_NEW', name: '新增注册用户数', domain: '用户域', source: 'dws_user_register_di', frequency: 'T+1', owner: '张明', score: 94.1, rows: 38620, status: 'normal', updatedAt: '2026-09-19 08:14' },
  { id: 'MTR-10003', code: 'DM_USER_RETENTION', name: '用户次日留存率', domain: '用户域', source: 'ads_user_retention_df', frequency: 'T+1', owner: '李婉', score: 88.7, rows: 15240, status: 'warning', updatedAt: '2026-09-19 09:02' },
  { id: 'MTR-10004', code: 'DM_ORDER_GMV', name: '交易总额（GMV）', domain: '交易域', source: 'dws_order_pay_di', frequency: '小时', owner: '王海涛', score: 98.2, rows: 864230, status: 'normal', updatedAt: '2026-09-20 10:00' },
  { id: 'MTR-10005', code: 'DM_ORDER_CNT', name: '有效订单量', domain: '交易域', source: 'dws_order_valid_di', frequency: '小时', owner: '王海涛', score: 97.5, rows: 742180, status: 'normal', updatedAt: '2026-09-20 10:00' },
  { id: 'MTR-10006', code: 'DM_ORDER_REFUND', name: '订单退款率', domain: '交易域', source: 'ads_order_refund_df', frequency: 'T+1', owner: '王海涛', score: 79.3, rows: 42310, status: 'error', updatedAt: '2026-09-19 07:48' },
  { id: 'MTR-10007', code: 'DM_PAY_SUCCESS', name: '支付成功率', domain: '交易域', source: 'dws_pay_result_di', frequency: '15分钟', owner: '陈嘉', score: 99.1, rows: 2310450, status: 'normal', updatedAt: '2026-09-20 10:45' },
  { id: 'MTR-10008', code: 'DM_DEV_ONLINE', name: '在线设备数', domain: '设备域', source: 'dws_device_online_di', frequency: '5分钟', owner: '刘晨', score: 95.8, rows: 4126800, status: 'normal', updatedAt: '2026-09-20 10:50' },
  { id: 'MTR-10009', code: 'DM_DEV_FAULT', name: '设备故障率', domain: '设备域', source: 'dws_device_fault_df', frequency: 'T+1', owner: '刘晨', score: 82.6, rows: 96240, status: 'warning', updatedAt: '2026-09-19 06:30' },
  { id: 'MTR-10010', code: 'DM_DEV_UPGRADE', name: '固件升级成功率', domain: '设备域', source: 'ads_firmware_upgrade_df', frequency: 'T+1', owner: '刘晨', score: 91.2, rows: 153870, status: 'normal', updatedAt: '2026-09-19 06:42' },
  { id: 'MTR-10011', code: 'DM_NET_LATENCY', name: '网络平均时延', domain: '网络域', source: 'dws_net_latency_di', frequency: '5分钟', owner: '赵启', score: 93.4, rows: 7820400, status: 'normal', updatedAt: '2026-09-20 10:52' },
  { id: 'MTR-10012', code: 'DM_NET_LOSS', name: '网络丢包率', domain: '网络域', source: 'dws_net_loss_di', frequency: '5分钟', owner: '赵启', score: 76.8, rows: 5612300, status: 'error', updatedAt: '2026-09-20 10:52' },
  { id: 'MTR-10013', code: 'DM_NET_FLOW', name: '骨干网流量总量', domain: '网络域', source: 'dws_net_flow_di', frequency: '小时', owner: '赵启', score: 96.9, rows: 3284500, status: 'normal', updatedAt: '2026-09-20 10:00' },
  { id: 'MTR-10014', code: 'DM_ALARM_TOTAL', name: '告警总数', domain: '运维域', source: 'dws_alarm_event_di', frequency: '实时', owner: '孙倩', score: 99.4, rows: 186320, status: 'normal', updatedAt: '2026-09-20 10:59' },
  { id: 'MTR-10015', code: 'DM_ALARM_MTTR', name: '平均修复时长（MTTR）', domain: '运维域', source: 'ads_alarm_mttr_df', frequency: 'T+1', owner: '孙倩', score: 87.1, rows: 12480, status: 'normal', updatedAt: '2026-09-19 05:20' },
  { id: 'MTR-10016', code: 'DM_SRV_AVAIL', name: '核心服务可用率', domain: '运维域', source: 'dws_service_avail_di', frequency: '15分钟', owner: '孙倩', score: 99.8, rows: 92160, status: 'normal', updatedAt: '2026-09-20 10:45' },
  { id: 'MTR-10017', code: 'DM_SRV_CPU', name: 'CPU 平均利用率', domain: '资源域', source: 'dws_resource_cpu_di', frequency: '5分钟', owner: '周航', score: 90.5, rows: 6540200, status: 'normal', updatedAt: '2026-09-20 10:55' },
  { id: 'MTR-10018', code: 'DM_SRV_STORE', name: '存储使用量', domain: '资源域', source: 'dws_resource_store_di', frequency: '小时', owner: '周航', score: 84.2, rows: 421860, status: 'warning', updatedAt: '2026-09-20 10:00' },
  { id: 'MTR-10019', code: 'DM_MKT_CONV', name: '营销活动转化率', domain: '营销域', source: 'ads_mkt_convert_df', frequency: 'T+1', owner: '吴桐', score: 89.6, rows: 286400, status: 'normal', updatedAt: '2026-09-19 09:30' },
  { id: 'MTR-10020', code: 'DM_MKT_COST', name: '获客成本（CAC）', domain: '营销域', source: 'ads_mkt_cac_df', frequency: 'T+1', owner: '吴桐', score: 81.7, rows: 35260, status: 'offline', updatedAt: '2026-08-31 18:20' },
  { id: 'MTR-10021', code: 'DM_FIN_REVENUE', name: '营业收入', domain: '财务域', source: 'dws_fin_revenue_df', frequency: 'T+1', owner: '郑楠', score: 98.8, rows: 74520, status: 'normal', updatedAt: '2026-09-19 04:10' },
  { id: 'MTR-10022', code: 'DM_FIN_COST', name: '成本支出', domain: '财务域', source: 'dws_fin_cost_df', frequency: 'T+1', owner: '郑楠', score: 92.3, rows: 68430, status: 'audit', updatedAt: '2026-09-19 04:26' },
  { id: 'MTR-10023', code: 'DM_RISK_FRAUD', name: '风险交易拦截数', domain: '风控域', source: 'dws_risk_fraud_di', frequency: '实时', owner: '何静', score: 95.1, rows: 24680, status: 'normal', updatedAt: '2026-09-20 10:59' },
  { id: 'MTR-10024', code: 'DM_SEC_ATTACK', name: '安全攻击拦截次数', domain: '安全域', source: 'dws_sec_attack_di', frequency: '实时', owner: '何静', score: 97.6, rows: 18340, status: 'audit', updatedAt: '2026-09-20 10:58' },
];

const domainOptions = [
  { text: '全部数据域', value: 'all' },
  { text: '用户域', value: '用户域' },
  { text: '交易域', value: '交易域' },
  { text: '设备域', value: '设备域' },
  { text: '网络域', value: '网络域' },
  { text: '运维域', value: '运维域' },
  { text: '资源域', value: '资源域' },
  { text: '营销域', value: '营销域' },
  { text: '财务域', value: '财务域' },
  { text: '风控域', value: '风控域' },
  { text: '安全域', value: '安全域' },
];

const frequencyOptions = [
  { text: '全部频率', value: 'all' },
  { text: '实时', value: '实时' },
  { text: '5分钟', value: '5分钟' },
  { text: '15分钟', value: '15分钟' },
  { text: '小时', value: '小时' },
  { text: 'T+1', value: 'T+1' },
];

const statusOptions = [
  { text: '全部状态', value: 'all' },
  { text: '正常', value: 'normal' },
  { text: '预警', value: 'warning' },
  { text: '异常', value: 'error' },
  { text: '待审核', value: 'audit' },
  { text: '已下线', value: 'offline' },
];

// ---- 采集明细 ----
const recordList = [
  { id: 'REC-20260920-01', batch: 'BATCH_20260920_0100', task: 'DWS 用户活跃日汇总', node: 'dwd_user_login_di', partition: '2026-09-20 01:00', rows: 1284560, cost: '12m 34s', quality: 98.2, status: 'success', finishedAt: '2026-09-20 01:12' },
  { id: 'REC-20260920-02', batch: 'BATCH_20260920_0200', task: '新增注册用户聚合', node: 'dwd_user_register_di', partition: '2026-09-20 02:00', rows: 38620, cost: '3m 08s', quality: 97.4, status: 'success', finishedAt: '2026-09-20 02:03' },
  { id: 'REC-20260920-03', batch: 'BATCH_20260920_0300', task: '次日留存计算', node: 'dws_user_retention_di', partition: '2026-09-20 03:00', rows: 15240, cost: '8m 41s', quality: 86.5, status: 'warning', finishedAt: '2026-09-20 03:09' },
  { id: 'REC-20260920-04', batch: 'BATCH_20260920_0400', task: '交易支付明细归集', node: 'dwd_order_pay_di', partition: '2026-09-20 04:00', rows: 864230, cost: '15m 02s', quality: 99.0, status: 'success', finishedAt: '2026-09-20 04:15' },
  { id: 'REC-20260920-05', batch: 'BATCH_20260920_0500', task: '有效订单口径清洗', node: 'dws_order_valid_di', partition: '2026-09-20 05:00', rows: 742180, cost: '11m 27s', quality: 98.6, status: 'success', finishedAt: '2026-09-20 05:11' },
  { id: 'REC-20260920-06', batch: 'BATCH_20260920_0600', task: '退款率回溯重算', node: 'ads_order_refund_df', partition: '2026-09-20 06:00', rows: 42310, cost: '6m 55s', quality: 68.9, status: 'failed', finishedAt: '2026-09-20 06:07' },
  { id: 'REC-20260920-07', batch: 'BATCH_20260920_0700', task: '支付结果实时汇总', node: 'dws_pay_result_di', partition: '2026-09-20 07:00', rows: 2310450, cost: '4m 12s', quality: 99.4, status: 'success', finishedAt: '2026-09-20 07:04' },
  { id: 'REC-20260920-08', batch: 'BATCH_20260920_0800', task: '在线设备心跳归集', node: 'dws_device_online_di', partition: '2026-09-20 08:00', rows: 4126800, cost: '9m 38s', quality: 96.1, status: 'success', finishedAt: '2026-09-20 08:10' },
  { id: 'REC-20260920-09', batch: 'BATCH_20260920_0900', task: '设备故障归因分析', node: 'dws_device_fault_df', partition: '2026-09-20 09:00', rows: 96240, cost: '13m 20s', quality: 81.3, status: 'warning', finishedAt: '2026-09-20 09:13' },
  { id: 'REC-20260920-10', batch: 'BATCH_20260920_1000', task: '固件升级结果统计', node: 'ads_firmware_upgrade_df', partition: '2026-09-20 10:00', rows: 153870, cost: '5m 46s', quality: 92.7, status: 'success', finishedAt: '2026-09-20 10:06' },
  { id: 'REC-20260920-11', batch: 'BATCH_20260920_1100', task: '网络时延分钟级聚合', node: 'dwd_net_latency_di', partition: '2026-09-20 11:00', rows: 7820400, cost: '18m 09s', quality: 94.8, status: 'success', finishedAt: '2026-09-20 11:18' },
  { id: 'REC-20260920-12', batch: 'BATCH_20260920_1200', task: '丢包率异常检测', node: 'dws_net_loss_di', partition: '2026-09-20 12:00', rows: 5612300, cost: '16m 32s', quality: 71.2, status: 'failed', finishedAt: '2026-09-20 12:17' },
  { id: 'REC-20260920-13', batch: 'BATCH_20260920_1300', task: '骨干网流量结算', node: 'dws_net_flow_di', partition: '2026-09-20 13:00', rows: 3284500, cost: '14m 51s', quality: 97.9, status: 'success', finishedAt: '2026-09-20 13:15' },
  { id: 'REC-20260920-14', batch: 'BATCH_20260920_1400', task: '告警事件流式入库', node: 'dwd_alarm_event_di', partition: '2026-09-20 14:00', rows: 186320, cost: '1m 24s', quality: 99.6, status: 'success', finishedAt: '2026-09-20 14:01' },
  { id: 'REC-20260920-15', batch: 'BATCH_20260920_1500', task: '工单修复时长统计', node: 'ads_alarm_mttr_df', partition: '2026-09-20 15:00', rows: 12480, cost: '2m 37s', quality: 88.4, status: 'success', finishedAt: '2026-09-20 15:03' },
  { id: 'REC-20260920-16', batch: 'BATCH_20260920_1600', task: '服务可用率巡检', node: 'dws_service_avail_di', partition: '2026-09-20 16:00', rows: 92160, cost: '4m 05s', quality: 99.9, status: 'success', finishedAt: '2026-09-20 16:04' },
  { id: 'REC-20260920-17', batch: 'BATCH_20260920_1700', task: 'CPU 利用率采样归集', node: 'dws_resource_cpu_di', partition: '2026-09-20 17:00', rows: 6540200, cost: '10m 18s', quality: 91.6, status: 'success', finishedAt: '2026-09-20 17:10' },
  { id: 'REC-20260920-18', batch: 'BATCH_20260920_1800', task: '存储水位巡检', node: 'dws_resource_store_di', partition: '2026-09-20 18:00', rows: 421860, cost: '7m 22s', quality: 83.5, status: 'warning', finishedAt: '2026-09-20 18:07' },
  { id: 'REC-20260920-19', batch: 'BATCH_20260920_1900', task: '营销转化漏斗计算', node: 'ads_mkt_convert_df', partition: '2026-09-20 19:00', rows: 286400, cost: '9m 47s', quality: 90.2, status: 'success', finishedAt: '2026-09-20 19:10' },
  { id: 'REC-20260920-20', batch: 'BATCH_20260920_2000', task: '获客成本口径核对', node: 'ads_mkt_cac_df', partition: '2026-09-20 20:00', rows: 35260, cost: '3m 51s', quality: 0, status: 'skipped', finishedAt: '2026-09-20 20:04' },
  { id: 'REC-20260920-21', batch: 'BATCH_20260920_2100', task: '风控拦截实时统计', node: 'dws_risk_fraud_di', partition: '2026-09-20 21:00', rows: 24680, cost: '1m 09s', quality: 95.7, status: 'success', finishedAt: '2026-09-20 21:01' },
  { id: 'REC-20260920-22', batch: 'BATCH_20260920_2200', task: '安全攻击事件归集', node: 'dws_sec_attack_di', partition: '2026-09-20 22:00', rows: 18340, cost: '1m 43s', quality: 97.8, status: 'success', finishedAt: '2026-09-20 22:02' },
];

const recordStatusOptions = [
  { text: '全部状态', value: 'all' },
  { text: '成功', value: 'success' },
  { text: '预警', value: 'warning' },
  { text: '失败', value: 'failed' },
  { text: '已跳过', value: 'skipped' },
];

// ---- 血缘溯源 ----
const lineageList = [
  { id: 'LN-001', nodeCode: 'ODS.USER.001', level: '上游', nodeType: 'ODS', nodeName: '用户登录日志原始表', tableName: 'ods.ods_user_login_log', owner: '数据平台组', rows: 98203400, latency: '实时', status: 'normal', updatedAt: '2026-09-20 10:59' },
  { id: 'LN-002', nodeCode: 'ODS.USER.002', level: '上游', nodeType: 'ODS', nodeName: '用户注册流水表', tableName: 'ods.ods_user_register_log', owner: '数据平台组', rows: 4218600, latency: '实时', status: 'normal', updatedAt: '2026-09-20 10:59' },
  { id: 'LN-003', nodeCode: 'ODS.DEV.011', level: '上游', nodeType: 'ODS', nodeName: '设备心跳上报表', tableName: 'ods.ods_device_heartbeat', owner: '设备接入组', rows: 428061000, latency: '实时', status: 'normal', updatedAt: '2026-09-20 10:58' },
  { id: 'LN-004', nodeCode: 'DWD.USER.101', level: '上游', nodeType: 'DWD', nodeName: '登录会话明细', tableName: 'dwd.dwd_user_login_di', owner: '用户数据组', rows: 126402300, latency: 'T+1', status: 'normal', updatedAt: '2026-09-20 01:12' },
  { id: 'LN-005', nodeCode: 'DWD.USER.102', level: '上游', nodeType: 'DWD', nodeName: '注册用户明细', tableName: 'dwd.dwd_user_register_di', owner: '用户数据组', rows: 6421800, latency: 'T+1', status: 'normal', updatedAt: '2026-09-20 02:03' },
  { id: 'LN-006', nodeCode: 'DWD.DEV.121', level: '上游', nodeType: 'DWD', nodeName: '设备状态快照', tableName: 'dwd.dwd_device_status_di', owner: '设备数据组', rows: 96012400, latency: '5分钟', status: 'warning', updatedAt: '2026-09-20 09:13' },
  { id: 'LN-007', nodeCode: 'DWS.USER.201', level: '当前', nodeType: 'DWS', nodeName: '用户活跃轻度汇总', tableName: 'dws.dws_user_active_di', owner: '用户数据组', rows: 1284560, latency: 'T+1', status: 'normal', updatedAt: '2026-09-20 08:12' },
  { id: 'LN-008', nodeCode: 'DWS.USER.202', level: '当前', nodeType: 'DWS', nodeName: '用户留存宽表', tableName: 'dws.dws_user_retention_di', owner: '用户数据组', rows: 15240, latency: 'T+1', status: 'warning', updatedAt: '2026-09-20 09:02' },
  { id: 'LN-009', nodeCode: 'DWS.DEV.221', level: '当前', nodeType: 'DWS', nodeName: '设备在线汇总', tableName: 'dws.dws_device_online_di', owner: '设备数据组', rows: 4126800, latency: '5分钟', status: 'normal', updatedAt: '2026-09-20 10:50' },
  { id: 'LN-010', nodeCode: 'ADS.USER.301', level: '下游', nodeType: 'ADS', nodeName: '用户指标看板', tableName: 'ads.ads_user_metric_df', owner: '指标平台组', rows: 86420, latency: 'T+1', status: 'normal', updatedAt: '2026-09-20 09:30' },
  { id: 'LN-011', nodeCode: 'ADS.MKT.302', level: '下游', nodeType: 'ADS', nodeName: '营销转化分析表', tableName: 'ads.ads_mkt_convert_df', owner: '营销数据组', rows: 286400, latency: 'T+1', status: 'normal', updatedAt: '2026-09-20 19:10' },
  { id: 'LN-012', nodeCode: 'ADS.FIN.303', level: '下游', nodeType: 'ADS', nodeName: '财务收入口径表', tableName: 'ads.ads_fin_revenue_df', owner: '财务数据组', rows: 74520, latency: 'T+1', status: 'normal', updatedAt: '2026-09-19 04:10' },
  { id: 'LN-013', nodeCode: 'API.USER.401', level: '下游', nodeType: 'API', nodeName: '指标查询开放接口', tableName: 'api.metric.query.v2', owner: '指标平台组', rows: 0, latency: '实时', status: 'normal', updatedAt: '2026-09-20 10:59' },
  { id: 'LN-014', nodeCode: 'API.RISK.402', level: '下游', nodeType: 'API', nodeName: '风控指标订阅接口', tableName: 'api.risk.metric.subscribe', owner: '风控数据组', rows: 0, latency: '实时', status: 'normal', updatedAt: '2026-09-20 10:59' },
  { id: 'LN-015', nodeCode: 'ADS.OPS.304', level: '下游', nodeType: 'ADS', nodeName: '运维告警分析表', tableName: 'ads.ads_ops_alarm_df', owner: '运维数据组', rows: 186320, latency: '实时', status: 'audit', updatedAt: '2026-09-20 14:01' },
  { id: 'LN-016', nodeCode: 'ADS.RES.305', level: '下游', nodeType: 'ADS', nodeName: '资源水位报表', tableName: 'ads.ads_resource_level_df', owner: '资源数据组', rows: 421860, latency: '小时', status: 'offline', updatedAt: '2026-08-31 18:20' },
];

const levelOptions = [
  { text: '全部层级', value: 'all' },
  { text: '上游', value: '上游' },
  { text: '当前', value: '当前' },
  { text: '下游', value: '下游' },
];

const nodeTypeOptions = [
  { text: '全部类型', value: 'all' },
  { text: 'ODS', value: 'ODS' },
  { text: 'DWD', value: 'DWD' },
  { text: 'DWS', value: 'DWS' },
  { text: 'ADS', value: 'ADS' },
  { text: 'API', value: 'API' },
];

export {
  metricList,
  domainOptions,
  frequencyOptions,
  statusOptions,
  recordList,
  recordStatusOptions,
  lineageList,
  levelOptions,
  nodeTypeOptions,
};
