// Layer 2 mock — ③ 黄金指标 + ⑤ 实时图表序列
import dayjs from "dayjs";
import { SERVICES } from "./services.js";

// ③ 黄金指标行：QPS / 平均响应时间 / 错误率 / P99 延迟（带环比涨跌与方向语义）
export const GOLDEN = {
  prod: [
    { key: "qps", label: "全站 QPS", icon: "activity", value: 126400, display: "126,400", unit: "次/秒", delta: "+8.6%", deltaUp: true, good: true, base: "较昨日同期" },
    { key: "avgRt", label: "平均响应时间", icon: "timer", display: "86", unit: "ms", delta: "+12.4%", deltaUp: true, good: false, base: "较昨日同期" },
    { key: "errRate", label: "全站错误率", icon: "triangle-alert", display: "0.90", unit: "%", delta: "+0.62pp", deltaUp: true, good: false, base: "较昨日同期" },
    { key: "p99", label: "P99 延迟", icon: "gauge", display: "1,380", unit: "ms", delta: "+52.1%", deltaUp: true, good: false, base: "较昨日同期" },
  ],
  staging: [
    { key: "qps", label: "全站 QPS", icon: "activity", value: 3600, display: "3,600", unit: "次/秒", delta: "+4.2%", deltaUp: true, good: true, base: "较昨日同期" },
    { key: "avgRt", label: "平均响应时间", icon: "timer", display: "42", unit: "ms", delta: "-5.1%", deltaUp: false, good: true, base: "较昨日同期" },
    { key: "errRate", label: "全站错误率", icon: "triangle-alert", display: "0.09", unit: "%", delta: "-0.03pp", deltaUp: false, good: true, base: "较昨日同期" },
    { key: "p99", label: "P99 延迟", icon: "gauge", display: "210", unit: "ms", delta: "-3.4%", deltaUp: false, good: true, base: "较昨日同期" },
  ],
};

export const RANGE_LABELS = { "1h": "近 1 小时", "6h": "近 6 小时", "24h": "近 24 小时", "7d": "近 7 天" };

const RANGE_SPEC = {
  "1h": { points: 60, stepMin: 1, fmt: "HH:mm" },
  "6h": { points: 72, stepMin: 5, fmt: "HH:mm" },
  "24h": { points: 96, stepMin: 15, fmt: "HH:mm" },
  "7d": { points: 84, stepMin: 120, fmt: "MM-DD HH:mm" },
};

// ⑤ 异常时段注入：sinceAgo 与告警列表「持续时长」一致
//   payment-service：42 分钟前错误率爬升至 3.85%（P0 告警触发中），并持续保持
//   api-gateway：18 分钟前 5xx 升至 0.9%（P1 告警触发中，支付异常向上游传播）
const SERIES_PROFILE = {
  prod: {
    "api-gateway": { errBase: 0.06, spike: { sinceAgo: 18, rampMin: 4, peak: 0.9, qpsDip: 0.04 } },
    "order-service": { errBase: 0.42 },
    "product-service": { errBase: 0.05 },
    "user-service": { errBase: 0.06 },
    "payment-service": { errBase: 0.08, spike: { sinceAgo: 42, rampMin: 5, peak: 3.85, qpsDip: 0.08 } },
    "push-service": { errBase: 0.03 },
    "search-service": { errBase: 0.08 },
    "risk-service": { errBase: 0.02 },
  },
  staging: {
    "api-gateway": { errBase: 0.05 },
    "order-service": { errBase: 0.05 },
    "product-service": { errBase: 0.03 },
    "user-service": { errBase: 0.04 },
    "payment-service": { errBase: 0.06, spike: { sinceAgo: 22, rampMin: 4, peak: 0.9, qpsDip: 0.03 } },
    "push-service": { errBase: 0.02 },
    "search-service": { errBase: 0.05 },
    "risk-service": { errBase: 0.01 },
  },
};

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

// 生成 QPS 与错误率双序列（确定性伪随机；错误率异常时段在数据上体现）
export function buildSeries(env, serviceKey, range) {
  const spec = RANGE_SPEC[range] || RANGE_SPEC["1h"];
  const svc = SERVICES[env].find((s) => s.key === serviceKey) || SERVICES[env][0];
  const profile = SERIES_PROFILE[env][svc.key] || { errBase: 0.05 };
  const rng = makeRng(hashStr(`series|${env}|${svc.key}|${range}`));
  const now = dayjs();
  const points = [];

  for (let i = spec.points - 1; i >= 0; i--) {
    const minutesAgo = i * spec.stepMin;
    const ts = now.subtract(minutesAgo, "minute");
    let err = profile.errBase * (0.75 + rng() * 0.5);
    let qps = svc.qps * (0.9 + rng() * 0.18);

    const spike = profile.spike;
    if (spike && minutesAgo <= spike.sinceAgo) {
      const rampEnd = spike.sinceAgo - spike.rampMin;
      // 爬升期 0→1，随后进入平台期（事故持续中，错误率维持峰值附近）
      const shape = minutesAgo >= rampEnd ? (spike.sinceAgo - minutesAgo) / spike.rampMin : 1;
      err = err + (spike.peak - profile.errBase) * shape * (0.94 + rng() * 0.12);
      qps = qps * (1 - spike.qpsDip * shape);
    }

    points.push({
      label: ts.format(spec.fmt),
      qps: Math.round(qps),
      err: Math.round(err * 1000) / 1000,
    });
  }

  return { points, errThreshold: svc.errThreshold };
}
