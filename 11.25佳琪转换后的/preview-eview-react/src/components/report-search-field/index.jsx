import TextField from '@/shared/TextField';
import { IconPlusIcPublicSearch } from '@hui/icon-plus';
export default function ReportSearchField({className, ariaLabel, placeholder, size, value, onChange, onSubmit}) {
  return <TextField className={className} aria-label={ariaLabel} placeholder={placeholder} size={size} value={value}
    onChange={value => onChange(value)} onKeyDown={event=>{if(event.key==='Enter')onSubmit();}}
    suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} className="report-search-icon" />}/>;
}
