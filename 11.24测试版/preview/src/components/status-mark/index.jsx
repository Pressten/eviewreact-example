import {Tag} from 'antd';
import {Icon} from '../../../assets/shared/icon.jsx';
import './index.css';

export default function StatusMark({failed,unknown=false,showIcon=true,children}) {
  return <span className="report-status"><Tag color={unknown?'default':failed?'error':'success'} icon={unknown||!showIcon?undefined:<Icon name={failed?'circle-x':'circle-check'} size="0.75rem"/>}>{children}</Tag></span>;
}
