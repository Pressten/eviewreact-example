// 头像 — 使用 assets/uploads 下的 SVG 头像图片(按 person.id 命名)
export default function OwnerAvatar({ person, size = "2rem", showRing = false }) {
  if (!person) return null;
  const dim = typeof size === "number" ? `${size / 16}rem` : size;
  return (
    <img
      className={`own-av ${showRing ? "own-av--ring" : ""}`}
      src={`/uploads/avatar-${person.id}.svg`}
      alt={person.name}
      style={{ width: dim, height: dim, color: person.color }}
      title={person.name}
    />
  );
}
