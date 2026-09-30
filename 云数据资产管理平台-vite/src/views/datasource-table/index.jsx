import { useMemo, useState, useEffect, useRef } from "react";
import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import TipBox from "@nce/eview-react/TipBox";
import SelectCard from "@nce/eview-react/SelectCard";
import {
  IconPlusIcPublicPlus,
  IconPlusIcPublicPower,
  IconPlusIcPublicEllipsis,
  IconPlusIcPublicPaintbrush,
} from "@nce/icon-plus";
import { useApp } from "../../context.jsx";
import { formatRows } from "../../mock/datasource.js";
import PageCard from "../../components/page-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import "./index.css";

const CURRENT_USER = "张伟";
const PAGE_SIZE = 10;

// Layer 4: 数据源列表 — 工具区 + 数据表格 + 内置分页
export default function DatasourceTable() {
  const { list, filters, setStatuses, openEditor, openRemoving, notify } = useApp();
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [view, setView] = useState("all");
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const tableRef = useRef(null);

  useEffect(() => {
    setCurrent(1);
    setSelectedIndexes([]);
  }, [filters, view]);

  const rows = useMemo(() => {
    const keyword = (filters.keyword || "").trim().toLowerCase();
    return list.filter((item) => {
      if (view === "mine" && item.owner !== CURRENT_USER) return false;
      if (filters.type && item.type !== filters.type) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.dept && item.dept !== filters.dept) return false;
      if (filters.range && filters.range.from && filters.range.to) {
        if (item.createdAt < filters.range.from || item.createdAt > filters.range.to) return false;
      }
      if (keyword) {
        const haystack = `${item.name} ${item.id} ${item.address} ${item.owner}`.toLowerCase();
        if (!haystack.includes(keyword)) return false;
      }
      return true;
    });
  }, [list, filters, view]);

  const clearSelection = () => setSelectedIndexes([]);

  const handleBulkStatus = (status, label) => {
    const ids = selectedIndexes.map((i) => rows[i]?.id).filter(Boolean);
    setStatuses(ids, status);
    notify("success", `已${label} ${ids.length} 个数据源`);
    clearSelection();
  };

  const handleRowAction = (key, record) => {
    if (key === "detail") {
      openEditor("edit", record);
      return;
    }
    if (key === "copy") {
      notify("success", `已复制「${record?.name}」的连接配置`);
      return;
    }
    if (key === "log") {
      notify("success", `「${record?.name}」的同步日志已开始导出`);
      return;
    }
    if (key === "delete") {
      openRemoving([record?.id]);
    }
  };

  const columns = [
    {
      title: "数据源名称",
      key: "name",
      width: 240,
      freezeCol: true,
      render: (cell, rowData, options, row) => {
        const record = row?.rawData;
        return (
          <a className="ds-link" onClick={() => openEditor("edit", record)}>
            {cell}
          </a>
        );
      },
    },
    {
      title: "类型",
      key: "type",
      width: 116,
      render: (cell) => <span className="ds-type">{cell}</span>,
    },
    { title: "归属部门", key: "dept", width: 150 },
    { title: "负责人", key: "owner", width: 96 },
    {
      title: "数据表数",
      key: "tables",
      width: 116,
      align: "right",
    },
    {
      title: "数据量",
      key: "rows",
      width: 124,
      align: "right",
      render: (cell) => formatRows(cell),
    },
    { title: "更新频率", key: "freq", width: 108 },
    {
      title: "运行状态",
      key: "status",
      width: 118,
      render: (cell) => <StatusTag status={cell} />,
    },
    {
      title: "最近更新时间",
      key: "updatedAt",
      width: 172,
      render: (cell) => <span className="ds-muted">{cell}</span>,
    },
    {
      title: "操作",
      key: "action",
      width: 148,
      align: "left",
      allowSort: false,
      render: (cell, rowData, options, row) => {
        const record = row?.rawData;
        return (
          <div className="ds-actions">
            <IconButton
              iconName={<IconPlusIcPublicPaintbrush iconSize="0.875rem" iconColor={["currentcolor"]} />}
              tipText="编辑"
              size="small"
              onClick={() => openEditor("edit", record)}
            />
            <IconButton
              iconName={<IconPlusIcPublicPower iconSize="0.875rem" iconColor={["currentcolor"]} />}
              tipText={record?.status === "offline" ? "上线" : "下线"}
              size="small"
              onClick={() => {
                setStatuses([record?.id], record?.status === "offline" ? "online" : "offline");
                notify("success", record?.status === "offline" ? "数据源已上线" : "数据源已下线");
              }}
            />
            <TipBox
              trigger="click"
              direction="bottomRight"
              isMouseLeaveClose
              content={
                <div className="app-dropdown-menu">
                  <button type="button" className="app-dropdown-item" onClick={() => handleRowAction("detail", record)}>
                    查看详情
                  </button>
                  <button type="button" className="app-dropdown-item" onClick={() => handleRowAction("copy", record)}>
                    复制配置
                  </button>
                  <button type="button" className="app-dropdown-item" onClick={() => handleRowAction("log", record)}>
                    导出同步日志
                  </button>
                  <div className="app-dropdown-divider" />
                  <button type="button" className="app-dropdown-item app-dropdown-item--danger" onClick={() => handleRowAction("delete", record)}>
                    删除数据源
                  </button>
                </div>
              }
            >
              <Button status="text" leftIcon={<IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={["currentcolor"]} />} />
            </TipBox>
          </div>
        );
      },
    },
  ];

  const hasSelection = selectedIndexes.length > 0;
  const selectedIds = selectedIndexes.map((i) => rows[i]?.id).filter(Boolean);

  return (
    <PageCard
      title="数据源列表"
      subtitle={`已接入 ${list.length} 个数据源`}
      className="table-card"
      bodyClassName="table-card__body"
      extra={
        <>
          <SelectCard
            type="small"
            value={view}
            onChange={(value) => setView(value)}
            data={[
              { text: "全部数据源", value: "all" },
              { text: "我负责的", value: "mine" },
            ]}
          />
          <Button
            status="primary"
            leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={["currentcolor"]} />}
            text="新建数据源"
            onClick={() => openEditor("create")}
          />
        </>
      }
    >
      <div className="table-toolbar">
        <div className="table-toolbar__info">
          {hasSelection ? `已选 ${selectedIndexes.length} 项` : `共 ${rows.length} 条记录`}
        </div>
        <div className="table-toolbar__actions">
          {hasSelection ? (
            <>
              <a className="ds-link ds-link--plain" onClick={clearSelection}>
                取消选择
              </a>
              <Button size="small" text="批量上线" onClick={() => handleBulkStatus("online", "上线")} />
              <Button size="small" text="批量下线" onClick={() => handleBulkStatus("offline", "下线")} />
              <Button size="small" status="risk" text="批量删除" onClick={() => openRemoving(selectedIds)} />
            </>
          ) : null}
        </div>
      </div>

      <Table
        ref={tableRef}
        columns={columns}
        dataset={rows}
        freezeColPosition="left"
        enableCheckBox
        checkType="multi"
        checkedRows={selectedIndexes}
        onRowCheck={(row, checkedRows) => setSelectedIndexes(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedIndexes(checkedRows)}
        enablePagination
        enableAutoPaging
        pagingProps={{
          pageSize,
          currentPage: current,
          pageSizeOptions: [10, 20, 50],
          onPageSizeChange: (size) => {
            setPageSize(size);
            setCurrent(1);
          },
        }}
        onPageChange={(page) => setCurrent(page)}
        emptyTableMsg="暂无数据源"
      />
    </PageCard>
  );
}
