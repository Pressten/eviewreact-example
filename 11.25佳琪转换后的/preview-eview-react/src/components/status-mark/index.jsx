import Tag from '@/shared/Tag';
import { IconPlusIcIctX, IconPlusIcPublicCheckmark } from '@hui/icon-plus';
import './index.css';

export default function StatusMark({failed,unknown=false,showIcon=true,children}) {
  const icon = unknown || !showIcon ? undefined :
    failed ? <IconPlusIcIctX iconSize="0.75rem" iconColor={['currentcolor']} className="report-status-mark-icon" /> : <IconPlusIcPublicCheckmark iconSize="0.75rem" iconColor={['currentcolor']} className="report-status-mark-icon" />;
  return <span className="report-status">
    <Tag color={unknown ? 'default' : failed ? 'error' : 'success'}>{icon}{children}</Tag>
  </span>;
}
