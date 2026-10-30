import { useState, useMemo } from "react";
import { IconPlusIcPublicEllipsis, IconPlusIcPublicSearch, IconPlusIcPublicAlert, IconPlusIcPublicLink, IconPlusIcPublicTxtFileTextured, IconPlusIcPublicChevronUp, IconPlusIcPublicAddMember, IconPlusIcCarUser, IconPlusIcPublicBellClock } from '@hui/icon-plus';
import Table from "@nce/eview-react/Table";
import Tag from "@/shared/Tag";
import TextField from "@/shared/TextField";
import SectionCard from "../../components/section-card/index.jsx";
import "./index.css";

const LEVEL_TAG = {
  critical: { color: "error", label: "严重" },
  warning: { color: "warning", label: "警告" },
  info: { color: "info", label: "提示" },
};
const LEVEL_ORDER = { critical: 0, warning: 1, info: 2 };
const STATUS_TAG = {
  pending: { color: "default", label: "待处理" },
  processing: { color: "processing", label: "处理中" },
  acknowledged: { color: "success", label: "已认领" },
  silenced: { color: "default", label: "已静默" },
};
const parseMinutes = (d) => parseInt(String(d).replace(/[^\d]/g, ""), 10) || 0;

// 区块⑥ 告警列表：级别 / 状态筛选 + 策略名搜索 + 分页；认领 / 静默 / 跳转对象
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
      key: "level",
      width: 88,
      render: (lvl) => {
        const t = LEVEL_TAG[lvl];
        return <Tag color={t.color} bordered={false}>{t.label}</Tag>;
      },
    },
    {
      title: "策略名",
      key: "strategy",
      render: (str, _rd, _opt, row) => {
        const r = row?.rawData || {};
        return (
          <div className="alert-strategy">
            <span className="alert-strategy-name">{str}</span>
            <span className="alert-id">{r.id}</span>
          </div>
        );
      },
    },
    {
      title: "告警对象",
      key: "object",
      render: (obj, _rd, _opt, row) => {
        const r = row?.rawData || {};
        return (
          <a className="alert-object-link" onClick={() => onJump(r.objectId)} title={`跳转至 ${obj} 监控`}>
            <IconPlusIcPublicLink iconSize="0.875rem" iconColor={['currentcolor']} />
            {obj}
          </a>
        );
      },
    },
    {
      title: "触发值 / 阈值",
      key: "trigger",
      allowSort: false,
      render: (_cell, _rd, _opt, row) => {
        const r = row?.rawData || {};
        return (
          <span className="alert-trigger">
            <span className="trigger-val">{r.triggerValue}</span>
            <span className="trigger-sep">/</span>
            <span className="trigger-th">{r.threshold}</span>
          </span>
        );
      },
    },
    {
      title: "持续时长",
      key: "duration",
      width: 110,
      render: (d) => <span className="alert-duration">{d}</span>,
    },
    {
      title: "负责人",
      key: "owner",
      width: 90,
      allowSort: false,
      render: (o) => <span className={o === "—" ? "alert-owner-empty" : "alert-owner"}>{o}</span>,
    },
    {
      title: "状态",
      key: "status",
      width: 100,
      render: (st) => {
        const t = STATUS_TAG[st];
        return <Tag color={t.color} bordered={false}>{t.label}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      allowSort: false,
      render: (_cell, _rd, _opt, row) => {
        const r = row?.rawData || {};
        const canClaim = r.status === "pending";
        const canSilence = r.status !== "silenced";
        const moreActions = [
          { key: "detail", label: "查看详情", icon: <IconPlusIcPublicTxtFileTextured iconSize="0.875rem" iconColor={['currentcolor']} /> },
          { key: "upgrade", label: "升级级别", icon: <IconPlusIcPublicChevronUp iconSize="0.875rem" iconColor={['currentcolor']} /> },
          { key: "assign", label: "转派负责人", icon: <IconPlusIcPublicAddMember iconSize="0.875rem" iconColor={['currentcolor']} /> },
        ];
        const handleMore = (key) => {
          if (key === "detail") onJump(r.objectId);
        };
        return (
          <div className="alert-actions">
            <IconPlusIcCarUser
              iconSize="0.875rem"
              iconColor={['currentcolor']}
              title={canClaim ? "认领" : "已认领"}
              onClick={canClaim ? () => onClaim(r.id) : undefined}
              className={canClaim ? "act-icon" : "act-icon is-disabled"}
            />
            <IconPlusIcPublicBellClock
              iconSize="0.875rem"
              iconColor={['currentcolor']}
              title={canSilence ? "静默" : "已静默"}
              onClick={canSilence ? () => onSilence(r) : undefined}
              className={canSilence ? "act-icon" : "act-icon is-disabled"}
            />
            <MoreMenu items={moreActions} onSelect={handleMore} />
          </div>
        );
      },
    },
  ];

  return (
    <SectionCard
      title="告警列表"
      subtitle={`${alerts.length} 条告警 · ${env === "staging" ? "预发环境" : "生产环境"}`}
      icon={<IconPlusIcPublicAlert iconSize="1.25rem" iconColor={['currentcolor']} />}
      accent="critical"
      actions={
        <TextField
          size="small"
          placeholder="搜索策略名或告警 ID"
          value={search}
          onChange={(value) => setSearch(value)}
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />}
          style={{ width: 220 }}
        />
      }
    >
      <Table
        columns={columns}
        dataset={filtered}
        enableZebraCrossing={false}
        width="unset"
        enableColumnCompareUpdate
        enablePagination
        enableAutoPaging
        pageSize={8}
        pageSizeOptions={[8, 10, 20]}
      />
    </SectionCard>
  );
}

// 手写下拉菜单（替代 antd Dropdown）：点击展开绝对定位浮层
function MoreMenu({ items, onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="act-icon act-more"
      title="更多操作"
      onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      style={{ position: "relative", display: "inline-flex", cursor: "pointer" }}
    >
      <IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={['currentcolor']} />
      {open ? (
        <ul className="more-menu__popover" onClick={(e) => e.stopPropagation()}>
          {items.map((it) => (
            <li
              key={it.key}
              className="more-menu__item"
              onClick={() => { onSelect(it.key); setOpen(false); }}
            >
              {it.icon}
              <span>{it.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </span>
  );
}
