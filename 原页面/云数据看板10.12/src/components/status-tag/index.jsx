import "./index.css";

// 状态标签 — 表格 / 抽屉中的软色状态徽标
const TONE_MAP = {
  运行中: "success",
  已停止: "none",
  维护中: "info",
  告警: "warning",
  故障: "error",
};

const LEVEL_MAP = {
  info: "info",
  warning: "warning",
  error: "error",
};

export default function StatusTag({ value, level }) {
  const tone = level ? LEVEL_MAP[level] || "none" : TONE_MAP[value] || "none";
  return <span className={`status-tag status-tag--${tone}`}>{value}</span>;
}
