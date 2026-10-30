// ⑦ 数据看板 · A/B 实验：UV / 转化率 / GMV 三组对比柱状图
// 含置信度说明、胜出版本标记、「应用胜出版本」按钮（需确认）
// 卡片操作区：统计周期下拉 + 竖分隔线 + 图标组（刷新/更多）
// 图表交互：悬浮查看双版本明细、点击柱体输出指标详情
import { useRef, useState } from "react";
import { Button, Dropdown, Modal, Tag, message } from "antd";
import Chart from "../../../assets/shared/chart.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useDecoration } from "../../context.jsx";
import { AB_EXPERIMENT } from "../../mock/decoration.js";
import "./index.css";

// 柱体指标单位（点击明细提示用）
const CATEGORY_UNITS = {
  "UV（万）": " 万",
  "转化率（%）": "%",
  "GMV（百万元）": " 百万元",
};

export default function DataBoard() {
  const { state } = useDecoration();
  const [rangeKey, setRangeKey] = useState("week");
  const [winnerApplied, setWinnerApplied] = useState(false);
  const chartRef = useRef(null);
  const ds = AB_EXPERIMENT.datasets[rangeKey];
  const conf = AB_EXPERIMENT.confidence;

  // 对比版本：版本 A = 当前版本（实验组），版本 B = 上一发布版本（对照组），与发布记录联动
  const prevVersion =
    state.publishRecords.find((r) => r.version !== state.currentVersion)?.version || "V2.3.0";

  // GMV 以百万元入图（与 UV/转化率数量级平衡），图例明细仍展示万元
  const barOption = {
    data: [
      { 指标: "UV（万）", 版本A: ds.versionA.uv, 版本B: ds.versionB.uv },
      { 指标: "转化率（%）", 版本A: ds.versionA.conv, 版本B: ds.versionB.conv },
      { 指标: "GMV（百万元）", 版本A: +(ds.versionA.gmv / 100).toFixed(2), 版本B: +(ds.versionB.gmv / 100).toFixed(2) },
    ],
    xAxis: { data: "指标" },
    yAxisTitle: "UV（万）/ 转化率（%）/ GMV（百万元）",
  };

  // 图表渲染后绑定柱体点击：输出指标点击明细
  const handleChartRendered = (chart) => {
    const ec = chart && typeof chart.getEchartsInstance === "function" ? chart.getEchartsInstance() : null;
    if (!ec) return;
    ec.on("click", (params) => {
      const unit = CATEGORY_UNITS[params.name] || "";
      const text = `${params.seriesName} · ${params.name}：${params.value}${unit}`;
      if (params.seriesName === "版本A") {
        message.info(`【点击明细】${text}，对比上一版本呈显著优势`);
      } else {
        message.info(`【点击明细】${text}（对照版本基线）`);
      }
    });
  };

  const rangeMenu = {
    items: [
      { key: "week", label: "近 7 天" },
      { key: "month", label: "近 30 天" },
    ],
    selectedKeys: [rangeKey],
    onClick: ({ key }) => {
      setRangeKey(key);
      message.info(`已切换至${AB_EXPERIMENT.datasets[key].rangeLabel}数据`);
    },
  };

  const moreMenu = {
    items: [
      { key: "export", icon: <Icon name="download" size="0.875rem" />, label: "导出明细" },
      { key: "report", icon: <Icon name="file-text" size="0.875rem" />, label: "查看完整报表" },
    ],
    onClick: ({ key }) =>
      message.info(key === "export" ? "明细已导出到本地（演示环境）" : "完整报表建设中（演示环境）"),
  };

  const handleApplyWinner = () => {
    Modal.confirm({
      title: `确认应用胜出版本（${state.currentVersion}）？`,
      content: `应用后版本 B（${prevVersion}）的流量将全部切换至胜出版本 ${state.currentVersion}，A/B 实验随之结束，操作即时生效。`,
      okText: "确认应用",
      cancelText: "取消",
      onOk: () => {
        setWinnerApplied(true);
        message.success(`实验已结束，胜出版本 ${state.currentVersion} 已全量上线`);
      },
    });
  };

  return (
    <div className="deco-card data-board">
      <div className="deco-card-head">
        <div className="deco-card-title">
          <Icon name="chart-column" size="1.25rem" className="card-title-icon" />
          数据看板
          <span className="card-title-caption">A/B 实验对比 · 点击柱体查看明细</span>
        </div>
        <span className="board-actions">
          <Dropdown menu={rangeMenu} trigger={["click"]} placement="bottomRight">
            <span className="board-filter" title="切换统计周期">
              {ds.rangeLabel}
              <Icon name="chevron-down" size="0.875rem" />
            </span>
          </Dropdown>
          <span className="board-divider" />
          <Icon
            name="refresh-cw"
            size="1rem"
            className="board-tool"
            title="刷新数据"
            onClick={() => message.success("数据已刷新")}
          />
          <Dropdown menu={moreMenu} trigger={["click"]} placement="bottomRight">
            <span className="board-tool" title="更多操作">
              <Icon name="ellipsis" size="1rem" />
            </span>
          </Dropdown>
        </span>
      </div>

      <Chart
        ref={chartRef}
        name="BarChart"
        option={barOption}
        style={{ height: "13rem" }}
        onChartRendered={handleChartRendered}
      />

      <div className="ab-legend">
        <div className="ab-row">
          <span className="ab-dot ab-dot-a" />
          <span className="ab-version">版本 A · {state.currentVersion}</span>
          {AB_EXPERIMENT.winner === "A" && (
            <Tag color="green" bordered={false} className="ab-winner-tag">
              <Icon name="crown" size="0.75rem" />
              胜出
            </Tag>
          )}
          <span className="ab-metric">
            UV {ds.versionA.uv} 万<em className="ab-up">{ds.versionA.uvDelta}</em>
          </span>
          <span className="ab-metric">
            转化率 {ds.versionA.conv}%<em className="ab-up">{ds.versionA.convDelta}</em>
          </span>
          <span className="ab-metric">
            GMV {ds.versionA.gmv} 万<em className="ab-up">{ds.versionA.gmvDelta}</em>
          </span>
        </div>
        <div className="ab-row">
          <span className="ab-dot ab-dot-b" />
          <span className="ab-version">版本 B · {prevVersion}</span>
          <span className="ab-metric">UV {ds.versionB.uv} 万</span>
          <span className="ab-metric">转化率 {ds.versionB.conv}%</span>
          <span className="ab-metric">GMV {ds.versionB.gmv} 万</span>
        </div>

        {/* 置信度说明 */}
        <div className="ab-confidence">
          <Icon name="circle-check" size="0.875rem" className="ab-confidence-icon" />
          置信度 {conf.level}（{conf.pValue}）· 样本量 {conf.sampleSize}：版本 A 在 UV、转化率、GMV
          三项核心指标上均显著优于版本 B，建议应用。
        </div>

        {/* 胜出版本应用（需确认） */}
        <div className="ab-apply">
          {winnerApplied ? (
            <Tag color="green" className="ab-applied-tag">
              <Icon name="circle-check" size="0.875rem" />
              胜出版本已全量应用
            </Tag>
          ) : (
            <Button
              type="primary"
              size="small"
              icon={<Icon name="badge-check" size="0.875rem" />}
              onClick={handleApplyWinner}
            >
              应用胜出版本（{state.currentVersion}）
            </Button>
          )}
          <span className="ab-apply-hint">应用后 B 版本流量将全量切换至胜出版本，实验结束</span>
        </div>
      </div>
    </div>
  );
}
