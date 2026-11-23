import Tag from '@/shared/Tag';
import { IconPlusIcPublicCheckmark, IconPlusIcPublicCloseCircle } from '@hui/icon-plus';
import './index.css';

export default function StatusMark({failed,unknown=false,showIcon=true,children}) {
  return <span className="report-status"><Tag color={unknown?'default':failed?'error':'success'}>{unknown||!showIcon?undefined:failed ? <IconPlusIcPublicCloseCircle iconSize="0.75rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicCheckmark iconSize="0.75rem" iconColor={['currentcolor']} />}{children}</Tag></span>;
}
