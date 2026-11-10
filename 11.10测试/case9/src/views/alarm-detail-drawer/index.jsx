import { Drawer, Timeline, message } from "antd";
import dayjs from "dayjs";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { LevelTag, AlarmStatusTag } from "../../components/status-tag/index.jsx";
import { fmtDur } from "../../mock/alarms.js";
import { SERVICES } from "../../mock/services.js";
import "./index.css";

// 分级处置建议（值班手册摘要）
const RUNBOOK = {
  P0: "立即启动应急响应：确认影响面 → 冻结非必要变更 → 按值班手册升级至服务负责人与业务方，恢复后 24h 内输出复盘。",
  P1: "15 分钟内定位根因：优先查看服务拓扑对应链路与今日变更；若与发布相关，评估回滚窗口。",
  P2: "值班窗口内持续观察：确认是否恶化，必要时认领并创建工单转交责任团队。",
  P3: "记录并转工单：不影响 SLA，按常规流程在工作时间处理。",
};

// 关键对象专项提示（与拓扑异常链路、告警数据口径一致）
const TARGET_HINT = {
  "payment-service": "支付链路 P0 事故主因：先核对 payment-mysql 慢查询 DDL 工单状态，再评估限流或降级备用支付渠道。",
  "payment-mysql": "慢查询由订单明细表缺索引引起（DDL 工单待审核）；审核通过前避免重启实例，并持续观察主从延迟。",
  "payment-redis": "连接池 98%：排查慢查询导致的连接占用，必要时临时调大连接池上限。",
  "order-service": "P99 1240ms 与订单导出任务相关，评估任务限流；实例已扩容至 12 个。",
  "order-redis": "内存 92%：检查大 Key 与过期策略，必要时清理临时缓存。",
  "api-gateway": "5xx 升高由下游支付服务传播引起，优先恢复支付链路；网关证书 15 天后过期，请安排轮换。",
};

