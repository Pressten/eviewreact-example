import { useMemo, useState } from "react";
import { Button, Dropdown, Input, Select, Space, Table, message } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import dayjs from "dayjs";
import { Icon } from "../../assets/shared/icons.js";
import SectionCard from "../components/SectionCard.jsx";
import StatusTag from "../components/StatusTag.jsx";
import { STATUS_KEYS, TYPE_ICON, deviceRows, summarize } from "../data.js";
import "./device-table.css";

// Layer 4: 设备配置清单 — 工具栏(搜索/筛选/刷新) + 复选表格 + 行内操作
export default function DeviceTable({ onEdit }) {
  const intl = useIntl();
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

  const statusOptions = [{ value: "all", label: t("table.filter.status", "全部状态") }].concat(
    STATUS_KEYS.map((key) => ({ value: key, label: t("status." + key, key) }))
  );

  const refresh = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      message.success(t("table.refreshed", "列表已刷新"));
    }, 600);
  };

  const disableRows = (codes) => {
    if (!codes.length) return;
    setRows((prev) =>
      prev.map((row) => (codes.indexOf(row.code) >= 0 ? { ...row, status: "disabled" } : row))
    );
    setSelectedKeys([]);
    message.success(t("table.disabled.toast", "设备已停用"));
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
        message.success(t("table.copied", "配置已复制"));
      } else if (key === "disable") {
        disableRows([record.code]);
      }
    },
  });

  const columns = [
    {
      title: label("table.col.name", "设备名称"),
      dataIndex: "name",
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
      dataIndex: "code",
      key: "code",
      render: (value) => <span className="cell-mono">{value}</span>,
    },
    {
      title: label("table.col.type", "设备类型"),
      dataIndex: "type",
      key: "type",
      render: (value) => t(value, value),
    },
    {
      title: label("table.col.site", "所属站点"),
      dataIndex: "site",
      key: "site",
      render: (value) => t(value, value),
    },
    {
      title: label("table.col.firmware", "固件版本"),
      dataIndex: "firmware",
      key: "firmware",
      render: (value) => <span className="cell-mono">{value}</span>,
    },
    {
      title: label("table.col.policy", "采集策略"),
      dataIndex: "policy",
      key: "policy",
      render: (value) => t(value, value),
    },
    {
      title: label("table.col.status", "状态"),
      dataIndex: "status",
      key: "status",
      render: (value) => <StatusTag status={value} />,
    },
    {
      title: label("table.col.lastReport", "最后上报"),
      dataIndex: "lastReport",
      key: "lastReport",
      render: (value) => <span className="cell-muted">{dayjs(value).format("MM-DD HH:mm")}</span>,
    },
    {
      title: label("table.col.actions", "操作"),
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space size={4}>
          <Button type="link" size="small" onClick={() => onEdit(record)}>
            {label("table.action.edit", "编辑")}
          </Button>
          <Dropdown menu={rowMenu(record)} trigger={["click"]} placement="bottomRight">
            <Button
              type="link"
              size="small"
              aria-label={t("table.action.more", "更多操作")}
              icon={<Icon name="ellipsis" size={14} />}
            />
          </Dropdown>
        </Space>
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
        <Input
          className="table-search"
          allowClear
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          prefix={<Icon name="search" size={14} />}
          placeholder={t("table.search.placeholder", "搜索设备名称或编号")}
        />
        <Select
          className="table-filter"
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
        />
        <Button icon={<Icon name="refresh-cw" size={14} />} loading={loading} onClick={refresh}>
          {label("table.refresh", "刷新")}
        </Button>
      </div>

      {selectedKeys.length > 0 ? (
        <div className="selection-bar">
          <span className="selection-count">
            {t("table.selected", "已选择 {count} 项", { count: selectedKeys.length })}
          </span>
          <Button
            size="small"
            icon={<Icon name="download" size={14} />}
            onClick={() => {
              message.success(t("table.exported", "已导出所选配置"));
              setSelectedKeys([]);
            }}
          >
            {label("table.bulkExport", "导出所选")}
          </Button>
          <Button
            size="small"
            danger
            icon={<Icon name="power" size={14} />}
            onClick={() => disableRows(selectedKeys)}
          >
            {label("table.bulkDisable", "批量停用")}
          </Button>
          <Button size="small" type="text" onClick={() => setSelectedKeys([])}>
            {label("table.clearSelection", "取消选择")}
          </Button>
        </div>
      ) : null}

      <Table
        rowKey="code"
        size="middle"
        className="device-table"
        columns={columns}
        dataSource={data}
        loading={loading}
        locale={{ emptyText: t("table.empty", "没有匹配的设备") }}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: setSelectedKeys,
          columnWidth: 48,
        }}
        pagination={{
          pageSize: 8,
          pageSizeOptions: [8, 16, 32],
          showSizeChanger: true,
          showTotal: (total) => t("table.total", "共 {total} 条记录", { total: total }),
        }}
      />
    </SectionCard>
  );
}
