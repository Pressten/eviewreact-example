// Layer 2: 接口详情数据 — 请求参数模板 / 响应示例 / curl 生成 / 模拟调试响应
// 供接口详情 Drawer（参数 / 响应示例 / 在线调试）使用。

// ── 通用参数片段 ──
const PAGE_PARAMS = [
  { name: "page", type: "int", required: false, description: "页码，从 1 开始，默认 1。" },
  { name: "page_size", type: "int", required: false, description: "每页数量，默认 20，最大 100。" },
];

// ── 查询参数模板（按 apiId 定制，未列出的 GET 列表接口使用通用分页）──
const QUERY_BY_API = {
  "users-list": [
    { name: "status", type: "string", required: false, description: "按状态过滤：ACTIVE / FROZEN / DELETED。" },
    { name: "created_after", type: "string", required: false, description: "创建时间下界，ISO 8601 格式。" },
    ...PAGE_PARAMS,
  ],
  "orders-list": [
    { name: "status", type: "string", required: false, description: "按状态过滤：PENDING / PAID / CANCELLED / REFUNDED。" },
    { name: "amount_min", type: "int", required: false, description: "金额下界，单位：分。" },
    { name: "amount_max", type: "int", required: false, description: "金额上界，单位：分。" },
    { name: "created_after", type: "string", required: false, description: "创建时间下界，ISO 8601 格式。" },
    ...PAGE_PARAMS,
  ],
  "products-list": [
    { name: "status", type: "string", required: false, description: "按状态过滤：ON_SALE / OFF_SALE。" },
    { name: "category_id", type: "string", required: false, description: "按类目 ID 过滤。" },
    ...PAGE_PARAMS,
  ],
  "webhooks-list": [
    { name: "enabled", type: "boolean", required: false, description: "是否仅返回启用中的订阅。" },
  ],
  "webhooks-deliveries": [
    { name: "since", type: "string", required: false, description: "查询该时间之后的推送记录，ISO 8601 格式。" },
    ...PAGE_PARAMS,
  ],
  "analytics-overview": [
    { name: "date_range", type: "string", required: false, description: "统计区间：7d / 30d / 90d，默认 30d。" },
  ],
  "analytics-reports": [
    { name: "dimensions", type: "array", required: true, description: '分析维度组合，如 ["channel", "category"]。' },
    { name: "date_range", type: "string", required: false, description: "统计区间：7d / 30d / 90d，默认 30d。" },
  ],
};

