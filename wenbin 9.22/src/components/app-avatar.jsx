// TODO(eview-react): Avatar 无对应组件，手写圆形头像。
// 支持 src（图片）与 text/children（文字首字母）；用 CSS 变量，不写死色值。
export default function AppAvatar({ text, src, size = 32, style, className = "" }) {
  const dim = { width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.42)}px` };
  if (src) {
    return (
      <img
        className={`app-avatar ${className}`.trim()}
        src={src}
        alt=""
        style={{ ...dim, borderRadius: "50%", objectFit: "cover", ...style }}
      />
    );
  }
  return (
    <div
      className={`app-avatar ${className}`.trim()}
      style={{
        ...dim,
        borderRadius: "50%",
        background: "var(--primary)",
        color: "var(--on-primary)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "var(--font-weight-medium)",
        ...style,
      }}
    >
      {text || ""}
    </div>
  );
}
