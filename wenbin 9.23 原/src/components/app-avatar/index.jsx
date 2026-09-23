import "./index.css";

export default function AppAvatar({ text, src, size = 32, style, className = "" }) {
  const dim = { width: `${size}px`, height: `${size}px` };
  if (src) {
    return (
      <img
        className={`app-avatar ${className}`.trim()}
        src={src}
        alt=""
        style={{ ...dim, ...style }}
      />
    );
  }
  return (
    <div
      className={`app-avatar app-avatar-text ${className}`.trim()}
      style={{ ...dim, fontSize: `${Math.round(size * 0.42)}px`, ...style }}
    >
      {text}
    </div>
  );
}
