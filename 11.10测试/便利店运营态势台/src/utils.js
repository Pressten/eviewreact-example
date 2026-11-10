// 通用格式化工具
export function fmtInt(n) {
  return Number(n || 0).toLocaleString("zh-CN");
}

export function fmtWan(n, digits = 1) {
  const w = (n || 0) / 10000;
  return `${w.toFixed(digits)}万`;
}

export function fmtMoney(n) {
  return `¥ ${fmtInt(Math.round(n || 0))}`;
}
