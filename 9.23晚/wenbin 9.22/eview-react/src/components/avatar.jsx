// TODO(eview-react): Avatar 未覆盖，当前手写圆形占位（文本/图片）。

export default function AppAvatar({ size = 32, src, style, children }) {
  if (src) {
    return (
      <img
        src={src}
        width={size}
        height={size}
        alt=""
        style={{
          borderRadius: "50%",
          objectFit: "cover",
          display: "inline-block",
          verticalAlign: "middle",
          ...style,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
