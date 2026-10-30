import Table from "@nce/eview-react/Table";
import { IconPlusIcPublicTransverseRectangleTemplate, IconPlusIcPublicResetting } from '@hui/icon-plus';
import Tag from "@/shared/Tag";
import SectionCard from "../../components/section-card/index.jsx";
import { CHANGES } from "../../mock/monitor.js";
import "./index.css";

const RESULT_TAG = {
  success: { color: "success", label: "成功" },
  failed: { color: "error", label: "失败" },
  rollback: { color: "warning", label: "回滚" },
};

// 区块⑧ 变更动态：今日 4 条发布；失败 / 回滚行可展开查看说明
export default function ChangeFeed() {
  const columns = [
    {
      title: "服务",
      key: "service",
      render: (s) => <span className="change-service">{s}</span>,
    },
    {
      title: "版本号",
      key: "version",
      render: (v) => <span className="change-version">{v}</span>,
    },
    {
      title: "负责人",
      key: "owner",
      allowSort: false,
    },
    {
      title: "结果",
      key: "result",
      render: (res) => {
        const t = RESULT_TAG[res];
        return (
          <Tag color={t.color} bordered={false} className="change-result-tag">
            {t.label}
          </Tag>
        );
      },
    },
    {
      title: "时间",
      key: "time",
      width: 80,
      allowSort: false,
    },
  ];

  const expandedRow = (row) => {
    const r = row?.rawData || {};
    return (
      <div className="change-expand">
        <div className="change-expand-head">
          <IconPlusIcPublicResetting iconSize="0.875rem" iconColor={['currentcolor']} />
          <span>{r.result === "failed" ? "失败说明与回滚处理" : "回滚说明"}</span>
        </div>
        <p className="change-reason">{r.rollbackReason}</p>
      </div>
    );
  };

  return (
    <SectionCard title="变更动态" subtitle="今日 4 条发布" icon={<IconPlusIcPublicTransverseRectangleTemplate iconSize="1.25rem" iconColor={['currentcolor']} />}>
      <Table
        columns={columns}
        dataset={CHANGES}
        enableZebraCrossing={false}
        width="unset"
        enableColumnCompareUpdate
        enableRowExpand
        onRowExpend={expandedRow}
      />
    </SectionCard>
  );
}
