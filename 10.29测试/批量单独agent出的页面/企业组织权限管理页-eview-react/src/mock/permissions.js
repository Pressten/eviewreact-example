// 权限矩阵 — 5 组 × 4 项 = 20 个权限点
// 每个权限点 key 全局唯一；group 用于聚合显示与组头半选态

export const permissionGroups = [
  {
    group: "user",
    groupLabel: "用户管理",
    groupDesc: "成员账号、邀请、编辑与停用",
    items: [
      { key: "user:view", label: "查看用户" },
      { key: "user:invite", label: "邀请用户" },
      { key: "user:edit", label: "编辑用户" },
      { key: "user:delete", label: "删除用户" },
    ],
  },
  {
    group: "org",
    groupLabel: "组织管理",
    groupDesc: "部门架构、节点维护",
    items: [
      { key: "org:view", label: "查看部门" },
      { key: "org:create", label: "创建部门" },
      { key: "org:adjust", label: "调整架构" },
      { key: "org:delete", label: "删除部门" },
    ],
  },
  {
    group: "app",
    groupLabel: "应用管理",
    groupDesc: "应用发布、配置与下架",
    items: [
      { key: "app:view", label: "查看应用" },
      { key: "app:config", label: "配置应用" },
      { key: "app:publish", label: "发布应用" },
      { key: "app:offline", label: "下架应用" },
    ],
  },
  {
    group: "audit",
    groupLabel: "日志审计",
    groupDesc: "操作日志、审计策略",
    items: [
      { key: "audit:view", label: "查看日志" },
      { key: "audit:export", label: "导出日志" },
      { key: "audit:config", label: "配置审计" },
      { key: "audit:delete", label: "删除日志" },
    ],
  },
  {
    group: "system",
    groupLabel: "系统设置",
    groupDesc: "全局配置、角色权限",
    items: [
      { key: "system:view", label: "查看设置" },
      { key: "system:edit", label: "修改设置" },
      { key: "system:role", label: "角色管理" },
      { key: "system:perm", label: "权限配置" },
    ],
  },
];

// 按角色生成默认权限集（与角色匹配）
export function getDefaultPermissions(role) {
  const all = permissionGroups.flatMap((g) => g.items.map((i) => i.key));
  switch (role) {
    case "super_admin":
      // 全部勾选
      return new Set(all);
    case "dept_admin": {
      // 部门级管理：除删除类、下架、删除日志、修改设置、权限配置外
      const exclude = ["user:delete", "org:delete", "app:offline", "audit:delete", "system:edit", "system:perm"];
      return new Set(all.filter((k) => !exclude.includes(k)));
    }
    case "editor": {
      // 编辑：查看 + 编辑/创建/邀请/导出/配置应用
      const include = [
        "user:view", "user:invite", "user:edit",
        "org:view", "org:create",
        "app:view", "app:config", "app:publish",
        "audit:view", "audit:export",
        "system:view",
      ];
      return new Set(include);
    }
    case "external_collaborator": {
      // 外部协作：仅应用模块的查看与配置 + 基础查看
      const include = [
        "user:view", "org:view",
        "app:view", "app:config",
        "audit:view",
        "system:view",
      ];
      return new Set(include);
    }
    case "member":
    default:
      // 普通成员：仅基础查看
      return new Set(["user:view", "org:view", "app:view", "audit:view", "system:view"]);
  }
}

// 角色分布统计（全公司范围，含外部协作）
export const roleDistribution = [
  { name: "超级管理员", value: 2, role: "super_admin" },
  { name: "部门管理员", value: 5, role: "dept_admin" },
  { name: "编辑", value: 13, role: "editor" },
  { name: "外部协作", value: 4, role: "external_collaborator" },
  { name: "普通成员", value: 37, role: "member" },
];
