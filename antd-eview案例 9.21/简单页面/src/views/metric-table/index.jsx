// MetricTable — 指标列表（工具区 + 批量操作条 + 表格 + 分页）
import { useState, useMemo } from 'react';
import Button from '@nce/eview-react/Button';
import Table from '@nce/eview-react/Table';
import TipBox from '@nce/eview-react/TipBox';
import DivMessage from '@nce/eview-react/DivMessage';
import MessageDialog from '@nce/eview-react/MessageDialog';
import { Icon } from '../../icon.jsx';
import { useApp } from '../../context.jsx';
import { formatMetricValue, isBreach } from '../../data.js';
import PanelCard from '../../components/panel-card/index.jsx';
import StatusTag from '../../components/status-tag/index.jsx';
import CategoryChip from '../../components/category-chip/index.jsx';
import RatioValue from '../../components/ratio-value/index.jsx';

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
  } = useApp();

  const [notice, setNotice] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });
  const selectedCount = selectedRowKeys.length;

  const offlineIds = useMemo(
    () => filteredMetrics.filter((m) => m.status === "offline").map((m) => m.id),
    [filteredMetrics]
  );

  const handleRowAction = (key, record) => {
    if (key === "enable") {
      updateStatus([record.id], "online");
      notify("success", "已启用「" + record.name + "」");
    } else if (key === "disable") {
      updateStatus([record.id], "offline");
      notify("success", "已停用「" + record.name + "」");
    } else if (key === "export") {
      notify("success", "「" + record.name + "」已加入导出队列");
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
      render: (cellValue, rowData) => (
        <div className="metric-table__name">
          <Button status="text" className="metric-table__name-link" text={rowData.name} onClick={() => openEdit(rowData)} />
          <span className="metric-table__code">{rowData.code}</span>
        </div>
      ),
    },
    {
      title: "指标分类",
      key: "category",
      width: 110,
      render: (cellValue) => <CategoryChip category={cellValue} />,
    },
    {
      title: "统计周期",
      key: "cycle",
      width: 96,
    },
    {
      title: "统计维度",
      key: "dimension",
      width: 104,
      render: (cellValue) => <span className="metric-table__muted">{cellValue}</span>,
    },
    {
      title: "目标值",
      key: "target",
      width: 104,
      align: "right",
      render: (cellValue, rowData) => (
        <span className="metric-table__num">{formatMetricValue(cellValue, rowData.unit)}</span>
      ),
    },
    {
      title: "当前值",
      key: "current",
      width: 116,
      align: "right",
      render: (cellValue, rowData) => (
        <span className={"metric-table__num" + (isBreach(rowData) ? " metric-table__num--alert" : "")}>
          {formatMetricValue(cellValue, rowData.unit)}
        </span>
      ),
    },
    {
      title: "达成率",
      key: "ratio",
      width: 128,
      align: "right",
      allowSort: true,
      render: (cellValue, rowData) => (
        <RatioValue ratio={cellValue} trend={rowData.trend} polarity={rowData.polarity} />
      ),
    },
    {
      title: "指标状态",
      key: "status",
      width: 108,
      render: (cellValue) => <StatusTag status={cellValue} />,
    },
    {
      title: "责任人",
      key: "owner",
      width: 96,
    },
    {
      title: "数据来源",
      key: "source",
      width: 116,
      render: (cellValue) => <span className="metric-table__muted">{cellValue}</span>,
    },
    {
      title: "更新时间",
      key: "updatedAt",
      width: 150,
      allowSort: true,
      render: (cellValue) => <span className="metric-table__muted">{cellValue}</span>,
    },
    {
      title: "操作",
      key: "actions",
      width: 132,
      freezeCol: true,
      align: "right",
      render: (cellValue, rowData) => (
        <div className="metric-table__actions">
          <TipBox type="simple" content="编辑指标" direction="top">
            <Button
              status="text"
              leftIcon={<Icon name="square-pen" size={15} />}
              onClick={() => openEdit(rowData)}
            />
          </TipBox>
          <TipBox type="simple" content="复制指标定义" direction="top">
            <Button
              status="text"
              leftIcon={<Icon name="copy" size={15} />}
              onClick={() => {
                duplicateMetric(rowData.id);
                notify("success", "已复制「" + rowData.name + "」的定义");
              }}
            />
          </TipBox>
          <TipBox
            trigger="click"
            direction="bottomRight"
            isMouseLeaveClose={false}
            content={
              <div className="metric-table__menu">
                {moreItems(rowData).map((item, idx) =>
                  item.type === "divider" ? (
                    <div key={idx} className="metric-table__menu-divider" />
                  ) : (
                    <button
                      key={item.key}
                      type="button"
                      className={"metric-table__menu-item" + (item.danger ? " metric-table__menu-item--danger" : "")}
                      onClick={() => handleRowAction(item.key, rowData)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  )
                )}
              </div>
            }
          >
            <Button status="text" leftIcon={<Icon name="ellipsis" size={15} />} />
          </TipBox>
        </div>
      ),
    },
  ];

  return (
    <PanelCard
      className="metric-table"
      title="指标列表"
      subtitle={"已收录 " + metrics.length + " 个指标 / 当前结果 " + filteredMetrics.length + " 条"}
      extra={
        <>
          <Button leftIcon={<Icon name="upload" size={14} />} text="批量导入" />
          <TipBox type="simple" content="刷新数据" direction="top">
            <Button
              status="text"
              leftIcon={<Icon name="refresh-cw" size={15} />}
              onClick={() => notify("success", "指标数据已刷新")}
            />
          </TipBox>
        </>
      }
      bodyClassName="metric-table__body"
    >
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={5000}
          onClose={() => setNotice(null)}
          style={{ marginBottom: 12 }}
        />
      ) : null}

      {selectedCount ? (
        <div className="metric-table__bulk">
          <span className="metric-table__bulk-text">
            已选择 <b>{selectedCount}</b> 项指标
          </span>
          <Button
            leftIcon={<Icon name="circle-check" size={14} />}
            text="批量启用"
            onClick={() => {
              updateStatus(selectedRowKeys, "online");
              notify("success", "已批量启用 " + selectedCount + " 个指标");
            }}
          />
          <Button
            leftIcon={<Icon name="circle-slash" size={14} />}
            text="批量停用"
            onClick={() => {
              updateStatus(selectedRowKeys, "offline");
              notify("success", "已批量停用 " + selectedCount + " 个指标");
            }}
          />
          <Button
            leftIcon={<Icon name="download" size={14} />}
            text="导出所选"
            onClick={() => notify("success", "已导出 " + selectedCount + " 个指标的明细")}
          />
          <Button status="text" className="metric-table__bulk-clear" text="取消选择" onClick={() => setSelectedRowKeys([])} />
        </div>
      ) : null}

      <Table
        columns={columns}
        dataset={filteredMetrics}
        keyIndex={0}
        enableCheckBox
        checkType="multi"
        checkedRows={selectedRowKeys}
        onRowCheck={(row, checkedRows) => setSelectedRowKeys(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedRowKeys(checkedRows)}
        disableCheckboxIds={offlineIds}
        enablePagination
        enableAutoPaging
        pagingProps={{ pageSize: 10, pageSizeOptions: [10, 20, 50] }}
        emptyTableMsg="暂无指标数据"
      />

      <div className="metric-table__footer">
        <span>指标口径以《数据指标管理规范》为准，异常指标同步至值班告警群。</span>
        <Button status="text" text="新增指标定义" onClick={openCreate} />
      </div>

      <MessageDialog
        type="confirm"
        isOpen={!!pendingDelete}
        content={pendingDelete ? "删除指标「" + pendingDelete.name + "」？" : ""}
        detail="删除后该指标的历史填报记录将同时失效，操作不可撤销。"
        onClose={() => setPendingDelete(null)}
        buttons={{
          cancel: { text: "取消", onClick: () => setPendingDelete(null) },
          ok: {
            text: "删除",
            onClick: () => {
              if (pendingDelete) {
                removeMetric(pendingDelete.id);
                notify("success", "已删除「" + pendingDelete.name + "」");
              }
              setPendingDelete(null);
            },
          },
        }}
      />
    </PanelCard>
  );
}

export default MetricTable;
