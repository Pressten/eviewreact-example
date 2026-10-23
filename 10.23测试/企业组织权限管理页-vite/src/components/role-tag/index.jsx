import Tag from "@/shared/Tag";
import { useApp } from "../../context.jsx";

// 角色 Tag — 4 种分色：超级管理员 red / 部门管理员 orange / 编辑 green / 普通成员 default
// color 配置走 antd 内置色板，对应 dark mode 由 antd 自带处理
export default function RoleTag({ role, showIcon = false }) {
  const { roleConfig } = useApp();
  const cfg = roleConfig[role];
  if (!cfg) return null;
  return (
    <Tag color={cfg.color} bordered={false} style={{ margin: 0 }}>
      {showIcon && <span style={{ marginRight: 4 }}>●</span>}
      {cfg.label}
    </Tag>
  );
}
