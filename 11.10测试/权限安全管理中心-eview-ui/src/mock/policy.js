// Layer 2 mock — 安全策略与数据权限初始配置
// 语义化字段：minPasswordLength / sessionTimeoutMinutes / loginMethods / forceMfa / passwordValidityDays / scopeId / dataTypes / validUntil

export const LOGIN_METHODS = [
  { methodId: "password", methodName: "账号密码" },
  { methodId: "sms", methodName: "短信验证" },
  { methodId: "qrcode", methodName: "扫码登录" },
  { methodId: "wecom", methodName: "企业微信" },
];

export const INITIAL_POLICY = {
  minPasswordLength: 10,
  sessionTimeoutMinutes: 30,
  loginMethods: ["password", "sms", "wecom"],
  forceMfa: true,
  passwordValidityDays: 90,
};

export const PASSWORD_VALIDITY_OPTIONS = [30, 60, 90, 180].map((d) => ({
  value: d,
  label: `每 ${d} 天`,
}));

export const SCOPE_OPTIONS = [
  { scopeId: "all", scopeName: "全部数据", scopeDesc: "可查看与操作组织内全部业务数据，无需单独授权" },
  { scopeId: "dept", scopeName: "本部门", scopeDesc: "仅可查看与操作本部门产生的业务数据" },
  { scopeId: "dept-sub", scopeName: "本部门及下级", scopeDesc: "可查看本部门及其下级小组产生的业务数据" },
  { scopeId: "self", scopeName: "仅本人", scopeDesc: "仅可查看与操作自己创建的业务数据" },
];

export const INITIAL_EXCEPTIONS = [
  { exceptionId: "ex-1", deptName: "市场部", dataTypes: ["订单数据", "会员数据"], validUntil: "2026-12-31" },
  { exceptionId: "ex-2", deptName: "技术研发部", dataTypes: ["库存数据"], validUntil: "2027-03-31" },
  { exceptionId: "ex-3", deptName: "人力资源部", dataTypes: ["会员数据"], validUntil: "2026-11-30" },
  { exceptionId: "ex-4", deptName: "运营部", dataTypes: ["财务报表", "订单数据"], validUntil: "2027-06-30" },
];
