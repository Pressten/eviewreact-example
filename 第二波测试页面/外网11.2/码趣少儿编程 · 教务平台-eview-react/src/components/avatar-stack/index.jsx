import { userMap } from "../../mock/drive.js";
import "./index.css";

// 头像组（H5 实现，Avatar 组件被禁用）
// mode: "stack" 叠加头像组 | "single" 单个头像
export default function AvatarStack({ userIds = [], max = 5, size = 28, mode = "stack" }) {
  if (!userIds.length) return null;
  const shown = userIds.slice(0, max);
  const extra = userIds.length - shown.length;

  if (mode === "single") {
    const u = userMap[userIds[0]];
    if (!u) return null;
    return (
      <span
        className={`avatar-circle av-${u.color}`}
        style={{ width: size + "px", height: size + "px" }}
        title={u.name}
      >
        {u.initials}
      </span>
    );
  }

  return (
    <span className="avatar-stack">
      {shown.map((id, i) => {
        const u = userMap[id];
        if (!u) return null;
        return (
          <span
            key={id}
            className={`avatar-circle av-${u.color}`}
            style={{
              width: size + "px",
              height: size + "px",
              marginInlineStart: i === 0 ? 0 : -size / 3 + "px",
              zIndex: shown.length - i,
            }}
            title={u.name}
          >
            {u.initials}
          </span>
        );
      })}
      {extra > 0 && (
        <span
          className="avatar-circle avatar-more"
          style={{
            width: size + "px",
            height: size + "px",
            marginInlineStart: -size / 3 + "px",
          }}
        >
          +{extra}
        </span>
      )}
    </span>
  );
}