// 告警详情抽屉：基本信息 / 处置建议 / 事件轨迹 / 同对象关联告警 / 快捷操作
export default function AlarmDetailDrawer() {
  const app = useApp();
  const rec = app.alarms.find((a) => a.id === app.alarmDetail.id);
  if (!rec) return null;

  const open = app.alarmDetail.open;
  const start = dayjs().subtract(rec.durationMin, "minute");
  const fmtTs = (d) => d.format(rec.durationMin >= 1440 ? "MM-DD HH:mm" : "HH:mm");

  const related = app.alarms.filter((a) => a.targetKey === rec.targetKey && a.id !== rec.id);

  // 事件轨迹：按持续时长与状态推导
  const trail = [
    {
      key: "t0",
      t: start,
      tone: "var(--color-error)",
      label: "告警首次触发",
      desc: `${rec.strategyName}：触发值 ${rec.triggerValue} 超过阈值 ${rec.threshold}`,
    },
    {
      key: "t1",
      t: start.add(2, "minute"),
      tone: "var(--color-alert)",
      label: "连续 3 个评估周期超阈值",
      desc: `告警级别确认为 ${rec.level}`,
    },
    {
      key: "t2",
      t: start.add(3, "minute"),
      tone: "var(--color-brand)",
      label: "电话 + IM 通知值班",
      desc: "通知对象：张伟（白班）、李婧（夜班交接）",
    },
  ];
  if (rec.claimBy) {
    trail.push({
      key: "t3",
      t: start.add(6, "minute"),
      tone: "var(--color-info-primary)",
      label: "值班工程师认领",
      desc: `认领人：${rec.claimBy}`,
    });
  }
  if (rec.status === "silenced") {
    trail.push({
      key: "t4",
      t: start.add(10, "minute"),
      tone: "var(--color-text-secondary)",
      label: "告警被静默",
      desc: rec.silenceReason ? `静默原因：${rec.silenceReason}` : "静默原因见静默记录",
    });
  }
  if (rec.status === "resolved") {
    trail.push({
      key: "t5",
      t: dayjs().subtract(8, "minute"),
      tone: "var(--color-success)",
      label: "指标恢复正常，告警自动关闭",
      desc: "连续 3 个评估周期低于阈值后自动关闭",
    });
  } else {
    trail.push({
      key: "t5",
      t: dayjs().subtract(1, "minute"),
      tone: "var(--color-error)",
      label: "最近一次评估仍超阈值",
      desc: `当前触发值 ${rec.triggerValue} 仍高于阈值 ${rec.threshold}`,
    });
  }

  const claimHere = () => {
    app.setAlarms((list) =>
      list.map((a) => (a.id === rec.id ? { ...a, status: "claimed", claimBy: "张伟" } : a))
    );
    message.success(`已认领告警：${rec.strategyName}（${rec.targetName}）· 值班人 张伟`);
  };

  const jumpTarget = () => {
    const isService = SERVICES[app.env].some((s) => s.key === rec.targetKey);
    if (isService) app.setSelectedService(rec.targetKey);
    app.closeAlarmDetail();
    const el = document.getElementById("topology-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    message.info(`已跳转对象：${rec.targetName}（见服务拓扑）`);
  };

  return (
    <Drawer
      open={open}
      onClose={app.closeAlarmDetail}
      width={520}
      title={
        <div className="adw-title">
          <LevelTag level={rec.level} />
          <span className="adw-name">{rec.strategyName}</span>
          <AlarmStatusTag status={rec.status} />
        </div>
      }
    >
      <div className="adw-body">
        <section className="adw-block">
          <h4>告警信息</h4>
          <div className="adw-grid">
            <div className="adw-cell">
              <span>告警对象</span>
              <b>{rec.targetName}</b>
            </div>
            <div className="adw-cell">
              <span>触发值 / 阈值</span>
              <b>
                {rec.triggerValue} / {rec.threshold}
              </b>
            </div>
            <div className="adw-cell">
              <span>持续时长</span>
              <b>{fmtDur(rec.durationMin)}</b>
            </div>
            <div className="adw-cell">
              <span>首次触发</span>
              <b>{fmtTs(start)}</b>
            </div>
            <div className="adw-cell">
              <span>认领人</span>
              <b>{rec.claimBy || "—"}</b>
            </div>
            <div className="adw-cell">
              <span>告警编号</span>
              <b>{rec.id}</b>
            </div>
          </div>
        </section>

        <section className="adw-block">
          <h4>处置建议</h4>
          <p className="adw-runbook">{TARGET_HINT[rec.targetKey] || RUNBOOK[rec.level]}</p>
          {TARGET_HINT[rec.targetKey] ? <p className="adw-runbook adw-runbook-sub">{RUNBOOK[rec.level]}</p> : null}
        </section>

        <section className="adw-block">
          <h4>事件轨迹</h4>
          <Timeline
            className="adw-trail"
            items={trail.map((ev) => ({
              key: ev.key,
              color: ev.tone,
              children: (
                <div className="adw-ev">
                  <div className="adw-ev-head">
                    <span className="adw-ev-time">{fmtTs(ev.t)}</span>
                    <b>{ev.label}</b>
                  </div>
                  <div className="adw-ev-desc">{ev.desc}</div>
                </div>
              ),
            }))}
          />
        </section>

        <section className="adw-block">
          <h4>同对象关联告警（{related.length}）</h4>
          {related.length === 0 ? (
            <p className="adw-empty">暂无其他关联告警</p>
          ) : (
            related.map((r) => (
              <div className="adw-related" key={r.id} onClick={() => app.openAlarmDetail(r)} title="点击查看该告警">
                <LevelTag level={r.level} />
                <span className="adw-related-name">{r.strategyName}</span>
                <AlarmStatusTag status={r.status} />
              </div>
            ))
          )}
        </section>

        <div className="adw-actions">
          {rec.status === "firing" ? (
            <a onClick={claimHere}>
              <Icon name="user-check" size="0.875rem" />
              认领
            </a>
          ) : null}
          <a
            onClick={() => {
              app.closeAlarmDetail();
              app.openSilence(rec.targetKey);
            }}
          >
            <Icon name="volume-x" size="0.875rem" />
            静默该对象
          </a>
          <a onClick={jumpTarget}>
            <Icon name="external-link" size="0.875rem" />
            跳转对象
          </a>
        </div>
      </div>
    </Drawer>
  );
}
