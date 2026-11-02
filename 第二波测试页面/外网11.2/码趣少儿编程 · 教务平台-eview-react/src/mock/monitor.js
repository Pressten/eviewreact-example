// Layer 2: 监控中心 mock 数据
// 字段语义化；服务卡可用率与告警列表逻辑一致（异常服务必有对应告警）；
// QPS 层级：网关 > 核心服务 > 数据库。
// 导出采用内联 export 声明（构建器仅识别 export const/function，不识别 export {} 块）。

export const TIME_RANGES = [
  { key: "15m", label: "近 15 分钟" },
  { key: "1h", label: "近 1 小时" },
  { key: "6h", label: "近 6 小时" },
  { key: "24h", label: "近 24 小时" },
  { key: "7d", label: "近 7 天" },
];

export const REFRESH_RATES = [
  { key: "10s", label: "10 秒" },
  { key: "30s", label: "30 秒" },
  { key: "1m", label: "1 分钟" },
];

export const DUTY = {
  name: "陈思远",
  title: "SRE 值班工程师",
  avatar: "/uploads/user.png",
  shiftStart: "08:00",
  handoverTime: "18:00",
  nextPerson: "李明",
  phone: "138-****-6201",
};

// 8 个核心服务可用性卡
// status: normal / warning / critical
const SERVICES_PROD = [
  { id: "api-gateway", name: "API 网关", availability: 99.99, qps: 48200, errRate: 0.02, p99: 86, instances: 12, status: "normal", trend: [40, 42, 41, 44, 46, 45, 47, 48, 47, 49, 48, 48] },
  { id: "order-service", name: "订单服务", availability: 99.92, qps: 8600, errRate: 0.85, p99: 420, instances: 8, status: "warning", trend: [44, 45, 43, 41, 39, 37, 36, 34, 33, 32, 31, 30] },
  { id: "product-service", name: "商品服务", availability: 99.98, qps: 12400, errRate: 0.05, p99: 110, instances: 10, status: "normal", trend: [46, 47, 46, 48, 47, 48, 49, 48, 49, 48, 49, 49] },
  { id: "user-service", name: "用户服务", availability: 99.97, qps: 6800, errRate: 0.08, p99: 96, instances: 6, status: "normal", trend: [45, 44, 46, 45, 47, 46, 45, 47, 46, 47, 46, 47] },
  { id: "payment-service", name: "支付服务", availability: 99.85, qps: 5400, errRate: 1.92, p99: 880, instances: 9, status: "critical", trend: [49, 48, 47, 44, 40, 36, 30, 26, 22, 19, 17, 15] },
  { id: "search-service", name: "搜索服务", availability: 99.96, qps: 15600, errRate: 0.12, p99: 140, instances: 14, status: "normal", trend: [47, 48, 47, 48, 49, 48, 47, 48, 49, 48, 47, 48] },
  { id: "inventory-service", name: "库存服务", availability: 99.95, qps: 4200, errRate: 0.15, p99: 130, instances: 5, status: "normal", trend: [46, 45, 47, 46, 45, 47, 46, 45, 47, 46, 45, 46] },
  { id: "message-queue", name: "消息队列", availability: 99.91, qps: 38600, errRate: 0.0, p99: 64, instances: 7, status: "warning", trend: [48, 47, 46, 44, 42, 40, 38, 36, 35, 34, 33, 32] },
];

