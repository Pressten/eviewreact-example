import { useState } from "react";
import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import MessageDialog from "@nce/eview-react/MessageDialog";
import DivMessage from "@nce/eview-react/DivMessage";
// TODO_CONTRACT: icon+ 组件名按命名规约 IconPlusIcPublic<Name> 暂定，真实名需经 icon-plus 接口 getIconInfo(keyword) 在线查询确认（离线迁移无法运行该查询）
import {
  IconPlusIcPublicEdit,
  IconPlusIcPublicCopy,
  IconPlusIcPublicMore,
  IconPlusIcPublicCheck,
  IconPlusIcPublicForbid,
  IconPlusIcPublicDownload,
  IconPlusIcPublicTrash,
  IconPlusIcPublicUpload,
  IconPlusIcPublicRefresh,
} from "@nce/icon-plus";
import { useApp } from "../../context.jsx";
import PanelCard from "../../components/panel-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import CategoryChip from "../../components/category-chip/index.jsx";
import RatioValue from "../../components/ratio-value/index.jsx";
import { formatMetricValue, isBreach } from "../../data.js";
import "./index.css";

// Layer 4: 指标列表（工具区 + 批量操作条 + 表格 + 分页）
export default function MetricTable() {
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
  const [openMenuId, setOpenMenuId] = useState(null);

  const notify = (type, text, title) =>
    setNotice({ key: Date.now(), type, text, title });

  const selectedCount = selectedRowKeys.length;
  const disableCheckboxIds = filteredMetrics
    .filter((metric) => metric.status === "offline")
    .map((metric) => metric.id);

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

  const buildMoreItems = (record) => {
    const items = [];
    if (record.status === "offline") {
      items.push({ key: "enable", icon: <IconPlusIcPublicCheck />, label: "启用指标" });
    } else {
      items.push({ key: "disable", icon: <IconPlusIcPublicForbid />, label: "停用指标" });
    }
    items.push({ key: "export", icon: <IconPlusIcPublicDownload />, label: "导出指标数据" });
    items.push({ divider: true });
    items.push({ key: "remove", icon: <IconPlusIcPublicTrash />, label: "删除指标", danger: true });
    return items;
  };

  const columns = [
    { title: "ID", key: "id", display: false, allowSort: false },
    {
      title: "指标名称",
      key: "name",
      width: 260,
      allowSort: false,
      render: (value, record) => (
        <div className="metric-table__name">
          <Button
            status="text"
            text={record.name}
            className="metric-table__name-link"
            onClick={() => openEdit(record)}
          />
          <span className="metric-table__code">{record.code}</span>
        </div>
      ),
    },
    {
      title: "指标分类",
      key: "category",
      width: 110,
      allowSort: false,
      render: (value) => <CategoryChip category={value} />,
    },
    { title: "统计周期", key: "cycle", width: 96, allowSort: false },
    {
      title: "统计维度",
      key: "dimension",
      width: 104,
      allowSort: false,
      render: (value) => <span className="metric-table__muted">{value}</span>,
    },
    {
      title: "目标值",
      key: "target",
      width: 104,
      align: "right",
      allowSort: false,
      render: (value, record) => (
        <span className="metric-table__num">{formatMetricValue(value, record.unit)}</span>
      ),
    },
    {
      title: "当前值",
      key: "current",
      width: 116,
      align: "right",
      allowSort: false,
      render: (value, record) => (
        <span className={"metric-table__num" + (isBreach(record) ? " metric-table__num--alert" : "")}>
          {formatMetricValue(value, record.unit)}
        </span>
      ),
    },
    {
      title: "达成率",
      key: "ratio",
      width: 128,
      align: "right",
      allowSort: true,
      render: (value, record) => (
        <RatioValue ratio={value} trend={record.trend} polarity={record.polarity} />
      ),
    },
    {
      title: "指标状态",
      key: "status",
      width: 108,
      allowSort: false,
      render: (value) => <StatusTag status={value} />,
    },
    { title: "责任人", key: "owner", width: 96, allowSort: false },
    {
      title: "数据来源",
      key: "source",
      width: 116,
      allowSort: false,
      render: (value) => <span className="metric-table__muted">{value}</span>,
    },
    {
      title: "更新时间",
      key: "updatedAt",
      width: 150,
      allowSort: true,
      render: (value) => <span className="metric-table__muted">{value}</span>,
    },
    {
      title: "操作",
      key: "actions",
      width: 132,
      align: "right",
      allowSort: false,
      render: (value, record) => (
        <div className="metric-table__actions">
          <IconButton
            iconName={<IconPlusIcPublicEdit />}
            tipText="编辑指标"
            tipData={{ direction: "top" }}
            onClick={() => openEdit(record)}
          />
          <IconButton
            iconName={<IconPlusIcPublicCopy />}
            tipText="复制指标定义"
            tipData={{ direction: "top" }}
            onClick={() => {
              duplicateMetric(record.id);
              notify("success", "已复制「" + record.name + "」的定义");
            }}
          />
          <div className="metric-table__more">
            <button
              type="button"
              className="metric-table__more-trigger"
              aria-label="更多操作"
              aria-haspopup="menu"
              aria-expanded={openMenuId === record.id}
              onClick={() =>
                setOpenMenuId(openMenuId === record.id ? null : record.id)
              }
            >
              <IconPlusIcPublicMore />
            </button>
            {openMenuId === record.id ? (
              <>
                <div
                  className="metric-table__more-backdrop"
                  onClick={() => setOpenMenuId(null)}
                />
                <div className="metric-table__more-menu" role="menu">
                  {buildMoreItems(record).map((item, idx) =>
                    item.divider ? (
                      <span key={idx} className="metric-table__more-divider" />
                    ) : (
                      <button
                        key={item.key}
                        type="button"
                        role="menuitem"
                        className={
                          "metric-table__more-item" +
                          (item.danger ? " metric-table__more-item--danger" : "")
                        }
                        onClick={() => {
                          handleRowAction(item.key, record);
                          setOpenMenuId(null);
                        }}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    )
                  )}
                </div>
              </>
            ) : null}
          </div>
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
          <Button size="small" text="批量导入" leftIcon={<IconPlusIcPublicUpload />} />
          <IconButton
            iconName={<IconPlusIcPublicRefresh />}
            tipText="刷新数据"
            tipData={{ direction: "bottom" }}
            onClick={() => notify("success", "指标数据已刷新")}
          />
        </>
      }
      bodyClassName="metric-table__body"
    >
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          title={notice.title}
          text={notice.text}
          disposeTimeOut={3000}
          onClose={() => setNotice(null)}
        />
      ) : null}

      {selectedCount ? (
        <div className="metric-table__bulk">
          <span className="metric-table__bulk-text">
            已选择 <b>{selectedCount}</b> 项指标
          </span>
          <Button
            size="small"
            text="批量启用"
            leftIcon={<IconPlusIcPublicCheck />}
            onClick={() => {
              updateStatus(selectedRowKeys, "online");
              notify("success", "已批量启用 " + selectedCount + " 个指标");
            }}
          />
          <Button
            size="small"
            text="批量停用"
            leftIcon={<IconPlusIcPublicForbid />}
            onClick={() => {
              updateStatus(selectedRowKeys, "offline");
              notify("success", "已批量停用 " + selectedCount + " 个指标");
            }}
          />
          <Button
            size="small"
            text="导出所选"
            leftIcon={<IconPlusIcPublicDownload />}
            onClick={() => notify("success", "已导出 " + selectedCount + " 个指标的明细")}
          />
          <Button
            status="text"
            size="small"
            text="取消选择"
            className="metric-table__bulk-clear"
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
        disableCheckboxIds={disableCheckboxIds}
        onRowCheck={(row, checkedRows) => setSelectedRowKeys(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedRowKeys(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSizeOptions={[10, 20, 50]}
        pagingProps={{ pageSize: 10, recordCountDisp: "共 " + filteredMetrics.length + " 条记录" }}
        emptyTableMsg="暂无指标"
      />

      <div className="metric-table__footer">
        <span>指标口径以《数据指标管理规范》为准，异常指标同步至值班告警群。</span>
        <Button status="text" size="small" text="新增指标定义" onClick={openCreate} />
      </div>

      <MessageDialog
        type="risk"
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
              const record = pendingDelete;
              removeMetric(record.id);
              setPendingDelete(null);
              notify("success", "已删除「" + record.name + "」");
            },
          },
        }}
      />
    </PanelCard>
  );
}
