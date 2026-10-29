// Layer 4: 客户详情抽屉 — 健康分趋势 / 基本信息网格 / 跟进动态时间轴 / 底部转交与跟进操作
import Button from "@nce/eview-react/Button";
import Drawer from "@nce/eview-react/Drawer";
import Chart from "@nce/eview-react/Chart";
import { IconPlusIcPublicSortDown, IconPlusIcPublicSortUp } from '@hui/icon-plus';
import dayjs from "dayjs";
import SimpleProgress from "../../components/simple-progress/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { useApp } from "../../context.jsx";
import { HEALTH_TREND_LABELS, getCustomerDetail } from "../../mock/dashboard.jsx";
import "./index.css";

function healthTone(score) {
  if (score >= 80) return "var(--success)";
  if (score >= 60) return "var(--critical)";
  return "var(--error)";
}

function healthStatus(score) {
  if (score >= 80) return "success";
  if (score >= 60) return "normal";
  return "error";
}

function daysToneClass(daysLeft) {
  if (daysLeft <= 7) return "is-urgent";
  if (daysLeft <= 15) return "is-soon";
  return "is-normal";
}

// 手写补位：antd Timeline（eview-react 导出名 TimeLine 存在但无 Reference，按 handwrite-templates 手写）
function AppTimeline({ items }) {
  return (
    <ol className="drawer-timeline">
      {items.map((item, index) => (
        <li key={index} className="drawer-timeline-node" style={{ "--node-color": item.color }}>
          <span className="drawer-timeline-dot" />
          <div className="drawer-timeline-item">{item.children}</div>
        </li>
      ))}
    </ol>
  );
}

export default function CustomerDrawer() {
  const { drawerCustomerId, closeCustomerDrawer, openFollowUpModal, openTransferModal, isDark } = useApp();
  const detail = drawerCustomerId ? getCustomerDetail(drawerCustomerId) : null;

  const trendRows = detail
    ? HEALTH_TREND_LABELS.map((label, index) => ({ 日期: label, 健康分: detail.healthTrend[index] }))
    : [];

  const infoItems = detail
    ? [
        { label: "CSM 负责人", value: detail.csm, isCsm: true },
        { label: "续约日期", value: dayjs(detail.renewalDate).format("YYYY-MM-DD") },
        { label: "剩余天数", value: `剩 ${detail.daysLeft} 天`, toneClass: daysToneClass(detail.daysLeft) },
        { label: "合同金额", value: `¥${detail.amount.toFixed(1)}万` },
        { label: "活跃账号", value: `${detail.activeAccounts} 个` },
        { label: "最近登录", value: detail.lastLogin },
      ]
    : [];

  // 图表 option 必含 a2ui + theme（随全局暗色状态派生）
  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };

  return (
    <Drawer
      visible={Boolean(drawerCustomerId)}
      onClose={closeCustomerDrawer}
      placement="right"
      width={480}
      className="customer-drawer"
      title={
        detail ? (
          <div className="drawer-title">
            <span className="drawer-title-name">{detail.companyName}</span>
            <StatusTag status={detail.status} />
            <span className="drawer-title-industry">{detail.industry}</span>
          </div>
        ) : (
          "客户详情"
        )
      }
    >
      {detail ? (
        <div className="drawer-body">
          <section className="drawer-section">
            <h4 className="drawer-section-title">健康分</h4>
            <div className="drawer-score-row">
              <span className="drawer-score" style={{ color: healthTone(detail.healthScore) }}>
                {detail.healthScore}
              </span>
              <div className="drawer-score-meta">
                <span className={`drawer-score-delta ${detail.scoreDelta >= 0 ? "is-up" : "is-down"}`}>
                  {detail.scoreDelta >= 0 ? (
                    <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} />
                  ) : (
                    <IconPlusIcPublicSortDown iconSize="0.875rem" iconColor={['currentcolor']} />
                  )}
                  较上期 {detail.scoreDelta >= 0 ? "+" : ""}
                  {detail.scoreDelta}
                </span>
                <span className="drawer-score-note">健康线 60 分 · 风险线 40 分</span>
              </div>
            </div>
            <SimpleProgress
              percent={detail.healthScore}
              status={healthStatus(detail.healthScore)}
              showLabel={false}
            />
            <div className="drawer-chart">
              <Chart
                name="LineChart"
                option={{
                  ...chartBase,
                  data: trendRows,
                  xAxis: { data: "日期" },
                  yAxisTitle: "健康分",
                  smooth: true,
                  markLine: { bottom: 60 },
                }}
                style={{ height: "10rem" }}
              />
            </div>
          </section>

          <section className="drawer-section">
            <h4 className="drawer-section-title">基本信息</h4>
            <div className="drawer-info-grid">
              {infoItems.map((item) => (
                <div key={item.label} className="drawer-info-item">
                  <span className="drawer-info-label">{item.label}</span>
                  {item.isCsm ? (
                    <span className="drawer-info-csm">
                      <img className="drawer-info-avatar" src="/uploads/user.png" alt={item.value} />
                      {item.value}
                    </span>
                  ) : (
                    <span className={`drawer-info-value ${item.toneClass || ""}`}>{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="drawer-section">
            <h4 className="drawer-section-title">跟进动态</h4>
            <AppTimeline
              items={detail.activities.map((activity) => ({
                color: activity.color,
                children: (
                  <div className="drawer-timeline-item">
                    <div className="drawer-timeline-head">
                      <span className="drawer-timeline-title">{activity.title}</span>
                      <span className="drawer-timeline-time">{activity.timeText}</span>
                    </div>
                    <p className="drawer-timeline-detail">{activity.detail}</p>
                  </div>
                ),
              }))}
            />
          </section>
        </div>
      ) : null}

      {/* Drawer 无内置按钮区：自写底部操作栏（绝对定位贴底） */}
      <div className="drawer-footer" style={{ position: "absolute", right: 0, bottom: 0, width: "100%", padding: "0.75rem 1rem", textAlign: "right" }}>
        <Button
          text="转交负责人"
          onClick={() => detail && openTransferModal({ customerId: detail.id, customerName: detail.companyName })}
        />
        <Button
          status="primary"
          text="创建跟进"
          onClick={() => detail && openFollowUpModal({ mode: "follow", customerId: detail.id })}
          style={{ marginLeft: "0.75rem" }}
        />
      </div>
    </Drawer>
  );
}
