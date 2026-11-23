import {useId} from 'react';
import {Segmented} from 'antd';

export default function OptionGroup({options,value,onChange,ariaLabel}) {
  const name = useId();
  const segments = options.map(([id, label, count]) => ({
    value: id,
    label: <span className="report-status-option" data-value={id}>
      {id !== 'all' && <i className={id} aria-hidden="true"/>}
      <span>{label}</span>
      <strong>{count}</strong>
    </span>,
  }));
  return <Segmented className="report-status-filters" name={name} role="radiogroup"
    aria-label={ariaLabel} value={value} onChange={onChange} options={segments}/>;
}