// ── 请求体参数模板（POST / PUT）──
const BODY_BY_API = {
  "auth-issue-token": [
    { name: "app_key", type: "string", required: true, description: "控制台签发的应用唯一标识。" },
    { name: "app_secret", type: "string", required: true, description: "应用密钥，仅可在服务端使用。" },
  ],
  "auth-refresh-token": [
    { name: "refresh_token", type: "string", required: true, description: "刷新令牌，有效期 30 天，使用后立即失效。" },
  ],
  "users-create": [
    { name: "external_id", type: "string", required: true, description: "商户侧唯一外部用户标识。" },
    { name: "nickname", type: "string", required: true, description: "用户昵称，2-32 个字符。" },
    { name: "avatar_url", type: "string", required: false, description: "头像 URL，必须为 HTTPS。" },
    { name: "extend", type: "object", required: false, description: "扩展字段，键值对最多 16 组。" },
  ],
  "users-update": [
    { name: "nickname", type: "string", required: false, description: "仅传入的字段会被更新。" },
    { name: "avatar_url", type: "string", required: false, description: "头像 URL，必须为 HTTPS。" },
    { name: "extend", type: "object", required: false, description: "扩展字段，整体覆盖式更新。" },
  ],
  "orders-create": [
    { name: "out_trade_no", type: "string", required: true, description: "商户订单号，同一商户下唯一。" },
    { name: "amount", type: "int", required: true, description: "订单金额，单位：分。" },
    { name: "currency", type: "string", required: false, description: "币种，默认 CNY。" },
    { name: "items", type: "array", required: true, description: "订单明细，含 product_id / sku_id / quantity。" },
    { name: "notify_url", type: "string", required: false, description: "支付结果异步回调地址。" },
  ],
  "orders-update": [
    { name: "status", type: "string", required: false, description: "订单状态。v2 起推荐用该字段替代「取消订单」接口。" },
    { name: "remark", type: "string", required: false, description: "订单备注，仅未支付订单可修改。" },
  ],
  "orders-cancel": [
    { name: "reason", type: "string", required: false, description: "取消原因，会写入订单事件流。" },
  ],
  "payments-create": [
    { name: "order_id", type: "string", required: true, description: "待支付订单 ID。" },
    { name: "channel", type: "string", required: true, description: "支付渠道：BALANCE / CARD / WECHAT / ALIPAY。" },
    { name: "amount", type: "int", required: true, description: "支付金额，单位：分，需与订单金额一致。" },
  ],
  "payments-capture": [
    { name: "amount", type: "int", required: false, description: "请款金额，缺省为授权金额，支持部分请款。" },
  ],
  "payments-refund": [
    { name: "refund_amount", type: "int", required: false, description: "退款金额，缺省为全额退款。" },
    { name: "reason", type: "string", required: true, description: "退款原因，会同步至买家侧。" },
  ],
  "products-create": [
    { name: "title", type: "string", required: true, description: "商品标题，2-64 个字符。" },
    { name: "category_id", type: "string", required: false, description: "所属类目 ID。" },
    { name: "skus", type: "array", required: false, description: "SKU 列表，含 price / stock / specs。" },
  ],
  "products-update": [
    { name: "title", type: "string", required: false, description: "仅传入的字段会被更新。" },
    { name: "status", type: "string", required: false, description: "商品状态：ON_SALE / OFF_SALE。" },
    { name: "skus", type: "array", required: false, description: "SKU 列表，整体覆盖式更新。" },
  ],
  "webhooks-create": [
    { name: "url", type: "string", required: true, description: "推送目标地址，必须为 HTTPS。" },
    { name: "events", type: "array", required: true, description: "订阅的事件类型列表，如 [\"order.paid\"]。" },
    { name: "retry_policy", type: "object", required: false, description: "重试策略：max_attempts / backoff 秒。" },
  ],
};

// ── 响应示例对象（按资源域）──
const SAMPLE_OBJECTS = {
  auth: {
    access_token: "eyJhbGciOiJIUzI1NiJ9.example.access",
    token_type: "Bearer",
    expires_in: 7200,
    refresh_token: "rt_9f2k8sQe5rT1yU8nZ3",
  },
  users: {
    user_id: "u_10294",
    external_id: "ext_88213",
    nickname: "林晚",
    status: "ACTIVE",
    created_at: "2026-08-30T14:21:05+08:00",
  },
  orders: {
    order_id: "20260921000142",
    out_trade_no: "商户单号-88213001",
    status: "PAID",
    amount: 12900,
    currency: "CNY",
    items_count: 3,
    created_at: "2026-09-21T10:14:37+08:00",
  },
  payments: {
    payment_id: "pay_88340912",
    order_id: "20260921000142",
    status: "SUCCESS",
    channel: "BALANCE",
    amount: 12900,
    paid_at: "2026-09-21T10:15:02+08:00",
  },
  products: {
    product_id: "p_3021",
    title: "云存储套餐 · 专业版",
    status: "ON_SALE",
    sku_count: 4,
    updated_at: "2026-09-02T09:00:00+08:00",
  },
  webhooks: {
    webhook_id: "wh_5521",
    url: "https://example.com/hooks/orders",
    events: ["order.paid", "order.refunded"],
    enabled: true,
  },
  analytics: {
    gmv: 12849300,
    order_count: 4821,
    conversion_rate: 0.062,
    date_range: "30d",
  },
};

// 列表型接口（GET 且路径不含资源 ID）
const LIST_APIS = new Set([
  "users-list",
  "orders-list",
  "products-list",
  "webhooks-list",
  "webhooks-deliveries",
]);

