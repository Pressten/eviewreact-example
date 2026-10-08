// Layer 4: 采集规则列表（表格 + 检索/筛选/批量操作）
import { useState, useMemo } from "react";
import { Table, Input, Select, Button } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import SoftTag from "../../components/soft-tag/index.jsx";
import { dataSourceOptions, sourceLabel } from "../../mock/rules.js";
import "./index.css";

const STATUS_TONE = { running: "success", stopped: "neutral", error: "error" };
const STATUS_LABEL = { running: "运行中", stopped: "已停用", error: "异常" };

export default function RuleTable({ data }) {
  const [keyword, setKeyword] = useState("");
  const [sourceFilter, setSourceFilter] = useState(undefined);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [refreshAt, setRefreshAt] = useState("");

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return data.filter((row) => {
      const hitKw =
        !kw ||
        row.name.toLowerCase().includes(kw) ||
        row.id.toLowerCase().includes(kw);
      const hitSource = !sourceFilter || row.source === sourceFilter;
      return hitKw && hitSource;
    });
  }, [data, keyword, sourceFilter]);

  const clearSelection = () => setSelectedKeys([]);

  const columns = [
    {
      title: "规则名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text) => (
        <a href="#rule" className="rt-link" onClick={(e) => e.preventDefault()}>
          {text}
        </a>
      ),
    },
    {
      title: "规则 ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (value) => <span className="rt-plain rt-plain--muted">{value}</span>,
    },
    {
      title: "数据源",
      dataIndex: "source",
      key: "source",
      width: 140,
      render: (value) => <span className="rt-plain">{sourceLabel(value)}</span>,
    },
    {
      title: "采集频率",
      dataIndex: "frequencyLabel",
      key: "frequencyLabel",
      width: 100,
      render: (value) => <span className="rt-plain">{value}</span>,
    },
    {
      title: "点位",
      dataIndex: "points",
      key: "points",
      width: 90,
      align: "right",
      render: (value) => <span className="rt-num">{value}</span>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (value) => <SoftTag tone={STATUS_TONE[value]}>{STATUS_LABEL[value]}</SoftTag>,
    },
    {
      title: "告警",
      dataIndex: "alarm",
      key: "alarm",
      width: 110,
      render: (value) =>
        value === "on" ? (
          <SoftTag tone="brand" icon="bell-ring">
            已开启
          </SoftTag>
        ) : (
          <SoftTag tone="neutral">未开启</SoftTag>
        ),
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 160,
      render: (value) => <span className="rt-plain rt-plain--muted">{value}</span>,
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      align: "left",
      render: (_text, record) => (
        <div className="rt-actions">
          <Button
            type="text"
            shape="circle"
            size="small"
            title="编辑规则"
            icon={<Icon name="square-pen" size="0.875rem" />}
          />
          <Button
            type="text"
            shape="circle"
            size="small"
            title={record.status === "running" ? "停用规则" : "启用规则"}
            icon={<Icon name={record.status === "running" ? "circle-pause" : "play"} size="0.875rem" />}
          />
          <Button
            type="text"
            shape="circle"
            size="small"
            danger
            title="删除规则"
            icon={<Icon name="trash-2" size="0.875rem" />}
          />
        </div>
      ),
    },
  ];

  return (
    <section className="rt-card">
      <header className="rt-toolbar">
        <div className="rt-toolbar__title">
          <h2 className="rt-card__title">已配置规则</h2>
          <span className="rt-count">共 {filtered.length} 条</span>
        </div>

        <div className="rt-toolbar__tools">
          {selectedKeys.length > 0 && (
            <div className="rt-selection">
              <span>已选 {selectedKeys.length} 项</span>
              <a href="#batch" onClick={(e) => e.preventDefault()}>
                批量停用
              </a>
              <a href="#clear" onClick={(e) => { e.preventDefault(); clearSelection(); }}>
                取消选择
              </a>
            </div>
          )}
          <Input
            className="rt-search"
            allowClear
            placeholder="搜索规则名称或 ID"
            value={keyword}
            suffix={<Icon name="search" size="0.875rem" />}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Select
            className="rt-filter"
            allowClear
            placeholder="数据源"
            style={{ width: "10rem" }}
            value={sourceFilter}
            options={dataSourceOptions}
            onChange={(v) => setSourceFilter(v)}
          />
          <Button
            type="text"
            shape="circle"
            title={refreshAt ? `最近刷新 ${refreshAt}` : "刷新列表"}
            icon={<Icon name="refresh-cw" size="0.875rem" />}
            onClick={() => setRefreshAt("刚刚")}
          />
        </div>
      </header>

      <Table
        rowKey="id"
        size="middle"
        columns={columns}
        dataSource={filtered}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: (keys) => setSelectedKeys(keys),
        }}
        pagination={{
          pageSize: 8,
          showSizeChanger: false,
          showTotal: (total) => `共 ${total} 条规则`,
        }}
        scroll={{ x: 1140 }}
      />
    </section>
  );
}
