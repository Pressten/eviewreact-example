// Layer 2: 开发者设置页默认值（语义化字段）
// 初始「已保存快照」= DEFAULT_SETTINGS，故页面初始无未保存更改。

export const THEME_PRESETS = [
  "#0067D1", // 平台蓝（默认）
  "#09AA71", // 成功绿
  "#715AFB", // 访问紫
  "#F4840C", // 告警橙
  "#E02128", // 错误红
  "#0EA5E9", // 天青
  "#10B981", // 翠绿
  "#6366F1", // 靛青
];

export const DEFAULT_SETTINGS = {
  // 通知偏好
  emailNotify: true, // 邮件通知
  buildFailAlert: true, // 构建失败提醒
  securityAlert: true, // 安全告警
  dndStart: "14:00", // 免打扰开始（HH:mm）
  dndEnd: "22:00", // 免打扰结束（HH:mm，需晚于开始）
  sensitiveVerify: true, // 敏感操作二次验证

  // 外观
  uiZoom: 100, // 界面缩放 80-120
  themeColor: "#0067D1", // 主题色
  editorFontSize: "medium", // 编辑器字号 small / medium / large

  // 安全与接入
  apiKey: "ak_live_8f3d2c1b9a7e6f4d2a5b6c7d", // API 密钥
  ipWhitelist: ["192.168.1.100", "10.0.0.55", "172.16.254.1"], // IP 白名单
  webhookUrl: "https://api.dev-platform.com/webhooks/deploy-notify", // Webhook 地址
  webhookRetry: true, // 失败重试

  // API 偏好
  dataFormat: "json", // 默认数据格式 json / xml
  pageSize: 20, // 默认分页大小 10 / 20 / 50
  sandbox: false, // 沙箱环境
};

// 深拷贝默认值，避免引用污染
export function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}
