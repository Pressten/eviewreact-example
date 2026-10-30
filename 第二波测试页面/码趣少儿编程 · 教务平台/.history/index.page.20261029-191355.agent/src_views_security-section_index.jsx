import { useState } from "react";
import { Switch, Input, Tooltip, Popover, Modal, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import IpInput from "../../../assets/shared/ip-input.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import SettingRow from "../../components/setting-row/index.jsx";
import "./index.css";

const IP_RE =
  /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

function genKey() {
  return (
    "ak_live_" +
    Math.random().toString(16).slice(2, 18) +
    Math.random().toString(16).slice(2, 18)
  );
}

// Layer 4: 安全与接入组
// API 密钥（脱敏+显隐+重新生成二次确认+Tooltip）、IP 白名单（IpInput 校验）、
// Webhook（Popover 回调规范）+ 失败重试开关。
export default function SecuritySection({ settings, update }) {
  const [showKey, setShowKey] = useState(false);
  const [regenOpen, setRegenOpen] = useState(false);
  const [newIp, setNewIp] = useState("");
  const [newIpError, setNewIpError] = useState("");

  const maskedKey = "ak_live_" + "•".repeat(24);
  const displayKey = showKey ? settings.apiKey : maskedKey;

  const handleAddIp = () => {
    const ip = newIp.trim();
    if (!ip) {
      setNewIpError("请输入 IP 地址");
      return;
    }
    if (!IP_RE.test(ip)) {
      setNewIpError("IP 格式非法，请输入合法的 IPv4 地址");
      return;
    }
    if (settings.ipWhitelist.includes(ip)) {
      setNewIpError("该 IP 已在白名单中");
      return;
    }
    update({ ipWhitelist: [...settings.ipWhitelist, ip] });
    setNewIp("");
    setNewIpError("");
    message.success(`已添加白名单 IP：${ip}`);
  };

  const handleDeleteIp = (idx) => {
    const removed = settings.ipWhitelist[idx];
    const next = settings.ipWhitelist.filter((_, i) => i !== idx);
    update({ ipWhitelist: next });
    message.info(`已移除白名单 IP：${removed}`);
  };

  const handleRegenConfirm = () => {
    update({ apiKey: genKey() });
    setRegenOpen(false);
    message.warning("旧密钥已立即失效，请妥善保管新生成的密钥");
  };

  const webhookSpec = (
    <div className="popover-spec">
      <p className="popover-spec__title">Webhook 回调规范</p>
      <ul>
        <li>需为可公网访问的 HTTPS 地址。</li>
        <li>平台以 POST application/json 推送事件体。</li>
        <li>需在 5 秒内返回 2xx 状态码视为成功。</li>
        <li>请求头携带 X-Signature 签名，建议校验以防伪造。</li>
      </ul>
    </div>
  );

  return (
    <SectionCard
      id="sec-security"
      icon="shield-check"
      title="安全与接入"
      description="管理 API 密钥、IP 白名单与 Webhook 回调，保障接入链路安全。"
    >
      {/* API 密钥 */}
      <div className="setting-row setting-row--apikey">
        <div className="setting-row__info">
          <div className="apikey-label">
            <label className="setting-row__label">API 密钥</label>
            <Tooltip title="用于服务端调用平台 API 的身份凭证。请妥善保管，切勿提交至代码仓库或日志中；密钥泄露将导致资源被盗用，需立即重新生成。">
              <span className="help-icon">
                <Icon name="circle-question-mark" size="0.875rem" />
              </span>
            </Tooltip>
          </div>
          <p className="setting-row__desc">
            用于服务端鉴权的长效凭证，泄露后请立即重新生成。
          </p>
        </div>
        <div className="apikey-control">
          <code className="apikey-box">{displayKey}</code>
          <span
            className="icon-action"
            title={showKey ? "隐藏密钥" : "显示密钥"}
            onClick={() => setShowKey((s) => !s)}
          >
            <Icon name={showKey ? "eye-off" : "eye"} size="0.875rem" />
          </span>
          <a className="link-action" onClick={() => setRegenOpen(true)} title="重新生成密钥">
            <Icon name="rotate-cw" size="0.875rem" />
            <span>重新生成</span>
          </a>
        </div>
      </div>

      {/* IP 白名单 */}
      <div className="setting-row setting-row--ipwhitelist">
        <div className="setting-row__info">
          <label className="setting-row__label">IP 白名单</label>
          <p className="setting-row__desc">
            仅允许白名单内 IP 调用本账户 API，最多 20 条。删除即时生效（保存后持久化）。
          </p>
          <ul className="ip-list">
            {settings.ipWhitelist.map((ip, idx) => (
              <li className="ip-item" key={idx}>
                <span className="ip-item__addr">{ip}</span>
                <span
                  className="icon-action icon-action--danger"
                  title="移除该 IP"
                  onClick={() => handleDeleteIp(idx)}
                >
                  <Icon name="trash-2" size="0.875rem" />
                </span>
              </li>
            ))}
          </ul>
          <div className="form-field ip-add">
            <IpInput
              type="ipv4"
              value={newIp}
              onChange={setNewIp}
              status={newIpError ? "error" : undefined}
            />
            <a className="link-action" onClick={handleAddIp} title="添加到白名单">
              <Icon name="plus" size="0.875rem" />
              <span>添加</span>
            </a>
            {newIpError && <div className="form-error form-error--left">{newIpError}</div>}
          </div>
        </div>
      </div>

      {/* Webhook 地址 */}
      <div className="setting-row">
        <div className="setting-row__info">
          <div className="apikey-label">
            <label className="setting-row__label">Webhook 地址</label>
            <Popover trigger="hover" placement="top" content={webhookSpec}>
              <span className="help-icon">
                <Icon name="info" size="0.875rem" />
              </span>
            </Popover>
          </div>
          <p className="setting-row__desc">事件回调推送地址，悬浮图标查看回调规范。</p>
        </div>
        <Input
          style={{ width: "22rem" }}
          value={settings.webhookUrl}
          placeholder="https://your-host.com/webhooks/event"
          onChange={(e) => update({ webhookUrl: e.target.value })}
        />
      </div>

      <SettingRow
        label="失败重试"
        description="Webhook 推送失败时，按指数退避策略自动重试最多 5 次。"
        status={settings.webhookRetry ? "已开启" : "已关闭"}
        statusOn={settings.webhookRetry}
        control={
          <Switch
            checked={settings.webhookRetry}
            onChange={(v) => update({ webhookRetry: v })}
          />
        }
      />

      <Modal
        open={regenOpen}
        title="重新生成 API 密钥"
        okText="确认重新生成"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        onOk={handleRegenConfirm}
        onCancel={() => setRegenOpen(false)}
      >
        <p className="regen-warn">
          重新生成后，<strong>旧密钥将立即失效</strong>，所有使用旧密钥的服务将无法调用 API。
          请在确认前同步更新相关服务的凭证配置。
        </p>
      </Modal>
    </SectionCard>
  );
}
