import Tag from "@/shared/Tag";
import { useApp } from "../../context.jsx";

// 角色 Tag — 4 种分色：超级管理员 red / 部门管理员 orange / 编辑 green / 普通成员 default
// color 由 @/shared/Tag 包壳内部解析（自定义 hex→实心背景+白字；dark mode 由 dark.css token 翻转跟随）
export default function RoleTag({ role, showIcon = false }) {
  const { roleConfig } = useApp();
  const cfg = roleConfig[role];
  if (!cfg) return null;
  return (
    <Tag color={cfg.color} style={{ margin: 0 }}>
      {showIcon && <span style={{ marginRight: 4 }}>●</span>}
      {cfg.label}
    </Tag>
  );
}
