import { IconPlusIcPublicSortDown, IconPlusIcPublicSortUp } from '@hui/icon-plus';
import "./index.css";

// 环比涨跌块：涨红跌绿（国内运营口径），支持百分比或绝对值（如 +2 家）
export default function DeltaChip({ pct, abs, absUnit = "家", digits = 1 }) {
  const isUp = abs != null ? abs >= 0 : pct >= 0;
  const text =
    abs != null
      ? `${isUp ? "+" : ""}${abs}${absUnit}`
      : `${isUp ? "+" : ""}${Number(pct || 0).toFixed(digits)}%`;
  return (
    <span className={`delta-chip ${isUp ? "delta-up" : "delta-down"}`}>
      {isUp ? <IconPlusIcPublicSortUp iconSize="0.75rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicSortDown iconSize="0.75rem" iconColor={['currentcolor']} />}
      {text}
    </span>
  );
}
