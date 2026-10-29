// 成员状态点 — 在职 success / 停用 critical / 离职 default
// 仅使用色块 + 文本，不使用 Badge
export default function StatusDot({ status }) {
  const map = {
    active: { label: "在职", color: "var(--success)" },
    suspended: { label: "停用", color: "var(--critical)" },
    left: { label: "离职", color: "var(--on-surface-variant)" },
  };
  const cfg = map[status] || map.active;
  return (
    <span className="status-dot">
      <span className="status-dot__dot" style={{ background: cfg.color }} />
      <span className="status-dot__label">{cfg.label}</span>
    </span>
  );
}
