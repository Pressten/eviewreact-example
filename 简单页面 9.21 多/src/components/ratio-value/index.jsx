// Layer 3: 达成率 + 环比趋势（达成率 ≥100% 达标 / ≥90% 需关注 / 其余告警）。
// 趋势箭头用原生 inline SVG（避免在未确认 icon-plus 导出目录前猜测组件名，符合"不猜 API"纪律）；
// 颜色走已冻结的 --success/--critical/--error/--on-surface-variant token，暗色随 <body>.dark 自动翻转。
// TODO(eview-react): icon-plus 目录确认后，箭头可换 @nce/icon-plus 按需引入组件。
import "./index.css";

const RATIO_TONE = [
  { min: 100, tone: "success" },
  { min: 90, tone: "critical" },
];

function toneOf(ratio) {
  const hit = RATIO_TONE.find((item) => ratio >= item.min);
  return hit ? hit.tone : "error";
}

function TrendArrow({ direction }) {
  const size = 12;
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  if (direction === "up") {
    return (
      <svg {...props}>
        <path d="M3.5 12.5L12.5 3.5M12.5 3.5H6.5M12.5 3.5V9.5" />
      </svg>
    );
  }
  if (direction === "down") {
    return (
      <svg {...props}>
        <path d="M3.5 3.5L12.5 12.5M12.5 12.5H6.5M12.5 12.5V6.5" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M3.5 8H12.5" />
    </svg>
  );
}

export default function RatioValue({ ratio, trend, polarity }) {
  const value = Number(ratio) || 0;
  const delta = Number(trend) || 0;
  const improving = polarity === "lower" ? delta < 0 : delta > 0;
  const direction = delta === 0 ? "flat" : delta > 0 ? "up" : "down";
  const trendTone = delta === 0 ? "flat" : improving ? "good" : "bad";

  return (
    <div className="ratio-value">
      <span className={"ratio-value__pct ratio-value__pct--" + toneOf(value)}>
        {value.toFixed(1)}%
      </span>
      <span className={"ratio-value__trend ratio-value__trend--" + trendTone}>
        <TrendArrow direction={direction} />
        {Math.abs(delta).toFixed(1)}%
      </span>
    </div>
  );
}
