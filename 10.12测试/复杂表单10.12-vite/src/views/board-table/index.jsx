// Layer 4: 板卡配置清单表格 — 页面最下方信息区
import { useMemo, useState } from "react";
import { IconPlusIcIctTopoEdit, IconPlusIcPublicCopy, IconPlusIcPublicDownload, IconPlusIcPublicPlus, IconPlusIcPublicSearch, IconPlusIcPublicTrash } from '@nce/icon-plus';
import Button from "@nce/eview-react/Button";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import Table from "@nce/eview-react/Table";
import DivMessage from "@nce/eview-react/DivMessage";
import StatusTag from "../../components/status-tag/index.jsx";
import { boardRows, STATUS_DICT, vendorOptions } from "../../mock/operator.js";
import "./index.css";

const VENDOR_MAP = vendorOptions.reduce((acc, item) => {
  acc[item.value] = item.text.replace(/（.*）/, "");
  return acc;
}, {});

const STATUS_FILTERS = Object.entries(STATUS_DICT).map(([value, cfg]) => ({
  text: cfg.text,
  value,
}));

export default function BoardTable() {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIndexes, setSelectedIndexes] = useState(() =>
    boardRows
      .map((row, idx) => (["BD-2403", "BD-2410"].includes(row.id) ? idx : -1))
      .filter((i) => i >= 0)
  );
  const [notice, setNotice] = useState(null);
  const notify = (type, text) => setNotice({ type, text, key: Date.now() });

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
      render: (cell) => VENDOR_MAP[cell] || cell,
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
      render: (cell) => <StatusTag status={cell} />,
    },
    {
      title: "更新时间",
      key: "updatedAt",
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      align: "left",
      allowSort: false,
      render: (cell, rowData, options, row) => {
        const record = row?.rawData;
        return (
          <div className="row-actions">
            <IconPlusIcIctTopoEdit iconSize="0.875rem" iconColor={['currentcolor']} title="编辑板卡" onClick={() => notify("default", `编辑 ${record?.name}`)} />
            <IconPlusIcPublicCopy iconSize="0.875rem" iconColor={['currentcolor']} title="复制板卡" onClick={() => notify("default", `复制 ${record?.name}`)} />
            <IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} title="删除板卡" onClick={() => notify("default", `删除 ${record?.name}`)} />
          </div>
        );
      },
    },
  ];

  return (
    <section className="board-table">
      {notice ? (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
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
            onChange={(value) => setKeyword(value)}
            suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />}
          />
          <Select
            className="board-table__filter"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[{ value: "all", text: "全部状态" }, ...STATUS_FILTERS]}
          />
          <Button leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} text="导出" />
          <Button status="primary" leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />} text="新增板卡" />
        </div>
      </header>

      {selectedIndexes.length > 0 ? (
        <div className="board-table__selected">
          <span>
            已选择 <em>{selectedIndexes.length}</em> 项
          </span>
          <div className="board-table__selected-actions">
            <a
              className="table-link"
              onClick={() => notify("default", `批量激活 ${selectedIndexes.length} 块板卡`)}
            >
              批量激活
            </a>
            <a
              className="table-link"
              onClick={() => setSelectedIndexes([])}
            >
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
        checkedRows={selectedIndexes}
        onRowCheck={(row, checkedRows) => setSelectedIndexes(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedIndexes(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSize={8}
      />
    </section>
  );
}
