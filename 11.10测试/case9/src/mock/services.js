// Layer 2 mock — ② 服务总览：8 个核心服务（生产 / 预发双环境）
// 字段语义：key 服务标识 / name 服务名 / domain 业务域 / availability 24h 可用率
// instances 实例数 / qps 实时 QPS / errRate 实时错误率 / errThreshold 错误率告警阈值
// 与告警列表逻辑一致：payment-service（可用率 99.41% + P0 告警）异常，order-service / api-gateway 降级。

// 确定性伪随机（LCG）：趋势数据稳定，不随渲染抖动
function makeRng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const SERVICES = {
  prod: [
    { key: "api-gateway", name: "API 网关", domain: "入口层", availability: 99.95, instances: 16, qps: 126400, errRate: 0.9, avgRt: 86, p99: 1380, errThreshold: 0.5 },
    { key: "order-service", name: "订单服务", domain: "交易域", availability: 99.87, instances: 12, qps: 38200, errRate: 0.42, avgRt: 210, p99: 1240, errThreshold: 1.0 },
    { key: "product-service", name: "商品服务", domain: "商品域", availability: 99.97, instances: 10, qps: 29600, errRate: 0.05, avgRt: 64, p99: 320, errThreshold: 0.5 },
    { key: "user-service", name: "用户服务", domain: "用户域", availability: 99.95, instances: 8, qps: 21300, errRate: 0.06, avgRt: 58, p99: 260, errThreshold: 0.5 },
    { key: "payment-service", name: "支付服务", domain: "交易域", availability: 99.41, instances: 8, qps: 18900, errRate: 3.85, avgRt: 640, p99: 1420, errThreshold: 1.0 },
    { key: "push-service", name: "消息推送", domain: "支撑域", availability: 99.98, instances: 6, qps: 12400, errRate: 0.03, avgRt: 45, p99: 180, errThreshold: 0.5 },
    { key: "search-service", name: "搜索服务", domain: "商品域", availability: 99.92, instances: 6, qps: 9800, errRate: 0.08, avgRt: 120, p99: 480, errThreshold: 0.5 },
    { key: "risk-service", name: "风控服务", domain: "支撑域", availability: 99.99, instances: 4, qps: 6200, errRate: 0.02, avgRt: 38, p99: 150, errThreshold: 0.5 },
  ],
  staging: [
    { key: "api-gateway", name: "API 网关", domain: "入口层", availability: 99.99, instances: 4, qps: 3600, errRate: 0.05, avgRt: 42, p99: 210, errThreshold: 0.5 },
    { key: "order-service", name: "订单服务", domain: "交易域", availability: 99.96, instances: 3, qps: 980, errRate: 0.05, avgRt: 55, p99: 240, errThreshold: 1.0 },
    { key: "product-service", name: "商品服务", domain: "商品域", availability: 99.98, instances: 3, qps: 760, errRate: 0.03, avgRt: 48, p99: 200, errThreshold: 0.5 },
    { key: "user-service", name: "用户服务", domain: "用户域", availability: 99.97, instances: 2, qps: 540, errRate: 0.04, avgRt: 50, p99: 190, errThreshold: 0.5 },
    { key: "payment-service", name: "支付服务", domain: "交易域", availability: 99.72, instances: 2, qps: 470, errRate: 0.9, avgRt: 180, p99: 480, errThreshold: 0.5 },
    { key: "push-service", name: "消息推送", domain: "支撑域", availability: 99.99, instances: 2, qps: 310, errRate: 0.02, avgRt: 40, p99: 160, errThreshold: 0.5 },
    { key: "search-service", name: "搜索服务", domain: "商品域", availability: 99.95, instances: 2, qps: 260, errRate: 0.05, avgRt: 90, p99: 300, errThreshold: 0.5 },
    { key: "risk-service", name: "风控服务", domain: "支撑域", availability: 99.99, instances: 2, qps: 180, errRate: 0.01, avgRt: 35, p99: 140, errThreshold: 0.5 },
  ],
};

// 事故时段（今日 13:45 起）：支付链路流量回落，网关同步小幅回落
const DIP_HOURS = {
  prod: { "payment-service": [13, 14], "api-gateway": [13, 14] },
  staging: {},
};

// ② 服务卡 24h 迷你趋势（QPS 形态）
export function trendFor(env, svc) {
  const dipHours = (DIP_HOURS[env] && DIP_HOURS[env][svc.key]) || [];
  const rng = makeRng(hashStr(`trend|${env}|${svc.key}`));
  const points = [];
  for (let h = 0; h < 24; h++) {
    const daytime = h >= 6 && h <= 21;
    let v = svc.qps * (daytime ? 0.95 : 0.62) * (0.92 + rng() * 0.16);
    if (dipHours.indexOf(h) >= 0) v *= 0.86;
    points.push({ t: `${String(h).padStart(2, "0")}:00`, v: Math.round(v) });
  }
  return points;
}

export function fmtNum(n) {
  return n.toLocaleString("en-US");
}

// 刷新脉冲：随 refreshTick 确定性抖动 ±1.5%（仅作用于展示层 QPS，告警触发值不变）
export function jitterOf(key, tick) {
  if (!tick) return 0;
  const rng = makeRng(hashStr(`live|${key}|${tick}`));
  return (rng() - 0.5) * 0.03;
}

export function liveQps(base, key, tick) {
  return Math.round(base * (1 + jitterOf(key, tick)));
}
