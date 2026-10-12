import { useMemo, useState } from "react";
import { IconPlusIcIctExportFile, IconPlusIcPublicCopy, IconPlusIcPublicPlus, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicSearch, IconPlusIcPublicTrash, IconPlusIcPublicUpdate } from '@nce/icon-plus';
import Button from "@nce/eview-react/Button";
import PopUpMenu from "@nce/eview-react/PopUpMenu";
import TextField from "@/shared/TextField";
import Table from "@nce/eview-react/Table";
import DivMessage from "@nce/eview-react/DivMessage";
import SectionCard from "../../components/section-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { DEVICE_STATUS } from "../../mock/devices.js";
import {
  deviceTypeLabel,
  deviceTypeOptions,
  protocolLabel,
  protocolOptions,
} from "../../mock/form-options.js";
import "./index.css";

export default function DeviceTable({ data, onDelete, onDeleteMany, onDuplicate, onAdd }) {
  const [keyword, setKeyword] = useState("");
  const [checkedIndexes, setCheckedIndexes] = useState([]);
  const [notice, setNotice] = useState(null);

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

  const columns = [
    {
      title: "设备名称",
      key: "name",
      render: (cell, _rd, _opt, row) => {
        const r = row ? row.rawData : undefined;
        return (
          <a
            className="table-link"
            onClick={() =>
              setNotice({
                type: "default",
                text: "查看设备 " + (r ? r.code : ""),
                key: Date.now(),
              })
            }
          >
            {cell}
          </a>
        );
      },
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
      allowSort: false,
      render: (cell) => (cell === null || cell === undefined ? "—" : cell),
    },
    { title: "采集周期(s)", key: "samples", align: "right", width: 120 },
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
      allowSort: false,
      render: (_cell, _rd, _opt, row) => {
        const r = row ? row.rawData : undefined;
        return (
          <div className="row-actions">
            <IconPlusIcPublicUpdate
              iconSize="0.875rem"
              iconColor={['currentcolor']}
              className="row-action"
              title="编辑"
              onClick={() =>
                setNotice({
                  type: "default",
                  text: "编辑 " + (r ? r.code : ""),
                  key: Date.now(),
                })
              }
            />
            <IconPlusIcPublicCopy iconSize="0.875rem" iconColor={['currentcolor']} className="row-action" title="复制" onClick={() => onDuplicate(r ? r.id : undefined)} />
            <IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} className="row-action" title="删除" onClick={() => onDelete(r ? r.id : undefined)} />
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
        onChange={(value) => {
          setKeyword(value);
          setCheckedIndexes([]);
          setNotice(null);
        }}
      />
      <IconPlusIcPublicRefreshClockwise
        iconSize="1rem"
        iconColor={['currentcolor']}
        className="toolbar-icon"
        title="刷新列表"
        onClick={() => {
          setKeyword("");
          setCheckedIndexes([]);
          setNotice({ type: "success", text: "列表已刷新", key: Date.now() });
        }}
      />
      <PopUpMenu
        options={[
          { id: "csv", text: "导出 CSV", serialno: "csv" },
          { id: "excel", text: "导出 Excel", serialno: "excel" },
        ]}
        onClick={(evt) =>
          setNotice({
            type: "success",
            text: "已导出 " + rows.length + " 条记录（" + evt.value + "）",
            key: Date.now(),
          })
        }
      >
        <Button leftIcon={<IconPlusIcIctExportFile iconSize="0.875rem" iconColor={['currentcolor']} />} text="导出" />
      </PopUpMenu>
      <Button
        status="primary"
        leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />}
        text="新增配置"
        onClick={onAdd}
      />
    </div>
  );

  const handleBatchEnable = () => {
    setNotice({
      type: "success",
      text: "已启用 " + checkedIndexes.length + " 台设备",
      key: Date.now(),
    });
    setCheckedIndexes([]);
  };

  const handleBatchDelete = () => {
    const ids = checkedIndexes
      .map((i) => (rows[i] ? rows[i].id : undefined))
      .filter((id) => id !== undefined);
    onDeleteMany(ids);
    setCheckedIndexes([]);
  };

  return (
    <SectionCard
      title="设备接入列表"
      subtitle={"共 " + data.length + " 台设备 · 当前展示 " + rows.length + " 条"}
      extra={toolbar}
    >
      {checkedIndexes.length > 0 ? (
        <div className="device-table__selection">
          <span className="device-table__selection-text">
            已选 {checkedIndexes.length} 项
          </span>
          <div className="device-table__selection-actions">
            <a className="table-link" onClick={handleBatchEnable}>
              批量启用
            </a>
            <a className="table-link" onClick={handleBatchDelete}>
              批量删除
            </a>
          </div>
        </div>
      ) : null}

      <Table
        columns={columns}
        dataset={rows}
        enableCheckBox
        checkType="multi"
        preserveCheckedRows
        checkedRows={checkedIndexes}
        onRowCheck={(_row, checkedRows) => setCheckedIndexes(checkedRows)}
        onHeaderCheck={(checkedRows) => setCheckedIndexes(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
      />

      {notice ? (
        <div className="app-notice">
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            enableDisposeTimeOut={!notice.persistent}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
    </SectionCard>
  );
}
