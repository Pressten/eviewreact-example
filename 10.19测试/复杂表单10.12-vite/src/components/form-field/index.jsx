// Layer 3: 表单字段容器（纯 H5 骨架 + 必填星号 + 校验文案不占位）
import "./index.css";

export default function FormField({
  label,
  required = false,
  htmlFor,
  error,
  span,
  className = "",
  children,
}) {
  const spanCls = span ? ` form-field--span-${span}` : "";
  return (
    <div className={`form-field${spanCls}${className ? " " + className : ""}`}>
      <label className={`form-field__label${required ? " is-required" : ""}`} htmlFor={htmlFor}>
        {label}
      </label>
      <div className="form-field__control">
        {children}
        {error ? <div className="form-field__error">{error}</div> : null}
      </div>
    </div>
  );
}
