// Layer 4: ④ 销售漏斗 — 进店→加购→成交→复购（PieChart 占比表达,占比合计 100%）
// 交互: 点击任一环节（右侧环节行或左侧环图扇区）弹出门店明细表
import { Fragment, useMemo, useState } from "react";
import { Button, Modal, Table } from "antd";
import Chart from "../../../assets/shared/chart.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { FUNNEL_STAGES, REGION_ORDER, buildFunnel, buildStageStoreDetail } from "../../mock/weekly-report.js";
import "./index.css";

// 环节色点与饼图默认调色板一致（数据分类色,非语义色）
const STAGE_COLORS = { visit: "#2070F3", cart: "#62B42E", deal: "#715AFB", repeat: "#2CB8C9" };

export default function SalesFunnel({ stores }) {
  const [activeStageKey, setActiveStageKey] = useState(null);
  const funnel = useMemo(() => buildFunnel(stores), [stores]);
  const activeStage = FUNNEL_STAGES.find((stage) => stage.stageKey === activeStageKey) || null;
  const activeStageMeta = funnel.stages.find((stage) => stage.stageKey === activeStageKey) || null;
  const stageDetail = useMemo(
    () => (activeStageKey ? buildStageStoreDetail(stores, activeStageKey) : []),
    [stores, activeStageKey]
  );

  // 绑定饼图扇区点击 → 打开对应环节的门店明细
  const handlePieRendered = (chart) => {
    const echartsInstance = chart.getEchartsInstance();
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

  const columns = [
    { title: "门店", dataIndex: "storeName", key: "storeName" },
    {
      title: "大区",
      dataIndex: "regionFullName",
      key: "regionFullName",
      filters: REGION_ORDER.map((region) => ({ text: `${region}大区`, value: region })),
      onFilter: (value, row) => row.region === value,
    },
    {
      title: "环节人数",
      dataIndex: "stageCountText",
      key: "stageCountText",
      align: "right",
      sorter: (a, b) => a.stageCount - b.stageCount,
    },
    {
      title: "环节占比",
      dataIndex: "stageShareText",
      key: "stageShareText",
      align: "right",
      sorter: (a, b) => a.stageShare - b.stageShare,
    },
    {
      title: "上环节转化率",
      key: "conversionFromPrev",
      align: "right",
      render: (_, row) => (row.conversionFromPrev == null ? "—" : `${row.conversionFromPrev}%`),
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
                  <Icon name="arrow-down" size="0.75rem" />
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
                <Icon name="chevron-right" size="0.875rem" className="stage-chevron" />
              </div>
            </Fragment>
          ))}
          <p className="funnel-hint">
            <Icon name="info" size="0.75rem" />
            点击任一环节或左侧环图扇区，查看门店明细
          </p>
        </div>
      </div>

      <div className="insight-strip">
        <span className="insight-chip">
          <Icon name="trending-up" size="0.75rem" className="chip-icon" />
          进店 → 成交 总转化率 {funnel.overallConversion}%
        </span>
        <span className="insight-chip">
          <Icon name="repeat" size="0.75rem" className="chip-icon" />
          成交 → 复购 复购率 {funnel.repeatRate}%
        </span>
      </div>

      <Modal
        open={Boolean(activeStage)}
        title={activeStage ? `「${activeStage.stageName}」环节 · 门店明细` : ""}
        width={720}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>关闭</Button>,
        ]}
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
          rowKey="storeId"
          columns={columns}
          dataSource={stageDetail}
          size="middle"
          sortDirections={["ascend", "descend", "ascend"]}
          showSorterTooltip={false}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `总记录数：${total}`,
            showSizeChanger: true,
            showQuickJumper: { goButton: "跳转" },
          }}
        />
      </Modal>
    </SectionCard>
  );
}
