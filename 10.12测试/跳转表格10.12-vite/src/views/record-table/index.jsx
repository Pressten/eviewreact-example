import { useState } from "react";
import { IconPlusIcCarRotateRight, IconPlusIcDigitalPowerDpFile, IconPlusIcPublicDownload, IconPlusIcPublicEye, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicSearch } from '@nce/icon-plus';
import Table from "@nce/eview-react/Table";
import TextField from "@/shared/TextField";
import Button from "@nce/eview-react/Button";
import { useApp } from "../../context.jsx";
import { records, RECORD_STAGES, RECORD_STATUS } from "../../mock/record.js";
import StatusTag from "../../components/status-tag/index.jsx";
import StepFlow from "../../components/step-flow/index.jsx";
import "../shared-table.css";

// Layer 4: 执行记录表格 — 含步骤条列,执行 ID 链接可跳转链路详情页签
export default function RecordTable() {
  const { openDetail } = useApp();
  const [checkedIndexes, setCheckedIndexes] = useState([]);
  const [keyword, setKeyword] = useState("");

  const data = records.filter((r) => {
    if (!keyword) return true;
    const k = keyword.toLowerCase();
    return (
      r.id.toLowerCase().indexOf(k) > -1 ||
      r.name.toLowerCase().indexOf(k) > -1 ||
      r.node.indexOf(keyword) > -1
    );
  });

  const columns = [
    {
      title: "执行 ID",
      key: "id",
      width: 190,
      allowSort: false,
      render: (value, _rowData, _opts, row) => {
        const r = row?.rawData;
        return (
          <a className="table-link" onClick={() => openDetail({ kind: "record", ...r })}>
            {value}
          </a>
        );
      },
    },
    {
      title: "关联任务",
      key: "name",
      width: 240,
      allowSort: false,
      render: (value, _rowData, _opts, row) => {
        const r = row?.rawData;
        return (
          <a className="table-link" onClick={() => openDetail({ kind: "record", ...r })}>
            {value}
          </a>
        );
      },
    },
    { title: "执行节点", key: "node", width: 140, allowSort: false },
    {
      title: "执行结果",
      key: "status",
      width: 110,
      allowSort: false,
      render: (value) => <StatusTag {...RECORD_STATUS[value]} />,
    },
    {
      title: "阶段流程",
      key: "stage",
      width: 210,
      allowSort: false,
      render: (_cell, _rowData, _opts, row) => {
        const r = row?.rawData;
        return <StepFlow stages={RECORD_STAGES} stage={r?.stage} status={r?.status} variant="cell" />;
      },
    },
    { title: "耗时", key: "duration", width: 120, allowSort: false },
    {
      title: "开始时间",
      key: "startTime",
      width: 170,
    },
    {
      title: "操作",
      key: "action",
      width: 110,
      allowSort: false,
      freezeCol: true,
      render: (_cell, _rowData, _opts, row) => {
        const r = row?.rawData;
        return (
          <div className="table-actions">
            <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['currentcolor']} title="查看链路详情" onClick={() => openDetail({ kind: "record", ...r })} />
            <IconPlusIcCarRotateRight iconSize="0.875rem" iconColor={['currentcolor']} title="重新执行" />
            <IconPlusIcDigitalPowerDpFile iconSize="0.875rem" iconColor={['currentcolor']} title="查看日志" />
          </div>
        );
      },
    },
  ];

  return (
    <div className="data-view">
      <div className="data-toolbar">
        <div className="data-toolbar__left">
          {checkedIndexes.length > 0 ? (
            <span className="data-toolbar__selected">
              已选 {checkedIndexes.length} 项
              <a className="table-link">批量重跑</a>
              <a className="table-link">下载日志</a>
            </span>
          ) : (
            <span className="data-toolbar__hint">共 {data.length} 条执行记录，点击执行 ID 可跳转链路详情</span>
          )}
        </div>
        <div className="data-toolbar__right">
          <TextField
            placeholder="搜索执行 ID、任务或节点"
            value={keyword}
            onChange={(value) => setKeyword(value)}
            suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />}
            style={{ width: "15rem" }}
          />
          <Button text="刷新" leftIcon={<IconPlusIcPublicRefreshClockwise iconSize="0.875rem" iconColor={['currentcolor']} />} />
          <Button status="primary" text="导出记录" leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} />
        </div>
      </div>
      <Table
        className="data-table"
        columns={columns}
        dataset={data}
        freezeColPosition="right"
        enableCheckBox
        checkType="multi"
        onRowCheck={(_row, checkedRows) => setCheckedIndexes(checkedRows)}
        onHeaderCheck={(checkedRows) => setCheckedIndexes(checkedRows)}
        enablePagination
        enableAutoPaging
        pagingProps={{ pageSize: 8, pageSizeOptions: [8, 20, 50] }}
        emptyTableMsg="暂无执行记录"
      />
    </div>
  );
}
