// 审计日志 — 最近权限变更记录
// result: success | failed
// action 类型用于筛选

export const auditLogs = [
  {
    id: "L001",
    time: "2026-10-21 09:48:22",
    operator: "邵文渊",
    operatorRole: "super_admin",
    action: "permission_grant",
    actionLabel: "权限授予",
    target: "周梦琪 — 应用管理·发布应用",
    result: "success",
    detail: "为「技术研发部」成员周梦琪授予「应用管理·发布应用」权限",
  },
  {
    id: "L002",
    time: "2026-10-21 09:32:10",
    operator: "张明远",
    operatorRole: "dept_admin",
    action: "member_transfer",
    actionLabel: "成员调岗",
    target: "高文博 → 前端组",
    result: "success",
    detail: "将「技术研发部」成员高文博由本部调入「前端组」",
  },
  {
    id: "L003",
    time: "2026-10-21 08:55:41",
    operator: "邵文渊",
    operatorRole: "super_admin",
    action: "role_change",
    actionLabel: "角色变更",
    target: "魏国栋 — 部门管理员",
    result: "success",
    detail: "将「后端组」成员魏国栋角色由「编辑」变更为「部门管理员」",
  },
  {
    id: "L004",
    time: "2026-10-21 08:18:05",
    operator: "张明远",
    operatorRole: "dept_admin",
    action: "member_disable",
    actionLabel: "成员停用",
    target: "孙浩天",
    result: "success",
    detail: "停用「技术研发部」成员孙浩天账号",
  },
  {
    id: "L005",
    time: "2026-10-21 07:30:19",
    operator: "王立群",
    operatorRole: "super_admin",
    action: "permission_revoke",
    actionLabel: "权限撤销",
    target: "潘雅韶 — 系统设置·修改设置",
    result: "failed",
    detail: "撤销「基础架构部」潘雅韶「系统设置·修改设置」权限失败：账号已停用",
  },
  {
    id: "L006",
    time: "2026-10-21 06:42:33",
    operator: "邵文渊",
    operatorRole: "super_admin",
    action: "permission_grant",
    actionLabel: "权限授予",
    target: "阮思琪 — 日志审计·导出日志",
    result: "success",
    detail: "为「基础架构部」阮思琪授予「日志审计·导出日志」权限",
  },
];

// 动作类型筛选选项
export const auditActionOptions = [
  { label: "全部动作", value: "all" },
  { label: "权限授予", value: "permission_grant" },
  { label: "权限撤销", value: "permission_revoke" },
  { label: "角色变更", value: "role_change" },
  { label: "成员调岗", value: "member_transfer" },
  { label: "成员停用", value: "member_disable" },
];