const SERVICES_STAGING = [
  { id: "api-gateway", name: "API 网关", availability: 99.99, qps: 3200, errRate: 0.01, p99: 52, instances: 4, status: "normal", trend: [30, 31, 30, 32, 31, 32, 33, 32, 31, 32, 31, 32] },
  { id: "order-service", name: "订单服务", availability: 99.98, qps: 640, errRate: 0.03, p99: 88, instances: 3, status: "normal", trend: [33, 34, 33, 34, 33, 34, 33, 34, 33, 34, 33, 34] },
  { id: "product-service", name: "商品服务", availability: 99.97, qps: 920, errRate: 0.04, p99: 76, instances: 3, status: "normal", trend: [34, 33, 34, 33, 34, 33, 34, 33, 34, 33, 34, 33] },
  { id: "user-service", name: "用户服务", availability: 99.96, qps: 510, errRate: 0.05, p99: 70, instances: 2, status: "normal", trend: [33, 34, 33, 34, 33, 34, 33, 34, 33, 34, 33, 34] },
  { id: "payment-service", name: "支付服务", availability: 99.94, qps: 430, errRate: 0.08, p99: 120, instances: 3, status: "normal", trend: [34, 33, 34, 33, 34, 33, 34, 33, 34, 33, 34, 33] },
  { id: "search-service", name: "搜索服务", availability: 99.95, qps: 1180, errRate: 0.06, p99: 96, instances: 4, status: "normal", trend: [33, 34, 33, 34, 33, 34, 33, 34, 33, 34, 33, 34] },
  { id: "inventory-service", name: "库存服务", availability: 99.93, qps: 320, errRate: 0.07, p99: 84, instances: 2, status: "normal", trend: [34, 33, 34, 33, 34, 33, 34, 33, 34, 33, 34, 33] },
  { id: "message-queue", name: "消息队列", availability: 99.90, qps: 2400, errRate: 0.0, p99: 48, instances: 3, status: "warning", trend: [36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25] },
];

export function getServices(env) {
  return env === "staging" ? SERVICES_STAGING : SERVICES_PROD;
}

// 黄金指标行（环比）
const GOLDEN_PROD = {
  qps: { value: 101800, unit: "req/s", delta: 5.2, deltaType: "up" },
  avgResponse: { value: 142, unit: "ms", delta: 8, deltaType: "up-bad" },
  errorRate: { value: 0.31, unit: "%", delta: 0.05, deltaType: "up-bad" },
  p99: { value: 880, unit: "ms", delta: 120, deltaType: "up-bad" },
};
const GOLDEN_STAGING = {
  qps: { value: 9600, unit: "req/s", delta: -3.1, deltaType: "down" },
  avgResponse: { value: 76, unit: "ms", delta: -4, deltaType: "down-good" },
  errorRate: { value: 0.05, unit: "%", delta: -0.02, deltaType: "down-good" },
  p99: { value: 264, unit: "ms", delta: -18, deltaType: "down-good" },
};
export function getGoldenMetrics(env) {
  return env === "staging" ? GOLDEN_STAGING : GOLDEN_PROD;
}

// 服务拓扑：1 网关 + 4 核心服务 + 8 数据节点 = 13 节点
// type: gateway / service / db(mysql) / cache(redis)
const TOPOLOGY_NODES = [
  { id: "api-gateway", name: "API 网关", type: "gateway", qps: 48200, errRate: 0.02, status: "normal", x: 620, y: 70, serviceId: "api-gateway" },
  { id: "order-service", name: "订单服务", type: "service", qps: 8600, errRate: 0.85, status: "warning", x: 200, y: 270, serviceId: "order-service" },
  { id: "product-service", name: "商品服务", type: "service", qps: 12400, errRate: 0.05, status: "normal", x: 480, y: 270, serviceId: "product-service" },
  { id: "user-service", name: "用户服务", type: "service", qps: 6800, errRate: 0.08, status: "normal", x: 760, y: 270, serviceId: "user-service" },
  { id: "payment-service", name: "支付服务", type: "service", qps: 5400, errRate: 1.92, status: "critical", x: 1040, y: 270, serviceId: "payment-service" },
  { id: "mysql-order", name: "MySQL·订单", type: "db", qps: 2100, errRate: 0.0, status: "normal", x: 130, y: 470, parent: "order-service" },
  { id: "redis-order", name: "Redis·订单", type: "cache", qps: 4800, errRate: 0.0, status: "normal", x: 270, y: 470, parent: "order-service" },
  { id: "mysql-product", name: "MySQL·商品", type: "db", qps: 2800, errRate: 0.0, status: "normal", x: 410, y: 470, parent: "product-service" },
  { id: "redis-product", name: "Redis·商品", type: "cache", qps: 4200, errRate: 0.0, status: "normal", x: 550, y: 470, parent: "product-service" },
  { id: "mysql-user", name: "MySQL·用户", type: "db", qps: 1600, errRate: 0.0, status: "normal", x: 690, y: 470, parent: "user-service" },
  { id: "redis-user", name: "Redis·用户", type: "cache", qps: 3400, errRate: 0.0, status: "normal", x: 830, y: 470, parent: "user-service" },
  { id: "mysql-payment", name: "MySQL·支付", type: "db", qps: 1300, errRate: 0.0, status: "critical", x: 970, y: 470, parent: "payment-service" },
  { id: "redis-payment", name: "Redis·支付", type: "cache", qps: 2700, errRate: 0.0, status: "normal", x: 1110, y: 470, parent: "payment-service" },
];

