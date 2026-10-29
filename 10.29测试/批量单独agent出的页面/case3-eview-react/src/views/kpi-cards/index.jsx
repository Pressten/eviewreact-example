// Layer 4: KPI 指标卡行 — 4 张卡（主数值 / 同比涨跌 / 说明 / 进度），点击下钻：续约明细 / 响应趋势弹窗，健康占比与高风险联动表格
import { useState } from "react";
import Dialog from "@nce/eview-react/Dialog";
import TipBox from "@nce/eview-react/TipBox";
import Chart from "@nce/eview-react/Chart";
import Tag from "@/shared/Tag";
import dayjs from "dayjs";
import SimpleProgress from "../../components/simple-progress/index.jsx";
import { scrollToSection, useApp } from "../../context.jsx";
import { KPI_CARDS, RENEWAL_RECORDS, RESPONSE_TREND } from "../../mock/dashboard.jsx";
import "./index.css";

const TONE_COLORS = {
  brand: "var(--primary)",
  success: "var(--success)",
  error: "var(--error)",
  info: "var(--info)",
};

const PAY_STATUS_COLORS = {
  已回款: "success",
  审批中: "processing",
  待确认: "warning",
};

const RESPONSE_ROWS = RESPONSE_TREND.labels.map((label, index) => ({
  日期: label,
  平均响应: RESPONSE_TREND.avg[index],
  P90: RESPONSE_TREND.p90[index],
}));

export default function KpiCards() {
  const { setTableStatusFilter, notify, isDark } = useApp();
  const [renewalModalOpen, setRenewalModalOpen] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);

  const handleOpenDetail = (card) => {
    if (card.key === "renewal-amount") {
      setRenewalModalOpen(true);
      return;
    }
    if (card.key === "avg-response") {
      setResponseModalOpen(true);
      return;
    }
    if (card.key === "health-ratio") {
      setTableStatusFilter("健康");
      scrollToSection(".risk-table-card");
      notify("info", "已定位到风险客户表格，并筛选「健康」客户");
      return;
    }
    setTableStatusFilter("风险");
    scrollToSection(".risk-table-card");
    notify("info", "已定位到风险客户表格，并筛选「风险」客户");
  };

  // 图表 option 必含 a2ui + theme（随全局暗色状态派生）
  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };

  return (
    <>
      <section className="kpi-row">
        {KPI_CARDS.map((card) => (
          <TipBox key={card.key} type="simple" content={`点击进入「${card.title}」明细`} trigger="hover" direction="top">
            <div
              className="kpi-card"
              role="button"
              tabIndex={0}
              onClick={() => handleOpenDetail(card)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") handleOpenDetail(card);
              }}
            >
              <div className="kpi-card-head">
                <span className={`kpi-icon tone-${card.tone}`}>
                  {card.icon}
                </span>
                <span className="kpi-card-title">{card.title}</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-value">{card.value}</span>
                <span className={`kpi-trend ${card.trend.tone === "good" ? "is-good" : "is-bad"}`}>
                  {card.trend.icon}
                  {card.trend.text}
                </span>
              </div>
              <p className="kpi-card-desc">{card.description}</p>
              <div className="kpi-card-progress">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <SimpleProgress percent={card.progress.percent} showLabel={false} />
                </div>
                <span className="kpi-progress-label">{card.progress.label}</span>
              </div>
            </div>
          </TipBox>
        ))}
      </section>

      {/* 下钻：本月续约明细（无按钮区：footer={null} → buttons 不传，点关闭按钮关闭） */}
      <Dialog
        isOpen={renewalModalOpen}
        title="本月续约明细"
        size={[512, "auto"]}
        style={{ maxHeight: "80vh" }}
        onClose={() => setRenewalModalOpen(false)}
      >
        <p className="modal-summary">近 30 天已续约 38 家 · 金额 ¥286.5万（以下为节选记录）</p>
        <ul className="renewal-list">
          {RENEWAL_RECORDS.map((record) => (
            <li key={record.id} className="renewal-item">
              <div className="renewal-item-main">
                <span className="renewal-company">{record.companyName}</span>
                <span className="renewal-meta">
                  {record.cycle} · {dayjs(record.renewalDate).format("MM-DD")} 续约
                </span>
              </div>
              <span className="renewal-amount">¥{record.amount.toFixed(1)}万</span>
              <Tag color={PAY_STATUS_COLORS[record.payStatus]}>{record.payStatus}</Tag>
            </li>
          ))}
        </ul>
      </Dialog>

      {/* 下钻：平均响应时长明细 */}
      <Dialog
        isOpen={responseModalOpen}
        title="平均响应时长明细"
        size={[512, "auto"]}
        style={{ maxHeight: "80vh" }}
        onClose={() => setResponseModalOpen(false)}
      >
        <div className="response-stats">
          <div className="response-stat">
            <span className="response-stat-value">1.8 小时</span>
            <span className="response-stat-label">P50 中位数</span>
          </div>
          <div className="response-stat">
            <span className="response-stat-value">4.2 小时</span>
            <span className="response-stat-label">P90 分位</span>
          </div>
          <div className="response-stat">
            <span className="response-stat-value">91%</span>
            <span className="response-stat-label">SLA 达标率</span>
          </div>
        </div>
        <Chart
          name="LineChart"
          option={{
            ...chartBase,
            data: RESPONSE_ROWS,
            xAxis: { data: "日期" },
            yAxisTitle: "小时",
            smooth: true,
            markLine: { bottom: 4 },
          }}
          style={{ height: "13rem", marginTop: "0.75rem" }}
        />
      </Dialog>
    </>
  );
}
