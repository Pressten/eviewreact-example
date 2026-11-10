import { LEVEL_META } from "../../mock/ops.js";
import "./index.css";

// 等级 Tag —— 气象预警 / 流量控制 / 不正常事件共用三色规范:
// 紧急=error 红 / 重要=critical 橙 / 一般=warning 黄
export default function LevelTag({ level }) {
  const meta = LEVEL_META[level] || { label: level };
  return <span className={`level-tag level-${level}`}>{meta.label}</span>;
}
