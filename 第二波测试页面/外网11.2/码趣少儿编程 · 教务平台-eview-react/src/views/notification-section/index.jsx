import Toggle from "@nce/eview-react/Toggle";
import TimePicker from "@/shared/TimePicker";
import SectionCard from "../../components/section-card/index.jsx";
import SettingRow from "../../components/setting-row/index.jsx";
import "./index.css";

const timeStrToArray = (s) => (s ? s.split(":").map(Number) : []);
const timeArrayToStr = (t) => {
  if (!Array.isArray(t) || t.length < 2) return "00:00";
  return String(t[0]).padStart(2, "0") + ":" + String(t[1]).padStart(2, "0");
};

// Layer 4: 通知偏好组
// 开关切换即时回显状态文案；免打扰时段逻辑校验（止晚于起）。
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
              style={{ width: "7rem" }}
              onChange={(t) => update({ dndStart: timeArrayToStr(t) })}
            />
            <span className="dnd-sep">至</span>
            <TimePicker
              time={timeStrToArray(settings.dndEnd)}
              format="hh:mm"
              style={{ width: "7rem" }}
              onChange={(t) => update({ dndEnd: timeArrayToStr(t) })}
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
          <Switch
            checked={settings.sensitiveVerify}
            onChange={(v) => update({ sensitiveVerify: v })}
          />
        }
      />
    </SectionCard>
  );
}
