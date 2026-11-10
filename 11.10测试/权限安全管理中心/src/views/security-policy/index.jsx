import { Slider, InputNumber, Checkbox, Switch, Select, Tag, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { LOGIN_METHODS, PASSWORD_VALIDITY_OPTIONS } from "../../mock/policy.js";
import "./index.css";

export default function SecurityPolicy() {
  const { policy, setPolicyField } = useApp();

  const enabledMethodNames = LOGIN_METHODS.filter((m) => policy.loginMethods.includes(m.methodId)).map(
    (m) => m.methodName
  );

  const toggleMethod = (methodId, checked) => {
    const next = checked
      ? [...policy.loginMethods, methodId]
      : policy.loginMethods.filter((x) => x !== methodId);
    if (next.length === 0) {
      message.warning("至少保留一种登录方式");
      return;
    }
    setPolicyField("loginMethods", next);
  };

  return (
    <section className="pc-card policy-card">
      <div className="section-head">
        <span className="section-icon"><Icon name="lock" size="1.125rem" /></span>
        <div>
          <div className="section-title">安全策略</div>
          <div className="section-sub">密码、会话与登录管控策略，调整后实时预览、统一保存生效</div>
        </div>
      </div>
      <div className="sub-cards">
        <div className="sub-card">
          <div className="sub-title">密码策略</div>
          <div className="sub-block">
            <div className="sub-label">
              密码最小长度
              <span className="sub-value">{policy.minPasswordLength} 位</span>
            </div>
            <Slider
              min={8}
              max={20}
              value={policy.minPasswordLength}
              onChange={(v) => setPolicyField("minPasswordLength", v)}
            />
            <div className="preview-text">
              <Icon name="info" size="0.875rem" className="preview-icon" />
              新密码至少 {policy.minPasswordLength} 位，须包含大小写字母与数字
            </div>
          </div>
          <div className="sub-block">
            <div className="sub-label">密码有效期</div>
            <Select
              value={policy.passwordValidityDays}
              options={PASSWORD_VALIDITY_OPTIONS}
              style={{ width: "9rem" }}
              onChange={(v) => setPolicyField("passwordValidityDays", v)}
            />
            <div className="preview-text">
              <Icon name="info" size="0.875rem" className="preview-icon" />
              每 {policy.passwordValidityDays} 天强制修改密码，到期前 7 天提醒
            </div>
          </div>
        </div>

        <div className="sub-card">
          <div className="sub-title">会话与双因子认证</div>
          <div className="sub-block">
            <div className="sub-label">会话超时</div>
            <div className="control-row">
              <InputNumber
                mode="spinner"
                variant="outlined"
                min={5}
                max={480}
                step={5}
                value={policy.sessionTimeoutMinutes}
                style={{ width: "8rem" }}
                onChange={(v) => {
                  if (v != null) setPolicyField("sessionTimeoutMinutes", v);
                }}
              />
              <span className="unit-text">分钟</span>
            </div>
            <div className="preview-text">
              <Icon name="info" size="0.875rem" className="preview-icon" />
              无操作 {policy.sessionTimeoutMinutes} 分钟后自动退出登录，需重新认证
            </div>
          </div>
          <div className="sub-block">
            <div className="sub-label">
              强制双因子认证
              <Tag className="mfa-tag" color={policy.forceMfa ? "success" : "default"}>
                {policy.forceMfa ? "已开启" : "未开启"}
              </Tag>
            </div>
            <Switch
              checked={policy.forceMfa}
              onChange={(v) => setPolicyField("forceMfa", v)}
            />
            <div className="preview-text">
              <Icon name="info" size="0.875rem" className="preview-icon" />
              {policy.forceMfa
                ? "全部成员登录时需完成短信 / 企业微信二次验证"
                : "未强制要求二次验证，建议敏感角色自行开启"}
            </div>
          </div>
        </div>

        <div className="sub-card">
          <div className="sub-title">允许登录方式</div>
          <div className="login-methods">
            {LOGIN_METHODS.map((m) => (
              <Checkbox
                key={m.methodId}
                checked={policy.loginMethods.includes(m.methodId)}
                onChange={(e) => toggleMethod(m.methodId, e.target.checked)}
              >
                {m.methodName}
              </Checkbox>
            ))}
          </div>
          <div className="preview-text">
            <Icon name="info" size="0.875rem" className="preview-icon" />
            已启用 {enabledMethodNames.length} 种：{enabledMethodNames.join("、") || "无"}
          </div>
        </div>
      </div>
    </section>
  );
}
