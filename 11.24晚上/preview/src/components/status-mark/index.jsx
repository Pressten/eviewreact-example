import {Tag} from 'antd';
import {Icon} from '../../../public/shared/icon.jsx';
import './index.css';

export default function StatusMark({failed,unknown=false,showIcon=true,children}) {
  const icon = unknown || !showIcon ? undefined :
    <Icon className="report-status-mark-icon" name={failed ? 'circle-x' : 'circle-check'} size="0.75rem"/>;
  return <span className="report-status">
    <Tag color={unknown ? 'default' : failed ? 'error' : 'success'} icon={icon}>{children}</Tag>
  </span>;
}
