// 金额格式化 — 数据层金额单位为千元(K),展示转为"万"
export function fmtMoney(amountK) {
  return `¥${(amountK / 10).toLocaleString("zh-CN", { maximumFractionDigits: 0 })}万`;
}
export function fmtMoneyShort(amountK) {
  return `${(amountK / 10).toLocaleString("zh-CN", { maximumFractionDigits: 1 })}万`;
}
export function fmtPct(n, digits = 1) {
  return `${n.toFixed(digits)}%`;
}
