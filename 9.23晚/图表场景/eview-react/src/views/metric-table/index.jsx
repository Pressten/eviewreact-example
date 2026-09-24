import { useState } from "react";
import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import Tag from "@nce/eview-react/Tag";
import TipBox from "@nce/eview-react/TipBox";
import { Icon } from "../../shared/icon.jsx";
import VerdictTag from "../../components/verdict-tag/index.jsx";
import "./index.css";

// Layer 4: 指标判断明细表
function rateTone(rate) {
  if (rate >= 98) return "is-success";
  if (rate >= 94) return "is-critical";
  return "is-error";
}

// TODO(eview-react): antd Dropdown 无对应，用 TipBox trigger="click" + 自定义菜单替代
const ACTION_MENU = [
  { key: "detail", icon: "file-text", label: "指标详情" },
  { key: "trace", icon: "git-branch", label: "下钻归因" },
  { key: "notify", icon: "send", label: "通知责任人" },
];

export default function MetricTable({ rows }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // TipBox key 重挂用于点击菜单项后关闭弹层
  const [menuKey, setMenuKey] = useState(0);

  const columns = [
    { title: "指标编码", key: "code", width: 108 },
    {
      title: "指标名称",
      key: "name",
      width: 190,
      render: (cell) => (
        <Button status="text" size="small" text={cell} className="cell-link" />
      ),
    },
    {
      title: "业务域",
      key: "domain",
      width: 108,
      render: (cell) => <span className="cell-domain">{cell}</span>,
    },
    { title: "所属区域", key: "region", width: 100 },
    { title: "责任人", key: "owner", width: 84 },
    // 隐藏列：供 current/target 的 render 取 row.unit（row 是 keyIndex 精简对象）
    { title: "单位", key: "unit", display: false },
    {
      title: "当前值",
      key: "current",
      width: 128,
      align: "right",
      render: (cell, _rowData, _options, row) => (
        <span className="cell-num">
          {cell}
          <em>{row.unit}</em>
        </span>
      ),
    },
    {
      title: "目标值",
      key: "target",
      width: 118,
      align: "right",
      render: (cell, _rowData, _options, row) => (
        <span className="cell-num cell-num--muted">
          {cell}
          <em>{row.unit}</em>
        </span>
      ),
    },
    {
      title: "达成率",
      key: "rate",
      width: 108,
      align: "right",
      allowSort: true,
      render: (cell) => (
        <span className={`cell-rate ${rateTone(cell)}`}>{cell.toFixed(1)}%</span>
      ),
    },
    {
      title: "同比",
      key: "yoy",
      width: 96,
      align: "right",
      render: (cell) => (
        <span className={`cell-yoy ${cell >= 0 ? "is-up" : "is-down"}`}>
          <Icon name={cell >= 0 ? "arrow-up-right" : "arrow-down-right"} size={13} />
          {Math.abs(cell)}
        </span>
      ),
    },
    {
      title: "判断结论",
      key: "verdict",
      width: 108,
      render: (cell) => <VerdictTag verdict={cell} />,
    },
    {
      title: "更新时间",
      key: "updated",
      width: 140,
      render: (cell) => <span className="cell-time">{cell}</span>,
    },
    {
      title: "操作",
      key: "action",
      width: 96,
      align: "left",
      freezeCol: true,
      render: () => (
        <div className="cell-actions">
          <IconButton
            size="small"
            iconName={<Icon name="search" size={14} />}
            tipText="查看判断依据"
          />
          <TipBox
            key={menuKey}
            trigger="click"
            direction="bottomRight"
            content={
              <div className="cell-menu">
                {ACTION_MENU.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className="cell-menu-item"
                    onClick={() => setMenuKey((k) => k + 1)}
                  >
                    <Icon name={item.icon} size={14} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            }
          >
            <IconButton
              size="small"
              iconName={<Icon name="ellipsis" size={14} />}
              tipText="更多操作"
            />
          </TipBox>
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
              <Button
                size="small"
                status="primary"
                text="批量重判"
                leftIcon={<Icon name="play" size={13} />}
              />
              <Button
                size="small"
                text="通知责任人"
                leftIcon={<Icon name="send" size={13} />}
              />
              <Button
                size="small"
                status="text"
                text="取消选择"
                onClick={() => setSelectedRowKeys([])}
              />
            </div>
          ) : (
            <>
              <Tag className="legend-tag legend-tag--pass">达标 ≥98%</Tag>
              <Tag className="legend-tag legend-tag--warn">预警 94%~98%</Tag>
              <Tag className="legend-tag legend-tag--fail">异常 &lt;94%</Tag>
              <Button text="列设置" leftIcon={<Icon name="columns-3" size={14} />} />
            </>
          )}
        </div>
      </header>

      <Table
        columns={columns}
        dataset={rows}
        keyIndex={0}
        enableCheckBox
        checkType="multi"
        checkedRows={selectedRowKeys}
        onRowCheck={(_row, checkedRows) => setSelectedRowKeys(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedRowKeys(checkedRows)}
        enablePagination
        enableAutoPaging
        pagingProps={{ pageSize: 10, pageSizeOptions: [10, 20, 50] }}
        emptyTableMsg="暂无指标数据"
        freezeColPosition="right"
      />
    </section>
  );
}
