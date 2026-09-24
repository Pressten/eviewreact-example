// Layer 4: 指标列表（工具区 + 批量操作条 + 表格 + 分页）
import { useState, useMemo } from "react";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import Table from "@nce/eview-react/Table";
import MessageDialog from "@nce/eview-react/MessageDialog";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { formatMetricValue, isBreach } from "../../data.js";
import PanelCard from "../../components/panel-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import CategoryChip from "../../components/category-chip/index.jsx";
import RatioValue from "../../components/ratio-value/index.jsx";
import ActionMenu from "../../components/action-menu/index.jsx";

function MetricTable() {
  const {
    metrics,
    filteredMetrics,
    selectedRowKeys,
    setSelectedRowKeys,
    openCreate,
    openEdit,
    duplicateMetric,
    updateStatus,
    removeMetric,
    notify,
  } = useApp();

  const [pendingDelete, setPendingDelete] = useState(null);

  const selectedCount = selectedRowKeys.length;
  const offlineIds = useMemo(
    () => metrics.filter((m) => m.status === "offline").map((m) => m.id),
    [metrics]
  );

  // render 里取行对象：eview-react Table 的 row 是按列 key 精简的对象，
  // code/unit/trend/polarity 未定义为列 key，需从源数组按 id 补齐。
  const byId = (id) => filteredMetrics.find((m) => m.id === id) || {};

  const handleRowAction = (key, record) => {
    if (key === "enable") {
      updateStatus([record.id], "online");
      notify("已启用「" + record.name + "」");
    } else if (key === "disable") {
      updateStatus([record.id], "offline");
      notify("已停用「" + record.name + "」");
    } else if (key === "export") {
      notify("「" + record.name + "」已加入导出队列");
    } else if (key === "remove") {
      setPendingDelete(record);
    }
  };

  const moreItems = (record) => [
    record.status === "offline"
      ? { key: "enable", icon: <Icon name="circle-check" size={14} />, label: "启用指标" }
      : { key: "disable", icon: <Icon name="circle-slash" size={14} />, label: "停用指标" },
    { key: "export", icon: <Icon name="file-spreadsheet" size={14} />, label: "导出指标数据" },
    { type: "divider" },
    { key: "remove", icon: <Icon name="trash-2" size={14} />, label: "删除指标", danger: true },
  ];

  const columns = [
    { title: "ID", key: "id", display: false },
    {
      title: "指标名称",
      key: "name",
      width: 260,
      freezeCol: true,
      render: (cell, _rowData, _options, row) => {
        const record = byId(row.id);
        return (
          <div className="metric-table__name">
            <Button
              status="text"
              className="metric-table__name-link"
              text={record.name || cell}
              onClick={() => openEdit(record)}
            />
            <span className="metric-table__code">{record.code}</span>
          </div>
        );
      },
    },
    {
      title: "指标分类",
      key: "category",
      width: 110,
      allowSort: false,
      render: (cell) => <CategoryChip category={cell} />,
    },
    { title: "统计周期", key: "cycle", width: 96, allowSort: false },
    {
      title: "统计维度",
      key: "dimension",
      width: 104,
      allowSort: false,
      render: (cell) => <span className="metric-table__muted">{cell}</span>,
    },
    {
      title: "目标值",
      key: "target",
      width: 104,
      align: "right",
      allowSort: false,
      render: (cell, _rowData, _options, row) => {
        const record = byId(row.id);
        return <span className="metric-table__num">{formatMetricValue(cell, record.unit)}</span>;
      },
    },
    {
      title: "当前值",
      key: "current",
      width: 116,
      align: "right",
      allowSort: false,
      render: (cell, _rowData, _options, row) => {
        const record = byId(row.id);
        return (
          <span className={"metric-table__num" + (isBreach(record) ? " metric-table__num--alert" : "")}>
            {formatMetricValue(cell, record.unit)}
          </span>
        );
      },
    },
    {
      title: "达成率",
      key: "ratio",
      width: 128,
      align: "right",
      allowSort: true,
      render: (cell, _rowData, _options, row) => {
        const record = byId(row.id);
        return <RatioValue ratio={cell} trend={record.trend} polarity={record.polarity} />;
      },
    },
    {
      title: "指标状态",
      key: "status",
      width: 108,
      allowSort: false,
      render: (cell) => <StatusTag status={cell} />,
    },
    { title: "责任人", key: "owner", width: 96, allowSort: false },
    {
      title: "数据来源",
      key: "source",
      width: 116,
      allowSort: false,
      render: (cell) => <span className="metric-table__muted">{cell}</span>,
    },
    {
      title: "更新时间",
      key: "updatedAt",
      width: 150,
      allowSort: true,
      render: (cell) => <span className="metric-table__muted">{cell}</span>,
    },
    {
      title: "操作",
      key: "actions",
      width: 132,
      align: "right",
      allowSort: false,
      render: (_cell, _rowData, _options, row) => {
        const record = byId(row.id);
        return (
          <div className="metric-table__actions">
            <IconButton
              iconName={<Icon name="square-pen" size={15} />}
              tipText="编辑指标"
              size="small"
              onClick={() => openEdit(record)}
            />
            <IconButton
              iconName={<Icon name="copy" size={15} />}
              tipText="复制指标定义"
              size="small"
              onClick={() => {
                duplicateMetric(record.id);
                notify("已复制「" + record.name + "」的定义");
              }}
            />
            <ActionMenu
              items={moreItems(record)}
              tipText="更多操作"
              onAction={(key) => handleRowAction(key, record)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <PanelCard
      className="metric-table"
      title="指标列表"
      subtitle={"已收录 " + metrics.length + " 个指标 / 当前结果 " + filteredMetrics.length + " 条"}
      extra={
        <>
          <Button size="small" leftIcon={<Icon name="upload" size={14} />} text="批量导入" />
          <IconButton
            iconName={<Icon name="refresh-cw" size={15} />}
            tipText="刷新数据"
            size="small"
            onClick={() => notify("指标数据已刷新")}
          />
        </>
      }
      bodyClassName="metric-table__body"
    >
      {selectedCount ? (
        <div className="metric-table__bulk">
          <span className="metric-table__bulk-text">
            已选择 <b>{selectedCount}</b> 项指标
          </span>
          <Button
            size="small"
            leftIcon={<Icon name="circle-check" size={14} />}
            text="批量启用"
            onClick={() => {
              updateStatus(selectedRowKeys, "online");
              notify("已批量启用 " + selectedCount + " 个指标");
            }}
          />
          <Button
            size="small"
            leftIcon={<Icon name="circle-slash" size={14} />}
            text="批量停用"
            onClick={() => {
              updateStatus(selectedRowKeys, "offline");
              notify("已批量停用 " + selectedCount + " 个指标");
            }}
          />
          <Button
            size="small"
            leftIcon={<Icon name="download" size={14} />}
            text="导出所选"
            onClick={() => notify("已导出 " + selectedCount + " 个指标的明细")}
          />
          <Button
            status="text"
            size="small"
            className="metric-table__bulk-clear"
            text="取消选择"
            onClick={() => setSelectedRowKeys([])}
          />
        </div>
      ) : null}

      <Table
        columns={columns}
        dataset={filteredMetrics}
        keyIndex={0}
        enableCheckBox
        checkType="multi"
        checkedRows={selectedRowKeys}
        disableCheckboxIds={offlineIds}
        onRowCheck={(_row, checkedRows) => setSelectedRowKeys(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedRowKeys(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        freezeColPosition="left"
        emptyTableMsg="暂无指标数据"
      />

      <div className="metric-table__footer">
        <span>指标口径以《数据指标管理规范》为准，异常指标同步至值班告警群。</span>
        <Button status="text" size="small" text="新增指标定义" onClick={openCreate} />
      </div>

      <MessageDialog
        type="confirm"
        isOpen={!!pendingDelete}
        iconLocation="title"
        content={pendingDelete ? "删除指标「" + pendingDelete.name + "」？" : ""}
        detail="删除后该指标的历史填报记录将同时失效，操作不可撤销。"
        onClose={() => setPendingDelete(null)}
        buttons={{
          cancel: { text: "取消", onClick: () => setPendingDelete(null) },
          ok: {
            text: "删除",
            focused: true,
            onClick: () => {
              if (!pendingDelete) return;
              removeMetric(pendingDelete.id);
              notify("已删除「" + pendingDelete.name + "」");
              setPendingDelete(null);
            },
          },
        }}
      />
    </PanelCard>
  );
}

export default MetricTable;