// 调用链路：网关 → 4 核心服务 → 各自 MySQL + Redis（共 12 条边）
// status: normal / abnormal；异常边标注 latencyMs
const TOPOLOGY_EDGES = [
  { id: "e1", from: "api-gateway", to: "order-service", status: "normal" },
  { id: "e2", from: "api-gateway", to: "product-service", status: "normal" },
  { id: "e3", from: "api-gateway", to: "user-service", status: "normal" },
  { id: "e4", from: "api-gateway", to: "payment-service", status: "abnormal", latencyMs: 850 },
  { id: "e5", from: "order-service", to: "mysql-order", status: "normal" },
  { id: "e6", from: "order-service", to: "redis-order", status: "normal" },
  { id: "e7", from: "product-service", to: "mysql-product", status: "normal" },
  { id: "e8", from: "product-service", to: "redis-product", status: "normal" },
  { id: "e9", from: "user-service", to: "mysql-user", status: "normal" },
  { id: "e10", from: "user-service", to: "redis-user", status: "normal" },
  { id: "e11", from: "payment-service", to: "mysql-payment", status: "abnormal", latencyMs: 1200 },
  { id: "e12", from: "payment-service", to: "redis-payment", status: "normal" },
];

export const TOPOLOGY = { nodes: TOPOLOGY_NODES, edges: TOPOLOGY_EDGES };

// 实时图表：近 1 小时，60 个点
function buildRealtime(serviceId, env) {
  const factor = env === "staging" ? 0.12 : 1;
  const base = {
    "api-gateway": { qps: 48000, err: 0.02 },
    "order-service": { qps: 8600, err: 0.7 },
    "product-service": { qps: 12400, err: 0.05 },
    "user-service": { qps: 6800, err: 0.08 },
    "payment-service": { qps: 5400, err: 0.3 },
    "search-service": { qps: 15600, err: 0.12 },
    "inventory-service": { qps: 4200, err: 0.15 },
    "message-queue": { qps: 38600, err: 0.0 },
  };
  const profile = base[serviceId] || base["api-gateway"];
  const now = new Date();
  const data = [];
  for (let i = 59; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 1000);
    const hh = String(t.getHours()).padStart(2, "0");
    const mm = String(t.getMinutes()).padStart(2, "0");
    const wave = Math.sin((59 - i) / 9) * 0.06 + Math.sin((59 - i) / 3.3) * 0.02;
    let qps = Math.round(profile.qps * factor * (1 + wave));
    let err = +(profile.err * (1 + Math.abs(wave) * 2)).toFixed(3);
    // 支付服务：35-44 分钟错误率异常飙升
    if (serviceId === "payment-service" && (59 - i) >= 35 && (59 - i) <= 44) {
      const peak = 59 - i;
      const spike = peak <= 39 ? (peak - 34) * 1.1 : (44 - peak) * 1.1 + 0.5;
      err = +(profile.err + spike).toFixed(2);
      qps = Math.round(qps * 0.82);
    }
    // 订单服务：错误率轻微偏高
    if (serviceId === "order-service") {
      err = +(err + 0.15 * (1 + Math.abs(wave))).toFixed(3);
    }
    data.push({ time: `${hh}:${mm}`, qps, errorRate: err });
  }
  return data;
}

export function getRealtime(serviceId, env) {
  return buildRealtime(serviceId, env);
}

