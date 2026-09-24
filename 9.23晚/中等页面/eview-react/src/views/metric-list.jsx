import { useMemo, useState } from "react";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import SearchInput from "@nce/eview-react/SearchInput";
import Select from "@nce/eview-react/Select";
import Table from "@nce/eview-react/Table";
import { Icon } from "../shared/icon.jsx";
import StatusTag from "../components/status-tag.jsx";
import { metricList, domainOptions, frequencyOptions, statusOptions } from "../data/metrics.js";

function MetricList({ onDrill }) {
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
    { title: "指标编码", key: "code", width: 200 },
    {
      title: "指标名称",
      key: "name",
      width: 190,
      render: (value, _oldValue, _text, row) => (
        <Button status="text" text={value} className="cell-link" onClick={() => onDrill(row)} />
      ),
    },
    { title: "数据域", key: "domain", width: 100 },
    { title: "数据源表", key: "source", width: 220 },
    { title: "更新频率", key: "frequency", width: 100 },
    { title: "负责人", key: "owner", width: 90 },
    {
      title: "质量评分",
      key: "score",
      width: 100,
      align: "right",
      sorter: (a, b) => a.score - b.score,
      render: (value) => <span className="num-cell">{value.toFixed(1)}</span>,
    },
    {
      title: "记录数",
      key: "rows",
      width: 120,
      align: "right",
      sorter: (a, b) => a.rows - b.rows,
      render: (value) => <span className="num-cell">{value.toLocaleString("zh-CN")}</span>,
    },
    {
      title: "状态",
      key: "status",
      width: 110,
      render: (value) => <StatusTag status={value} />,
    },
    { title: "更新时间", key: "updatedAt", width: 170 },
    {
      title: "操作",
      key: "action",
      width: 120,
      freezeCol: true,
      render: (_value, _oldValue, _text, row) => (
        <div className="row-actions">
          <IconButton
            iconName={<Icon name="table-2" size={14} />}
            tipText="查看采集明细"
            onClick={() => onDrill(row)}
          />
          <IconButton
            iconName={<Icon name="settings" size={14} />}
            tipText="指标配置"
          />
          <IconButton
            iconName={<Icon name="git-branch" size={14} />}
            tipText="血缘溯源"
            onClick={() => onDrill(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="metric-list">
      <div className="table-toolbar">
        <div className="table-toolbar__filters">
          <SearchInput
            value={keyword}
            onSearch={(value) => setKeyword(value)}
            placeholder="搜索指标名称、编码或数据源表"
            className="toolbar-search"
          />
          <Select options={domainOptions} value={domain} onChange={setDomain} className="toolbar-select" />
          <Select options={frequencyOptions} value={frequency} onChange={setFrequency} className="toolbar-select" />
          <Select options={statusOptions} value={status} onChange={setStatus} className="toolbar-select" />
          <Button leftIcon={<Icon name="rotate-ccw" size={14} />} text="重置" onClick={resetFilters} />
        </div>
        <div className="table-toolbar__extra">
          <span className="table-toolbar__count">
            共 <em>{dataSource.length}</em> 条指标
          </span>
          <Button leftIcon={<Icon name="download" size={14} />} text="导出" />
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
            <Button leftIcon={<Icon name="chart-column" size={14} />} text="批量生成报告" />
            <Button leftIcon={<Icon name="bell" size={14} />} text="批量设置告警" />
            <Button status="text" text="取消选择" onClick={() => setSelectedKeys([])} />
          </div>
        </div>
      ) : null}

      <Table
        keyIndex="id"
        columns={columns}
        dataset={dataSource}
        enableCheckBox
        onRowCheck={(keys) => setSelectedKeys(keys)}
        enablePagination
        pagingProps={{ pageSize: 10 }}
      />
    </div>
  );
}

export default MetricList;
