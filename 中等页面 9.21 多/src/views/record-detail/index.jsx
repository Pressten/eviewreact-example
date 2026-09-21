import { useMemo, useState } from "react";
import { Button, Input, Select, Table, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icons.js";
import StatusTag from "../../components/status-tag/index.jsx";
import ContextBanner from "../../components/context-banner/index.jsx";
import { recordList, recordStatusOptions } from "../../mock/records.js";
import "./index.css";

// Layer 4: 二级页签「采集明细」— 由指标清单下钻进入；批次号链接再下钻到血缘溯源页签
export default function RecordDetail({ metric, onDrill, onBack }) {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");

  const dataSource = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return recordList.filter((item) => {
      const hitKeyword =
        !kw ||
        item.batch.toLowerCase().includes(kw) ||
        item.task.toLowerCase().includes(kw) ||
        item.node.toLowerCase().includes(kw);
      const hitStatus = status === "all" || item.status === status;
      return hitKeyword && hitStatus;
    });
  }, [keyword, status]);

  const successCount = recordList.filter((r) => r.status === "success").length;
  const failedCount = recordList.filter((r) => r.status === "failed").length;
  const avgQuality = (
    recordList.reduce((sum, r) => sum + r.quality, 0) / recordList.length
  ).toFixed(1);

  const columns = [
    {
      title: "批次号",
      dataIndex: "batch",
      key: "batch",
      width: 210,
      fixed: "left",
      render: (text, record) => (
        <Button type="link" size="small" className="cell-link" onClick={() => onDrill(record)}>
          {text}
        </Button>
      ),
    },
    { title: "采集任务", dataIndex: "task", key: "task", width: 200 },
    { title: "来源节点", dataIndex: "node", key: "node", width: 200 },
    { title: "分区时间", dataIndex: "partition", key: "partition", width: 160 },
    {
      title: "记录数",
      dataIndex: "rows",
      key: "rows",
      width: 120,
      align: "right",
      sorter: (a, b) => a.rows - b.rows,
      render: (value) => <span className="num-cell">{value.toLocaleString("zh-CN")}</span>,
    },
    {
      title: "耗时",
      dataIndex: "cost",
      key: "cost",
      width: 100,
      align: "right",
    },
    {
      title: "质量分",
      dataIndex: "quality",
      key: "quality",
      width: 100,
      align: "right",
      sorter: (a, b) => a.quality - b.quality,
      render: (value) => <span className="num-cell">{value.toFixed(1)}</span>,
    },
    {
      title: "执行状态",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (value) => <StatusTag status={value} />,
    },
    { title: "完成时间", dataIndex: "finishedAt", key: "finishedAt", width: 170 },
    {
      title: "操作",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <div className="row-actions">
          <Tooltip title="查看血缘溯源">
            <Button
              type="text"
              shape="circle"
              size="small"
              icon={<Icon name="git-branch" size={14} />}
              onClick={() => onDrill(record)}
            />
          </Tooltip>
          <Tooltip title="运行日志">
            <Button type="text" shape="circle" size="small" icon={<Icon name="file-text" size={14} />} />
          </Tooltip>
          <Tooltip title="重新调度">
            <Button type="text" shape="circle" size="small" icon={<Icon name="rotate-ccw" size={14} />} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="record-detail">
      <ContextBanner
        icon="database"
        title={metric ? metric.name : "全部指标"}
        crumb={metric ? `${metric.code} · ${metric.domain} · 数据源 ${metric.source}` : "未选择指标，展示全部采集记录"}
        fields={
          metric
            ? [
                { label: "更新频率", value: metric.frequency },
                { label: "负责人", value: metric.owner },
                { label: "质量评分", value: metric.score.toFixed(1) },
              ]
            : []
        }
        onBack={onBack}
        backText="返回指标清单"
      />

      <div className="record-detail__stats">
        <div className="mini-stat">
          <span className="mini-stat__label">采集批次</span>
          <span className="mini-stat__value">{recordList.length}</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat__label">成功批次</span>
          <span className="mini-stat__value mini-stat__value--success">{successCount}</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat__label">失败批次</span>
          <span className="mini-stat__value mini-stat__value--error">{failedCount}</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat__label">平均质量分</span>
          <span className="mini-stat__value">{avgQuality}</span>
        </div>
      </div>

      <div className="table-toolbar">
        <div className="table-toolbar__filters">
          <Input
            allowClear
            className="toolbar-search"
            prefix={<Icon name="search" size={14} />}
            placeholder="搜索批次号、采集任务或来源节点"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Select className="toolbar-select" options={recordStatusOptions} value={status} onChange={setStatus} />
          <Button
            icon={<Icon name="rotate-ccw" size={14} />}
            onClick={() => {
              setKeyword("");
              setStatus("all");
            }}
          >
            重置
          </Button>
        </div>
        <div className="table-toolbar__extra">
          <span className="table-toolbar__count">
            共 <em>{dataSource.length}</em> 条批次记录
          </span>
          <Button icon={<Icon name="download" size={14} />}>导出</Button>
        </div>
      </div>

      <div className="table-hint">
        <Icon name="corner-down-right" size={14} />
        <span>点击批次号或「查看血缘溯源」图标，可继续下钻至该批次的血缘溯源页签。</span>
      </div>

      <Table
        rowKey="id"
        size="middle"
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1500 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </div>
  );
}
