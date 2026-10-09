import { Tag } from "antd";
import { levelMeta } from "../../mock/rule.js";

// Layer 3: 复用组件 — 告警级别标签（antd Tag，软标签配色走语义 token）
export default function LevelTag({ level }) {
  const meta =
    levelMeta[level] || { label: level, bg: "var(--surface-variant)", color: "var(--on-surface-variant)" };
  return (
    <Tag
      style={{
        background: meta.bg,
        color: meta.color,
        borderColor: meta.bg,
        marginInlineEnd: 0,
      }}
    >
      {meta.label}
    </Tag>
  );
}
