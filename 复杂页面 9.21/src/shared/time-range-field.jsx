// TODO(eview-react): 建议替换为 TimeRangeSelector / TimePicker.RangePicker，本 Skill 暂无其规格。
// eview-react DatePicker 的 range 模式仅支持 date / datetime（无纯时:分范围选择器），
// 此处用两个原生 <input type="time"> 手写最小可用版，暴露 value / onChange 以便 Form.Item 托管。
import './time-range-field.css';

export default function TimeRangeField({ value, onChange, placeholderStart = '00:00', placeholderEnd = '23:59' }) {
  const arr = Array.isArray(value) ? value : ['', ''];
  const start = arr[0] || '';
  const end = arr[1] || '';

  const handleStart = (e) => {
    if (onChange) onChange([e.target.value, end]);
  };
  const handleEnd = (e) => {
    if (onChange) onChange([start, e.target.value]);
  };

  return (
    <div className="time-range-field">
      <input
        type="time"
        className="time-range-field__input"
        value={start}
        placeholder={placeholderStart}
        onChange={handleStart}
      />
      <span className="time-range-field__sep" aria-hidden="true">—</span>
      <input
        type="time"
        className="time-range-field__input"
        value={end}
        placeholder={placeholderEnd}
        onChange={handleEnd}
      />
    </div>
  );
}
