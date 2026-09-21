// =============================================================================
// [共享组件] StatusTag — 通用状态标签（全局共享，多视图复用）
// 职责：统一全站状态语义（表内状态列、统计卡、血缘层级），按 status key 映射 tone/icon/text。
// 复用方：metric-list / record-detail / lineage-trace 三个视图的状态列与统计。
// 契约（冻结，勿改签名）：
//   props: { status: string, text?: string, showIcon?: boolean=true }
//   status 词表：normal|warning|error|audit|offline|success|failed|skipped|上游|当前|下游
//   tone 词表：success|critical|error|warning|neutral|info|brand|violet
// 图标：@nce/icon-plus 按需引入，禁用内置 Icon name=。
// 样式：私有 index.css，消费 token；class 前缀 status-tag--<tone>。
// =============================================================================
import {
  IconPlusIcPublicCheck,
  IconPlusIcPublicWarning,
  IconPlusIcPublicClose,
  IconPlusIcPublicClock,
  IconPlusIcPublicSlash,
  IconPlusIcPublicArrowLeft,
  IconPlusIcPublicArrowRight,
  IconPlusIcPublicDot,
} from '@nce/icon-plus';
// TODO_CONTRACT: icon+ 组件名（Warning/Close/Clock/Slash/ArrowLeft/Dot）为按命名规则推测，
//   待内网 getIconInfo 核实后替换。Check/ArrowRight 来自 Reference 确认。
import './index.css';

const STATUS_MAP = {
  normal: { text: '正常', tone: 'success', Icon: IconPlusIcPublicCheck },
  warning: { text: '预警', tone: 'critical', Icon: IconPlusIcPublicWarning },
  error: { text: '异常', tone: 'error', Icon: IconPlusIcPublicClose },
  audit: { text: '待审核', tone: 'warning', Icon: IconPlusIcPublicClock },
  offline: { text: '已下线', tone: 'neutral', Icon: IconPlusIcPublicSlash },
  success: { text: '成功', tone: 'success', Icon: IconPlusIcPublicCheck },
  failed: { text: '失败', tone: 'error', Icon: IconPlusIcPublicClose },
  skipped: { text: '已跳过', tone: 'neutral', Icon: IconPlusIcPublicSlash },
  上游: { text: '上游', tone: 'info', Icon: IconPlusIcPublicArrowLeft },
  当前: { text: '当前', tone: 'brand', Icon: IconPlusIcPublicDot },
  下游: { text: '下游', tone: 'violet', Icon: IconPlusIcPublicArrowRight },
};

export default function StatusTag({ status, text, showIcon = true }) {
  const meta = STATUS_MAP[status] || { text: status, tone: 'neutral', Icon: IconPlusIcPublicDot };
  const { Icon } = meta;
  return (
    <span className={`status-tag status-tag--${meta.tone}`}>
      {showIcon && Icon ? <Icon iconColor={['currentColor']} iconSize={12} /> : null}
      <span>{text || meta.text}</span>
    </span>
  );
}
