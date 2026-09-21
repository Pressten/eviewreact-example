// Layer 3: 指标状态软标签（语义圆点 + 文字软底胶囊）。
// 原视觉为"前导圆点 + 文字"软底胶囊：eview-react Tag 无前导圆点、Badge status 为异形（无软底胶囊），
// 按 fallback pattern 保留原生 JSX；颜色走已冻结的 --success/--critical/--error/--info 等 token，
// 暗色随 <body>.dark（与 aui3_1_dark 同步）自动翻转，深色软底另加描边见 index.css。
// TODO(eview-react): 若可接受去圆点，可改 <Tag color=...>（success→success / critical→caution / error→danger / info→primary / neutral|muted→default）。
import { STATUS_MAP } from "../../data.js";
import "./index.css";

export default function StatusTag({ status }) {
  const config = STATUS_MAP[status] || STATUS_MAP.draft;
  return (
    <span className={"status-tag status-tag--" + config.tone}>
      <span className="status-tag__dot" />
      {config.label}
    </span>
  );
}
