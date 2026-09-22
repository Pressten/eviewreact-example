import { useMemo, useState } from 'react';
import Button from '@nce/eview-react/Button';
import SearchInput from '@nce/eview-react/SearchInput';
import Select from '@nce/eview-react/Select';
import Table from '@nce/eview-react/Table';
import TipBox from '@nce/eview-react/TipBox';
import Icon from '../../shared/icons.jsx';
import StatusTag from '../../components/status-tag/index.jsx';
import { metricList, domainOptions, frequencyOptions, statusOptions } from '../../mock/metrics.js';

// Layer 4: 一级页签「指标清单」— 链接列点击后下钻到采集明细页签
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
      render: (text, record) => (
        <Button status="text" size="small" className="cell-link" onClick={() => onDrill(record)}>
          {text}
        </Button>
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
      fixed: "right",
      render: (_, record) => (
        <div className="row-actions">
          <TipBox direction="top" content="查看采集明细">
            <Button
              status="text"
              size="small"
              leftIcon={<Icon name="table-2" size={14} />}
              onClick={() => onDrill(record)}
            />
          </TipBox>
          <TipBox direction="top" content="指标配置">
            <Button status="text" size="small" leftIcon={<Icon name="settings" size={14} />} />
          </TipBox>
          <TipBox direction="top" content="血缘溯源">
            <Button
              status="text"
              size="small"
              leftIcon={<Icon name="git-branch" size={14} />}
              onClick={() => onDrill(record)}
            />
          </TipBox>
        </div>
      ),
    },
  ];

  return (
    <div className="metric-list">
      <div className="table-toolbar">
        <div className="table-toolbar__filters">
          <SearchInput
            className="toolbar-search"
            placeholder="搜索指标名称、编码或数据源表"
            value={keyword}
            onSearch={(value) => setKeyword(value)}
            onClear={() => setKeyword("")}
          />
          <Select className="toolbar-select" options={domainOptions} value={domain} onChange={setDomain} />
          <Select className="toolbar-select" options={frequencyOptions} value={frequency} onChange={setFrequency} />
          <Select className="toolbar-select" options={statusOptions} value={status} onChange={setStatus} />
          <Button leftIcon={<Icon name="rotate-ccw" size={14} />} onClick={resetFilters}>
            重置
          </Button>
        </div>
        <div className="table-toolbar__extra">
          <span className="table-toolbar__count">
            共 <em>{dataSource.length}</em> 条指标
          </span>
          <Button leftIcon={<Icon name="download" size={14} />}>导出</Button>
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
            <Button size="small" leftIcon={<Icon name="chart-column" size={14} />}>
              批量生成报告
            </Button>
            <Button size="small" leftIcon={<Icon name="bell" size={14} />}>
              批量设置告警
            </Button>
            <Button size="small" status="text" onClick={() => setSelectedKeys([])}>
              取消选择
            </Button>
          </div>
        </div>
      ) : null}

      <Table
        keyIndex="id"
        columns={columns}
        dataset={dataSource}
        scroll={{ x: 1620 }}
        enableCheckBox
        onRowCheck={(keys) => setSelectedKeys(keys)}
        enablePagination
        pagingProps={{ pageSize: 10 }}
      />
    </div>
  );
}

export default MetricList;
