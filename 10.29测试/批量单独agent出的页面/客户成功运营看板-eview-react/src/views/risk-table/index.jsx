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

// ⑥ 风险客户表格 — 12 行 / 4 状态 / 健康分(手写进度条) / 行内操作(跟进·转交)
// 支持分页 + 关键词搜索(全局)+ 行业筛选(全局)+ 状态 Tabs(本地)
// antd Table→eview Table（dataSource→dataset / dataIndex→key / render 行数据取 row.rawData）
// antd Tabs→eview Tab（items→children TabItem / activeKey→selectedIndex / onChange→onClick(index)）
// antd Progress→手写进度条（eview 无对应，showInfo=false 仅色条 + 分数）
// antd message.info→DivMessage；Dropdown 为死代码（moreProps 构建后未渲染）已移除
export default function RiskTable() {
  const { industry, searchKeyword } = useApp();
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
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
    setNotice({ key: Date.now(), text: `${label} · ${record?.companyName}` });
  };

  const statusTabIndex = Math.max(0, statusTabs.findIndex((t) => t.key === statusFilter));

  const columns = [
    {
      title: "公司名称",
      key: "companyName",
      // render(cellValue, rowData, options, row) —— 行数据在 row.rawData（可能 undefined）
      render: (text, _rowData, _options, row) => {
        const record = row?.rawData;
        return (
          <a className="table-link" onClick={() => handleAction("查看详情", record)}>
            {text}
          </a>
        );
      },
    },
    {
      title: "行业",
      key: "industry",
    },
    {
      title: "健康分",
      key: "healthScore",
      width: 140,
      allowSort: true,
      render: (score) => (
        <div className="health-cell">
          <div className="health-progress">
            <div
              className="health-progress-bar"
              style={{ width: `${Math.min(100, Math.max(0, score))}%`, background: scoreColor(score) }}
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
      allowSort: true,
      render: (text) => (
        <div className="csm-cell">
          <img src="/uploads/user.png" className="csm-avatar" alt={text} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "续约日期",
      key: "renewalDate",
      allowSort: true,
      render: (date) => <span className="table-date">{date}</span>,
    },
    {
      title: "状态",
      key: "statusKey",
      allowSort: false,
      render: (key) => <HealthTag status={key} />,
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
      <Tab
        selectedIndex={statusTabIndex}
        draggable={false}
        className="status-tabs"
        onClick={(index) => setStatusFilter(statusTabs[index].key)}
      >
        {statusTabs.map((t) => (
          <TabItem key={t.key} title={t.label} />
        ))}
      </Tab>
      <Table
        columns={columns}
        dataset={filtered}
        width="unset"
        enableZebraCrossing={false}
        enablePagination
        enableAutoPaging
        currentPage={page}
        pageSize={8}
        onPageChange={(currentPage) => setPage(currentPage)}
        emptyTableMsg="暂无风险客户"
      />
      {notice && (
        <div className="notice-overlay">
          <DivMessage
            key={notice.key}
            display
            type="default"
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      )}
    </SectionCard>
  );
}
