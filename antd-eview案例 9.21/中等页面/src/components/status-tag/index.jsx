import Icon from '../../shared/icons.jsx';

// Layer 3: 通用状态标签 — 统一全站状态语义（表内状态列、统计卡、血缘层级）
const STATUS_MAP = {
  normal: { text: "正常", tone: "success", icon: "circle-check" },
  warning: { text: "预警", tone: "critical", icon: "triangle-alert" },
  error: { text: "异常", tone: "error", icon: "circle-x" },
  audit: { text: "待审核", tone: "warning", icon: "clock" },
  offline: { text: "已下线", tone: "neutral", icon: "circle-slash" },
  success: { text: "成功", tone: "success", icon: "circle-check" },
  failed: { text: "失败", tone: "error", icon: "circle-x" },
  skipped: { text: "已跳过", tone: "neutral", icon: "circle-slash" },
  上游: { text: "上游", tone: "info", icon: "arrow-left" },
  当前: { text: "当前", tone: "brand", icon: "circle-dot" },
  下游: { text: "下游", tone: "violet", icon: "arrow-right" },
};

function StatusTag({ status, text, showIcon = true }) {
  const meta = STATUS_MAP[status] || { text: status, tone: "neutral", icon: "circle-dot" };
  return (
    <span className={`status-tag status-tag--${meta.tone}`}>
      {showIcon ? <Icon name={meta.icon} size={12} /> : null}
      <span>{text || meta.text}</span>
    </span>
  );
}

export default StatusTag;
