import "./index.css";

// Layer 3: H5 表单字段骨架 — label / 必填星号 / 校验文案(绝对定位不占位)
export default function FormField({ label, htmlFor, required, error, layout = "stack", className = "", children }) {
  return (
    <div className={`form-field form-field--${layout} ${className}`}>
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
