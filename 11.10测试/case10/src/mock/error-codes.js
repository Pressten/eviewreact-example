// Layer 2: 错误码速查表 — 11 条语义化错误码

export const ERROR_CODES = [
  {
    code: "40001",
    http: "400",
    meaning: "参数缺失",
    suggestion: "检查请求中是否遗漏必填字段，缺失字段会列在响应的 details 数组中。",
  },
  {
    code: "40002",
    http: "400",
    meaning: "参数格式错误",
    suggestion: "按接口文档核对字段类型与格式，例如日期需为 ISO 8601 格式。",
  },
  {
    code: "40003",
    http: "400",
    meaning: "请求体不是合法 JSON",
    suggestion: "校验请求体 JSON 语法，并设置 Content-Type: application/json。",
  },
  {
    code: "40101",
    http: "401",
    meaning: "访问令牌无效",
    suggestion: "确认 Authorization 请求头使用 Bearer 方式携带，且令牌属于当前环境。",
  },
  {
    code: "40102",
    http: "401",
    meaning: "访问令牌已过期",
    suggestion: "使用 refresh_token 调用 POST /auth/tokens/refresh 换取新令牌。",
  },
  {
    code: "40301",
    http: "403",
    meaning: "无接口访问权限",
    suggestion: "在控制台的应用详情中申请对应权限点，审批通过后重试。",
  },
  {
    code: "40304",
    http: "403",
    meaning: "HMAC 签名校验失败",
    suggestion: "按签名算法重新计算 X-OC-Signature，注意时间戳偏差需小于 5 分钟。",
  },
  {
    code: "40401",
    http: "404",
    meaning: "资源不存在",
    suggestion: "确认资源 ID 是否正确，以及资源是否属于当前商户。",
  },
  {
    code: "42901",
    http: "429",
    meaning: "触发频率限制",
    suggestion: "按响应头 X-RateLimit-Reset 给出的时间退避重试，或申请提升配额。",
  },
  {
    code: "50001",
    http: "500",
    meaning: "服务内部错误",
    suggestion: "携带响应中的 trace_id 联系技术支持，或以指数退避自动重试。",
  },
  {
    code: "50003",
    http: "504",
    meaning: "下游服务超时",
    suggestion: "等待 5 秒后重试；连续失败请检查网络出口与熔断配置。",
  },
];
