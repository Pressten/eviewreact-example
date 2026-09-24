import { useMemo, useState } from "react";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import SearchInput from "@nce/eview-react/SearchInput";
import Select from "@nce/eview-react/Select";
import Table from "@nce/eview-react/Table";
import { Icon } from "../shared/icon.jsx";
import StatusTag from "../components/status-tag.jsx";
import ContextBanner from "../components/context-banner.jsx";
import { lineageList, levelOptions, nodeTypeOptions } from "../data/lineage.js";

const LEVEL_META = [
  { key: "上游", tone: "info", desc: "数据来源节点" },
  { key: "当前", tone: "brand", desc: "当前加工节点" },
  { key: "下游", tone: "violet", desc: "消费与输出节点" },
];

function LineageTrace({ metric, record, onBack }) {
  const [keyword, setKeyword] = useState("");
  const [level, setLevel] = useState("all");
  const [nodeType, setNodeType] = useState("all");

  const dataSource = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return lineageList.filter((item) => {
      const hitKeyword =
        !kw ||
        item.nodeName.toLowerCase().includes(kw) ||
        item.nodeCode.toLowerCase().includes(kw) ||
        item.tableName.toLowerCase().includes(kw);
      const hitLevel = level === "all" || item.level === level;
      const hitType = nodeType === "all" || item.nodeType === nodeType;
      return hitKeyword && hitLevel && hitType;
    });
  }, [keyword, level, nodeType]);

  const columns = [
    { title: "节点编码", key: "nodeCode", width: 150 },
    {
      title: "血缘层级",
      key: "level",
      width: 110,
      render: (value) => <StatusTag status={value} />,
    },
    {
      title: "节点类型",
      key: "nodeType",
      width: 100,
      render: (value) => <span className="type-chip">{value}</span>,
    },
    { title: "节点名称", key: "nodeName", width: 200 },
    { title: "物理表 / 接口", key: "tableName", width: 230 },
    { title: "归属团队", key: "owner", width: 130 },
    {
      title: "数据量",
      key: "rows",
      width: 140,
      align: "right",
      sorter: (a, b) => a.rows - b.rows,
      render: (value) => (
        <span className="num-cell">{value === 0 ? "—" : value.toLocaleString("zh-CN")}</span>
      ),
    },
    { title: "时效", key: "latency", width: 100 },
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
      width: 96,
      freezeCol: true,
      render: () => (
        <div className="row-actions">
          <IconButton
            iconName={<Icon name="maximize-2" size={14} />}
            tipText="查看节点详情"
          />
          <IconButton
            iconName={<Icon name="share-2" size={14} />}
            tipText="分享链路"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="lineage-trace">
      <ContextBanner
        icon="git-branch"
        title={`血缘溯源 · ${metric ? metric.name : "全部指标"}`}
        crumb={
          record
            ? `批次 ${record.batch} · 任务 ${record.task} · 来源节点 ${record.node}`
            : "未选择批次，展示指标全量血缘节点"
        }
        fields={
          record
            ? [
                { label: "分区时间", value: record.partition },
                { label: "记录数", value: record.rows.toLocaleString("zh-CN") },
                { label: "质量分", value: record.quality.toFixed(1) },
              ]
            : []
        }
        onBack={onBack}
        backText="返回采集明细"
      />

      <div className="lineage-path">
        {LEVEL_META.map((meta, index) => {
          const nodes = lineageList.filter((n) => n.level === meta.key);
          return (
            <div className="lineage-path__group" key={meta.key}>
              <div className={`lineage-path__head lineage-path__head--${meta.tone}`}>
                <span className="lineage-path__head-name">{meta.key}节点</span>
                <span className="lineage-path__head-desc">{meta.desc}</span>
                <span className="lineage-path__head-num">{nodes.length}</span>
              </div>
              <div className="lineage-path__nodes">
                {nodes.slice(0, 3).map((node) => (
                  <span className="lineage-path__node" key={node.id} title={node.tableName}>
                    <span className="lineage-path__node-type">{node.nodeType}</span>
                    <span className="lineage-path__node-name">{node.nodeName}</span>
                  </span>
                ))}
                {nodes.length > 3 ? (
                  <span className="lineage-path__more">+{nodes.length - 3} 个节点</span>
                ) : null}
              </div>
              {index < LEVEL_META.length - 1 ? (
                <span className="lineage-path__arrow">
                  <Icon name="arrow-right" size={16} />
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="table-toolbar">
        <div className="table-toolbar__filters">
          <SearchInput
            value={keyword}
            onSearch={(value) => setKeyword(value)}
            placeholder="搜索节点名称、编码或物理表"
            className="toolbar-search"
          />
          <Select options={levelOptions} value={level} onChange={setLevel} className="toolbar-select" />
          <Select options={nodeTypeOptions} value={nodeType} onChange={setNodeType} className="toolbar-select" />
          <Button
            leftIcon={<Icon name="rotate-ccw" size={14} />}
            text="重置"
            onClick={() => {
              setKeyword("");
              setLevel("all");
              setNodeType("all");
            }}
          />
        </div>
        <div className="table-toolbar__extra">
          <span className="table-toolbar__count">
            共 <em>{dataSource.length}</em> 个血缘节点
          </span>
          <Button leftIcon={<Icon name="network" size={14} />} text="全屏血缘视图" />
          <Button leftIcon={<Icon name="download" size={14} />} text="导出" />
        </div>
      </div>

      <Table
        keyIndex="id"
        columns={columns}
        dataset={dataSource}
        enablePagination
        pagingProps={{ pageSize: 10 }}
      />
    </div>
  );
}

export default LineageTrace;
