import Tag from "@/shared/Tag";

// 健康度状态 Tag — 语义色规范:健康=success / 观察=warning / 风险=error / 流失预警=volcano
const STATUS_MAP = {
  healthy: { label: "健康", color: "success" },
  watch: { label: "观察", color: "warning" },
  risk: { label: "风险", color: "error" },
  churn: { label: "流失预警", color: "volcano" },
};

export default function HealthTag({ status }) {
  const cfg = STATUS_MAP[status] || STATUS_MAP.watch;
  return <Tag color={cfg.color}>{cfg.label}</Tag>;
}
