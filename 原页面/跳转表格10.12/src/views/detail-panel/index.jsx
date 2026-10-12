import { Table, Button } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
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
        <Icon name="route" size="2.5rem" color="var(--text-placeholder)" />
        <div className="detail-empty__title">尚未选择链路</div>
        <div className="detail-empty__desc">请从「任务清单」或「执行记录」中点击任务名称 / 执行 ID 链接查看链路详情</div>
        <Button type="primary" size="small" onClick={() => setActiveTab("task")}>前往任务清单</Button>
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
      dataIndex: "node",
      key: "node",
      render: (value, row) => (
        <div className="node-cell">
          <span className={"node-cell__dot node-cell__dot--" + row.tone} />
          <span>{value}</span>
          <span className="node-cell__title">{row.title}</span>
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "statusText",
      key: "status",
      width: 130,
      render: (value, row) => <StatusTag text={value} tone={row.tone} />,
    },
    { title: "耗时", dataIndex: "cost", key: "cost", width: 120, align: "right" },
    { title: "操作人", dataIndex: "operator", key: "operator", width: 120, render: () => detailRecord.owner },
  ];

  return (
    <div className="detail-panel">
      <div className="detail-hero">
        <div className="detail-hero__main">
          <span className="detail-hero__icon">
            <Icon name="route" size="1.25rem" />
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
          <Button size="small" icon={<Icon name="arrow-left" size="0.875rem" />} onClick={() => setActiveTab("task")}>
            返回任务清单
          </Button>
          <Button size="small" icon={<Icon name="file-text" size="0.875rem" />}>查看日志</Button>
          <Button size="small" type="primary" icon={<Icon name="refresh-cw" size="0.875rem" />}>重新执行</Button>
        </div>
      </div>

      {isFailed && (
        <div className="detail-alert">
          <Icon name="triangle-alert" size="1rem" />
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
          rowKey="key"
          size="middle"
          columns={nodeColumns}
          dataSource={nodeData}
          pagination={false}
        />
      </section>
    </div>
  );
}
