import Toggle from "eview-ui/Toggle";
import TimePicker from "eview-ui/TimePicker";
import SectionCard from "../../components/section-card/index.jsx";
import SettingRow from "../../components/setting-row/index.jsx";
import "./index.css";

function timeStrToArray(str) {
  if (!str) return [0, 0, 0];
  const parts = String(str).split(":").map((n) => parseInt(n, 10) || 0);
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}
function timeArrayToStr(arr) {
  if (!Array.isArray(arr)) return "00:00";
  const h = String(arr[0] || 0).padStart(2, "0");
  const m = String(arr[1] || 0).padStart(2, "0");
  const s = String(arr[2] || 0).padStart(2, "0");
  return `${h}:${m}:${s}`.replace(/:00$/, "");
}

export default function NotificationSection({ settings, update, errors }) {
  const dndError = errors.dnd;

  return (
    <SectionCard
      id="sec-notification"
      icon="bell"
      title="通知偏好"
      description="控制平台事件、构建与安全类通知的推送方式与时段。"
    >
      <SettingRow
        label="邮件通知"
        description="接收平台事件、构建结果与系统公告的邮件推送。"
        status={settings.emailNotify ? "已开启" : "已关闭"}
        statusOn={settings.emailNotify}
        control={
          <Toggle
            toggled={settings.emailNotify}
            onToggle={(v) => update({ emailNotify: v })}
          />
        }
      />

      <SettingRow
        label="构建失败提醒"
        description="当流水线构建失败时，立即推送提醒至绑定邮箱与站内信。"
        status={settings.buildFailAlert ? "已开启" : "已关闭"}
        statusOn={settings.buildFailAlert}
        control={
          <Toggle
            toggled={settings.buildFailAlert}
            onToggle={(v) => update({ buildFailAlert: v })}
          />
        }
      />

      <SettingRow
        label="安全告警"
        description="异常登录、密钥使用风险、敏感资源变更等安全事件告警。"
        status={settings.securityAlert ? "已开启" : "已关闭"}
        statusOn={settings.securityAlert}
        control={
          <Toggle
            toggled={settings.securityAlert}
            onToggle={(v) => update({ securityAlert: v })}
          />
        }
      />

      <div className="setting-row setting-row--dnd">
        <div className="setting-row__info">
          <label className="setting-row__label">消息免打扰时段</label>
          <p className="setting-row__desc">
            该时段内暂停所有通知推送，紧急安全告警除外。结束时间须晚于开始时间。
          </p>
        </div>
        <div className="form-field dnd-field">
          <div className="dnd-range">
            <TimePicker
              time={timeStrToArray(settings.dndStart)}
              format="hh:mm"
              placeholder="开始"
              onChange={(t) => update({ dndStart: timeArrayToStr(t).slice(0, 5) })}
              status={dndError ? "error" : undefined}
              style={{ width: "7rem" }}
            />
            <span className="dnd-sep">至</span>
            <TimePicker
              time={timeStrToArray(settings.dndEnd)}
              format="hh:mm"
              placeholder="结束"
              onChange={(t) => update({ dndEnd: timeArrayToStr(t).slice(0, 5) })}
              status={dndError ? "error" : undefined}
              style={{ width: "7rem" }}
            />
          </div>
          {dndError && <div className="form-error">{dndError}</div>}
        </div>
      </div>

      <SettingRow
        label="敏感操作二次验证"
        description="删除资源、重置密钥、修改权限等操作需输入验证码二次确认。"
        status={settings.sensitiveVerify ? "已开启" : "已关闭"}
        statusOn={settings.sensitiveVerify}
        control={
          <Toggle
            toggled={settings.sensitiveVerify}
            onToggle={(v) => update({ sensitiveVerify: v })}
          />
        }
      />
    </SectionCard>
  );
}
