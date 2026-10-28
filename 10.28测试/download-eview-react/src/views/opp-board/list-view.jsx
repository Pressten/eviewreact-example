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
      width: 220,
      allowSort: false,
      render: (v, _rowData, _options, row) => {
        const r = row?.rawData;
        return (
          <a className="lv__link" onClick={() => onSelect(r)}>{v}</a>
        );
      },
    },
    {
      title: "金额",
      key: "amount",
      align: "right",
      width: 130,
      allowSort: true,
      render: (v) => <span className="lv__amount">{fmtMoney(v)}</span>,
    },
    {
      title: "阶段",
      key: "stage",
      width: 120,
      allowSort: false,
      render: (v) => {
        const st = stageMap[v];
        return st ? <Tag color={st.color} bordered={false}>{st.label}</Tag> : v;
      },
    },
    {
      title: "负责人",
      key: "owner",
      width: 160,
      allowSort: false,
      render: (v) => {
        const ow = ownerMap[v];
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
      width: 130,
      allowSort: true,
      render: (v, _rowData, _options, row) => {
        const r = row?.rawData;
        return (
          <span className="lv__date">
            {v}
            {r?.nearExpiry && <Tag color="error" bordered={false} className="lv__date-tag">临期</Tag>}
          </span>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      width: 80,
      align: "left",
      allowSort: false,
      render: (_v, _rowData, _options, row) => {
        const r = row?.rawData;
        return (
          <a className="lv__link" onClick={() => onSelect(r)} title="查看详情">
            <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['var(--interactive-link)']} />
            详情
          </a>
        );
      },
    },
  ];

  return (
    <div className="lv">
      <Table
        dataset={opps}
        columns={columns}
        size="middle"
        width="unset"
        enableZebraCrossing={false}
        enableColumnCompareUpdate
        enablePagination
        enableAutoPaging
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        className="lv__table"
      />
    </div>
  );
}
