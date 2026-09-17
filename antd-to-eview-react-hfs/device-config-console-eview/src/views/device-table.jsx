// Layer 4: 设备配置清单 — 工具栏(搜索/筛选/刷新) + 复选表格 + 行内操作
// eview-react 转换要点:
//   Table: dataSource→dataset(对象行)、rowKey→keyIndex(指向 code 列)、rowSelection→enableCheckBox、
//          pagination→enablePagination+enableAutoPaging(前台分页)、loading→enableLoading、locale.emptyText→emptyTableMsg
//   行内 Dropdown 菜单退化为内联文字按钮;message.success→Toast;dayjs 格式化退化为字符串切片
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import Select from "@nce/eview-react/Select";
import SearchInput from "@nce/eview-react/SearchInput";
import SectionCard from "../components/SectionCard.jsx";
import StatusTag from "../components/StatusTag.jsx";
import { useToast } from "../components/Toast.jsx";
import { STATUS_KEYS, deviceRows, summarize } from "../data.js";
import "./device-table.css";

// "2026-09-15 09:42" → "09-15 09:42"(原 dayjs format("MM-DD HH:mm"))
function formatLastReport(value) {
  return String(value || "").slice(5);
}

export default function DeviceTable({ onEdit }) {
  const intl = useIntl();
  const toast = useToast();
  const [rows, setRows] = useState(deviceRows);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const t = (id, fallback, values) =>
    intl.formatMessage({ id: id, defaultMessage: fallback }, values);
  const label = (id, fallback) => <FormattedMessage id={id} defaultMessage={fallback} />;

  const stats = useMemo(() => summarize(rows), [rows]);

  const data = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return rows.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!kw) return true;
      return (
        row.name.toLowerCase().includes(kw) ||
        row.code.toLowerCase().includes(kw) ||
        t(row.policy, row.policy).toLowerCase().includes(kw)
      );
    });
  }, [rows, keyword, statusFilter, intl]);

  const statusOptions = [{ value: "all", text: t("table.filter.status", "全部状态") }].concat(
    STATUS_KEYS.map((key) => ({ value: key, text: t("status." + key, key) }))
  );

  const refresh = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      toast("success", t("table.refreshed", "列表已刷新"));
    }, 600);
  };

  const disableRows = (codes) => {
    if (!codes.length) return;
    setRows((prev) =>
      prev.map((row) => (codes.indexOf(row.code) >= 0 ? { ...row, status: "disabled" } : row))
    );
    setSelectedKeys([]);
    toast("success", t("table.disabled.toast", "设备已停用"));
  };

  const columns = [
    {
      title: label("table.col.name", "设备名称"),
      key: "name",
      render: (value) => <span className="cell-strong">{value}</span>,
    },
    {
      title: label("table.col.code", "设备编号"),
      key: "code",
      render: (value) => <span className="cell-mono">{value}</span>,
    },
    {
      title: label("table.col.type", "设备类型"),
      key: "type",
      render: (value) => t(value, value),
    },
    {
      title: label("table.col.site", "所属站点"),
      key: "site",
      render: (value) => t(value, value),
    },
    {
      title: label("table.col.firmware", "固件版本"),
      key: "firmware",
      render: (value) => <span className="cell-mono">{value}</span>,
    },
    {
      title: label("table.col.policy", "采集策略"),
      key: "policy",
      render: (value) => t(value, value),
    },
    {
      title: label("table.col.status", "状态"),
      key: "status",
      render: (value) => <StatusTag status={value} />,
    },
    {
      title: label("table.col.lastReport", "最后上报"),
      key: "lastReport",
      render: (value) => <span className="cell-muted">{formatLastReport(value)}</span>,
    },
    {
      title: label("table.col.actions", "操作"),
      key: "actions",
      align: "right",
      render: (_, row) => (
        // TODO(eview-react): Dropdown 行内菜单退化为内联文字按钮
        <span className="cell-actions">
          <Button status="text" size="small" text={label("table.action.edit", "编辑")} onClick={() => onEdit(row)} />
          <Button
            status="text"
            size="small"
            text={label("table.action.copy", "复制配置")}
            onClick={() => toast("success", t("table.copied", "配置已复制"))}
          />
          <Button
            status="risk"
            size="small"
            text={label("table.action.disable", "停用设备")}
            onClick={() => disableRows([row.code])}
          />
        </span>
      ),
    },
  ];

  return (
    <SectionCard
      title={label("table.title", "设备配置清单")}
      subtitle={t("table.subtitle", "共 {total} 台设备，在线 {online} 台，告警 {alarm} 台", {
        total: stats.total,
        online: stats.online,
        alarm: stats.alarm,
      })}
    >
      <div className="table-toolbar">
        <SearchInput
          className="table-search"
          value={keyword}
          onChange={(value) => setKeyword(value)}
          onSearch={(value) => setKeyword(value)}
          onClear={() => setKeyword("")}
          placeholder={t("table.search.placeholder", "搜索设备名称或编号")}
        />
        <Select
          className="table-filter"
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          options={statusOptions}
        />
        <Button text={label("table.refresh", "刷新")} disabled={loading} onClick={refresh} />
      </div>

      {selectedKeys.length > 0 ? (
        <div className="selection-bar">
          <span className="selection-count">
            {t("table.selected", "已选择 {count} 项", { count: selectedKeys.length })}
          </span>
          <Button
            size="small"
            text={label("table.bulkExport", "导出所选")}
            onClick={() => {
              toast("success", t("table.exported", "已导出所选配置"));
              setSelectedKeys([]);
            }}
          />
          <Button
            size="small"
            status="risk"
            text={label("table.bulkDisable", "批量停用")}
            onClick={() => disableRows(selectedKeys)}
          />
          <Button size="small" status="text" text={label("table.clearSelection", "取消选择")} onClick={() => setSelectedKeys([])} />
        </div>
      ) : null}

      <Table
        className="device-table"
        columns={columns}
        dataset={data}
        keyIndex={1}
        enableSort={false}
        enableLoading={loading}
        emptyTableMsg={t("table.empty", "没有匹配的设备")}
        enableCheckBox
        checkType="multi"
        checkedRows={selectedKeys}
        onRowCheck={(row, checkedRows) => setSelectedKeys(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedKeys(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSize={8}
        pageSizeOptions={[8, 16, 32]}
      />
    </SectionCard>
  );
}
