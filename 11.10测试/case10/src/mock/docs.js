// Layer 2: 文档内容 — 认证术语 / 快速开始步骤 / 基础信息
// 代码示例中的 {V} 为版本占位符，渲染时替换为当前版本号。

// ── 密钥示例值（沙箱环境演示数据）──
export const DEMO_CREDENTIALS = {
  appKey: "AKID-7f3kQm2vX9tR4bN8",
  appSecret: "sk_live_9x2mBc7wQe5rT1yU8nZ3",
  appSecretMasked: "sk_live_••••••••••••••••",
};

// ── 认证方式：关键名词（悬浮 Tooltip 解释）──
export const GLOSSARY = [
  {
    term: "Bearer Token",
    brief: "OAuth 2.0 标准的访问令牌类型",
    tip: "RFC 6750 定义的令牌类型：请求时置于 Authorization: Bearer <token> 头中，服务端校验通过后放行。开放平台令牌默认有效期 7200 秒，过期后使用 refresh_token 调用刷新接口换取新令牌。",
  },
  {
    term: "Rate Limit",
    brief: "按应用维度的调用频率限制",
    tip: "默认配额为每应用 100 次/秒，超出后返回错误码 42901。请依据响应头 X-RateLimit-Reset 的等待时间退避重试；生产用量可在控制台申请提升配额。",
  },
  {
    term: "HMAC 签名",
    brief: "敏感接口的防篡改请求签名",
    tip: "使用 App Secret 对请求体与时间戳计算 HMAC-SHA256，置于 X-OC-Signature 请求头。支付、回调等敏感接口强制要求；时间戳偏差大于 5 分钟将被拒绝（40304）。",
  },
];

// ── 快速开始：4 步折叠面板内容 ──
export const QUICKSTART_STEPS = [
  {
    title: "创建应用并获取密钥",
    duration: "约 2 分钟",
    intro:
      "登录开放平台控制台，进入「应用管理 → 创建应用」，填写应用名称与回调地址后即可获得密钥对。App Secret 仅在创建成功时展示一次，请立即妥善保存。",
    lang: "text",
    code: [
      "App Key     AKID-7f3kQm2vX9tR4bN8",
      "App Secret  sk_live_9x2m...（仅展示一次，请立即保存）",
    ].join("\n"),
    note: "沙箱环境与生产环境使用不同的密钥对，本页示例均为沙箱环境。",
  },
  {
    title: "获取访问令牌",
    duration: "约 3 分钟",
    intro:
      "调用令牌接口，以 App Key 与 App Secret 换取访问令牌。返回体包含 access_token、refresh_token 与有效期 expires_in（秒）。",
    lang: "bash",
    code: [
      "curl -X POST 'https://api.opencloud.example.com/v{V}/auth/tokens' \\",
      "  -H 'Content-Type: application/json' \\",
      "  -d '{",
      "    \"app_key\": \"AKID-7f3kQm2vX9tR4bN8\",",
      "    \"app_secret\": \"sk_live_9x2m...\"",
      "  }'",
    ].join("\n"),
    note: "请勿在浏览器或客户端代码中保存 App Secret，令牌获取必须发生在服务端。",
  },
  {
    title: "调用第一个接口",
    duration: "约 3 分钟",
    intro: "将访问令牌放入 Authorization 请求头，即可调用业务接口。以下示例查询订单列表：",
    lang: "bash",
    code: [
      "curl 'https://api.opencloud.example.com/v{V}/orders?page_size=10' \\",
      "  -H 'Authorization: Bearer <ACCESS_TOKEN>'",
    ].join("\n"),
    note: "令牌过期（40102）时使用 refresh_token 刷新即可，无需重新走密钥流程。",
  },
  {
    title: "处理响应与错误",
    duration: "约 5 分钟",
    intro:
      "所有接口返回统一信封结构：code 为 0 表示成功，非 0 对应「错误码」表中的定义；data 为业务数据，trace_id 用于问题排查。",
    lang: "json",
    code: [
      "{",
      "  \"code\": 0,",
      "  \"message\": \"ok\",",
      "  \"data\": {",
      "    \"order_id\": \"20260921000142\",",
      "    \"status\": \"PAID\",",
      "    \"amount\": 12900",
      "  },",
      "  \"trace_id\": \"9f2c-4a71-bd3e\"",
      "}",
    ].join("\n"),
    note: "建议对 42901 / 50001 实现指数退避重试，最大重试 3 次。",
  },
];

// ── 概述：基础信息（value 含 {V} 占位符的随版本变化）──
export const BASE_INFO = [
  { label: "Base URL", value: "https://api.opencloud.example.com/v{V}", mono: true },
  { label: "传输协议", value: "HTTPS（TLS 1.2+）" },
  { label: "数据格式", value: "JSON（UTF-8）" },
  { label: "默认限流", value: "100 次/秒 · 应用维度" },
  { label: "时间格式", value: "ISO 8601（UTC+8）" },
  { label: "签名算法", value: "HMAC-SHA256（敏感接口）" },
];

// ── 多语言 SDK 示例（快速开始 · 调用第一个接口）──
export const SDK_SAMPLES = [
  {
    key: "curl",
    label: "curl",
    lang: "bash",
    code: [
      "curl 'https://api.opencloud.example.com/v{V}/orders?page_size=10' \\",
      "  -H 'Authorization: Bearer <ACCESS_TOKEN>'",
    ].join("\n"),
  },
  {
    key: "node",
    label: "Node.js",
    lang: "javascript",
    code: [
      "const res = await fetch(",
      "  'https://api.opencloud.example.com/v{V}/orders?page_size=10',",
      "  { headers: { Authorization: 'Bearer <ACCESS_TOKEN>' } },",
      ");",
      "const { data } = await res.json();",
      "console.log(data.total, data.list);",
    ].join("\n"),
  },
  {
    key: "python",
    label: "Python",
    lang: "python",
    code: [
      "import requests",
      "",
      "resp = requests.get(",
      "    'https://api.opencloud.example.com/v{V}/orders',",
      "    params={'page_size': 10},",
      "    headers={'Authorization': 'Bearer <ACCESS_TOKEN>'},",
      ")",
      "data = resp.json()['data']",
      "print(data['total'], len(data['list']))",
    ].join("\n"),
  },
  {
    key: "go",
    label: "Go",
    lang: "go",
    code: [
      "req, _ := http.NewRequest(\"GET\",",
      "    \"https://api.opencloud.example.com/v{V}/orders?page_size=10\", nil)",
      "req.Header.Set(\"Authorization\", \"Bearer <ACCESS_TOKEN>\")",
      "",
      "resp, err := http.DefaultClient.Do(req)",
      "if err != nil {",
      "    log.Fatal(err)",
      "}",
      "defer resp.Body.Close()",
    ].join("\n"),
  },
];
