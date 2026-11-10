// Layer 2 mock — ⑥ 告警列表（生产 18 条 / 预发 6 条）
// 与服务卡、拓扑节点保持逻辑一致：
//   异常对象必有活动告警 —— payment-service（P0）、payment-mysql（P0）、payment-redis（P1）、
//   order-service（P1）、order-redis（P1）、api-gateway（P1）。
// 字段：level 级别 / strategyName 策略名 / targetKey+targetName 告警对象 /
//       triggerValue+threshold 触发值与阈值 / durationMin 持续分钟 / status 状态 / claimBy 认领人

export const ALARMS = {
  prod: [
    { id: "ALM-10241", level: "P0", strategyName: "支付服务错误率超阈值", targetKey: "payment-service", targetName: "支付服务 payment-service", triggerValue: "3.85%", threshold: "1.0%", durationMin: 42, status: "firing", claimBy: null },
    { id: "ALM-10238", level: "P0", strategyName: "服务可用性跌破 SLA", targetKey: "payment-service", targetName: "支付服务 payment-service", triggerValue: "99.41%", threshold: "99.90%", durationMin: 41, status: "firing", claimBy: null },
    { id: "ALM-10244", level: "P0", strategyName: "数据库慢查询比例过高", targetKey: "payment-mysql", targetName: "payment-mysql 主库", triggerValue: "26%", threshold: "10%", durationMin: 38, status: "claimed", claimBy: "张伟" },
    { id: "ALM-10231", level: "P1", strategyName: "服务 P99 延迟过高", targetKey: "order-service", targetName: "订单服务 order-service", triggerValue: "1240ms", threshold: "500ms", durationMin: 55, status: "firing", claimBy: null },
    { id: "ALM-10247", level: "P1", strategyName: "网关 5xx 错误比例升高", targetKey: "api-gateway", targetName: "API 网关 api-gateway", triggerValue: "0.9%", threshold: "0.5%", durationMin: 18, status: "firing", claimBy: null },
    { id: "ALM-10246", level: "P1", strategyName: "支付回调超时率升高", targetKey: "payment-service", targetName: "支付服务 payment-service", triggerValue: "4.2%", threshold: "2.0%", durationMin: 40, status: "firing", claimBy: null },
    { id: "ALM-10252", level: "P1", strategyName: "MySQL 主从复制延迟", targetKey: "payment-mysql", targetName: "payment-mysql 主库", triggerValue: "3.2s", threshold: "1.0s", durationMin: 28, status: "firing", claimBy: null },
    { id: "ALM-10255", level: "P1", strategyName: "Redis 连接池使用率过高", targetKey: "payment-redis", targetName: "payment-redis 集群", triggerValue: "98%", threshold: "80%", durationMin: 35, status: "claimed", claimBy: "张伟" },
    { id: "ALM-10258", level: "P1", strategyName: "Redis 内存使用率过高", targetKey: "order-redis", targetName: "order-redis 集群", triggerValue: "92%", threshold: "85%", durationMin: 72, status: "firing", claimBy: null },
    { id: "ALM-10221", level: "P2", strategyName: "服务 CPU 使用率过高", targetKey: "order-service", targetName: "订单服务 order-service", triggerValue: "87%", threshold: "80%", durationMin: 25, status: "silenced", claimBy: null },
    { id: "ALM-10249", level: "P2", strategyName: "登录接口 QPS 突增", targetKey: "user-service", targetName: "用户服务 user-service", triggerValue: "+65%", threshold: "+50%", durationMin: 12, status: "claimed", claimBy: "张伟" },
    { id: "ALM-10218", level: "P2", strategyName: "JVM Full GC 频率升高", targetKey: "product-service", targetName: "商品服务 product-service", triggerValue: "8次/分", threshold: "5次/分", durationMin: 30, status: "silenced", claimBy: null },
    { id: "ALM-10212", level: "P2", strategyName: "消息队列消费积压", targetKey: "push-service", targetName: "消息推送 push-service", triggerValue: "12.4万条", threshold: "5万条", durationMin: 65, status: "resolved", claimBy: null },
    { id: "ALM-10257", level: "P2", strategyName: "风控接口超时率升高", targetKey: "risk-service", targetName: "风控服务 risk-service", triggerValue: "1.2%", threshold: "1.0%", durationMin: 15, status: "resolved", claimBy: null },
    { id: "ALM-10202", level: "P2", strategyName: "TLS 证书即将过期", targetKey: "api-gateway", targetName: "API 网关 api-gateway", triggerValue: "15天", threshold: "30天", durationMin: 4320, status: "claimed", claimBy: "李婧" },
    { id: "ALM-10209", level: "P3", strategyName: "搜索索引构建延迟", targetKey: "search-service", targetName: "搜索服务 search-service", triggerValue: "45s", threshold: "30s", durationMin: 120, status: "resolved", claimBy: null },
    { id: "ALM-10233", level: "P3", strategyName: "实例 OOM 重启", targetKey: "order-service", targetName: "订单服务 order-service (pod-7)", triggerValue: "2次/30分", threshold: "1次/30分", durationMin: 50, status: "resolved", claimBy: null },
    { id: "ALM-10260", level: "P3", strategyName: "定时报表任务延迟", targetKey: "report-batch", targetName: "报表批处理 report-batch", triggerValue: "20分钟", threshold: "10分钟", durationMin: 35, status: "resolved", claimBy: null },
  ],
  staging: [
    { id: "STG-20114", level: "P1", strategyName: "预发支付服务错误率升高", targetKey: "payment-service", targetName: "支付服务 payment-service（预发）", triggerValue: "0.9%", threshold: "0.5%", durationMin: 22, status: "firing", claimBy: null },
    { id: "STG-20118", level: "P2", strategyName: "预发数据库慢查询比例过高", targetKey: "payment-mysql", targetName: "payment-mysql 主库（预发）", triggerValue: "14%", threshold: "10%", durationMin: 25, status: "claimed", claimBy: "张伟" },
    { id: "STG-20109", level: "P2", strategyName: "Redis 内存使用率过高", targetKey: "payment-redis", targetName: "payment-redis 集群（预发）", triggerValue: "88%", threshold: "85%", durationMin: 60, status: "silenced", claimBy: null },
    { id: "STG-20101", level: "P3", strategyName: "联调流量突增", targetKey: "order-service", targetName: "订单服务 order-service（预发）", triggerValue: "+80%", threshold: "+50%", durationMin: 40, status: "resolved", claimBy: null },
    { id: "STG-20096", level: "P3", strategyName: "TLS 证书即将过期", targetKey: "api-gateway", targetName: "API 网关 api-gateway（预发）", triggerValue: "12天", threshold: "30天", durationMin: 2880, status: "claimed", claimBy: "李婧" },
    { id: "STG-20120", level: "P3", strategyName: "定时任务延迟", targetKey: "report-batch", targetName: "报表批处理 report-batch（预发）", triggerValue: "18分钟", threshold: "10分钟", durationMin: 30, status: "resolved", claimBy: null },
  ],
};

const LEVEL_RANK = { P0: 0, P1: 1, P2: 2, P3: 3 };

// 对象的活动告警（触发中 / 已认领）中最严重的一条；无则返回 null
export function worstActiveLevel(alarms, targetKey) {
  let worst = null;
  for (const a of alarms) {
    if (a.targetKey !== targetKey) continue;
    if (a.status !== "firing" && a.status !== "claimed") continue;
    if (!worst || LEVEL_RANK[a.level] < LEVEL_RANK[worst.level]) worst = a;
  }
  return worst;
}

export function fmtDur(min) {
  if (min < 60) return `${min} 分钟`;
  if (min < 1440) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h} 小时 ${m} 分` : `${h} 小时`;
  }
  const d = Math.floor(min / 1440);
  const h = Math.floor((min % 1440) / 60);
  return h ? `${d} 天 ${h} 小时` : `${d} 天`;
}
