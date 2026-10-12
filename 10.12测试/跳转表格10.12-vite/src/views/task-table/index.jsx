import { useState } from "react";
import { IconPlusIcPublicDownload, IconPlusIcPublicEye, IconPlusIcPublicPlus, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicSearch, IconPlusIcPublicTrash } from '@nce/icon-plus';
import Table from "@nce/eview-react/Table";
import TextField from "@/shared/TextField";
import Button from "@nce/eview-react/Button";
import { useApp } from "../../context.jsx";
import { tasks, STAGES, TASK_STATUS } from "../../mock/task.js";
import StatusTag from "../../components/status-tag/index.jsx";
import StepFlow from "../../components/step-flow/index.jsx";
import "../shared-table.css";

// Layer 4: 任务清单表格 — 含步骤条列,名称链接可跳转链路详情页签
export default function TaskTable() {
  const { openDetail } = useApp();
  const [checkedIndexes, setCheckedIndexes] = useState([]);
  const [keyword, setKeyword] = useState("");

  const data = tasks.filter((t) => {
    if (!keyword) return true;
    const k = keyword.toLowerCase();
    return (
      t.name.toLowerCase().indexOf(k) > -1 ||
      t.id.toLowerCase().indexOf(k) > -1 ||
      t.owner.indexOf(keyword) > -1
    );
  });

  const columns = [
    {
      title: "任务名称",
      key: "name",
      width: 210,
      allowSort: false,
      render: (value, _rowData, _opts, row) => {
        const r = row?.rawData;
        return (
          <a className="table-link" onClick={() => openDetail({ kind: "task", ...r })}>
            {value}
          </a>
        );
      },
    },
    {
      title: "任务类型",
      key: "typeLabel",
      width: 110,
      allowSort: false,
    },
    { title: "数据源", key: "source", width: 130, allowSort: false },
    { title: "负责人", key: "owner", width: 90, allowSort: false },
    {
      title: "状态",
      key: "status",
      width: 120,
      allowSort: false,
      render: (value) => <StatusTag {...TASK_STATUS[value]} />,
    },
    {
      title: "阶段流程",
      key: "stage",
      width: 210,
      allowSort: false,
      render: (_cell, _rowData, _opts, row) => {
        const r = row?.rawData;
        return <StepFlow stages={STAGES} stage={r?.stage} status={r?.status} variant="cell" />;
      },
    },
    {
      title: "数据量",
      key: "rows",
      width: 110,
      align: "right",
      allowSort: false,
    },
    {
      title: "创建时间",
      key: "createdAt",
      width: 170,
    },
    {
      title: "操作",
      key: "action",
      width: 130,
      allowSort: false,
      freezeCol: true,
      render: (_cell, _rowData, _opts, row) => {
        const r = row?.rawData;
        return (
          <div className="table-actions">
            <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['currentcolor']} title="查看链路详情" onClick={() => openDetail({ kind: "task", ...r })} />
            <IconPlusIcPublicRefreshClockwise iconSize="0.875rem" iconColor={['currentcolor']} title="重新执行" />
            <IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} title="删除任务" />
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
              <a className="table-link">批量导出</a>
            </span>
          ) : (
            <span className="data-toolbar__hint">共 {data.length} 个任务，点击任务名称可跳转链路详情</span>
          )}
        </div>
        <div className="data-toolbar__right">
          <TextField
            placeholder="搜索名称、ID 或负责人"
            value={keyword}
            onChange={(value) => setKeyword(value)}
            suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />}
            style={{ width: "14rem" }}
          />
          <Button text="导出" leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} />
          <Button status="primary" text="新建任务" leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />} />
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
        emptyTableMsg="暂无任务"
      />
    </div>
  );
}
