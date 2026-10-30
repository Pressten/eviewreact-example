// Layer 4: ④ 销售漏斗 — 进店→加购→成交→复购（PieChart 占比表达,占比合计 100%）
// 交互: 点击任一环节（右侧环节行或左侧环图扇区）弹出门店明细表
import { Fragment, useMemo, useState } from "react";
import { IconPlusIcPublicInfo, IconPlusIcPublicRightArrow, IconPlusIcPublicChevronDown, IconPlusIcIctMoveUp, IconPlusIcPublicRefreshClockwise } from '@hui/icon-plus';
import Dialog from "@nce/eview-react/Dialog";
import Table from "@nce/eview-react/Table";
import Chart from "@nce/eview-react/Chart";
import { useApp } from "../../context.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { FUNNEL_STAGES, buildFunnel, buildStageStoreDetail } from "../../mock/weekly-report.jsx";
import "./index.css";

// 环节色点与饼图默认调色板一致（数据分类色,非语义色）
const STAGE_COLORS = { visit: "#2070F3", cart: "#62B42E", deal: "#715AFB", repeat: "#2CB8C9" };

export default function SalesFunnel({ stores }) {
  const [activeStageKey, setActiveStageKey] = useState(null);
  const { isDark } = useApp();
  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };
  const funnel = useMemo(() => buildFunnel(stores), [stores]);
  const activeStage = FUNNEL_STAGES.find((stage) => stage.stageKey === activeStageKey) || null;
  const activeStageMeta = funnel.stages.find((stage) => stage.stageKey === activeStageKey) || null;
  const stageDetail = useMemo(
    () => (activeStageKey ? buildStageStoreDetail(stores, activeStageKey) : []),
    [stores, activeStageKey]
  );

  // 绑定饼图扇区点击 → 打开对应环节的门店明细
  // onChartRendered 回调参数即底层 echarts 实例,直接 .on() 绑定,禁止再调 getEchartsInstance()
  const handlePieRendered = (echartsInstance) => {
    if (!echartsInstance) return;
    echartsInstance.on("click", (params) => {
      const stage = FUNNEL_STAGES.find((item) => item.stageName === params.name);
      if (stage) setActiveStageKey(stage.stageKey);
    });
  };

  const openStage = (stageKey) => setActiveStageKey(stageKey);

  const handleStageKeyDown = (event, stageKey) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openStage(stageKey);
    }
  };

  const handleCancel = () => setActiveStageKey(null);

  // eview Table 列定义：dataIndex→key；filters/onFilter（antd 列级值筛选）无 eview 对应,丢弃；
  // sorter 列保留默认 allowSort(true)，无 sorter 列显式 allowSort:false 防止表头凭空带排序箭头；
  // render 行数据取 row.rawData（可能 undefined,加 ?. 防御）；本格值用第 1 参 cell
  const columns = [
    { title: "门店", key: "storeName", allowSort: false },
    { title: "大区", key: "regionFullName", allowSort: false },
    {
      title: "环节人数",
      key: "stageCountText",
      align: "right",
      allowSort: true,
    },
    {
      title: "环节占比",
      key: "stageShareText",
      align: "right",
      allowSort: true,
    },
    {
      title: "上环节转化率",
      key: "conversionFromPrev",
      align: "right",
      allowSort: false,
      render: (cell) => (cell == null ? "—" : `${cell}%`),
    },
  ];

  return (
    <SectionCard
      index="04"
      title="销售漏斗"
      subtitle={`进店 → 加购 → 成交 → 复购 · 占比合计 100% · 点击环节查看 ${stores.length} 家门店明细`}
      className="span-7"
    >
      <div className="funnel-body">
        <div className="funnel-pie-wrap">
          <Chart
            name="PieChart"
            option={{
              ...chartBase,
              data: funnel.stages.map((stage) => ({ name: stage.stageName, value: stage.count })),
              title: { text: "环节人数占比", subtext: "合计 100%" },
              legendPosition: "bottomCenter",
            }}
            onChartRendered={handlePieRendered}
            style={{ height: "100%" }}
          />
        </div>
        <div className="funnel-stages">
          {funnel.stages.map((stage, stageIndex) => (
            <Fragment key={stage.stageKey}>
              {stageIndex > 0 && (
                <div className="funnel-conv">
                  <IconPlusIcPublicChevronDown iconSize="0.75rem" iconColor={['currentcolor']} />
                  转化率 {stage.conversionFromPrev}%
                </div>
              )}
              <div
                className="funnel-stage-row"
                role="button"
                tabIndex={0}
                onClick={() => openStage(stage.stageKey)}
                onKeyDown={(event) => handleStageKeyDown(event, stage.stageKey)}
              >
                <span
                  className="stage-dot"
                  style={{ background: STAGE_COLORS[stage.stageKey] }}
                />
                <div className="stage-info">
                  <span className="stage-name">{stage.stageName}</span>
                  <span className="stage-count">{stage.countText} 人次</span>
                </div>
                <span className="stage-share">占比 {stage.share}%</span>
                <IconPlusIcPublicRightArrow iconSize="0.875rem" iconColor={['currentcolor']} className="stage-chevron" />
              </div>
            </Fragment>
          ))}
          <p className="funnel-hint">
            <IconPlusIcPublicInfo iconSize="0.75rem" iconColor={['currentcolor']} />
            点击任一环节或左侧环图扇区，查看门店明细
          </p>
        </div>
      </div>

      <div className="insight-strip">
        <span className="insight-chip">
          <IconPlusIcIctMoveUp iconSize="0.75rem" iconColor={['currentcolor']} className="chip-icon" />
          进店 → 成交 总转化率 {funnel.overallConversion}%
        </span>
        <span className="insight-chip">
          <IconPlusIcPublicRefreshClockwise iconSize="0.75rem" iconColor={['currentcolor']} className="chip-icon" />
          成交 → 复购 复购率 {funnel.repeatRate}%
        </span>
      </div>

      <Dialog
        isOpen={Boolean(activeStage)}
        title={activeStage ? `「${activeStage.stageName}」环节 · 门店明细` : ""}
        size={[720, "auto"]}
        onClose={handleCancel}
        buttons={[{ text: "关闭", onClick: handleCancel }]}
        style={{ maxHeight: "80vh" }}
      >
        {activeStageMeta && (
          <p className="funnel-modal-summary">
            全店{activeStageMeta.stageName}合计 <b>{activeStageMeta.countText}</b> 人次 · 占环节总量{" "}
            <b>{activeStageMeta.share}%</b>
            {activeStageMeta.conversionFromPrev != null && (
              <> · 上环节转化率 <b>{activeStageMeta.conversionFromPrev}%</b></>
            )}
          </p>
        )}
        <Table
          columns={columns}
          dataset={stageDetail}
          enableZebraCrossing={false}
          enableColumnCompareUpdate
          width="unset"
          emptyTableMsg="暂无门店明细"
          enablePagination
          enableAutoPaging
          pageSize={10}
          pageSizeOptions={[10, 20, 50]}
        />
      </Dialog>
    </SectionCard>
  );
}
