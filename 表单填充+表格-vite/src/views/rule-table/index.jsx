// Layer 4: 采集规则列表（表格 + 检索/筛选/批量操作）
import { useState, useMemo } from "react";
import { IconPlusIcDigitalPowerDpPauseCircle, IconPlusIcIctTopoEdit, IconPlusIcPublicPlay, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicSearch, IconPlusIcPublicTrash } from '@nce/icon-plus';
import Table from "@nce/eview-react/Table";
import TextField from "@nce/eview-react/TextField";
import Select from "@nce/eview-react/Select";
import Button from "@nce/eview-react/Button";
import SoftTag from "../../components/soft-tag/index.jsx";
import { dataSourceOptions, sourceLabel } from "../../mock/rules.js";
import "./index.css";

const STATUS_TONE = { running: "success", stopped: "neutral", error: "error" };
const STATUS_LABEL = { running: "运行中", stopped: "已停用", error: "异常" };

export default function RuleTable({ data }) {
  const [keyword, setKeyword] = useState("");
  const [sourceFilter, setSourceFilter] = useState(undefined);
  const [checkedRows, setCheckedRows] = useState([]);
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

  const clearSelection = () => setCheckedRows([]);

  const columns = [
    {
      title: "规则名称",
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
      key: "id",
      width: 120,
      render: (value) => <span className="rt-plain rt-plain--muted">{value}</span>,
    },
    {
      title: "数据源",
      key: "source",
      width: 140,
      render: (value) => <span className="rt-plain">{sourceLabel(value)}</span>,
    },
    {
      title: "采集频率",
      key: "frequencyLabel",
      width: 100,
      render: (value) => <span className="rt-plain">{value}</span>,
    },
    {
      title: "点位",
      key: "points",
      width: 90,
      align: "right",
      render: (value) => <span className="rt-num">{value}</span>,
    },
    {
      title: "状态",
      key: "status",
      width: 110,
      render: (value) => <SoftTag tone={STATUS_TONE[value]}>{STATUS_LABEL[value]}</SoftTag>,
    },
    {
      title: "告警",
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
      key: "updatedAt",
      width: 160,
      render: (value) => <span className="rt-plain rt-plain--muted">{value}</span>,
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      align: "left",
      allowSort: false,
      render: (_cell, _rowData, _options, row) => {
        const record = row?.rawData;
        return (
          <div className="rt-actions">
            <Button
              status="text"
              size="small"
              tipData="编辑规则"
              tipShow="always"
            >
              <IconPlusIcIctTopoEdit iconSize="0.875rem" iconColor={['currentcolor']} />
            </Button>
            <Button
              status="text"
              size="small"
              tipData={record?.status === "running" ? "停用规则" : "启用规则"}
              tipShow="always"
            >
              {record?.status === "running" ? <IconPlusIcDigitalPowerDpPauseCircle iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicPlay iconSize="0.875rem" iconColor={['currentcolor']} />}
            </Button>
            <Button
              status="risk"
              size="small"
              tipData="删除规则"
              tipShow="always"
            >
              <IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} />
            </Button>
          </div>
        );
      },
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
          {checkedRows.length > 0 && (
            <div className="rt-selection">
              <span>已选 {checkedRows.length} 项</span>
              <a href="#batch" onClick={(e) => e.preventDefault()}>
                批量停用
              </a>
              <a href="#clear" onClick={(e) => { e.preventDefault(); clearSelection(); }}>
                取消选择
              </a>
            </div>
          )}
          <TextField
            className="rt-search"
            placeholder="搜索规则名称或 ID"
            value={keyword}
            suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />}
            onChange={(value) => setKeyword(value)}
          />
          <Select
            className="rt-filter"
            enableClear
            defaultLabel="数据源"
            selectStyle={{ width: "10rem" }}
            value={sourceFilter}
            options={dataSourceOptions}
            onChange={(v) => setSourceFilter(v)}
          />
          <Button
            status="text"
            size="small"
            tipData={refreshAt ? `最近刷新 ${refreshAt}` : "刷新列表"}
            tipShow="always"
            onClick={() => setRefreshAt("刚刚")}
          >
            <IconPlusIcPublicRefreshClockwise iconSize="0.875rem" iconColor={['currentcolor']} />
          </Button>
        </div>
      </header>

      <Table
        columns={columns}
        dataset={filtered}
        enableCheckBox
        checkType="multi"
        checkedRows={checkedRows}
        onRowCheck={(_row, checkedRowIndexes) => setCheckedRows(checkedRowIndexes)}
        onHeaderCheck={(checkedRowIndexes) => setCheckedRows(checkedRowIndexes)}
        enablePagination
        enableAutoPaging
        pageSize={8}
        emptyTableMsg="暂无规则"
      />
    </section>
  );
}
