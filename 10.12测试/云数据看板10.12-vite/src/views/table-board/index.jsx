import { useState } from "react";
import { IconPlusIcCarRotateRight, IconPlusIcPublicCamera, IconPlusIcPublicDownload, IconPlusIcPublicEllipsis, IconPlusIcPublicExpand, IconPlusIcPublicEye, IconPlusIcPublicPlus, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicSearch, IconPlusIcPublicTrash } from '@nce/icon-plus';
import Table from "@nce/eview-react/Table";
import TextField from "@/shared/TextField";
import Button from "@nce/eview-react/Button";
import TipBox from "@nce/eview-react/TipBox";
import SimpleProgress from "../../components/simple-progress/index.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { instances } from "../../mock/dashboard.jsx";
import "./index.css";

const rowActionItems = [
  { key: "restart", icon: <IconPlusIcCarRotateRight iconSize="0.875rem" iconColor={['currentcolor']} />, label: "重启实例" },
  { key: "snapshot", icon: <IconPlusIcPublicCamera iconSize="0.875rem" iconColor={['currentcolor']} />, label: "创建快照" },
  { key: "resize", icon: <IconPlusIcPublicExpand iconSize="0.875rem" iconColor={['currentcolor']} />, label: "变更规格" },
  { divider: true },
  { key: "release", icon: <IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} />, label: "释放实例", danger: true },
];

export default function TableBoard({ onOpen }) {
  const [keyword, setKeyword] = useState("");
  const [selectedKeys, setSelectedKeys] = useState([]);

  const dataSource = instances.filter((r) => {
    if (!keyword) return true;
    const kw = keyword.toLowerCase();
    return (
      r.name.toLowerCase().includes(kw) ||
      r.id.toLowerCase().includes(kw) ||
      r.owner.includes(keyword)
    );
  });

  const columns = [
    {
      title: "实例名称",
      key: "name",
      width: 180,
      allowSort: true,
      render: (cell, rowData, options, row) => (
        <a className="cell-link" onClick={() => onOpen(row?.rawData)}>
          {cell}
        </a>
      ),
    },
    {
      title: "实例 ID",
      key: "id",
      width: 150,
      allowSort: false,
    },
    {
      title: "区域",
      key: "region",
      width: 130,
      allowSort: false,
    },
    {
      title: "规格",
      key: "spec",
      width: 150,
      allowSort: false,
    },
    {
      title: "状态",
      key: "status",
      width: 120,
      allowSort: false,
      render: (value) => <StatusTag value={value} />,
    },
    {
      title: "CPU 使用率",
      key: "cpu",
      width: 170,
      align: "right",
      allowSort: true,
      render: (value) => (
        <div className="cell-meter">
          <SimpleProgress
            percent={value}
            showText={false}
            status={value >= 85 ? "error" : "normal"}
          />
          <span className="cell-meter__val">{value}%</span>
        </div>
      ),
    },
    {
      title: "内存使用率",
      key: "memory",
      width: 120,
      align: "right",
      allowSort: true,
      render: (value) => <span className="cell-num">{value}%</span>,
    },
    {
      title: "负责人",
      key: "owner",
      width: 100,
      allowSort: false,
    },
    {
      title: "更新时间",
      key: "updateTime",
      width: 170,
      allowSort: true,
    },
    {
      title: "操作",
      key: "action",
      width: 130,
      align: "left",
      allowSort: false,
      freezeCol: true,
      render: (cell, rowData, options, row) => {
        const r = row?.rawData;
        return (
          <div className="cell-actions">
            <IconPlusIcPublicEye onClick={() => onOpen(r)} title="查看详情" iconSize="0.875rem" iconColor={['currentcolor']} style={{ cursor: 'pointer' }} />
            <IconPlusIcCarRotateRight title="重启实例" iconSize="0.875rem" iconColor={['currentcolor']} />
            <TipBox
              trigger="click"
              direction="bottomRight"
              type="simple"
              content={
                <div className="app-dropdown-menu">
                  {rowActionItems.map((item, i) =>
                    item.divider ? (
                      <div key={i} className="app-dropdown-divider" />
                    ) : (
                      <button
                        key={item.key}
                        type="button"
                        className={`app-dropdown-item${item.danger ? " app-dropdown-item--danger" : ""}`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    )
                  )}
                </div>
              }
            >
              <span className="cell-actions__more">
                <IconPlusIcPublicEllipsis title="更多操作" iconSize="0.875rem" iconColor={['currentcolor']} />
              </span>
            </TipBox>
          </div>
        );
      },
    },
  ];

  return (
    <SectionCard
      title="云主机实例"
      subtitle={`共 ${dataSource.length} 个实例`}
      bodyClassName="section-card__body--flush"
      extra={
        <div className="table-tools">
          {selectedKeys.length > 0 ? (
            <span className="table-tools__selected">
              已选 {selectedKeys.length} 项
              <a className="cell-link" onClick={() => setSelectedKeys([])}>
                取消选择
              </a>
            </span>
          ) : null}
          <TextField
            className="table-tools__search"
            placeholder="搜索实例名称、ID 或负责人"
            value={keyword}
            onChange={(value) => setKeyword(value)}
            suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />}
          />
          <TipBox type="simple" content="刷新" direction="top">
            <span className="table-tools__icon">
              <IconPlusIcPublicRefreshClockwise iconSize="1rem" iconColor={['currentcolor']} />
            </span>
          </TipBox>
          <Button size="small" text="导出" leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} />
          <Button size="small" status="primary" text="新建实例" leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />} />
        </div>
      }
    >
      <Table
        className="instance-table"
        columns={columns}
        dataset={dataSource}
        enableCheckBox
        checkType="multi"
        checkedRows={selectedKeys}
        onRowCheck={(row, checkedRows) => setSelectedKeys(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedKeys(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSize={8}
        pageSizeOptions={[8]}
        freezeColPosition="right"
      />
    </SectionCard>
  );
}
