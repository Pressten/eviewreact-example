import {Icon} from '../../../public/shared/icon.jsx';
import './index.css';

// 状态图标一律走 Lucide（Icon.md：绝不手写 SVG path）；
// 颜色由 ICT 语义 token 经 currentColor 注入描边。
export default function ReportStatusIcon({failed = false}) {
  return <Icon className="report-status-icon" name={failed ? 'circle-x' : 'circle-check-big'}
    size="1.25rem" style={{color: failed ? 'var(--icon-error)' : 'var(--icon-success)'}}/>;
}
