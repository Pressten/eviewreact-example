import Table from "@nce/eview-react/Table";
import { IconPlusIcPublicEye } from '@hui/icon-plus';
import Tag from "@/shared/Tag";
import { stages, stageMap } from "../../mock/stages.js";
import { ownerMap } from "../../mock/salespeople.js";
import { fmtMoney } from "../../mock/format.js";
import OwnerAvatar from "../../components/owner-avatar/index.jsx";

// 列表视图 — 商机以表格呈现
export default function ListView({ opps, onSelect }) {
  const columns = [
    {
      title: "客户",
      key: "customer",
      allowSort: false,
      render: (cell, _rowData, _options, row) => (
        <a className="lv__link" onClick={() => onSelect(row?.rawData)}>{cell}</a>
      ),
    },
    {
      title: "金额",
      key: "amount",
      align: "right",
      render: (cell) => <span className="lv__amount">{fmtMoney(cell)}</span>,
    },
    {
      title: "阶段",
      key: "stage",
      allowSort: false,
      render: (cell) => {
        const st = stageMap[cell];
        return st ? <Tag color={st.color} bordered={false}>{st.label}</Tag> : cell;
      },
    },
    {
      title: "负责人",
      key: "owner",
      allowSort: false,
      render: (cell) => {
        const ow = ownerMap[cell];
        return ow ? (
          <span className="lv__owner">
            <OwnerAvatar person={ow} size="1.25rem" />
            {ow.name}
          </span>
        ) : "—";
      },
    },
    {
      title: "预计成交日",
      key: "closeDate",
      render: (cell, _rowData, _options, row) => {
        const r = row?.rawData;
        return (
          <span className="lv__date">
            {cell}
            {r?.nearExpiry && <Tag color="error" bordered={false} className="lv__date-tag">临期</Tag>}
          </span>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      align: "left",
      allowSort: false,
      render: (_cell, _rowData, _options, row) => (
        <a className="lv__link" onClick={() => onSelect(row?.rawData)} title="查看详情">
          <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['var(--interactive-link)']} />
          详情
        </a>
      ),
    },
  ];

  return (
    <div className="lv">
      <Table
        columns={columns}
        dataset={opps}
        enablePagination
        enableAutoPaging
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        enableZebraCrossing={false}
        width="unset"
        enableColumnCompareUpdate
        emptyTableMsg="暂无商机"
        className="lv__table"
      />
    </div>
  );
}
