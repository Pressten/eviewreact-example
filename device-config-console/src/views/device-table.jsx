import { useMemo, useState } from "react";
import Table from "@nce/eview-react/Table";
import Select from "@nce/eview-react/Select";
import SearchInput from "@nce/eview-react/SearchInput";
import Button from "@nce/eview-react/Button";
import { FormattedMessage, useIntl } from "react-intl";
import dayjs from "dayjs";
import { Icon } from "../icons.jsx";
import SectionCard from "../components/SectionCard.jsx";
import StatusTag from "../components/StatusTag.jsx";
import Dropdown from "../components/Dropdown.jsx";
import { useToast } from "../components/Toast.jsx";
import { STATUS_KEYS, TYPE_ICON, deviceRows, summarize } from "../data.js";
import "./device-table.css";

// Layer 4: 设备配置清单 — 工具栏(搜索/筛选/刷新) + 复选表格 + 行内操作
//
// TODO(eview-react): Table 的以下 prop 名按 skill 映射总表写入,需对照已安装的 eview-react Table Reference 核对:
//   - dataset / keyIndex / columns[].key / emptyTableMsg
//   - enablePagination + pagingProps + onPageChange(分页参数结构 pageSize/pageSizes 以 Reference 为准)
//   - enableCheckBox + onRowCheck + 受控已选项的 prop 名(此处暂用 selectedDataKeys,如不符请改)
//   - loading(antd 用 loading,eview-react 可能用 isOpen 包 Loading 或 Table 自带 isLoading,请按实际调整)
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
      toast.success(t("table.refreshed", "列表已刷新"));
    }, 600);
  };

  const disableRows = (codes) => {
    if (!codes.length) return;
    setRows((prev) =>
      prev.map((row) => (codes.indexOf(row.code) >= 0 ? { ...row, status: "disabled" } : row))
    );
    setSelectedKeys([]);
    toast.success(t("table.disabled.toast", "设备已停用"));
  };

  const rowMenu = (record) => ({
    items: [
      {
        key: "copy",
        icon: <Icon name="copy" size={14} />,
        label: label("table.action.copy", "复制配置"),
      },
      { type: "divider" },
      {
        key: "disable",
        danger: true,
        icon: <Icon name="power" size={14} />,
        label: label("table.action.disable", "停用设备"),
      },
    ],
    onClick: ({ key }) => {
      if (key === "copy") {
        toast.success(t("table.copied", "配置已复制"));
      } else if (key === "disable") {
        disableRows([record.code]);
      }
    },
  });

  const columns = [
    {
      title: label("table.col.name", "设备名称"),
      key: "name",
      render: (value, record) => (
        <div className="device-cell">
          <span className="device-icon">
            <Icon name={TYPE_ICON[record.type]} size={14} />
          </span>
          <span className="cell-strong">{value}</span>
        </div>
      ),
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
      render: (value) => <span className="cell-muted">{dayjs(value).format("MM-DD HH:mm")}</span>,
    },
    {
      title: label("table.col.actions", "操作"),
      key: "actions",
      align: "right",
      render: (_, record) => (
        <div className="row-actions">
          <Button status="text" text={t("table.action.edit", "编辑")} onClick={() => onEdit(record)} />
          <Dropdown menu={rowMenu(record)} trigger="click" placement="bottomRight">
            <Button
              status="text"
              aria-label={t("table.action.more", "更多操作")}
              leftIcon={<Icon name="ellipsis" size={14} />}
            />
          </Dropdown>
        </div>
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
        {/* TODO(eview-react): SearchInput 的 onSearch 值变化也会触发(skill 提示),这里用作实时过滤;
            onClear 清空关键词。prop 名以 Reference 为准。 */}
        <div className="table-search">
          <SearchInput
            placeholder={t("table.search.placeholder", "搜索设备名称或编号")}
            onSearch={(v) => setKeyword(v || "")}
            onClear={() => setKeyword("")}
          />
        </div>
        <div className="table-filter">
          <Select
            value={statusFilter}
            options={statusOptions}
            onChange={(value) => setStatusFilter(value)}
          />
        </div>
        <Button
          leftIcon={<Icon name="refresh-cw" size={14} />}
          disabled={loading}
          text={t("table.refresh", "刷新")}
          onClick={refresh}
        />
      </div>

      {selectedKeys.length > 0 ? (
        <div className="selection-bar">
          <span className="selection-count">
            {t("table.selected", "已选择 {count} 项", { count: selectedKeys.length })}
          </span>
          <Button
            leftIcon={<Icon name="download" size={14} />}
            text={t("table.bulkExport", "导出所选")}
            onClick={() => {
              toast.success(t("table.exported", "已导出所选配置"));
              setSelectedKeys([]);
            }}
          />
          <Button
            status="risk"
            leftIcon={<Icon name="power" size={14} />}
            text={t("table.bulkDisable", "批量停用")}
            onClick={() => disableRows(selectedKeys)}
          />
          <Button
            status="text"
            text={t("table.clearSelection", "取消选择")}
            onClick={() => setSelectedKeys([])}
          />
        </div>
      ) : null}

      <Table
        className="device-table"
        keyIndex="code"
        dataset={data}
        columns={columns}
        loading={loading}
        emptyTableMsg={t("table.empty", "没有匹配的设备")}
        enableCheckBox
        selectedDataKeys={selectedKeys}
        onRowCheck={(checkedKeys) => setSelectedKeys(checkedKeys || [])}
        enablePagination
        pagingProps={{ pageSize: 8, pageSizes: [8, 16, 32] }}
        onPageChange={() => {}}
      />
    </SectionCard>
  );
}
