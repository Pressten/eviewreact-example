import { useState } from "react";
import { Table, Button, Tag, Dropdown, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import VerdictTag from "../../components/verdict-tag/index.jsx";
import "./index.css";

// Layer 4: 指标判断明细表
function rateTone(rate) {
  if (rate >= 98) return "is-success";
  if (rate >= 94) return "is-critical";
  return "is-error";
}

export default function MetricTable({ rows }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    { title: "指标编码", dataIndex: "code", key: "code", width: 108 },
    {
      title: "指标名称",
      dataIndex: "name",
      key: "name",
      width: 190,
      render: (text) => (
        <Button type="link" className="cell-link" size="small">
          {text}
        </Button>
      ),
    },
    {
      title: "业务域",
      dataIndex: "domain",
      key: "domain",
      width: 108,
      render: (text) => <span className="cell-domain">{text}</span>,
    },
    { title: "所属区域", dataIndex: "region", key: "region", width: 100 },
    { title: "责任人", dataIndex: "owner", key: "owner", width: 84 },
    {
      title: "当前值",
      dataIndex: "current",
      key: "current",
      width: 128,
      align: "right",
      render: (value, record) => (
        <span className="cell-num">
          {value}
          <em>{record.unit}</em>
        </span>
      ),
    },
    {
      title: "目标值",
      dataIndex: "target",
      key: "target",
      width: 118,
      align: "right",
      render: (value, record) => (
        <span className="cell-num cell-num--muted">
          {value}
          <em>{record.unit}</em>
        </span>
      ),
    },
    {
      title: "达成率",
      dataIndex: "rate",
      key: "rate",
      width: 108,
      align: "right",
      sorter: (a, b) => a.rate - b.rate,
      render: (rate) => (
        <span className={`cell-rate ${rateTone(rate)}`}>{rate.toFixed(1)}%</span>
      ),
    },
    {
      title: "同比",
      dataIndex: "yoy",
      key: "yoy",
      width: 96,
      align: "right",
      render: (yoy) => (
        <span className={`cell-yoy ${yoy >= 0 ? "is-up" : "is-down"}`}>
          <Icon name={yoy >= 0 ? "arrow-up-right" : "arrow-down-right"} size={13} />
          {Math.abs(yoy)}
        </span>
      ),
    },
    {
      title: "判断结论",
      dataIndex: "verdict",
      key: "verdict",
      width: 108,
      render: (verdict) => <VerdictTag verdict={verdict} />,
    },
    {
      title: "更新时间",
      dataIndex: "updated",
      key: "updated",
      width: 140,
      render: (text) => <span className="cell-time">{text}</span>,
    },
    {
      title: "操作",
      key: "action",
      width: 96,
      align: "left",
      fixed: "right",
      render: (_text, record) => (
        <div className="cell-actions">
          <Tooltip title="查看判断依据">
            <Button type="text" shape="circle" size="small" icon={<Icon name="search" size={14} />} />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                { key: "detail", icon: <Icon name="file-text" size={14} />, label: "指标详情" },
                { key: "trace", icon: <Icon name="git-branch" size={14} />, label: "下钻归因" },
                { key: "notify", icon: <Icon name="send" size={14} />, label: "通知责任人" },
              ],
            }}
          >
            <Button type="text" shape="circle" size="small" icon={<Icon name="ellipsis" size={14} />} />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <section className="table-card">
      <header className="table-card-head">
        <div className="table-card-title">
          <h2>指标判断明细</h2>
          <p>按达成率阈值自动判定，共 {rows.length} 项指标</p>
        </div>
        <div className="table-card-tools">
          {selectedRowKeys.length > 0 ? (
            <div className="selection-bar">
              <span>
                已选 <strong>{selectedRowKeys.length}</strong> 项
              </span>
              <Button size="small" type="primary" icon={<Icon name="play" size={13} />}>
                批量重判
              </Button>
              <Button size="small" icon={<Icon name="send" size={13} />}>
                通知责任人
              </Button>
              <Button size="small" type="text" onClick={() => setSelectedRowKeys([])}>
                取消选择
              </Button>
            </div>
          ) : (
            <>
              <Tag className="legend-tag legend-tag--pass">达标 ≥98%</Tag>
              <Tag className="legend-tag legend-tag--warn">预警 94%~98%</Tag>
              <Tag className="legend-tag legend-tag--fail">异常 &lt;94%</Tag>
              <Button icon={<Icon name="columns-3" size={14} />}>列设置</Button>
            </>
          )}
        </div>
      </header>

      <Table
        rowKey="code"
        size="middle"
        columns={columns}
        dataSource={rows}
        scroll={{ x: 1420 }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 项指标`,
        }}
      />
    </section>
  );
}
