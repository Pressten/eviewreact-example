// Layer 4: 认证方式章节 — 密钥说明（显隐/复制）+ 名词 Tooltip + 请求头示例
import { useState } from "react";
import { Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { GLOSSARY, DEMO_CREDENTIALS } from "../../mock/docs.js";
import CodeBlock from "../../components/code-block/index.jsx";
import "./index.css";

// 密钥行：等宽值 + 复制（+ Secret 支持显隐切换）
function CredentialRow({ label, value, maskedValue, toggleable }) {
  const [visible, setVisible] = useState(!toggleable);
  const [copied, setCopied] = useState(false);

  const currentValue = toggleable && !visible ? maskedValue : value;

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentValue).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="cred-row">
      <span className="cred-label">{label}</span>
      <span className="cred-value">{currentValue}</span>
      <span className="cred-actions">
        {toggleable && (
          <Icon
            name={visible ? "eye-off" : "eye"}
            size="0.875rem"
            title={visible ? "隐藏密钥" : "显示密钥"}
            onClick={() => setVisible((v) => !v)}
            className="cred-action-icon"
          />
        )}
        <Icon
          name={copied ? "circle-check" : "copy"}
          size="0.875rem"
          title={copied ? "已复制" : "复制密钥"}
          onClick={handleCopy}
          className={`cred-action-icon${copied ? " copied" : ""}`}
        />
      </span>
    </div>
  );
}

export default function SectionAuth() {
  const { version } = useApp();

  const headerExample = [
    `POST /v${version}/orders HTTP/1.1`,
    "Host: api.opencloud.example.com",
    "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.exampleToken",
    "Content-Type: application/json",
  ].join("\n");

  return (
    <section id="auth" className="doc-section">
      <div className="section-head">
        <span className="section-no">01</span>
        <h2 className="section-title">认证方式</h2>
      </div>

      <p className="section-lead">
        所有接口均需在请求头携带访问令牌。调用方先使用控制台签发的密钥对换取
        <Tooltip placement="top" title={GLOSSARY[0].tip}>
          <span className="term-inline">Bearer Token</span>
        </Tooltip>
        ，再发起业务请求；单应用调用频率受
        <Tooltip placement="top" title={GLOSSARY[1].tip}>
          <span className="term-inline">Rate Limit</span>
        </Tooltip>
        约束，支付等敏感接口还需附加
        <Tooltip placement="top" title={GLOSSARY[2].tip}>
          <span className="term-inline">HMAC 签名</span>
        </Tooltip>
        。
      </p>

      {/* 密钥说明 */}
      <div className="cred-card">
        <div className="cred-card-head">
          <span className="cred-card-title">密钥说明</span>
          <a className="cred-reset-link">重置密钥</a>
        </div>
        <CredentialRow label="App Key" value={DEMO_CREDENTIALS.appKey} />
        <CredentialRow
          label="App Secret"
          value={DEMO_CREDENTIALS.appSecret}
          maskedValue={DEMO_CREDENTIALS.appSecretMasked}
          toggleable
        />
        <div className="cred-tip">
          <Icon name="triangle-alert" size="0.875rem" className="cred-tip-icon" />
          App Secret 仅可在服务端保存与使用，泄露后请立即重置；重置后旧密钥将于 24 小时内失效。
        </div>
      </div>

      {/* 名词解释 */}
      <div className="glossary-list">
        {GLOSSARY.map((item) => (
          <div className="glossary-row" key={item.term}>
            <Tooltip
              placement="top"
              title={<span className="glossary-tip-text">{item.tip}</span>}
            >
              <span className="term-chip">
                <Icon name="info" size="0.75rem" />
                {item.term}
              </span>
            </Tooltip>
            <span className="glossary-brief">{item.brief}</span>
          </div>
        ))}
      </div>

      <CodeBlock lang="http" code={headerExample} className="auth-code-block" />
    </section>
  );
}
