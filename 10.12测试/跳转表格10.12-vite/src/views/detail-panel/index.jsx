import Table from "@nce/eview-react/Table";
import { IconPlusIcDigitalPowerDpFile, IconPlusIcIctOriginalRoute, IconPlusIcPublicAlert, IconPlusIcPublicLeftArrow, IconPlusIcPublicRefreshClockwise } from '@nce/icon-plus';
import Button from "@nce/eview-react/Button";
import { useApp } from "../../context.jsx";
import StepFlow from "../../components/step-flow/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { STAGES, TASK_STATUS } from "../../mock/task.js";
import { RECORD_STAGES, RECORD_STATUS, RECORD_NODES } from "../../mock/record.js";
import "./index.css";

// Layer 4: 链路详情 — 表格链接跳转的目标页签
export default function DetailPanel() {
  const { detailRecord, setActiveTab } = useApp();

  if (!detailRecord) {
    return (
      <div className="detail-empty">
        <IconPlusIcIctOriginalRoute iconSize="2.5rem" iconColor={['var(--text-placeholder)']} />
        <div className="detail-empty__title">尚未选择链路</div>
        <div className="detail-empty__desc">请从「任务清单」或「执行记录」中点击任务名称 / 执行 ID 链接查看链路详情</div>
        <Button status="primary" text="前往任务清单" onClick={() => setActiveTab("task")} />
      </div>
    );
  }

  const isTask = detailRecord.kind === "task";
  const stages = isTask ? STAGES : RECORD_STAGES;
  const statusMap = isTask ? TASK_STATUS : RECORD_STATUS;
  const stage = detailRecord.stage;
  const status = detailRecord.status;
  const isFailed = status === "failed";
  const isDone = status === "success";

  const infoItems = [
    { label: "编号", value: detailRecord.id },
    { label: "类型", value: detailRecord.typeLabel },
    { label: "数据源", value: detailRecord.source },
    { label: "目标库", value: detailRecord.target },
    { label: "负责人", value: detailRecord.owner },
    { label: "数据量", value: detailRecord.rows },
    { label: "开始时间", value: detailRecord.startTime },
    { label: "耗时", value: detailRecord.duration },
  ];

  const nodeData = stages.map((title, i) => {
    let nodeStatus = "waiting";
    if (isFailed && i === stage) nodeStatus = "failed";
    else if (i < stage) nodeStatus = "success";
    else if (i === stage) nodeStatus = isDone ? "success" : "running";
    const done = nodeStatus === "success";
    return {
      key: i,
      node: RECORD_NODES[i] || title,
      title,
      status: nodeStatus,
      statusText: done ? "已完成" : nodeStatus === "failed" ? "失败" : nodeStatus === "running" ? "执行中" : "等待中",
      tone: done ? "success" : nodeStatus === "failed" ? "error" : nodeStatus === "running" ? "info" : "warning",
      cost: done ? `${(i + 1) * 7 + 3} 分钟` : nodeStatus === "running" ? "进行中" : "—",
    };
  });

  const nodeColumns = [
    {
      title: "链路节点",
      key: "node",
      allowSort: false,
      render: (value, _rowData, _opts, row) => {
        const r = row?.rawData;
        return (
          <div className="node-cell">
            <span className={"node-cell__dot node-cell__dot--" + (r?.tone ?? "")} />
            <span>{value}</span>
            <span className="node-cell__title">{r?.title ?? ""}</span>
          </div>
        );
      },
    },
    {
      title: "状态",
      key: "statusText",
      width: 130,
      allowSort: false,
      render: (value, _rowData, _opts, row) => {
        const r = row?.rawData;
        return <StatusTag text={value} tone={r?.tone ?? ""} />;
      },
    },
    { title: "耗时", key: "cost", width: 120, align: "right", allowSort: false },
    { title: "操作人", key: "operator", width: 120, allowSort: false, render: () => detailRecord.owner },
  ];

  return (
    <div className="detail-panel">
      <div className="detail-hero">
        <div className="detail-hero__main">
          <span className="detail-hero__icon">
            <IconPlusIcIctOriginalRoute iconSize="1.25rem" iconColor={['currentcolor']} />
          </span>
          <div className="detail-hero__meta">
            <div className="detail-hero__title">{detailRecord.name}</div>
            <div className="detail-hero__tags">
              <StatusTag {...statusMap[status]} />
              <span className="detail-hero__id">{detailRecord.id}</span>
            </div>
          </div>
        </div>
        <div className="detail-hero__actions">
          <Button text="返回任务清单" leftIcon={<IconPlusIcPublicLeftArrow iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={() => setActiveTab("task")} />
          <Button text="查看日志" leftIcon={<IconPlusIcDigitalPowerDpFile iconSize="0.875rem" iconColor={['currentcolor']} />} />
          <Button status="primary" text="重新执行" leftIcon={<IconPlusIcPublicRefreshClockwise iconSize="0.875rem" iconColor={['currentcolor']} />} />
        </div>
      </div>

      {isFailed && (
        <div className="detail-alert">
          <IconPlusIcPublicAlert iconSize="1rem" iconColor={['currentcolor']} />
          <span>任务在第 {stage + 1} 阶段「{stages[stage]}」执行失败，失败原因：下游连接超时（TimeoutException），请检查目标库连通性后重试。</span>
        </div>
      )}

      <section className="detail-section">
        <h3 className="detail-section__title">阶段进度</h3>
        <StepFlow stages={stages} stage={stage} status={status} variant="detail" />
      </section>

      <section className="detail-section">
        <h3 className="detail-section__title">基础信息</h3>
        <div className="detail-info">
          {infoItems.map((item) => (
            <div className="detail-info__item" key={item.label}>
              <span className="detail-info__label">{item.label}</span>
              <span className="detail-info__value">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h3 className="detail-section__title">链路节点</h3>
        <Table
          className="data-table"
          columns={nodeColumns}
          dataset={nodeData}
          emptyTableMsg="暂无链路节点"
        />
      </section>
    </div>
  );
}
