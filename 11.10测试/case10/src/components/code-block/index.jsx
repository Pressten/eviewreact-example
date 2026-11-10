// Layer 3: 等宽代码块 — 开发者文档风（语言角标 + 一键复制）
import { useState } from "react";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

export default function CodeBlock({ lang = "bash", code, className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`code-block ${className}`}>
      <div className="code-head">
        <span className="code-lang">{lang}</span>
        <Icon
          name={copied ? "circle-check" : "copy"}
          size="0.875rem"
          title={copied ? "已复制" : "复制代码"}
          onClick={handleCopy}
          className={`code-copy${copied ? " copied" : ""}`}
        />
      </div>
      <pre className="code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
