import { useState, useRef } from "react";
import "./index.css";

// 自定义 IP 输入组件 — 4 段 0~255 的 IPv4 输入
// size: "large" | "middle" | "small",对齐 antd 控件三档尺寸
export default function IpInput({ size = "middle", onChange }) {
  const [octets, setOctets] = useState(["192", "168", "1", ""]);
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const sanitize = (raw) => raw.replace(/[^\d]/g, "").slice(0, 3);

  const clamp = (raw) => {
    if (raw === "") return "";
    let n = parseInt(raw, 10);
    if (isNaN(n)) return "";
    if (n < 0) n = 0;
    if (n > 255) n = 255;
    return String(n);
  };

  const update = (i, value) => {
    const next = [...octets];
    next[i] = value;
    setOctets(next);
    if (onChange) onChange(next.join("."));
  };

  const handleChange = (i, e) => {
    update(i, sanitize(e.target.value));
  };

  const handleBlur = (i, e) => {
    update(i, clamp(e.target.value));
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "." && octets[i] !== "" && i < 3) {
      e.preventDefault();
      refs[i + 1].current.focus();
      return;
    }
    if (e.key === "Backspace" && octets[i] === "" && i > 0) {
      refs[i - 1].current.focus();
    }
  };

  return (
    <div className={`ip-input ip-input-${size}`} role="group" aria-label="IPv4 地址输入">
      {octets.map((val, i) => (
        <div className="ip-input-cell" key={i}>
          <input
            ref={(el) => { refs[i].current = el; }}
            className="ip-input-seg"
            value={val}
            onChange={(e) => handleChange(i, e)}
            onBlur={(e) => handleBlur(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={3}
            aria-label={`第${["一", "二", "三", "四"][i]}段`}
          />
          {i < 3 && <span className="ip-input-dot">.</span>}
        </div>
      ))}
    </div>
  );
}
