// Layer 2 mock — 功能模块 / 角色 / 权限矩阵初始数据
// 语义化字段：moduleId / moduleName / roleId / roleName / description / permModule / permAction

export const PERM_MODULES = [
  { moduleId: "member-mgmt", moduleName: "会员管理", description: "会员档案、等级权益与积分明细的查看与维护" },
  { moduleId: "product-mgmt", moduleName: "商品管理", description: "商品上架、类目属性与价格策略管理" },
  { moduleId: "order-mgmt", moduleName: "订单管理", description: "订单检索、发货跟进与售后工单处理" },
  { moduleId: "marketing", moduleName: "营销活动", description: "优惠券、拼团与限时促销活动的配置与投放" },
  { moduleId: "inventory", moduleName: "库存管理", description: "库存盘点、仓间调拨与低库存预警设置" },
  { moduleId: "refund-approve", moduleName: "退款审批", description: "退款申请单的审核、驳回与资金退回" },
  { moduleId: "finance-report", moduleName: "财务报表", description: "营收、成本与利润报表的查看与导出" },
  { moduleId: "data-export", moduleName: "数据导出", description: "业务数据批量导出的申请与执行" },
  { moduleId: "log-audit", moduleName: "日志审计", description: "操作日志与登录日志的检索与回溯" },
  { moduleId: "system-config", moduleName: "系统配置", description: "系统参数、通知模板等基础配置维护" },
  { moduleId: "perm-mgmt", moduleName: "权限管理", description: "组织、角色与权限矩阵的维护与授权" },
  { moduleId: "notification", moduleName: "消息通知", description: "站内信、公告与短信通知的发送管理" },
];

export const PERM_ACTIONS = [
  { actionId: "view", actionName: "查看" },
  { actionId: "edit", actionName: "编辑" },
  { actionId: "delete", actionName: "删除" },
];

export const INITIAL_ROLES = [
  { roleId: "role-super", roleName: "超级管理员", description: "拥有系统全部功能的完整权限，负责平台统筹与账号安全管理" },
  { roleId: "role-ops-mgr", roleName: "运营经理", description: "管理运营体系与营销审批，可查看全量业务数据与报表" },
  { roleId: "role-ops", roleName: "运营专员", description: "执行日常运营操作，可编辑业务数据但不可删除或查看财务报表" },
  { roleId: "role-fin", roleName: "财务", description: "负责财务报表与退款资金管理，权限范围仅限财务相关模块" },
  { roleId: "role-auditor", roleName: "审计员", description: "独立回溯操作与登录日志，仅保留只读与导出权限，不做业务变更" },
  { roleId: "role-guest", roleName: "只读访客", description: "仅可查看业务概览页面，无任何编辑与删除权限" },
];

// [view, edit, delete]
const P = (v, e, d) => ({ view: !!v, edit: !!e, delete: !!d });

export const INITIAL_PERMS = {
  "role-super": {
    "member-mgmt": P(1, 1, 1), "product-mgmt": P(1, 1, 1), "order-mgmt": P(1, 1, 1),
    marketing: P(1, 1, 1), inventory: P(1, 1, 1), "refund-approve": P(1, 1, 1),
    "finance-report": P(1, 1, 1), "data-export": P(1, 1, 1), "log-audit": P(1, 1, 1),
    "system-config": P(1, 1, 1), "perm-mgmt": P(1, 1, 1), notification: P(1, 1, 1),
  },
  "role-ops-mgr": {
    "member-mgmt": P(1, 1, 0), "product-mgmt": P(1, 1, 1), "order-mgmt": P(1, 1, 1),
    marketing: P(1, 1, 1), inventory: P(1, 1, 0), "refund-approve": P(1, 1, 0),
    "finance-report": P(1, 0, 0), "data-export": P(1, 0, 0), "log-audit": P(1, 0, 0),
    "system-config": P(1, 0, 0), "perm-mgmt": P(1, 0, 0), notification: P(1, 1, 0),
  },
  "role-ops": {
    "member-mgmt": P(1, 1, 0), "product-mgmt": P(1, 1, 0), "order-mgmt": P(1, 1, 0),
    marketing: P(1, 1, 0), inventory: P(1, 1, 0), "refund-approve": P(1, 0, 0),
    "finance-report": P(0, 0, 0), "data-export": P(0, 0, 0), "log-audit": P(0, 0, 0),
    "system-config": P(0, 0, 0), "perm-mgmt": P(0, 0, 0), notification: P(1, 1, 0),
  },
  "role-fin": {
    "member-mgmt": P(0, 0, 0), "product-mgmt": P(0, 0, 0), "order-mgmt": P(1, 0, 0),
    marketing: P(0, 0, 0), inventory: P(0, 0, 0), "refund-approve": P(1, 1, 0),
    "finance-report": P(1, 1, 0), "data-export": P(1, 0, 0), "log-audit": P(0, 0, 0),
    "system-config": P(0, 0, 0), "perm-mgmt": P(0, 0, 0), notification: P(0, 0, 0),
  },
  "role-auditor": {
    "member-mgmt": P(0, 0, 0), "product-mgmt": P(0, 0, 0), "order-mgmt": P(1, 0, 0),
    marketing: P(0, 0, 0), inventory: P(0, 0, 0), "refund-approve": P(0, 0, 0),
    "finance-report": P(1, 0, 0), "data-export": P(1, 0, 0), "log-audit": P(1, 0, 0),
    "system-config": P(0, 0, 0), "perm-mgmt": P(1, 0, 0), notification: P(0, 0, 0),
  },
  "role-guest": {
    "member-mgmt": P(1, 0, 0), "product-mgmt": P(1, 0, 0), "order-mgmt": P(1, 0, 0),
    marketing: P(1, 0, 0), inventory: P(0, 0, 0), "refund-approve": P(0, 0, 0),
    "finance-report": P(0, 0, 0), "data-export": P(0, 0, 0), "log-audit": P(0, 0, 0),
    "system-config": P(0, 0, 0), "perm-mgmt": P(0, 0, 0), notification: P(0, 0, 0),
  },
};

export function emptyPermMap() {
  const map = {};
  PERM_MODULES.forEach((m) => { map[m.moduleId] = { view: false, edit: false, delete: false }; });
  return map;
}
