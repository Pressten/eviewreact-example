import { salespeople, ownerMap } from "./salespeople.js";
import { opportunities } from "./opportunities.js";
import { deals } from "./deals.js";
import { teamMap } from "./teams.js";
import { stages } from "./stages.js";

export function getOwner(id) { return ownerMap[id]; }
export function getTeam(key) { return teamMap[key]; }

// 商机筛选 — 团队 / 产品线 / 部门 / 漏斗阶段联动
export function filterOpps({ team, productLine = "all", dept = "all", funnelStage = null }) {
  return opportunities.filter((o) => {
    if (o.team !== team) return false;
    if (productLine !== "all" && o.productLine !== productLine) return false;
    if (dept !== "all") {
      const owner = ownerMap[o.owner];
      if (!owner || owner.dept !== dept) return false;
    }
    if (funnelStage && o.stage !== funnelStage) return false;
    return true;
  });
}

const ANCHOR = new Date("2026-10-21");
function inTimeRange(closeDate, range) {
  const d = new Date(closeDate);
  if (range === "quarter") {
    return d.getFullYear() === 2026 && d.getMonth() >= 9 && d.getMonth() <= 11; // Q4
  }
  if (range === "month") {
    return d.getFullYear() === 2026 && d.getMonth() === 9; // 10 月
  }
  if (range === "week") {
    const t = d.getTime();
    return t >= new Date("2026-10-19").getTime() && t <= new Date("2026-10-25").getTime();
  }
  return true;
}

// 成交订单筛选 — 团队 / 产品线 / 部门 / 时间范围
export function filterDeals({ team, productLine = "all", dept = "all", timeRange = "quarter" }) {
  return deals.filter((d) => {
    if (d.team !== team) return false;
    if (productLine !== "all" && d.productLine !== productLine) return false;
    if (dept !== "all") {
      const owner = ownerMap[d.owner];
      if (!owner || owner.dept !== dept) return false;
    }
    if (!inTimeRange(d.closeDate, timeRange)) return false;
    return true;
  });
}

export function filterSalespeople({ team, dept = "all" }) {
  return salespeople.filter((s) => s.team === team && (dept === "all" || s.dept === dept));
}

// 销售漏斗聚合 — 各阶段金额/单数/占比 + 阶段间转化率
export function buildFunnel(opps) {
  const total = opps.reduce((sum, o) => sum + o.amount, 0);
  const rows = stages.map((st) => {
    const stageOpps = opps.filter((o) => o.stage === st.key);
    const amount = stageOpps.reduce((s, o) => s + o.amount, 0);
    const count = stageOpps.length;
    return {
      ...st,
      amount,
      count,
      pct: total > 0 ? (amount / total) * 100 : 0,
      opps: stageOpps,
    };
  });
  const conv = rows.map((r, i) => {
    if (i === 0) return null;
    const prev = rows[i - 1].amount;
    return prev > 0 ? (r.amount / prev) * 100 : 0;
  });
  return { rows, total, conv };
}

// 重点客户榜 — 成交订单按金额排序取前 N
export function topCustomers(dealsArr, n = 8) {
  return [...dealsArr]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, n)
    .map((d, i) => ({
      rank: i + 1,
      customer: d.customer,
      amount: d.amount,
      owner: ownerMap[d.owner],
      closeDate: d.closeDate,
      productLine: d.productLine,
    }));
}

// 团队业绩行 — 销售签约额/单数/目标达成率/排名
export function teamRows(salespeopleFiltered, dealsFiltered) {
  return salespeopleFiltered
    .map((s) => {
      const myDeals = dealsFiltered.filter((d) => d.owner === s.id);
      const signed = myDeals.reduce((sum, d) => sum + d.amount, 0);
      const count = myDeals.length;
      const rate = s.target > 0 ? (signed / s.target) * 100 : 0;
      return { ...s, signed, dealCount: count, rate };
    })
    .sort((a, b) => b.signed - a.signed)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

// 本季目标条 — 已签约/待审批/预测达成/差额
export function buildGoal(teamKey) {
  const team = teamMap[teamKey];
  const teamOpps = opportunities.filter((o) => o.team === teamKey);
  const teamDeals = deals.filter((d) => d.team === teamKey);
  const target = salespeople.filter((s) => s.team === teamKey).reduce((s, p) => s + p.target, 0);
  const signed = teamDeals.reduce((s, d) => s + d.amount, 0);
  const pending = team ? team.pending : 0;
  const signingAmount = teamOpps.filter((o) => o.stage === "signing").reduce((s, o) => s + o.amount, 0);
  const forecast = Math.round(signed + pending * 0.85 + signingAmount * 0.9);
  const forecastRate = target > 0 ? (forecast / target) * 100 : 0;
  const signedRate = target > 0 ? (signed / target) * 100 : 0;
  const gap = target - forecast;
  return { target, signed, pending, forecast, forecastRate, signedRate, gap, signingAmount, team };
}
