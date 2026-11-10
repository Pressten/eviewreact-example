// Layer 3: HTTP 方法分色标签（GET/POST/PUT/DELETE）
import "./index.css";

export default function MethodTag({ method, mini = false }) {
  return (
    <span className={`method-tag m-${method.toLowerCase()}${mini ? " method-tag-mini" : ""}`}>
      {method}
    </span>
  );
}
