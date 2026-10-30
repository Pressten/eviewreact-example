import Toggle from "@nce/eview-react/Toggle";
import { IconPlusIcPublicTransverseRectangleTemplate } from '@hui/icon-plus';
import TimePicker from "@/shared/TimePicker";
import SectionCard from "../../components/section-card/index.jsx";
import SettingRow from "../../components/setting-row/index.jsx";
import "./index.css";

// "HH:mm" → [hour, minute] 数字数组（eview TimePicker time 输入）
function hhmmToTime(s) {
  if (!s) return [0, 0];
  const [h, m] = s.split(":").map((n) => parseInt(n, 10));
  return [Number.isNaN(h) ? 0 : h, Number.isNaN(m) ? 0 : m];
}

// string[] → "HH:mm"（eview TimePicker onChange 输出）
function timeToHhmm(arr) {
  if (!arr || arr.length < 2) return "00:00";
  const h = String(arr[0]).padStart(2, "0");
  const m = String(arr[1]).padStart(2, "0");
  return `${h}:${m}`;
}

// Layer 4: 通知偏好组
// 开关切换即时回显状态文案；免打扰时段逻辑校验（止晚于起）。
export default function NotificationSection({ settings, update, errors }) {
  const dndError = errors.dnd;

  return (
    <SectionCard
      id="sec-notification"
      icon={<IconPlusIcPublicTransverseRectangleTemplate iconSize="1.25rem" iconColor={['currentcolor']} />}
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
            data={[false, true]}
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
            data={[false, true]}
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
            data={[false, true]}
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
              time={hhmmToTime(settings.dndStart)}
              format="hh:mm"
              style={{ width: "7rem" }}
              onChange={(arr) => update({ dndStart: timeToHhmm(arr) })}
            />
            <span className="dnd-sep">至</span>
            <TimePicker
              time={hhmmToTime(settings.dndEnd)}
              format="hh:mm"
              style={{ width: "7rem" }}
              onChange={(arr) => update({ dndEnd: timeToHhmm(arr) })}
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
            data={[false, true]}
          />
        }
      />
    </SectionCard>
  );
}