// 告警列表：≥14 条
// level: critical / warning / info
// status: pending(待处理) / processing(处理中) / acknowledged(已认领) / silenced(已静默)
const ALERTS_PROD = [
  { id: "A-20261028-001", level: "critical", strategy: "支付服务可用率下降", object: "支付服务", objectId: "payment-service", triggerValue: "99.85%", threshold: "99.95%", duration: "23 分钟", status: "processing", owner: "陈思远" },
  { id: "A-20261028-002", level: "critical", strategy: "支付服务 P99 延迟超阈值", object: "支付服务", objectId: "payment-service", triggerValue: "880ms", threshold: "500ms", duration: "21 分钟", status: "acknowledged", owner: "陈思远" },
  { id: "A-20261028-003", level: "critical", strategy: "MySQL·支付 慢查询率", object: "MySQL·支付", objectId: "payment-service", triggerValue: "12.4%", threshold: "5%", duration: "19 分钟", status: "acknowledged", owner: "王磊" },
  { id: "A-20261028-004", level: "warning", strategy: "订单服务错误率", object: "订单服务", objectId: "order-service", triggerValue: "0.85%", threshold: "0.5%", duration: "34 分钟", status: "pending", owner: "—" },
  { id: "A-20261028-005", level: "warning", strategy: "消息队列消费堆积", object: "消息队列", objectId: "message-queue", triggerValue: "18.2 万条", threshold: "5 万条", duration: "47 分钟", status: "processing", owner: "刘芳" },
  { id: "A-20261028-006", level: "warning", strategy: "API 网关 5xx 比率", object: "API 网关", objectId: "api-gateway", triggerValue: "0.21%", threshold: "0.1%", duration: "12 分钟", status: "pending", owner: "—" },
  { id: "A-20261028-007", level: "info", strategy: "库存服务 CPU 使用率", object: "库存服务", objectId: "inventory-service", triggerValue: "78%", threshold: "80%", duration: "8 分钟", status: "acknowledged", owner: "刘芳" },
  { id: "A-20261028-008", level: "warning", strategy: "Redis·支付 内存使用率", object: "Redis·支付", objectId: "payment-service", triggerValue: "89%", threshold: "85%", duration: "26 分钟", status: "pending", owner: "—" },
  { id: "A-20261028-009", level: "critical", strategy: "支付回调超时率", object: "支付服务", objectId: "payment-service", triggerValue: "6.8%", threshold: "2%", duration: "15 分钟", status: "processing", owner: "陈思远" },
  { id: "A-20261028-010", level: "info", strategy: "搜索服务慢查询", object: "搜索服务", objectId: "search-service", triggerValue: "1.2%", threshold: "2%", duration: "5 分钟", status: "acknowledged", owner: "周婷" },
  { id: "A-20261028-011", level: "warning", strategy: "用户服务依赖的 Redis 连接池耗尽", object: "用户服务", objectId: "user-service", triggerValue: "98%", threshold: "90%", duration: "10 分钟", status: "pending", owner: "—" },
  { id: "A-20261028-012", level: "info", strategy: "商品服务 GC 耗时", object: "商品服务", objectId: "product-service", triggerValue: "420ms", threshold: "500ms", duration: "3 分钟", status: "silenced", owner: "周婷" },
  { id: "A-20261028-013", level: "warning", strategy: "订单服务依赖的 MySQL 主从延迟", object: "MySQL·订单", objectId: "order-service", triggerValue: "6.2s", threshold: "3s", duration: "29 分钟", status: "pending", owner: "—" },
  { id: "A-20261028-014", level: "critical", strategy: "支付服务实例 OOM 重启", object: "支付服务", objectId: "payment-service", triggerValue: "2 实例", threshold: "1 实例", duration: "7 分钟", status: "pending", owner: "—" },
  { id: "A-20261028-015", level: "info", strategy: "消息队列 磁盘使用率", object: "消息队列", objectId: "message-queue", triggerValue: "72%", threshold: "80%", duration: "2 分钟", status: "acknowledged", owner: "刘芳" },
  { id: "A-20261028-016", level: "warning", strategy: "API 网关下游熔断触发", object: "API 网关", objectId: "api-gateway", triggerValue: "支付服务", threshold: "—", duration: "18 分钟", status: "processing", owner: "陈思远" },
];

