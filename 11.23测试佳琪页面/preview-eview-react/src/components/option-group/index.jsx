import {useId} from 'react';
import SelectCard from '@nce/eview-react/SelectCard';

export default function OptionGroup({options,value,onChange,ariaLabel}) {
  const name = useId();
  const segments = options.map(([id, label, count]) => ({
    value: id,
    text: <span className="report-status-option" data-value={id}>
      {id !== 'all' && <i className={id} aria-hidden="true"/>}
      <span>{label}</span>
      <strong>{count}</strong>
    </span>,
  }));
  return <SelectCard className="report-status-filters" name={name} role="radiogroup"
    aria-label={ariaLabel} value={value} onChange={onChange} data={segments}/>;
}
