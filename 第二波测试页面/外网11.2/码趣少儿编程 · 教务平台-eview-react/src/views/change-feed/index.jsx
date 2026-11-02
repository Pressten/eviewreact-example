import Table from "@nce/eview-react/Table";
import { IconPlusIcDevBranch, IconPlusIcCarRotateRight } from '@hui/icon-plus';
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
      allowSort: false,
      render: (cell) => <span className="change-service">{cell}</span>,
    },
    {
      title: "版本号",
      key: "version",
      allowSort: false,
      render: (cell) => <span className="change-version">{cell}</span>,
    },
    {
      title: "负责人",
      key: "owner",
      allowSort: false,
    },
    {
      title: "结果",
      key: "result",
      allowSort: false,
      render: (cell) => {
        const t = RESULT_TAG[cell];
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

  const renderExpand = (r) => {
    if (!r || (r.result !== "failed" && r.result !== "rollback")) return null;
    return (
      <div className="change-expand">
        <div className="change-expand-head">
          <IconPlusIcCarRotateRight iconSize="0.875rem" iconColor={['currentcolor']} />
          <span>{r.result === "failed" ? "失败说明与回滚处理" : "回滚说明"}</span>
        </div>
        <p className="change-reason">{r.rollbackReason}</p>
      </div>
    );
  };

  return (
    <SectionCard title="变更动态" subtitle="今日 4 条发布" icon={<IconPlusIcDevBranch iconSize="1.25rem" iconColor={['currentcolor']} />}>
      <Table
        size="middle"
        columns={columns}
        dataset={CHANGES}
        enableZebraCrossing={false}
        enableColumnCompareUpdate
        width="unset"
        enableRowExpand
        onRowExpend={(row) => renderExpand(row?.rawData)}
      />
    </SectionCard>
  );
}
