// Layer 4: 板卡配置清单表格 — 页面最下方信息区
import { useMemo, useState } from "react";
import { IconPlusIcIctBulkEdit, IconPlusIcPublicCopy, IconPlusIcPublicDownload, IconPlusIcPublicPlus, IconPlusIcPublicSearch, IconPlusIcPublicTrash } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import Table from "@nce/eview-react/Table";
import DivMessage from "@nce/eview-react/DivMessage";
import StatusTag from "../../components/status-tag/index.jsx";
import { boardRows, STATUS_DICT, vendorOptions } from "../../mock/operator.js";
import "./index.css";

const VENDOR_MAP = vendorOptions.reduce((acc, item) => {
  acc[item.value] = item.label.replace(/（.*）/, "");
  return acc;
}, {});

const STATUS_FILTERS = Object.entries(STATUS_DICT).map(([value, cfg]) => ({
  text: cfg.text,
  value,
}));

const STATUS_FILTER_OPTIONS = [{ text: "全部状态", value: "all" }, ...STATUS_FILTERS];

export default function BoardTable() {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [checkedIndexes, setCheckedIndexes] = useState([2, 9]);
  const [notice, setNotice] = useState(null);

  const notify = (type, text) => {
    setNotice({ type, text, key: Date.now() });
  };

  const dataSource = useMemo(() => {
    return boardRows.filter((row) => {
      const matchKeyword =
        !keyword ||
        row.name.includes(keyword) ||
        row.id.toLowerCase().includes(keyword.toLowerCase()) ||
        row.model.toLowerCase().includes(keyword.toLowerCase());
      const matchStatus = statusFilter === "all" || row.status === statusFilter;
      return matchKeyword && matchStatus;
    });
  }, [keyword, statusFilter]);

  const columns = [
    {
      title: "板卡名称",
      key: "name",
      allowSort: false,
      render: (cell) => (
        <a className="table-link" onClick={() => notify("default", `查看板卡详情：${cell}`)}>
          {cell}
        </a>
      ),
    },
    {
      title: "槽位号",
      key: "slot",
      width: 92,
      align: "right",
      sort: "asc",
    },
    {
      title: "板卡型号",
      key: "model",
      allowSort: false,
    },
    {
      title: "厂商",
      key: "vendor",
      allowSort: false,
      render: (v) => VENDOR_MAP[v] || v,
    },
    {
      title: "端口总数",
      key: "ports",
      width: 104,
      align: "right",
    },
    {
      title: "已用端口",
      key: "usedPorts",
      width: 104,
      align: "right",
    },
    {
      title: "软件版本",
      key: "version",
      allowSort: false,
    },
    {
      title: "状态",
      key: "status",
      width: 108,
      allowSort: false,
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: "更新时间",
      key: "updatedAt",
      width: 156,
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      align: "left",
      allowSort: false,
      render: (_cell, _rowData, _options, row) => {
        const r = row?.rawData;
        return (
          <div className="row-actions" style={{ display: "flex", gap: "0.5rem" }}>
            <IconPlusIcIctBulkEdit
              iconSize="0.875rem"
              iconColor={['currentcolor']}
              title="编辑板卡"
              style={{ cursor: "pointer" }}
              onClick={() => notify("default", `编辑 ${r?.name ?? ""}`)}
            />
            <IconPlusIcPublicCopy
              iconSize="0.875rem"
              iconColor={['currentcolor']}
              title="复制板卡"
              style={{ cursor: "pointer" }}
              onClick={() => notify("default", `复制 ${r?.name ?? ""}`)}
            />
            <IconPlusIcPublicTrash
              iconSize="0.875rem"
              iconColor={['currentcolor']}
              title="删除板卡"
              style={{ cursor: "pointer" }}
              onClick={() => notify("default", `删除 ${r?.name ?? ""}`)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <section className="board-table">
      {notice ? (
        <div
          style={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1050,
          }}
        >
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}

      <header className="board-table__head">
        <div className="board-table__title-wrap">
          <h3 className="board-table__title">板卡配置清单</h3>
          <span className="board-table__subtitle">
            共 {dataSource.length} 块板卡 · 与上方「设备与板卡信息」联动
          </span>
        </div>
        <div className="board-table__tools">
          <TextField
            className="board-table__search"
            placeholder="搜索板卡名称、型号或编号"
            value={keyword}
            onChange={(v) => setKeyword(v)}
            suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />}
          />
          <Select
            className="board-table__filter"
            value={statusFilter}
            onChange={(v) => setStatusFilter(v)}
            options={STATUS_FILTER_OPTIONS}
          />
          <Button text="导出" leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} />
          <Button
            status="primary"
            text="新增板卡"
            leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />}
          />
        </div>
      </header>

      {checkedIndexes.length > 0 ? (
        <div className="board-table__selected">
          <span>
            已选择 <em>{checkedIndexes.length}</em> 项
          </span>
          <div className="board-table__selected-actions">
            <a
              className="table-link"
              onClick={() => notify("default", `批量激活 ${checkedIndexes.length} 块板卡`)}
            >
              批量激活
            </a>
            <a className="table-link" onClick={() => setCheckedIndexes([])}>
              取消选择
            </a>
          </div>
        </div>
      ) : null}

      <Table
        columns={columns}
        dataset={dataSource}
        enableCheckBox
        checkType="multi"
        checkedRows={checkedIndexes}
        onRowCheck={(_row, rows) => setCheckedIndexes(rows)}
        onHeaderCheck={(rows) => setCheckedIndexes(rows)}
        enablePagination
        enableAutoPaging
        pagingProps={{ pageSize: 8, pageSizeOptions: [8, 16, 24, 50] }}
        emptyTableMsg="暂无板卡"
      />
    </section>
  );
}
