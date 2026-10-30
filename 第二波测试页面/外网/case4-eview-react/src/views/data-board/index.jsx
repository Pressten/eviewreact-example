// ⑦ 数据看板 · A/B 实验：UV / 转化率 / GMV 三组对比柱状图
// 含置信度说明、胜出版本标记、「应用胜出版本」按钮（需确认）
// 卡片操作区：统计周期下拉 + 竖分隔线 + 图标组（刷新/更多）
// 图表交互：悬浮查看双版本明细、点击柱体输出指标详情
import { useRef, useState } from "react";
import { IconPlusIcDigitalPowerDpCheck, IconPlusIcIctTrophy, IconPlusIcPublicChart, IconPlusIcPublicCheckmark, IconPlusIcPublicChevronDown, IconPlusIcPublicDownload, IconPlusIcPublicEllipsis, IconPlusIcPublicFiles, IconPlusIcPublicRefreshClockwise } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import MessageDialog from "@nce/eview-react/MessageDialog";
import Tag from "@/shared/Tag";
import AppDropdown from "@/shared/AppDropdown";
import { toast } from "@/shared/AppToast";
import Chart from "@nce/eview-react/Chart";
import { useApp, useDecoration } from "../../context.jsx";
import { AB_EXPERIMENT } from "../../mock/decoration.jsx";
import "./index.css";

// 柱体指标单位（点击明细提示用）
const CATEGORY_UNITS = {
  "UV（万）": " 万",
  "转化率（%）": "%",
  "GMV（百万元）": " 百万元",
};

export default function DataBoard() {
  const { isDark } = useApp();
  const { state } = useDecoration();
  const [rangeKey, setRangeKey] = useState("week");
  const [winnerApplied, setWinnerApplied] = useState(false);
  const [winnerConfirm, setWinnerConfirm] = useState(false);
  const chartRef = useRef(null);
  const ds = AB_EXPERIMENT.datasets[rangeKey];
  const conf = AB_EXPERIMENT.confidence;

  // 图表 option 必含 a2ui:true + theme（随暗色派生）——改包导入后源封装不再自动注入
  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };

  // 对比版本：版本 A = 当前版本（实验组），版本 B = 上一发布版本（对照组），与发布记录联动
  const prevVersion =
    state.publishRecords.find((r) => r.version !== state.currentVersion)?.version || "V2.3.0";

  // GMV 以百万元入图（与 UV/转化率数量级平衡），图例明细仍展示万元
  const barOption = {
    ...chartBase,
    data: [
      { 指标: "UV（万）", 版本A: ds.versionA.uv, 版本B: ds.versionB.uv },
      { 指标: "转化率（%）", 版本A: ds.versionA.conv, 版本B: ds.versionB.conv },
      { 指标: "GMV（百万元）", 版本A: +(ds.versionA.gmv / 100).toFixed(2), 版本B: +(ds.versionB.gmv / 100).toFixed(2) },
    ],
    xAxis: { data: "指标" },
    yAxisTitle: "UV（万）/ 转化率（%）/ GMV（百万元）",
  };

  // 图表渲染后绑定柱体点击：输出指标点击明细（回调参数即 echarts 实例，禁止再调 getEchartsInstance）
  const handleChartRendered = (chart) => {
    if (!chart || typeof chart.on !== "function") return;
    chart.on("click", (params) => {
      const unit = CATEGORY_UNITS[params.name] || "";
      const text = `${params.seriesName} · ${params.name}：${params.value}${unit}`;
      if (params.seriesName === "版本A") {
        toast.info(`【点击明细】${text}，对比上一版本呈显著优势`);
      } else {
        toast.info(`【点击明细】${text}（对照版本基线）`);
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
      toast.info(`已切换至${AB_EXPERIMENT.datasets[key].rangeLabel}数据`);
    },
  };

  const moreMenu = {
    items: [
      { key: "export", icon: <IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />, label: "导出明细" },
      { key: "report", icon: <IconPlusIcPublicFiles iconSize="0.875rem" iconColor={['currentcolor']} />, label: "查看完整报表" },
    ],
    onClick: ({ key }) =>
      toast.info(key === "export" ? "明细已导出到本地（演示环境）" : "完整报表建设中（演示环境）"),
  };

  const handleApplyWinner = () => setWinnerConfirm(true);

  const confirmApplyWinner = () => {
    setWinnerApplied(true);
    setWinnerConfirm(false);
    toast.success(`实验已结束，胜出版本 ${state.currentVersion} 已全量上线`);
  };

  return (
    <div className="deco-card data-board">
      <div className="deco-card-head">
        <div className="deco-card-title">
          <IconPlusIcPublicChart iconSize="1.25rem" iconColor={['currentcolor']} className="card-title-icon" />
          数据看板
          <span className="card-title-caption">A/B 实验对比 · 点击柱体查看明细</span>
        </div>
        <span className="board-actions">
          <AppDropdown menu={rangeMenu} trigger={["click"]} placement="bottomRight">
            <span className="board-filter" title="切换统计周期">
              {ds.rangeLabel}
              <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} />
            </span>
          </AppDropdown>
          <span className="board-divider" />
          <IconPlusIcPublicRefreshClockwise iconSize="1rem" iconColor={['currentcolor']} className="board-tool" />
          <AppDropdown menu={moreMenu} trigger={["click"]} placement="bottomRight">
            <span className="board-tool" title="更多操作">
              <IconPlusIcPublicEllipsis iconSize="1rem" iconColor={['currentcolor']} />
            </span>
          </AppDropdown>
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
              <IconPlusIcIctTrophy iconSize="0.75rem" iconColor={['currentcolor']} />
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
          <IconPlusIcPublicCheckmark iconSize="0.875rem" iconColor={['currentcolor']} className="ab-confidence-icon" />
          置信度 {conf.level}（{conf.pValue}）· 样本量 {conf.sampleSize}：版本 A 在 UV、转化率、GMV
          三项核心指标上均显著优于版本 B，建议应用。
        </div>

        {/* 胜出版本应用（需确认） */}
        <div className="ab-apply">
          {winnerApplied ? (
            <Tag color="green" className="ab-applied-tag">
              <IconPlusIcPublicCheckmark iconSize="0.875rem" iconColor={['currentcolor']} />
              胜出版本已全量应用
            </Tag>
          ) : (
            <Button
              status="primary"
              size="small"
              leftIcon={<IconPlusIcDigitalPowerDpCheck iconSize="0.875rem" iconColor={['currentcolor']} />}
              text={`应用胜出版本（${state.currentVersion}）`}
              onClick={handleApplyWinner}
            />
          )}
          <span className="ab-apply-hint">应用后 B 版本流量将全量切换至胜出版本，实验结束</span>
        </div>
      </div>

      <MessageDialog
        type="confirm"
        iconLocation="title"
        isOpen={winnerConfirm}
        content={`确认应用胜出版本（${state.currentVersion}）？`}
        detail={`应用后版本 B（${prevVersion}）的流量将全部切换至胜出版本 ${state.currentVersion}，A/B 实验随之结束，操作即时生效。`}
        onClose={() => setWinnerConfirm(false)}
        buttons={{
          cancel: { text: "取消", onClick: () => setWinnerConfirm(false) },
          ok: { text: "确认应用", onClick: confirmApplyWinner },
        }}
      />
    </div>
  );
}
