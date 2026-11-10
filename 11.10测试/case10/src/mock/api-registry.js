// Layer 2: 接口注册表 — 版本元数据 / 资源分组 / 32 个接口 / 树构建工具

// ── 版本元数据（三版本内容差异的数据源）──
export const VERSION_META = {
  v1: {
    key: "v1",
    label: "v1 存档",
    docTag: "v1.9.3",
    pageTitle: "API 参考 · v1（存档）",
    bannerType: "critical",
    bannerIcon: "triangle-alert",
    bannerText:
      "该版本已于 2025-06-30 停止维护并进入只读存档，不再接收缺陷修复与功能变更。存量接入请尽快迁移至 v2 稳定版，迁移步骤见「快速开始」。",
    releaseNote: "发布于 2023-04-18 · 已归档",
    monthlyChanges: 0,
  },
  v2: {
    key: "v2",
    label: "v2 稳定",
    docTag: "v2.4.1",
    pageTitle: "API 参考 · v2（稳定）",
    bannerType: "info",
    bannerIcon: "info",
    bannerText:
      "当前生产环境推荐版本。接口契约稳定，破坏性变更将提前 90 天在更新日志中公告；本版本有 2 个接口已标记「即将下线」，请关注迁移窗口。",
    releaseNote: "发布于 2024-07-01 · 生产推荐",
    monthlyChanges: 5,
  },
  v3: {
    key: "v3",
    label: "v3 预览",
    docTag: "v3.0.0-beta.2",
    pageTitle: "API 参考 · v3（预览）",
    bannerType: "warning",
    bannerIcon: "flask-conical",
    bannerText:
      "预览版本包含 2 个新增实验性接口，契约与行为可能随反馈调整，不建议用于生产环境；v2 中标记「即将下线」的接口在本版本已正式下线。",
    releaseNote: "发布于 2026-10-12 · 预览通道",
    monthlyChanges: 9,
  },
};

export const VERSION_ORDER = ["v1", "v2", "v3"];

// ── 资源分组定义（左侧目录树的分组骨架）──
export const API_GROUPS = [
  {
    key: "auth",
    name: "认证与安全",
    icon: "shield-check",
    subgroups: [{ key: "tokens", name: "访问令牌" }],
  },
  {
    key: "users",
    name: "用户与账户",
    icon: "users",
    subgroups: [{ key: "usermgmt", name: "用户管理" }],
  },
  {
    key: "orders",
    name: "订单管理",
    icon: "shopping-bag",
    subgroups: [
      { key: "order-basic", name: "基础操作" },
      { key: "order-extra", name: "扩展操作" },
    ],
  },
  {
    key: "payments",
    name: "支付与结算",
    icon: "credit-card",
    subgroups: [
      { key: "pay-ops", name: "支付操作" },
      { key: "refund-ops", name: "退款" },
    ],
  },
  {
    key: "products",
    name: "商品与库存",
    icon: "package",
    subgroups: [
      { key: "product-mgmt", name: "商品管理" },
      { key: "sku", name: "SKU" },
    ],
  },
  {
    key: "webhooks",
    name: "事件订阅",
    icon: "bell",
    subgroups: [
      { key: "hook-mgmt", name: "订阅管理" },
      { key: "deliveries", name: "推送记录" },
    ],
  },
  {
    key: "analytics",
    name: "数据分析",
    icon: "chart-column",
    subgroups: [{ key: "reports", name: "报表" }],
  },
];

