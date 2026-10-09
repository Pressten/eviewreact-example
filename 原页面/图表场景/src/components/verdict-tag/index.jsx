import { Icon } from "../../../assets/shared/icon.jsx";
import { verdictMap } from "../../mock/metrics.js";
import "./index.css";

// Layer 3: 判断结论标签（达标 / 预警 / 异常）
const ICONS = {
  pass: "circle-check",
  warn: "triangle-alert",
  fail: "circle-x",
};

export default function VerdictTag({ verdict, showIcon = true, size = "default" }) {
  const meta = verdictMap[verdict] || verdictMap.pass;
  return (
    <span className={`verdict-tag verdict-tag--${meta.tone} verdict-tag--${size}`}>
      {showIcon ? <Icon name={ICONS[verdict] || "circle-check"} size={size === "small" ? 12 : 14} /> : null}
      {meta.label}
    </span>
  );
}
