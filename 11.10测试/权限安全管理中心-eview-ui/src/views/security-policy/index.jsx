import { useRef } from "react";
import DragInput from "@cloudsop/eview-ui/DragInput";
import Spinner from "@cloudsop/eview-ui/Spinner";
import Checkbox from "@cloudsop/eview-ui/Checkbox";
import Toggle from "@cloudsop/eview-ui/Toggle";
import SelectPro from "@cloudsop/eview-ui/SelectPro";
import Tag from "@cloudsop/eview-ui/Tag";
import Icon from "@/shared/Icon";
import Notify from "@/shared/Notify";
import { useApp } from "../../context.jsx";
import { LOGIN_METHODS, PASSWORD_VALIDITY_OPTIONS } from "../../mock/policy.js";
import "./index.css";

// PASSWORD_VALIDITY_OPTIONS 原为 antd Select 的 {value, label}，SelectPro 项需 {value, text}。
const VALIDITY_OPTIONS_EUI = PASSWORD_VALIDITY_OPTIONS.map((o) => ({ value: o.value, text: o.label }));

export default function SecurityPolicy() {
  const { policy, setPolicyField } = useApp();
  const notifyRef = useRef(null);

  const enabledMethodNames = LOGIN_METHODS.filter((m) => policy.loginMethods.includes(m.methodId)).map(
    (m) => m.methodName
  );

  const toggleMethod = (methodId, checked) => {
    const next = checked
      ? [...policy.loginMethods, methodId]
      : policy.loginMethods.filter((x) => x !== methodId);
    if (next.length === 0) {
      // message.warning → DivMessage type="warn"（message.warning 映射 warn）
      notifyRef.current && notifyRef.current.show("warn", "至少保留一种登录方式");
      return;
    }
    setPolicyField("loginMethods", next);
  };

  return (
    <section className="pc-card policy-card">
      <Notify ref={notifyRef} />
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
            {/* Slider→DragInput：value 恒数组；onChange(value, changeValue)；无 disabled */}
            <DragInput
              min={8}
              max={20}
              value={[policy.minPasswordLength]}
              onChange={(value) => setPolicyField("minPasswordLength", Array.isArray(value) ? value[0] : value)}
            />
            <div className="preview-text">
              <Icon name="info" size="0.875rem" className="preview-icon" />
              新密码至少 {policy.minPasswordLength} 位，须包含大小写字母与数字
            </div>
          </div>
          <div className="sub-block">
            <div className="sub-label">密码有效期</div>
            {/* Select→SelectPro：options 项 label→text；onChange(value, options) */}
            <SelectPro
              value={policy.passwordValidityDays}
              options={VALIDITY_OPTIONS_EUI}
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
              {/* InputNumber→Spinner：onChange(value) 仅有效值触发；onError 接无效值；min/max/step 同名 */}
              <Spinner
                min={5}
                max={480}
                step={5}
                value={policy.sessionTimeoutMinutes}
                style={{ width: "8rem" }}
                onChange={(v) => {
                  if (v != null) setPolicyField("sessionTimeoutMinutes", v);
                }}
                onError={(v) => {
                  notifyRef.current && notifyRef.current.show("error", `会话超时须为 ${5}~${480} 之间的有效数字`);
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
              <Tag className="mfa-tag" type="status" color={policy.forceMfa ? "success" : "default"}>
                {policy.forceMfa ? "已开启" : "未开启"}
              </Tag>
            </div>
            {/* Switch→Toggle：checked→toggled；onChange→onToggle(value)；data=[关值, 开值] */}
            <Toggle
              data={["off", "on"]}
              toggled={policy.forceMfa}
              onToggle={(v) => setPolicyField("forceMfa", v === "on")}
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
                value={m.methodId}
                label={m.methodName}
                checked={policy.loginMethods.includes(m.methodId)}
                onChange={(_value, checked) => toggleMethod(m.methodId, checked)}
              />
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
