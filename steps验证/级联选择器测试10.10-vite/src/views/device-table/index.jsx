import { useMemo, useRef, useState } from "react";
import { IconPlusIcPublicCopy, IconPlusIcPublicDownload, IconPlusIcPublicPaintbrush, IconPlusIcPublicPlus, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicSearch, IconPlusIcPublicTrash } from '@nce/icon-plus';
import Button from "@nce/eview-react/Button";
import PopUpMenu from "@nce/eview-react/PopUpMenu";
import Table from "@nce/eview-react/Table";
import TextField from "@/shared/TextField";
import { notify } from "@/shared/Notice";
import SectionCard from "../../components/section-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { DEVICE_STATUS } from "../../mock/devices.js";
import { deviceTypeLabel, protocolLabel } from "../../mock/form-options.js";
import "./index.css";

export default function DeviceTable({ data, onDelete, onDeleteMany, onDuplicate, onAdd }) {
  const [keyword, setKeyword] = useState("");
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const tableRef = useRef(null);

  const rows = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return data;
    return data.filter(
      (row) =>
        row.name.toLowerCase().indexOf(kw) >= 0 ||
        row.code.toLowerCase().indexOf(kw) >= 0 ||
        row.region.toLowerCase().indexOf(kw) >= 0
    );
  }, [data, keyword]);

  const customSortFun = (key, a, b) => {
    switch (key) {
      case "name":
        return String(a && a.name ? a.name : "").localeCompare(
          String(b && b.name ? b.name : ""), "zh");
      case "port":
        return ((a && a.port) || 0) - ((b && b.port) || 0);
      case "samples":
        return ((a && a.samples) || 0) - ((b && b.samples) || 0);
      case "updatedAt":
        return String(a && a.updatedAt ? a.updatedAt : "").localeCompare(
          String(b && b.updatedAt ? b.updatedAt : ""));
      default:
        return 0;
    }
  };

  const columns = [
    { title: "ID", key: "id", display: false },
    {
      title: "设备名称",
      key: "name",
      render: (cell, rowData, options, row) => (
        <a
          className="table-link"
          onClick={() =>
            notify("info", "查看设备 " + (row && row.rawData ? row.rawData.code : ""))
          }
        >
          {cell}
        </a>
      ),
    },
    { title: "设备编码", key: "code", allowSort: false },
    {
      title: "设备类型",
      key: "type",
      allowSort: false,
      render: (cell) => deviceTypeLabel(cell),
    },
    { title: "所属分组", key: "group", allowSort: false },
    { title: "部署位置", key: "region", allowSort: false },
    {
      title: "接入协议",
      key: "protocol",
      allowSort: false,
      render: (cell) => protocolLabel(cell),
    },
    {
      title: "端口",
      key: "port",
      align: "right",
      width: 90,
      render: (cell) => (cell === null || cell === undefined ? "—" : cell),
    },
    {
      title: "采集周期(s)",
      key: "samples",
      align: "right",
      width: 120,
    },
    {
      title: "状态",
      key: "status",
      width: 110,
      allowSort: false,
      render: (cell) => {
        const meta = DEVICE_STATUS[cell] || { text: cell, tone: "neutral" };
        return <StatusTag tone={meta.tone}>{meta.text}</StatusTag>;
      },
    },
    { title: "更新时间", key: "updatedAt", width: 170 },
    {
      title: "操作",
      key: "action",
      width: 130,
      freezeCol: true,
      allowSort: false,
      render: (cell, rowData, options, row) => {
        const r = row && row.rawData ? row.rawData : null;
        const full = r ? rows.find((d) => d.id === r.id) || r : null;
        return (
          <div className="row-actions">
            <IconPlusIcPublicPaintbrush iconSize="0.875rem" iconColor={['currentcolor']} className="row-action" title="编辑" onClick={() => notify("info", "编辑 " + (full ? full.code : ""))} style={{ cursor: 'pointer' }} />
            <IconPlusIcPublicCopy iconSize="0.875rem" iconColor={['currentcolor']} className="row-action" title="复制" onClick={() => onDuplicate(full ? full.id : undefined)} style={{ cursor: 'pointer' }} />
            <IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} className="row-action" title="删除" onClick={() => onDelete(full ? full.id : undefined)} style={{ cursor: 'pointer' }} />
          </div>
        );
      },
    },
  ];

  const toolbar = (
    <div className="device-table__toolbar">
      <TextField
        className="device-table__search"
        placeholder="搜索名称、编码或位置"
        value={keyword}
        suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />}
        onChange={(value) => setKeyword(value)}
      />
      <IconPlusIcPublicRefreshClockwise iconSize="1rem" iconColor={['currentcolor']} className="toolbar-icon" title="刷新列表" onClick={() => {
          setKeyword("");
          notify("success", "列表已刷新");
        }} style={{ cursor: 'pointer' }} />
      <PopUpMenu
        options={[
          { id: "csv", text: "导出 CSV", serialno: "csv" },
          { id: "excel", text: "导出 Excel", serialno: "excel" },
        ]}
        onClick={(evt) =>
          notify("success", "已导出 " + rows.length + " 条记录（" + evt.value + "）")
        }
      >
        <Button text="导出" leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} />
      </PopUpMenu>
      <Button
        status="primary"
        text="新增配置"
        leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />}
        onClick={onAdd}
      />
    </div>
  );

  return (
    <SectionCard
      title="设备接入列表"
      subtitle={"共 " + data.length + " 台设备 · 当前展示 " + rows.length + " 条"}
      extra={toolbar}
    >
      {selectedIndexes.length > 0 ? (
        <div className="device-table__selection">
          <span className="device-table__selection-text">已选 {selectedIndexes.length} 项</span>
          <div className="device-table__selection-actions">
            <a
              className="table-link"
              onClick={() => {
                notify("success", "已启用 " + selectedIndexes.length + " 台设备");
                setSelectedIndexes([]);
              }}
            >
              批量启用
            </a>
            <a
              className="table-link"
              onClick={() => {
                const checkedData =
                  tableRef.current ? tableRef.current.getCheckedRowsData() : [];
                onDeleteMany(checkedData.map((r) => r.id));
                setSelectedIndexes([]);
              }}
            >
              批量删除
            </a>
          </div>
        </div>
      ) : null}

      <Table
        ref={tableRef}
        columns={columns}
        dataset={rows}
        enableCheckBox
        checkType="multi"
        preserveCheckedRows
        checkedRows={selectedIndexes}
        onRowCheck={(row, checkedRows) => setSelectedIndexes(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedIndexes(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        freezeColPosition="right"
        customSortFun={customSortFun}
        emptyTableMsg="暂无设备数据"
      />
    </SectionCard>
  );
}
