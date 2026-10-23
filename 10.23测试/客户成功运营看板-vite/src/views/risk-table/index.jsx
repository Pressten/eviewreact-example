import { useState, useMemo } from "react";
import { IconPlusIcPublicAlert } from '@hui/icon-plus';
import Table from "@nce/eview-react/Table";
import Tab, { TabItem } from "@nce/eview-react/Tab";
import DivMessage from "@nce/eview-react/DivMessage";
import SectionCard from "../../components/section-card/index.jsx";
import HealthTag from "../../components/health-tag/index.jsx";
import { useApp } from "../../context.jsx";
import { riskCustomers, statusTabs } from "../../mock/dashboard.jsx";
import "./index.css";

// ⑥ 风险客户表格 — 12 行 / 4 状态 / 健康分 Progress / 行内操作(跟进·转交)
// 支持分页 + 关键词搜索(全局)+ 行业筛选(全局)+ 状态 Tabs(本地)
export default function RiskTable() {
  const { industry, searchKeyword } = useApp();
  const [statusFilter, setStatusFilter] = useState("all");
  const [notice, setNotice] = useState(null);

  const filtered = useMemo(() => {
    const kw = (searchKeyword || "").trim();
    return riskCustomers.filter((c) => {
      const matchIndustry = industry === "all" || c.industryKey === industry;
      const matchSearch =
        !kw || c.companyName.includes(kw) || c.industry.includes(kw) || c.csm.includes(kw);
      const matchStatus = statusFilter === "all" || c.statusKey === statusFilter;
      return matchIndustry && matchSearch && matchStatus;
    });
  }, [industry, searchKeyword, statusFilter]);

  const scoreColor = (score) => {
    if (score >= 75) return "var(--success)";
    if (score >= 60) return "var(--warning)";
    if (score >= 45) return "var(--critical)";
    return "var(--error)";
  };

  const handleAction = (label, record) => {
    setNotice({ text: `${label} · ${record?.companyName ?? ""}`, type: "default", key: Date.now() });
  };

  const columns = [
    {
      title: "公司名称",
      key: "companyName",
      sorter: (a, b) => a.companyName.localeCompare(b.companyName, "zh-CN"),
      render: (cell, _rowData, _options, row) => (
        <a className="table-link" onClick={() => handleAction("查看详情", row?.rawData)}>
          {cell}
        </a>
      ),
    },
    {
      title: "行业",
      key: "industry",
      sorter: (a, b) => a.industry.localeCompare(b.industry, "zh-CN"),
    },
    {
      title: "健康分",
      key: "healthScore",
      sorter: (a, b) => a.healthScore - b.healthScore,
      width: 140,
      render: (score) => (
        <div className="health-cell">
          <div className="health-bar">
            <span
              style={{
                display: "block",
                width: `${Math.min(100, Math.max(0, score))}%`,
                height: "100%",
                background: scoreColor(score),
              }}
            />
          </div>
          <span className="health-score" style={{ color: scoreColor(score) }}>
            {score}
          </span>
        </div>
      ),
    },
    {
      title: "CSM 负责人",
      key: "csm",
      sorter: (a, b) => a.csm.localeCompare(b.csm, "zh-CN"),
      render: (cell) => (
        <div className="csm-cell">
          <img src="/uploads/user.png" className="csm-avatar" alt={cell} />
          <span>{cell}</span>
        </div>
      ),
    },
    {
      title: "续约日期",
      key: "renewalDate",
      sorter: (a, b) => a.renewalDate.localeCompare(b.renewalDate),
      render: (cell) => <span className="table-date">{cell}</span>,
    },
    {
      title: "状态",
      key: "statusKey",
      allowSort: false,
      render: (cell) => <HealthTag status={cell} />,
    },
    {
      title: "操作",
      key: "action",
      width: 168,
      allowSort: false,
      render: (_cell, _rowData, _options, row) => {
        const record = row?.rawData;
        return (
          <div className="row-actions">
            <a className="table-link" onClick={() => handleAction("跟进", record)}>
              跟进
            </a>
            <a className="table-link" onClick={() => handleAction("转交", record)}>
              转交
            </a>
          </div>
        );
      },
    },
  ];

  return (
    <SectionCard
      title="风险客户跟进"
      icon={<IconPlusIcPublicAlert iconSize="1.25rem" iconColor={['currentcolor']} className="section-card-icon" />}
      extra={<span className="table-count">共 {filtered.length} 家</span>}
      bodyClassName="risk-body"
    >
      {notice && (
        <div style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage key={notice.key} display type={notice.type} text={notice.text} onClose={() => setNotice(null)} />
        </div>
      )}
      <Tab
        selectedIndex={Math.max(0, statusTabs.findIndex((t) => t.key === statusFilter))}
        draggable={false}
        onClick={(index) => setStatusFilter(statusTabs[index]?.key ?? "all")}
        className="status-tabs"
      >
        {statusTabs.map((t) => (
          <TabItem key={t.key} title={t.label} />
        ))}
      </Tab>
      <Table
        columns={columns}
        dataset={filtered}
        enablePagination
        enableAutoPaging
        pageSizeOptions={[8, 16, 24]}
        enableZebraCrossing={false}
        width="unset"
        enableColumnCompareUpdate
      />
    </SectionCard>
  );
}
