import {useId} from 'react';
import './index.css';

export default function OptionGroup({options, value, onChange, ariaLabel, compact}) {
  const name = useId();

  // 同一组使用原生单选键盘行为。主表和打开的详情各自独立选中。
  return <div className="report-status-filters" data-compact={compact || undefined} role="radiogroup" aria-label={ariaLabel}>
    {options.map(([id, label, count]) =>
      <label key={id} className="report-status-option" data-value={id}>
        <input className="report-status-input" type="radio" name={name} value={id}
          checked={value === id} onChange={() => onChange(id)}/>
        <span className="report-status-content">
          {id !== 'all' && <span className="report-status-dot" aria-hidden="true"/>}
          <span>{label}</span>
          <span className="report-status-count">{count}</span>
        </span>
      </label>
    )}
  </div>;
}
