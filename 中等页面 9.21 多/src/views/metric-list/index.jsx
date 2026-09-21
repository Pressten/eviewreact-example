import { useMemo, useState } from "react";
import { Button, Input, Select, Table, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icons.js";
import StatusTag from "../../components/status-tag/index.jsx";
import { metricList, domainOptions, frequencyOptions, statusOptions } from "../../mock/metrics.js";
import "./index.css";

// Layer 4: 一级页签「指标清单」— 链接列点击后下钻到采集明细页签
export default function MetricList({ onDrill }) {
  const [keyword, setKeyword] = useState("");
  const [domain, setDomain] = useState("all");
  const [frequency, setFrequency] = useState("all");
  const [status, setStatus] = useState("all");
  const [selectedKeys, setSelectedKeys] = useState([]);

  const dataSource = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return metricList.filter((item) => {
      const hitKeyword =
        !kw ||
        item.name.toLowerCase().includes(kw) ||
        item.code.toLowerCase().includes(kw) ||
        item.source.toLowerCase().includes(kw);
      const hitDomain = domain === "all" || item.domain === domain;
      const hitFrequency = frequency === "all" || item.frequency === frequency;
      const hitStatus = status === "all" || item.status === status;
      return hitKeyword && hitDomain && hitFrequency && hitStatus;
    });
  }, [keyword, domain, frequency, status]);

  const resetFilters = () => {
    setKeyword("");
    setDomain("all");
    setFrequency("all");
    setStatus("all");
  };

  const columns = [
    { title: "指标编码", dataIndex: "code", key: "code", width: 200 },
    {
      title: "指标名称",
      dataIndex: "name",
      key: "name",
      width: 190,
      render: (text, record) => (
        <Button type="link" size="small" className="cell-link" onClick={() => onDrill(record)}>
          {text}
        </Button>
      ),
    },
    { title: "数据域", dataIndex: "domain", key: "domain", width: 100 },
    { title: "数据源表", dataIndex: "source", key: "source", width: 220 },
    { title: "更新频率", dataIndex: "frequency", key: "frequency", width: 100 },
    { title: "负责人", dataIndex: "owner", key: "owner", width: 90 },
    {
      title: "质量评分",
      dataIndex: "score",
      key: "score",
      width: 100,
      align: "right",
      sorter: (a, b) => a.score - b.score,
      render: (value) => <span className="num-cell">{value.toFixed(1)}</span>,
    },
    {
      title: "记录数",
      dataIndex: "rows",
      key: "rows",
      width: 120,
      align: "right",
      sorter: (a, b) => a.rows - b.rows,
      render: (value) => <span className="num-cell">{value.toLocaleString("zh-CN")}</span>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (value) => <StatusTag status={value} />,
    },
    { title: "更新时间", dataIndex: "updatedAt", key: "updatedAt", width: 170 },
    {
      title: "操作",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <div className="row-actions">
          <Tooltip title="查看采集明细">
            <Button
              type="text"
              shape="circle"
              size="small"
              icon={<Icon name="table-2" size={14} />}
              onClick={() => onDrill(record)}
            />
          </Tooltip>
          <Tooltip title="指标配置">
            <Button type="text" shape="circle" size="small" icon={<Icon name="settings" size={14} />} />
          </Tooltip>
          <Tooltip title="血缘溯源">
            <Button
              type="text"
              shape="circle"
              size="small"
              icon={<Icon name="git-branch" size={14} />}
              onClick={() => onDrill(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="metric-list">
      <div className="table-toolbar">
        <div className="table-toolbar__filters">
          <Input
            allowClear
            className="toolbar-search"
            prefix={<Icon name="search" size={14} />}
            placeholder="搜索指标名称、编码或数据源表"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Select className="toolbar-select" options={domainOptions} value={domain} onChange={setDomain} />
          <Select className="toolbar-select" options={frequencyOptions} value={frequency} onChange={setFrequency} />
          <Select className="toolbar-select" options={statusOptions} value={status} onChange={setStatus} />
          <Button icon={<Icon name="rotate-ccw" size={14} />} onClick={resetFilters}>
            重置
          </Button>
        </div>
        <div className="table-toolbar__extra">
          <span className="table-toolbar__count">
            共 <em>{dataSource.length}</em> 条指标
          </span>
          <Button icon={<Icon name="download" size={14} />}>导出</Button>
        </div>
      </div>

      <div className="table-hint">
        <Icon name="link-2" size={14} />
        <span>点击指标名称或「查看采集明细」图标，可下钻至该指标的采集明细页签。</span>
      </div>

      {selectedKeys.length > 0 ? (
        <div className="selection-bar">
          <span className="selection-bar__text">
            已选择 <em>{selectedKeys.length}</em> 项指标
          </span>
          <div className="selection-bar__actions">
            <Button size="small" icon={<Icon name="chart-column" size={14} />}>
              批量生成报告
            </Button>
            <Button size="small" icon={<Icon name="bell" size={14} />}>
              批量设置告警
            </Button>
            <Button size="small" type="text" onClick={() => setSelectedKeys([])}>
              取消选择
            </Button>
          </div>
        </div>
      ) : null}

      <Table
        rowKey="id"
        size="middle"
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1620 }}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: (keys) => setSelectedKeys(keys),
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </div>
  );
}
