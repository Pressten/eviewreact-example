import { useMemo, useState } from "react";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import SearchInput from "@nce/eview-react/SearchInput";
import Select from "@nce/eview-react/Select";
import Table from "@nce/eview-react/Table";
import { Icon } from "../shared/icon.jsx";
import StatusTag from "../components/status-tag.jsx";
import ContextBanner from "../components/context-banner.jsx";
import { recordList, recordStatusOptions } from "../data/records.js";

function RecordDetail({ metric, onDrill, onBack }) {
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
      key: "batch",
      width: 210,
      render: (value, _oldValue, _text, row) => (
        <Button status="text" text={value} className="cell-link" onClick={() => onDrill(row)} />
      ),
    },
    { title: "采集任务", key: "task", width: 200 },
    { title: "来源节点", key: "node", width: 200 },
    { title: "分区时间", key: "partition", width: 160 },
    {
      title: "记录数",
      key: "rows",
      width: 120,
      align: "right",
      sorter: (a, b) => a.rows - b.rows,
      render: (value) => <span className="num-cell">{value.toLocaleString("zh-CN")}</span>,
    },
    { title: "耗时", key: "cost", width: 100, align: "right" },
    {
      title: "质量分",
      key: "quality",
      width: 100,
      align: "right",
      sorter: (a, b) => a.quality - b.quality,
      render: (value) => <span className="num-cell">{value.toFixed(1)}</span>,
    },
    {
      title: "执行状态",
      key: "status",
      width: 110,
      render: (value) => <StatusTag status={value} />,
    },
    { title: "完成时间", key: "finishedAt", width: 170 },
    {
      title: "操作",
      key: "action",
      width: 120,
      freezeCol: true,
      render: (_value, _oldValue, _text, row) => (
        <div className="row-actions">
          <IconButton
            iconName={<Icon name="git-branch" size={14} />}
            tipText="查看血缘溯源"
            onClick={() => onDrill(row)}
          />
          <IconButton
            iconName={<Icon name="file-text" size={14} />}
            tipText="运行日志"
          />
          <IconButton
            iconName={<Icon name="rotate-ccw" size={14} />}
            tipText="重新调度"
          />
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
          <SearchInput
            value={keyword}
            onSearch={(value) => setKeyword(value)}
            placeholder="搜索批次号、采集任务或来源节点"
            className="toolbar-search"
          />
          <Select options={recordStatusOptions} value={status} onChange={setStatus} className="toolbar-select" />
          <Button
            leftIcon={<Icon name="rotate-ccw" size={14} />}
            text="重置"
            onClick={() => {
              setKeyword("");
              setStatus("all");
            }}
          />
        </div>
        <div className="table-toolbar__extra">
          <span className="table-toolbar__count">
            共 <em>{dataSource.length}</em> 条批次记录
          </span>
          <Button leftIcon={<Icon name="download" size={14} />} text="导出" />
        </div>
      </div>

      <div className="table-hint">
        <Icon name="corner-down-right" size={14} />
        <span>点击批次号或「查看血缘溯源」图标，可继续下钻至该批次的血缘溯源页签。</span>
      </div>

      <Table
        keyIndex="id"
        columns={columns}
        dataset={dataSource}
        enablePagination
        pagingProps={{ pageSize: 10 }}
      />
    </div>
  );
}

export default RecordDetail;
