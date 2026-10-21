import { useState } from "react";
import { IconPlusIcPublicMinus, IconPlusIcPublicPlus } from '@hui/icon-plus';
import TextField from "@/shared/TextField";
import "./index.css";

export default function DynamicInputRow({
  initialValues = [],
  placeholder = "",
  width = "17.5rem",
  onChange,
  label,
}) {
  const [values, setValues] = useState(
    initialValues.length > 0 ? [...initialValues] : [""]
  );

  const emit = (next) => {
    if (onChange) onChange(next);
  };
  const addRow = () => {
    const next = [...values, ""];
    setValues(next);
    emit(next);
  };
  const removeRow = (idx) => {
    if (values.length <= 1) return;
    const next = values.filter((_, i) => i !== idx);
    setValues(next);
    emit(next);
  };
  const updateRow = (idx, val) => {
    const next = values.map((x, i) => (i === idx ? val : x));
    setValues(next);
    emit(next);
  };

  return (
    <div className="esn-row">
      {label}
      {values.map((val, idx) => (
        <div className="esn-input-group" key={idx}>
          <TextField
            value={val}
            onChange={(value) => updateRow(idx, value)}
            placeholder={placeholder}
            style={{ width }}
          />
          <button
            className="btn-icon add"
            title="添加"
            onClick={addRow}
            type="button"
          >
            <IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['var(--on-surface)']} />
          </button>
          <button
            className={
              "btn-icon remove" + (values.length > 1 ? " visible" : "")
            }
            title="删除"
            onClick={() => removeRow(idx)}
            type="button"
          >
            <IconPlusIcPublicMinus iconSize="0.875rem" iconColor={['var(--on-surface)']} />
          </button>
        </div>
      ))}
    </div>
  );
}
