// Layer 2: 更新日志 — Timeline 数据（版本发布 / 变更类型 / 变更条目）

// tag 类型：新增(feat) / 优化(opt) / 修复(fix) / 安全(sec) / 下线公告(dep)
export const CHANGELOG = [
  {
    version: "v3.0.0-beta.2",
    date: "2026-10-21",
    highlight: "预览通道",
    entries: [
      { tag: "新增", type: "feat", text: "新增「生成分析报表」接口 GET /analytics/reports，支持异步任务轮询。" },
      { tag: "优化", type: "opt", text: "经营总览接口新增 conversion_rate 指标字段。" },
    ],
  },
  {
    version: "v3.0.0-beta.1",
    date: "2026-10-12",
    highlight: "预览通道",
    entries: [
      { tag: "新增", type: "feat", text: "v3 预览通道开放，新增「获取经营总览」接口 GET /analytics/overview。" },
      { tag: "下线公告", type: "dep", text: "「取消订单」「申请退款」两个接口在 v3 中已正式下线，由订单状态字段与退款工作流替代。" },
    ],
  },
  {
    version: "v2.4.1",
    date: "2026-10-12",
    highlight: "生产推荐",
    entries: [
      { tag: "安全", type: "sec", text: "HMAC 签名时间戳容差从 10 分钟收紧至 5 分钟，请校验服务端时钟。" },
      { tag: "优化", type: "opt", text: "令牌刷新接口支持并发排队，滑动窗口内旧令牌仍然有效。" },
    ],
  },
  {
    version: "v2.4.0",
    date: "2026-09-18",
    entries: [
      { tag: "优化", type: "opt", text: "「查询支付结果」接口新增 60 秒边缘缓存，降低穿透配额消耗。" },
      { tag: "新增", type: "feat", text: "支付渠道枚举新增 ALIPAY。" },
    ],
  },
  {
    version: "v2.3.2",
    date: "2026-08-30",
    entries: [
      { tag: "修复", type: "fix", text: "修复「查询用户列表」在 status 过滤参数与分页参数同时使用时 total 计数错误的问题。" },
    ],
  },
  {
    version: "v2.3.0",
    date: "2026-07-15",
    entries: [
      { tag: "新增", type: "feat", text: "新增「查询事件推送记录」接口 GET /webhooks/{webhook_id}/deliveries。" },
      { tag: "优化", type: "opt", text: "事件推送重试策略支持自定义 backoff 间隔。" },
    ],
  },
  {
    version: "v2.2.0",
    date: "2026-05-20",
    entries: [
      { tag: "下线公告", type: "dep", text: "公告「取消订单」「申请退款」接口将于 2026-12-31 停止服务，请提前迁移。" },
      { tag: "安全", type: "sec", text: "App Secret 重置后旧密钥有效期由 48 小时缩短至 24 小时。" },
    ],
  },
  {
    version: "v1.9.3",
    date: "2025-06-30",
    entries: [
      { tag: "下线公告", type: "dep", text: "v1 版本进入只读存档，停止维护。" },
    ],
  },
];

// 顶部公告弹窗内容（v2.4.1 更新公告）
export const ANNOUNCEMENT = {
  version: "v2.4.1",
  date: "2026-10-12",
  entries: [
    { tag: "安全", type: "sec", text: "HMAC 签名时间戳容差收紧至 5 分钟，请校验服务端时钟偏差。" },
    { tag: "优化", type: "opt", text: "令牌刷新接口支持并发排队，滑动窗口内旧令牌仍然有效。" },
    { tag: "新增", type: "feat", text: "v3 预览通道已开放，包含 2 个数据分析实验性接口，可在版本切换中查看。" },
    { tag: "下线公告", type: "dep", text: "「取消订单」「申请退款」接口将于 2026-12-31 停止服务。" },
  ],
};