// ── 接口清单（32 个；since 标记引入版本，status 为按版本的状态映射）──
export const APIS = [
  // 认证与安全 / 访问令牌
  {
    apiId: "auth-issue-token",
    name: "获取访问令牌",
    method: "POST",
    path: "/auth/tokens",
    description: "以 App Key 与 App Secret 换取访问令牌，令牌默认有效期 7200 秒。",
    group: "auth",
    subgroup: "tokens",
    since: "v1",
    updatedAt: "2026-07-21",
    requiresHmac: false,
    scopes: ["app:token"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "auth-refresh-token",
    name: "刷新访问令牌",
    method: "POST",
    path: "/auth/tokens/refresh",
    description: "使用 refresh_token 换取新的访问令牌，旧令牌随即失效。",
    group: "auth",
    subgroup: "tokens",
    since: "v1",
    updatedAt: "2026-07-21",
    requiresHmac: false,
    scopes: ["app:token"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "auth-revoke-token",
    name: "吊销访问令牌",
    method: "DELETE",
    path: "/auth/tokens/{token_id}",
    description: "主动吊销未过期的访问令牌，用于密钥泄露等应急场景。",
    group: "auth",
    subgroup: "tokens",
    since: "v1",
    updatedAt: "2026-05-14",
    requiresHmac: false,
    scopes: ["app:token"],
    status: { v1: "active", v2: "active", v3: "active" },
  },

  // 用户与账户 / 用户管理
  {
    apiId: "users-list",
    name: "查询用户列表",
    method: "GET",
    path: "/users",
    description: "分页查询商户下的用户列表，支持按注册时间与状态过滤。",
    group: "users",
    subgroup: "usermgmt",
    since: "v1",
    updatedAt: "2026-08-30",
    requiresHmac: false,
    scopes: ["user:read"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "users-create",
    name: "创建用户",
    method: "POST",
    path: "/users",
    description: "在当前商户下创建用户，需指定唯一外部用户标识 external_id。",
    group: "users",
    subgroup: "usermgmt",
    since: "v1",
    updatedAt: "2026-09-02",
    requiresHmac: false,
    scopes: ["user:write"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "users-me",
    name: "获取当前用户信息",
    method: "GET",
    path: "/users/me",
    description: "返回访问令牌所属用户的完整资料，常用于登录态校验。",
    group: "users",
    subgroup: "usermgmt",
    since: "v1",
    updatedAt: "2026-06-18",
    requiresHmac: false,
    scopes: ["user:read"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "users-detail",
    name: "查询用户详情",
    method: "GET",
    path: "/users/{user_id}",
    description: "按用户 ID 查询单个用户的资料与扩展字段。",
    group: "users",
    subgroup: "usermgmt",
    since: "v1",
    updatedAt: "2026-06-18",
    requiresHmac: false,
    scopes: ["user:read"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "users-update",
    name: "更新用户信息",
    method: "PUT",
    path: "/users/{user_id}",
    description: "更新指定用户的昵称、头像与扩展字段等信息。",
    group: "users",
    subgroup: "usermgmt",
    since: "v1",
    updatedAt: "2026-09-02",
    requiresHmac: false,
    scopes: ["user:write"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "users-delete",
    name: "删除用户",
    method: "DELETE",
    path: "/users/{user_id}",
    description: "删除指定用户，关联数据保留 30 天后物理清除。",
    group: "users",
    subgroup: "usermgmt",
    since: "v1",
    updatedAt: "2026-04-09",
    requiresHmac: false,
    scopes: ["user:write"],
    status: { v1: "active", v2: "active", v3: "active" },
  },

  // 订单管理 / 基础操作
  {
    apiId: "orders-list",
    name: "查询订单列表",
    method: "GET",
    path: "/orders",
    description: "分页查询订单列表，支持按状态、金额区间与创建时间范围过滤。",
    group: "orders",
    subgroup: "order-basic",
    since: "v1",
    updatedAt: "2026-09-12",
    requiresHmac: false,
    scopes: ["order:read"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "orders-create",
    name: "创建订单",
    method: "POST",
    path: "/orders",
    description: "创建一笔新订单，返回订单号与支付所需参数。",
    group: "orders",
    subgroup: "order-basic",
    since: "v1",
    updatedAt: "2026-09-25",
    requiresHmac: false,
    scopes: ["order:write"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "orders-detail",
    name: "查询订单详情",
    method: "GET",
    path: "/orders/{order_id}",
    description: "按订单号查询单笔订单的完整信息与履约状态。",
    group: "orders",
    subgroup: "order-basic",
    since: "v1",
    updatedAt: "2026-08-02",
    requiresHmac: false,
    scopes: ["order:read"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "orders-update",
    name: "更新订单",
    method: "PUT",
    path: "/orders/{order_id}",
    description: "修改未支付订单的金额、明细与备注，订单支付后不可修改。",
    group: "orders",
    subgroup: "order-basic",
    since: "v1",
    updatedAt: "2026-08-02",
    requiresHmac: false,
    scopes: ["order:write"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "orders-delete",
    name: "删除订单",
    method: "DELETE",
    path: "/orders/{order_id}",
    description: "删除未支付且创建超过 24 小时的草稿订单。",
    group: "orders",
    subgroup: "order-basic",
    since: "v1",
    updatedAt: "2026-03-17",
    requiresHmac: false,
    scopes: ["order:write"],
    status: { v1: "active", v2: "active", v3: "active" },
  },

  // 订单管理 / 扩展操作
  {
    apiId: "orders-cancel",
    name: "取消订单",
    method: "POST",
    path: "/orders/{order_id}/cancel",
    description: "取消未支付订单。v2 起请改用「更新订单」接口的 status 字段。",
    group: "orders",
    subgroup: "order-extra",
    since: "v1",
    updatedAt: "2026-07-30",
    requiresHmac: false,
    scopes: ["order:write"],
    status: { v1: "active", v2: "deprecating", v3: "sunset" },
  },
  {
    apiId: "orders-events",
    name: "查询订单事件流",
    method: "GET",
    path: "/orders/{order_id}/events",
    description: "按时间序返回订单全生命周期事件，用于对账与状态同步。",
    group: "orders",
    subgroup: "order-extra",
    since: "v1",
    updatedAt: "2026-09-25",
    requiresHmac: false,
    scopes: ["order:read"],
    status: { v1: "active", v2: "active", v3: "active" },
  },

  // 支付与结算 / 支付操作
  {
    apiId: "payments-create",
    name: "发起支付",
    method: "POST",
    path: "/payments",
    description: "基于订单发起支付，支持余额、银行卡与第三方渠道。",
    group: "payments",
    subgroup: "pay-ops",
    since: "v1",
    updatedAt: "2026-09-18",
    requiresHmac: true,
    scopes: ["payment:write"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "payments-query",
    name: "查询支付结果",
    method: "GET",
    path: "/payments/{payment_id}",
    description: "查询单笔支付的状态、渠道流水号与到账时间。",
    group: "payments",
    subgroup: "pay-ops",
    since: "v1",
    updatedAt: "2026-09-18",
    requiresHmac: false,
    scopes: ["payment:read"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "payments-capture",
    name: "捕获支付",
    method: "POST",
    path: "/payments/{payment_id}/capture",
    description: "对授权成功的支付进行请款，两步支付场景下使用。",
    group: "payments",
    subgroup: "pay-ops",
    since: "v1",
    updatedAt: "2026-08-05",
    requiresHmac: true,
    scopes: ["payment:write"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "payments-methods",
    name: "查询可用支付方式",
    method: "GET",
    path: "/payment-methods",
    description: "返回当前商户与币种下可用的支付方式及费率。",
    group: "payments",
    subgroup: "pay-ops",
    since: "v1",
    updatedAt: "2026-02-11",
    requiresHmac: false,
    scopes: ["payment:read"],
    status: { v1: "active", v2: "active", v3: "active" },
  },

  // 支付与结算 / 退款
  {
    apiId: "payments-refund",
    name: "申请退款",
    method: "POST",
    path: "/payments/{payment_id}/refund",
    description: "对已支付订单发起全额或部分退款，v3 起由 /refunds 退款工作流替代。",
    group: "payments",
    subgroup: "refund-ops",
    since: "v1",
    updatedAt: "2026-07-08",
    requiresHmac: true,
    scopes: ["payment:write"],
    status: { v1: "active", v2: "deprecating", v3: "sunset" },
  },

  // 商品与库存 / 商品管理
  {
    apiId: "products-list",
    name: "查询商品列表",
    method: "GET",
    path: "/products",
    description: "分页查询商品列表，支持按上下架状态与类目过滤。",
    group: "products",
    subgroup: "product-mgmt",
    since: "v1",
    updatedAt: "2026-08-14",
    requiresHmac: false,
    scopes: ["product:read"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "products-create",
    name: "创建商品",
    method: "POST",
    path: "/products",
    description: "创建商品并返回商品 ID，支持多规格 SKU 结构。",
    group: "products",
    subgroup: "product-mgmt",
    since: "v1",
    updatedAt: "2026-09-02",
    requiresHmac: false,
    scopes: ["product:write"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "products-detail",
    name: "查询商品详情",
    method: "GET",
    path: "/products/{product_id}",
    description: "按商品 ID 查询商品基础信息、SKU 与价格策略。",
    group: "products",
    subgroup: "product-mgmt",
    since: "v1",
    updatedAt: "2026-08-14",
    requiresHmac: false,
    scopes: ["product:read"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "products-update",
    name: "更新商品",
    method: "PUT",
    path: "/products/{product_id}",
    description: "更新商品信息，价格变更实时生效于新订单。",
    group: "products",
    subgroup: "product-mgmt",
    since: "v1",
    updatedAt: "2026-09-02",
    requiresHmac: false,
    scopes: ["product:write"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "products-delete",
    name: "删除商品",
    method: "DELETE",
    path: "/products/{product_id}",
    description: "下架并删除商品，历史订单中的引用不受影响。",
    group: "products",
    subgroup: "product-mgmt",
    since: "v1",
    updatedAt: "2026-03-25",
    requiresHmac: false,
    scopes: ["product:write"],
    status: { v1: "active", v2: "active", v3: "active" },
  },

  // 商品与库存 / SKU
  {
    apiId: "products-skus",
    name: "查询商品 SKU 列表",
    method: "GET",
    path: "/products/{product_id}/skus",
    description: "返回指定商品的全部 SKU、库存与售价信息。",
    group: "products",
    subgroup: "sku",
    since: "v1",
    updatedAt: "2026-06-30",
    requiresHmac: false,
    scopes: ["product:read"],
    status: { v1: "active", v2: "active", v3: "active" },
  },

  // 事件订阅 / 订阅管理
  {
    apiId: "webhooks-list",
    name: "查询事件订阅列表",
    method: "GET",
    path: "/webhooks",
    description: "查询当前应用的事件订阅地址、事件类型与启用状态。",
    group: "webhooks",
    subgroup: "hook-mgmt",
    since: "v1",
    updatedAt: "2026-05-20",
    requiresHmac: false,
    scopes: ["webhook:read"],
    status: { v1: "active", v2: "active", v3: "active" },
  },
  {
    apiId: "webhooks-create",
    name: "创建事件订阅",
    method: "POST",
    path: "/webhooks",
    description: "为指定事件类型创建推送订阅，支持重试策略配置。",
    group: "webhooks",
    subgroup: "hook-mgmt",
    since: "v2",
    updatedAt: "2026-07-15",
    requiresHmac: true,
    scopes: ["webhook:write"],
    status: { v2: "active", v3: "active" },
  },

  // 事件订阅 / 推送记录
  {
    apiId: "webhooks-deliveries",
    name: "查询事件推送记录",
    method: "GET",
    path: "/webhooks/{webhook_id}/deliveries",
    description: "分页查询事件推送记录，含响应码、耗时与重试详情。",
    group: "webhooks",
    subgroup: "deliveries",
    since: "v2",
    updatedAt: "2026-07-15",
    requiresHmac: false,
    scopes: ["webhook:read"],
    status: { v2: "active", v3: "active" },
  },

  // 数据分析 / 报表（v3 预览新增）
  {
    apiId: "analytics-overview",
    name: "获取经营总览",
    method: "GET",
    path: "/analytics/overview",
    description: "返回商户维度的经营概览指标，含 GMV、订单量与转化率。",
    group: "analytics",
    subgroup: "reports",
    since: "v3",
    updatedAt: "2026-10-16",
    requiresHmac: false,
    scopes: ["analytics:read"],
    status: { v3: "active" },
  },
  {
    apiId: "analytics-reports",
    name: "生成分析报表",
    method: "GET",
    path: "/analytics/reports",
    description: "按维度组合生成分析报表，返回异步任务 ID 用于轮询结果。",
    group: "analytics",
    subgroup: "reports",
    since: "v3",
    updatedAt: "2026-10-21",
    requiresHmac: false,
    scopes: ["analytics:read"],
    status: { v3: "active" },
  },
];

// ── 派生工具 ──

// 按版本返回可用接口：v1 比 v2 少 2 个（v2 引入的订阅接口），v3 比 v2 多 2 个（数据分析）
export function getApisForVersion(version) {
  return APIS.filter((api) => Boolean(api.status[version]));
}

// 接口在指定版本下的状态：active 正常 / deprecating 即将下线 / sunset 已下线
export function getStatusInVersion(api, version) {
  return api.status[version] || "active";
}

// 是否标记为当前版本的「新增」接口（v1 存档不显示新增标记）
export function isNewInVersion(api, version) {
  return api.since === version && version !== "v1";
}

// 接口所属分组与子分组的展示名称
export function getGroupPath(api) {
  const group = API_GROUPS.find((item) => item.key === api.group);
  const sub = group ? group.subgroups.find((item) => item.key === api.subgroup) : null;
  return {
    groupName: group ? group.name : "-",
    subgroupName: sub ? sub.name : "-",
  };
}

// 构建目录树纯数据（title 渲染由视图层完成，保持 mock 层无 React 依赖）
export function buildTreeData(apis) {
  return API_GROUPS.map((group) => {
    const groupApis = apis.filter((api) => api.group === group.key);
    if (groupApis.length === 0) return null;
    const children = group.subgroups
      .map((sub) => {
        const subApis = groupApis.filter((api) => api.subgroup === sub.key);
        if (subApis.length === 0) return null;
        return {
          key: `s:${group.key}/${sub.key}`,
          nodeType: "sub",
          name: sub.name,
          count: subApis.length,
          children: subApis.map((api) => ({
            key: `a:${api.apiId}`,
            nodeType: "api",
            name: api.name,
            method: api.method,
            isLeaf: true,
          })),
        };
      })
      .filter(Boolean);
    return {
      key: `g:${group.key}`,
      nodeType: "group",
      name: group.name,
      icon: group.icon,
      count: groupApis.length,
      children,
    };
  }).filter(Boolean);
}
