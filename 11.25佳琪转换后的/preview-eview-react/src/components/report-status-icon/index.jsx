import { IconPlusIcDigitalPowerDpCheck, IconPlusIcIctX } from '@hui/icon-plus';
import './index.css';

// 状态图标一律走 Lucide（Icon.md：绝不手写 SVG path）；
// 颜色由 ICT 语义 token 经 currentColor 注入描边。
export default function ReportStatusIcon({failed = false}) {
  return failed ? <IconPlusIcIctX iconSize="1.25rem" iconColor={['currentcolor']} className="report-status-icon" style={{color: failed ? 'var(--icon-error)' : 'var(--icon-success)'}} /> : <IconPlusIcDigitalPowerDpCheck iconSize="1.25rem" iconColor={['currentcolor']} className="report-status-icon" style={{color: failed ? 'var(--icon-error)' : 'var(--icon-success)'}} />;
}
