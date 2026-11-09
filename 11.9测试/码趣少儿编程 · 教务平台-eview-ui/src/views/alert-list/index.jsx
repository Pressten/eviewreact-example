import { useState, useMemo } from "react";
import TablePro from "eview-ui/TablePro";
import Tag from "eview-ui/Tag";
import TextField from "eview-ui/TextField";
import Dropdown from "eview-ui/Dropdown";
import Icon from "@/shared/Icon";
import SectionCard from "../../components/section-card/index.jsx";
import "./index.css";

const LEVEL_TAG = {
  critical: { color: "danger", label: "严重" },
  warning: { color: "warning", label: "警告" },
  info: { color: "primary", label: "提示" },
};
const LEVEL_ORDER = { critical: 0, warning: 1, info: 2 };
const STATUS_TAG = {
  pending: { color: "default", label: "待处理" },
  processing: { color: "primary", label: "处理中" },
  acknowledged: { color: "success", label: "已认领" },
  silenced: { color: "default", label: "已静默" },
};
const parseMinutes = (d) => parseInt(String(d).replace(/[^\d]/g, ""), 10) || 0;

export default function AlertList({ alerts, env, onClaim, onSilence, onJump }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    if (!kw) return alerts;
    return alerts.filter((a) => a.strategy.toLowerCase().includes(kw) || a.id.toLowerCase().includes(kw));
  }, [alerts, search]);

  const columns = [
    {
      title: "级别",
      dataIndex: "level",
      key: "level",
      width: 88,
      filters: [
        { text: "严重", value: "critical" },
        { text: "警告", value: "warning" },
        { text: "提示", value: "info" },
      ],
      onFilter: (value, r) => r.level === value,
      sorter: (a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level],
      render: (lvl) => {
        const t = LEVEL_TAG[lvl];
        return <Tag type="status" color={t.color}>{t.label}</Tag>;
      },
    },
    {
      title: "策略名",
      dataIndex: "strategy",
      key: "strategy",
      sorter: (a, b) => a.strategy.localeCompare(b.strategy, "zh"),
      render: (str, r) => (
        <div className="alert-strategy">
          <span className="alert-strategy-name">{str}</span>
          <span className="alert-id">{r.id}</span>
        </div>
      ),
    },
    {
      title: "告警对象",
      dataIndex: "object",
      key: "object",
      render: (obj, r) => (
        <a className="alert-object-link" onClick={() => onJump(r.objectId)} title={`跳转至 ${obj} 监控`}>
          <Icon name="external-link" size="0.875rem" />
          {obj}
        </a>
      ),
    },
    {
      title: "触发值 / 阈值",
      key: "trigger",
      render: (_, r) => (
        <span className="alert-trigger">
          <span className="trigger-val">{r.triggerValue}</span>
          <span className="trigger-sep">/</span>
          <span className="trigger-th">{r.threshold}</span>
        </span>
      ),
    },
    {
      title: "持续时长",
      dataIndex: "duration",
      key: "duration",
      width: 110,
      sorter: (a, b) => parseMinutes(a.duration) - parseMinutes(b.duration),
      render: (d) => <span className="alert-duration">{d}</span>,
    },
    {
      title: "负责人",
      dataIndex: "owner",
      key: "owner",
      width: 90,
      render: (o) => <span className={o === "—" ? "alert-owner-empty" : "alert-owner"}>{o}</span>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      filters: [
        { text: "待处理", value: "pending" },
        { text: "处理中", value: "processing" },
        { text: "已认领", value: "acknowledged" },
        { text: "已静默", value: "silenced" },
      ],
      onFilter: (value, r) => r.status === value,
      render: (st) => {
        const t = STATUS_TAG[st];
        return <Tag type="status" color={t.color}>{t.label}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, r) => {
        const canClaim = r.status === "pending";
        const canSilence = r.status !== "silenced";
        const moreItems = (
          <div className="act-more-menu">
            <div className="act-more-item" onClick={() => onJump(r.objectId)}>
              <Icon name="file-text" size="0.875rem" /> 查看详情
            </div>
            <div className="act-more-item">
              <Icon name="arrow-up" size="0.875rem" /> 升级别
            </div>
            <div className="act-more-item">
              <Icon name="user-plus" size="0.875rem" /> 转派负责人
            </div>
          </div>
        );
        return (
          <div className="alert-actions">
            <Icon
              name="user-check"
              size="0.875rem"
              title={canClaim ? "认领" : "已认领"}
              onClick={canClaim ? () => onClaim(r.id) : undefined}
              className={canClaim ? "act-icon" : "act-icon is-disabled"}
            />
            <Icon
              name="bell-off"
              size="0.875rem"
              title={canSilence ? "静默" : "已静默"}
              onClick={canSilence ? () => onSilence(r) : undefined}
              className={canSilence ? "act-icon" : "act-icon is-disabled"}
            />
            <Dropdown overlay={moreItems} trigger={["click"]}>
              <span className="act-icon act-more" title="更多操作">
                <Icon name="ellipsis" size="0.875rem" />
              </span>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const recordCount = filtered.length;

  return (
    <SectionCard
      title="告警列表"
      subtitle={`${alerts.length} 条告警 · ${env === "staging" ? "预发环境" : "生产环境"}`}
      icon="bell"
      accent="critical"
      actions={
        <div style={{ width: 220, display: "inline-flex", alignItems: "center" }}>
          <Icon name="search" size="0.875rem" style={{ marginRight: "0.25rem", color: "#AEAEAE" }} />
          <TextField
            placeholder="搜索策略名或告警 ID"
            value={search}
            onChange={(v) => setSearch(v)}
            style={{ flex: 1 }}
          />
        </div>
      }
    >
      <TablePro
        size="normal"
        rowKey="id"
        columns={columns}
        dataset={filtered}
        columnResizable={false}
        scroll={{ x: 980 }}
        pagination={{
          recordCount,
          pageSize: 8,
          pageSizeOptions: [8, 10, 20],
        }}
      />
    </SectionCard>
  );
}