const ALERTS_STAGING = [
  { id: "A-20261028-S01", level: "warning", strategy: "消息队列消费堆积", object: "消息队列", objectId: "message-queue", triggerValue: "3.2 万条", threshold: "2 万条", duration: "14 分钟", status: "pending", owner: "—" },
  { id: "A-20261028-S02", level: "info", strategy: "支付服务 P99 延迟", object: "支付服务", objectId: "payment-service", triggerValue: "118ms", threshold: "200ms", duration: "4 分钟", status: "acknowledged", owner: "周婷" },
  { id: "A-20261028-S03", level: "info", strategy: "搜索服务慢查询", object: "搜索服务", objectId: "search-service", triggerValue: "0.6%", threshold: "2%", duration: "2 分钟", status: "acknowledged", owner: "周婷" },
  { id: "A-20261028-S04", level: "warning", strategy: "订单服务 GC 耗时", object: "订单服务", objectId: "order-service", triggerValue: "380ms", threshold: "300ms", duration: "6 分钟", status: "pending", owner: "—" },
  { id: "A-20261028-S05", level: "info", strategy: "库存服务 CPU 使用率", object: "库存服务", objectId: "inventory-service", triggerValue: "62%", threshold: "80%", duration: "1 分钟", status: "silenced", owner: "刘芳" },
];

export function getAlerts(env) {
  return env === "staging" ? ALERTS_STAGING : ALERTS_PROD;
}

// 值班交接 Timeline：今日 6 条
export const HANDOVER = [
  { time: "08:00", person: "陈思远", event: "接班，与夜班完成线上无遗留高危告警交接", result: "normal", detail: "夜班值班人：赵恒；遗留待观察告警 2 条（消息队列堆积、订单服务错误率），已转入观察队列。" },
  { time: "09:42", person: "陈思远", event: "处理搜索服务慢查询告警，扩容 ES 节点", result: "normal", detail: "慢查询率由 1.8% 降至 0.4%，恢复正常水位。扩容节点：es-node-07/08。" },
  { time: "11:15", person: "陈思远", event: "商品服务发布 v3.4.2 上线，灰度 20%", result: "processing", detail: "灰度进行中，错误率 0.05% 在阈值内，观察 30 分钟后全量。" },
  { time: "13:08", person: "刘芳", event: "支付服务可用率告警升级为 P0，拉群应急", result: "abnormal", detail: "支付服务可用率跌至 99.85%，MySQL·支付慢查询率 12.4%，已通知 DBA 团队介入。" },
  { time: "14:30", person: "刘芳", event: "消息队列堆积告警处置，调整消费者并发", result: "processing", detail: "堆积由 26 万条降至 18.2 万条，仍在阈值之上，持续观察。" },
  { time: "17:50", person: "陈思远", event: "待与李明交接，需重点说明支付服务应急进展", result: "pending", detail: "支付服务应急未关闭：MySQL·支付慢查询未恢复，DBA 仍在排查；消息队列堆积持续。请夜班持续跟进。" },
];

// 变更动态：今日 4 条发布
export const CHANGES = [
  { id: "C1", service: "商品服务", version: "v3.4.2", owner: "周婷", result: "success", time: "11:15", note: "商品详情页缓存优化，灰度 20% 发布中" },
  { id: "C2", service: "用户服务", version: "v2.9.0", owner: "王磊", result: "failed", time: "14:02", note: "登录态续期逻辑缺陷导致 5xx 上升", rollbackReason: "v2.9.0 在 14:02 上线后 5 分钟内用户服务错误率升至 1.4%，触发自动熔断。已于 14:11 回滚至 v2.8.9，错误率回落至 0.05%。根因：JWT 续期时区处理缺陷，待修复后重新评审。" },
  { id: "C3", service: "搜索服务", version: "v5.1.3", owner: "李明", result: "rollback", time: "15:20", note: "ES 索引重建任务配置错误", rollbackReason: "v5.1.3 触发了全量索引重建，集群负载飙升至 95%。15:35 紧急回滚至 v5.1.2，重建任务已停止。待修正重建任务调度策略后重新发布。" },
  { id: "C4", service: "库存服务", version: "v1.8.5", owner: "刘芳", result: "success", time: "16:40", note: "库存扣减幂等性增强，全量上线完成" },
];
