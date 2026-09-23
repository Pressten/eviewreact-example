import { useState } from "react";
import Button from "@nce/eview-react/Button";
import Chart from "@nce/eview-react/Chart";
import { Icon } from "../../shared/icon.jsx";
import { useToast } from "../../shared/feedback.jsx";
import { useApp } from "../../context.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import StatCard from "../../components/stat-card/index.jsx";
import { apiTrendFull, deptStorage, sourceDist, syncProgressData, recentActivities } from "../../mock/dataset.js";
import "./index.css";

const rangeOptions = [
  { label: "近 7 天", value: "7d" },
  { label: "近 14 天", value: "14d" },
];

export default function OverviewView() {
  const { datasets, setActiveMenu } = useApp();
  const [range, setRange] = useState("14d");
  const [toastNode, notify] = useToast();
  const trend = range === "7d" ? apiTrendFull.slice(-7) : apiTrendFull;

  const publishedCount = datasets.filter((d) => d.status === "published").length;

  return (
    <div className="ov-page">
      {toastNode}
      <div className="page-head">
        <div>
          <h2>数据概览</h2>
          <p>欢迎回来，陈志远！这里汇总了平台全部数据资产的运行概况。</p>
        </div>
        <div className="page-head-actions">
          <Button leftIcon={<Icon name="download" size={14} />} onClick={() => window.print()}>
            导出报表
          </Button>
          <Button status="primary" leftIcon={<Icon name="plus" size={14} />} onClick={() => setActiveMenu("management")}>
            新建数据集
          </Button>
        </div>
      </div>

      <div className="ov-stats">
        <StatCard icon="database" label="数据集总数" value={datasets.length} unit="个" trend={6.4} trendLabel="较上月新增 2 个" tone="brand" onClick={() => setActiveMenu("management")} />
        <StatCard icon="hard-drive" label="存储总量" value="5.8" unit="TB" trend={2.1} trendLabel="较上月 +0.12 TB" tone="info" onClick={() => notify.info("存储集群容量 8 TB，已用 71%")} />
        <StatCard icon="zap" label="今日 API 调用" value="48,216" unit="次" trend={12.8} trendLabel="峰值时段 10:00-11:00" tone="critical" onClick={() => notify.info("调用趋势见下方图表")} />
        <StatCard icon="refresh-cw" label="运行中同步任务" value="3" unit="个" trend={-3.2} trendLabel="失败 1 个待处理" tone="success" onClick={() => setActiveMenu("sync")} />
      </div>

      <SectionCard
        className="ov-trend"
        icon="chart-line"
        title="API 调用趋势"
        subtitle="平台数据服务接口调用与错误情况"
        extra={
          <div className="ov-seg">
            {rangeOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                className={`ov-seg-item${range === o.value ? " active" : ""}`}
                onClick={() => setRange(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        }
      >
        <Chart
          name="LineChart"
          option={{
            data: trend,
            xAxis: { data: "日期", name: "日期" },
            yAxisTitle: "调用量 (次)",
            smooth: true,
            area: true,
            markLine: { bottom: 40000 },
          }}
          style={{ height: 300 }}
        />
      </SectionCard>

      <div className="ov-grid-2">
        <SectionCard icon="chart-column" title="各部门数据存储量" subtitle="按归属部门统计 (TB)">
          <Chart
            name="BarChart"
            option={{
              data: deptStorage,
              xAxis: { data: "部门" },
              yAxisTitle: "存储量 (TB)",
              direction: "horizontal",
            }}
            style={{ height: 300 }}
          />
        </SectionCard>
        <SectionCard icon="chart-pie" title="数据来源分布" subtitle="按接入源类型统计">
          <Chart
            name="PieChart"
            option={{
              data: sourceDist,
              title: { text: "接入源", subtext: `共 ${datasets.length} 个数据集` },
              legendPosition: "centerRight",
            }}
            style={{ height: 300 }}
          />
        </SectionCard>
      </div>

      <div className="ov-grid-3">
        <SectionCard icon="gauge" title="存储资源水位" subtitle="全集群热存储">
          <Chart
            name="GaugeChart"
            option={{ data: [{ value: 71, name: "存储利用率" }], min: 0, max: 100, splitNumber: 4, markLine: 85 }}
            style={{ height: 190 }}
          />
          <div className="ov-gauge-info">
            <div>
              <span>集群总容量</span>
              <b>8 TB</b>
            </div>
            <div>
              <span>已用容量</span>
              <b>5.68 TB</b>
            </div>
            <div>
              <span>预计扩容</span>
              <b>2026 Q4</b>
            </div>
          </div>
        </SectionCard>
        <SectionCard icon="list-checks" title="数据源同步进度" subtitle="当前批次完成度">
          <Chart
            name="ProcessChart"
            option={{ name: "ProcessBarChart", data: syncProgressData, unit: "%" }}
            style={{ height: 270 }}
          />
        </SectionCard>
        <SectionCard
          icon="activity"
          title="最近操作动态"
          extra={
            <Button size="small" status="text" onClick={() => setActiveMenu("sync")}>
              查看全部
            </Button>
          }
        >
          <div className="ov-tl">
            {recentActivities.map((a, idx) => (
              <div className="ov-tl-item" key={idx}>
                <span className={`ov-tl-dot tone-${a.tone}`} />
                <div className="ov-tl-main">
                  <p>{a.title}</p>
                  <i>{a.time}</i>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="ov-foot-note">
        <Icon name="info" size={13} />
        已发布数据集 {publishedCount} 个 · 数据服务 SLA 99.95% · 上次统计于今天 09:00
      </div>
    </div>
  );
}