// ── 请求参数（路径参数 + 查询/请求体参数）──
export function getRequestParams(api) {
  // 1. 路径参数：自动提取 {xxx}
  const pathParams = (api.path.match(/\{([^}]+)\}/g) || []).map((seg) => {
    const name = seg.slice(1, -1);
    return {
      name,
      type: "string",
      required: true,
      description: `路径参数 · 目标资源的唯一标识。`,
      in: "path",
    };
  });

  // 2. 查询 / 请求体参数
  let extraParams = [];
  if (api.method === "GET") {
    extraParams = (QUERY_BY_API[api.apiId] || (LIST_APIS.has(api.apiId) ? PAGE_PARAMS : [])).map(
      (item) => ({ ...item, in: "query" })
    );
  } else if (api.method === "POST" || api.method === "PUT") {
    extraParams = (BODY_BY_API[api.apiId] || []).map((item) => ({ ...item, in: "body" }));
  }
  return [...pathParams, ...extraParams];
}

// ── 响应示例（统一信封结构）──
export function getResponseSample(api) {
  let data;
  if (api.apiId === "analytics-reports") {
    data = { task_id: "task_77210934", status: "PENDING", poll_after: 30 };
  } else if (LIST_APIS.has(api.apiId)) {
    const obj = SAMPLE_OBJECTS[api.group];
    data = { list: [obj, { ...obj }], total: 87, page: 1, page_size: 20 };
  } else {
    data = SAMPLE_OBJECTS[api.group];
  }
  return JSON.stringify(
    { code: 0, message: "ok", data, trace_id: "9f2c-4a71-bd3e" },
    null,
    2
  );
}

// ── curl 请求生成 ──
export function buildCurl(api, version) {
  const base = `https://api.opencloud.example.com/${version}`;
  const lines = [`curl -X ${api.method} '${base}${api.path}' \\`];
  lines.push("  -H 'Authorization: Bearer <ACCESS_TOKEN>' \\");
  if (api.method === "POST" || api.method === "PUT") {
    lines.push("  -H 'Content-Type: application/json' \\");
    lines.push("  -d '{ ...请求参数 }' \\");
  }
  if (api.requiresHmac) {
    lines.push("  -H 'X-OC-Signature: <HMAC_SHA256_SIGNATURE>' \\");
  }
  const last = lines.pop();
  lines.push(last.replace(/ \\$/, ""));
  return lines.join("\n");
}

// ── 模拟调试响应：约 15% 概率返回错误，用于演示错误处理 ──
export function simulateDebugResponse(api) {
  const durationMs = 120 + Math.floor(Math.random() * 340);
  const requestId = `req_${Math.random().toString(16).slice(2, 10)}`;
  const roll = Math.random();

  if (roll < 0.08) {
    return {
      ok: false,
      httpStatus: 429,
      code: "42901",
      message: "触发频率限制",
      durationMs,
      requestId,
      headers: { "X-RateLimit-Reset": "3", "X-RateLimit-Remaining": "0" },
      body: JSON.stringify(
        { code: 42901, message: "触发频率限制", trace_id: "7a1d-c208-e5f3" },
        null,
        2
      ),
    };
  }
  if (roll < 0.16) {
    return {
      ok: false,
      httpStatus: 401,
      code: "40102",
      message: "访问令牌已过期",
      durationMs,
      requestId,
      headers: { "WWW-Authenticate": "Bearer realm=\"opencloud\"" },
      body: JSON.stringify(
        { code: 40102, message: "访问令牌已过期", details: ["access_token expired at 2026-10-29T09:00:00Z"], trace_id: "b92e-31aa-77c4" },
        null,
        2
      ),
    };
  }
  return {
    ok: true,
    httpStatus: 200,
    code: "0",
    message: "ok",
    durationMs,
    requestId,
    headers: { "X-RateLimit-Remaining": "99" },
    body: getResponseSample(api),
  };
}
