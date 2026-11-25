import {Input} from 'antd';
import {Icon} from '../../../public/shared/icon.jsx';

export default function ReportSearchField({className, ariaLabel, placeholder, size, value, onChange, onSubmit}) {
  return <Input className={className} aria-label={ariaLabel} placeholder={placeholder} size={size} value={value}
    allowClear onChange={event => onChange(event.target.value)} onPressEnter={onSubmit}
    suffix={<Icon className="report-search-icon" name="search" size="0.875rem"/>}/>;
}
