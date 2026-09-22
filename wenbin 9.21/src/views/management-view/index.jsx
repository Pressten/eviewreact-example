import { useEffect, useMemo, useState, useRef } from "react";
import dayjs from "dayjs";
import Button from "@nce/eview-react/Button";
import DatePicker from "@nce/eview-react/DatePicker";
import SelectCard from "@nce/eview-react/SelectCard";
import DragInput from "@nce/eview-react/DragInput";
import Spinner from "@nce/eview-react/Spinner";
import TextField from "@nce/eview-react/TextField";
import Toggle from "@nce/eview-react/Toggle";
import Select from "@nce/eview-react/Select";
import Table from "@nce/eview-react/Table";
import Tag from "@nce/eview-react/Tag";
import TipBox from "@nce/eview-react/TipBox";
import Rating from "@nce/eview-react/Rating";
import MessageDialog from "@nce/eview-react/MessageDialog";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { useNotice } from "../../components/notice/index.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { hotTags, ownerOptions, sourceOptions, statusOptions, typeIcons, typeOptions } from "../../mock/dataset.js";
import DatasetFormModal from "./dataset-form-modal.jsx";
import ExportModal from "./export-modal.jsx";
import DetailDrawer from "./detail-drawer.jsx";
import "./index.css";

const emptyFilter = {
  keyword: "",
  type: "all",
  owner: "all",
  source: "all",
  status: "all",
  range: null,
  onlyMine: false,
  minQuality: 0,
  minRecords: 0,
};

const fmtRecords = (v) => (v >= 10000 ? `${(v / 10000).toFixed(v % 10000 === 0 ? 0 : 1)} 万` : v.toLocaleString("zh-CN"));
const fmtSize = (v) => (v >= 1024 ? `${(v / 1024).toFixed(1)} GB` : `${v} MB`);

// 手写头像（antd Avatar 无对应）
function OwnerAvatar({ name }) {
  return (
    <span className="mg-avatar" aria-hidden="true">
      {name.slice(0, 1)}
    </span>
  );
}

// 手写进度条（antd Progress 无对应）
function SimpleProgress({ percent }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <span className="mg-qpop-prog">
      <span className="mg-qpop-prog-track">
        <span className="mg-qpop-prog-fill" style={{ width: `${p}%` }} />
      </span>
    </span>
  );
}

// 行内"更多"下拉（antd Dropdown 无对应）
function MoreMenu({ record, onAction }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const items = [
    { key: "copy", icon: "copy", label: "复制数据集 ID" },
    { key: "export", icon: "download", label: "导出数据" },
    { key: "toggle", icon: record.status === "published" ? "x" : "check", label: record.status === "published" ? "下线数据集" : "发布上线" },
    { key: "recycle", icon: "trash-2", label: "移入回收站", danger: true },
  ];

  return (
    <span className="mg-more-wrap" ref={ref}>
      <Button
        size="small"
        status="text"
        leftIcon={<Icon name="ellipsis" size={14} />}
        onClick={() => setOpen((v) => !v)}
      />
      {open ? (
        <span className="mg-more-menu" role="menu">
          {items.map((it) => (
            <button
              key={it.key}
              type="button"
              className={`hb-menu-item${it.danger ? " danger" : ""}`}
              onClick={() => {
                setOpen(false);
                onAction(it.key, record);
              }}
            >
              <Icon name={it.icon} size={14} />
              <span>{it.label}</span>
            </button>
          ))}
        </span>
      ) : null}
    </span>
  );
}

export default function ManagementView() {
  const { datasets, setDatasets, setRecycleItems, globalKeyword } = useApp();
  const { notify } = useNotice();
  const [draft, setDraft] = useState(() => ({ ...emptyFilter, keyword: globalKeyword }));
  const [applied, setApplied] = useState(() => ({ ...emptyFilter, keyword: globalKeyword }));
  const [advOpen, setAdvOpen] = useState(false);
  const [chips, setChips] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [exportCtx, setExportCtx] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    if (globalKeyword) {
      setDraft((f) => ({ ...f, keyword: globalKeyword }));
      setApplied((f) => ({ ...f, keyword: globalKeyword }));
    }
  }, [globalKeyword]);

  const now = () => dayjs().format("YYYY-MM-DD HH:mm");

  const filtered = useMemo(() => {
    return datasets.filter((d) => {
      const k = applied.keyword.trim().toLowerCase();
      if (k && !(d.name.toLowerCase().includes(k) || d.id.toLowerCase().includes(k) || d.owner.includes(k) || d.type.includes(k) || (d.tags || []).some((t) => t.includes(k)))) return false;
      if (applied.type !== "all" && d.type !== applied.type) return false;
      if (applied.owner !== "all" && d.owner !== applied.owner) return false;
      if (applied.source !== "all" && d.source !== applied.source) return false;
      if (applied.status !== "all" && d.status !== applied.status) return false;
      if (applied.onlyMine && d.owner !== "陈志远") return false;
      if (applied.range && applied.range[0] && applied.range[1]) {
        const day = d.updated.slice(0, 10);
        if (day < applied.range[0] || day > applied.range[1]) return false;
      }
      if (d.quality < applied.minQuality) return false;
      if (d.records < applied.minRecords) return false;
      if (chips.length && !chips.every((c) => (d.tags || []).includes(c))) return false;
      return true;
    });
  }, [datasets, applied, chips]);

  const set = (patch) => setDraft((f) => ({ ...f, ...patch }));

  const published = datasets.filter((d) => d.status === "published").length;

  const moveToRecycle = (rows) => {
    const ids = rows.map((r) => r.id);
    setDatasets((prev) => prev.filter((d) => !ids.includes(d.id)));
    setRecycleItems((prev) => [
      ...rows.map((r) => ({ id: r.id, dataset: r, sizeMB: r.sizeMB, deletedBy: "陈志远", deletedAt: now(), daysLeft: 30, reason: "手动删除" })),
      ...prev,
    ]);
    setSelectedKeys([]);
    notify("warn", `已将 ${rows.length} 个数据集移入回收站，30 天内可恢复`);
  };

  const askConfirm = (opts) => setConfirm(opts);
  const runConfirm = () => {
    if (confirm && confirm.onOk) confirm.onOk();
    setConfirm(null);
  };

  const recycleOne = (r) => {
    askConfirm({
      type: "risk",
      content: `数据集「${r.name}」将被移入回收站，30 天内可恢复。`,
      okText: "移入回收站",
      danger: true,
      onOk: () => moveToRecycle([r]),
    });
  };

  const batchOnline = () => {
    const targets = datasets.filter((d) => selectedKeys.includes(d.id) && d.status !== "published");
    askConfirm({
      type: "confirm",
      content: `选中的 ${selectedKeys.length} 个数据集中，${targets.length} 个将发布上线，其余保持已发布状态。`,
      okText: "确认上线",
      onOk: () => {
        setDatasets((prev) => prev.map((d) => (selectedKeys.includes(d.id) && d.status !== "published" ? { ...d, status: "published", updated: now() } : d)));
        setSelectedKeys([]);
        notify("success", `${targets.length} 个数据集已发布上线`);
      },
    });
  };

  const batchRecycle = () => {
    const rows = datasets.filter((d) => selectedKeys.includes(d.id));
    askConfirm({
      type: "risk",
      content: `选中的 ${rows.length} 个数据集将移入回收站，30 天内可恢复。`,
      okText: "移入回收站",
      danger: true,
      onOk: () => moveToRecycle(rows),
    });
  };

  const offlineRecord = (r) => {
    askConfirm({
      type: "risk",
      content: `「${r.name}」下线后所有 API 访问将被暂停，确定下线吗？`,
      okText: "确认下线",
      danger: true,
      onOk: () => {
        setDatasets((prev) => prev.map((d) => (d.id === r.id ? { ...d, status: "offline", updated: now() } : d)));
        setDetail(null);
        notify("warn", `「${r.name}」已下线`);
      },
    });
  };

  const toggleStatus = (r) => {
    if (r.status === "published") {
      offlineRecord(r);
    } else {
      setDatasets((prev) => prev.map((d) => (d.id === r.id ? { ...d, status: "published", updated: now() } : d)));
      notify("success", `「${r.name}」已发布上线`);
    }
  };

  const copyId = (r) => {
    if (navigator.clipboard) navigator.clipboard.writeText(r.id).catch(() => {});
    notify("success", `已复制数据集 ID：${r.id}`);
  };

  const onMoreAction = (key, r) => {
    if (key === "copy") copyId(r);
    else if (key === "export") setExportCtx({ scope: "single", count: 1, recordName: r.name, filteredCount: 1 });
    else if (key === "toggle") toggleStatus(r);
    else recycleOne(r);
  };

  const qDetail = (r) => {
    const base = Math.round(r.quality * 20);
    const rows = [
      ["完整性", base],
      ["时效性", Math.max(40, base - 6)],
      ["一致性", Math.min(100, base + 4)],
      ["唯一性", Math.max(40, base - 2)],
    ];
    return (
      <div className="mg-qpop">
        {rows.map(([k, v]) => (
          <div className="mg-qpop-row" key={k}>
            <span>{k}</span>
            <SimpleProgress percent={v} />
            <i>{v}</i>
          </div>
        ))}
      </div>
    );
  };

  const columns = [
    { title: "ID", key: "id", display: false },
    {
      title: "数据集名称",
      key: "name",
      width: 250,
      render: (v, r) => (
        <div className="mg-name">
          <button type="button" className="mg-name-link" onClick={() => setDetail(r)} title="点击查看详情">
            {v}
          </button>
          <span className="mg-name-meta">
            {r.id} · {r.fields} 个字段
          </span>
        </div>
      ),
    },
    {
      title: "类型",
      key: "type",
      width: 120,
      allowSort: false,
      render: (v) => (
        <span className="type-chip">
          <Icon name={typeIcons[v]} size={13} />
          {v}
        </span>
      ),
    },
    {
      title: "负责人",
      key: "owner",
      width: 150,
      render: (v, r) => (
        <div className="mg-owner">
          <OwnerAvatar name={v} />
          <div className="mg-owner-text">
            <span>{v}</span>
            <i>{r.department}</i>
          </div>
        </div>
      ),
    },
    { title: "记录数", key: "records", width: 110, render: (v) => fmtRecords(v) },
    { title: "存储量", key: "sizeMB", width: 100, render: (v) => fmtSize(v) },
    {
      title: "质量评分",
      key: "quality",
      width: 155,
      render: (v) => (
        <TipBox content={qDetail({ quality: v })} title="质量评分构成" trigger="hover" direction="top">
          <span className="mg-quality">
            <Rating value={v} half disabled size={14} />
            <i>{v.toFixed(1)}</i>
          </span>
        </TipBox>
      ),
    },
    {
      title: "状态",
      key: "status",
      width: 105,
      allowSort: false,
      render: (v) => <StatusTag status={v} />,
    },
    { title: "更新时间", key: "updated", width: 150, sort: "desc" },
    {
      title: "操作",
      key: "actions",
      width: 175,
      allowSort: false,
      render: (_v, r) => (
        <div className="mg-actions">
          <TipBox type="simple" content="查看详情" direction="top">
            <Button size="small" status="text" leftIcon={<Icon name="eye" size={14} />} onClick={() => setDetail(r)}>
              详情
            </Button>
          </TipBox>
          <TipBox type="simple" content="编辑" direction="top">
            <Button size="small" status="text" leftIcon={<Icon name="pencil" size={14} />} onClick={() => setEditRecord(r)}>
              编辑
            </Button>
          </TipBox>
          <MoreMenu record={r} onAction={onMoreAction} />
        </div>
      ),
    },
  ];

  const expandedRow = (r) => (
    <div className="mg-expanded">
      <div className="mg-exp-desc">
        <label>数据简介</label>
        <p>{r.desc}</p>
        <div className="mg-exp-tags">
          {(r.tags || []).map((t) => (
            <Tag key={t} style={{ marginRight: 6 }}>
              {t}
            </Tag>
          ))}
          {(r.tags || []).length === 0 ? <i>暂无标签</i> : null}
        </div>
      </div>
      <div className="mg-exp-meta">
        <div className="mg-kv">
          <span>创建时间</span>
          <b>{r.createdAt}</b>
        </div>
        <div className="mg-kv">
          <span>数据来源</span>
          <b>{r.source}</b>
        </div>
        <div className="mg-kv">
          <span>同步状态</span>
          <b>{r.synced ? "已启用自动同步" : "未启用"}</b>
        </div>
        <div className="mg-kv">
          <span>累计访问</span>
          <b>{r.views.toLocaleString("zh-CN")} 次</b>
        </div>
      </div>
    </div>
  );

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      notify("success", "列表已刷新");
    }, 600);
  };

  return (
    <div className="mg-page">
      <div className="page-head">
        <div>
          <h2>数据管理</h2>
          <p>
            共 {datasets.length} 个数据集，已发布 {published} 个 · 点击名称或双击行查看详情
          </p>
        </div>
        <div className="page-head-actions">
          <Button leftIcon={<Icon name="rotate-cw" size={14} />} onClick={refresh}>
            刷新
          </Button>
          <Button status="primary" leftIcon={<Icon name="plus" size={14} />} onClick={() => setCreateOpen(true)}>
            新建数据集
          </Button>
        </div>
      </div>

      <SectionCard
        className="mg-filter"
        icon="sliders-horizontal"
        title="筛选查询"
        subtitle="支持关键词、类型、负责人、状态与更新时间组合筛选"
        extra={
          <Button status="text" size="small" onClick={() => setAdvOpen((v) => !v)}>
            {advOpen ? "收起高级筛选" : "展开高级筛选"}
            <Icon name={advOpen ? "chevron-down" : "chevron-right"} size={13} />
          </Button>
        }
      >
        <div className="mg-filter-row">
          <div className="mg-f-item mg-fw">
            <label>关键词</label>
            <TextField
              placeholder="数据集名称 / ID / 负责人 / 标签"
              value={draft.keyword}
              onChange={(value) => set({ keyword: value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") setApplied({ ...draft });
              }}
              inputStyle={{ paddingLeft: 30 }}
            />
            <span className="mg-search-icon">
              <Icon name="search" size={14} />
            </span>
          </div>
          <div className="mg-f-item">
            <label>数据类型</label>
            <Select
              selectStyle={{ width: 150 }}
              value={draft.type}
              onChange={(v) => set({ type: v })}
              options={[{ value: "all", text: "全部类型" }, ...typeOptions.map((v) => ({ value: v, text: v }))]}
            />
          </div>
          <div className="mg-f-item">
            <label>负责人</label>
            <Select
              selectStyle={{ width: 140 }}
              value={draft.owner}
              onChange={(v) => set({ owner: v })}
              options={[{ value: "all", text: "全部负责人" }, ...ownerOptions.map((v) => ({ value: v, text: v }))]}
            />
          </div>
          <div className="mg-f-item">
            <label>更新时间</label>
            <DatePicker
              range={[]}
              format="yyyy-MM-dd"
              selectStyle={{ width: 240 }}
              onOkClick={(obj) => {
                if (obj && obj.fromSelectDate && obj.toSelectDate) {
                  set({ range: [obj.fromSelectDate, obj.toSelectDate] });
                } else {
                  set({ range: null });
                }
              }}
              onCancelClick={() => {}}
            />
          </div>
          <div className="mg-f-item">
            <label>状态</label>
            <SelectCard
              type="small"
              data={[{ value: "all", text: "全部" }, ...statusOptions.map((s) => ({ value: s.value, text: s.label }))]}
              value={draft.status}
              onChange={(v) => set({ status: v })}
            />
          </div>
          <div className="mg-f-item">
            <label>仅看我维护的</label>
            <Toggle data={[false, true]} toggled={draft.onlyMine} onToggle={(v) => set({ onlyMine: v })} />
          </div>
          <div className="mg-f-actions">
            <Button
              leftIcon={<Icon name="rotate-ccw" size={14} />}
              onClick={() => {
                setDraft({ ...emptyFilter });
                setApplied({ ...emptyFilter });
                setChips([]);
                notify("info", "筛选条件已重置");
              }}
            >
              重置
            </Button>
            <Button status="primary" leftIcon={<Icon name="search" size={14} />} onClick={() => setApplied({ ...draft })}>
              查询
            </Button>
          </div>
        </div>
        <div className={`mg-advanced${advOpen ? " open" : ""}`}>
          <div className="mg-advanced-inner">
            <div className="mg-f-item">
              <label>质量评分下限（{draft.minQuality} 分）</label>
              <DragInput
                style={{ maxWidth: 260 }}
                min={0}
                max={5}
                precision={1}
                markIndexes={[0, 2.5, 5]}
                value={[draft.minQuality]}
                onChange={(val) => set({ minQuality: val[0] })}
              />
            </div>
            <div className="mg-f-item">
              <label>最小记录数</label>
              <div className="mg-num-wrap">
                <Spinner
                  min={0}
                  doNotFocusWhenValueUpdate
                  value={draft.minRecords}
                  inputClassName="mg-num-input"
                  onChange={(v) => set({ minRecords: Number(v) || 0 })}
                />
                <span className="mg-num-suffix">条</span>
              </div>
            </div>
            <div className="mg-f-item">
              <label>数据来源</label>
              <Select
                selectStyle={{ width: 150 }}
                value={draft.source}
                onChange={(v) => set({ source: v })}
                options={[{ value: "all", text: "全部来源" }, ...sourceOptions.map((v) => ({ value: v, text: v }))]}
              />
            </div>
            <div className="mg-f-item">
              <label>热门标签（即时生效）</label>
              <div className="mg-chips">
                {hotTags.map((t) => (
                  <Tag
                    key={t}
                    color="primary"
                    fill={chips.includes(t) ? "solid" : "outline"}
                    onClick={() => setChips((prev) => (chips.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))}
                    style={{ marginRight: 8, cursor: "pointer" }}
                  >
                    {t}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {selectedKeys.length > 0 && (
        <div className="mg-batch-bar">
          <span className="mg-batch-count">
            已选择 <b>{selectedKeys.length}</b> 项
          </span>
          <Button size="small" leftIcon={<Icon name="download" size={13} />} onClick={() => setExportCtx({ scope: "selection", count: selectedKeys.length, filteredCount: filtered.length })}>
            批量导出
          </Button>
          <Button size="small" leftIcon={<Icon name="check" size={13} />} onClick={batchOnline}>
            批量上线
          </Button>
          <Button size="small" status="risk" leftIcon={<Icon name="trash-2" size={13} />} onClick={batchRecycle}>
            移入回收站
          </Button>
          <Button size="small" status="text" onClick={() => setSelectedKeys([])}>
            取消选择
          </Button>
        </div>
      )}

      <SectionCard
        className="mg-table-card"
        icon="database"
        title="数据集列表"
        subtitle={`共 ${filtered.length} 条结果`}
        extra={
          <Button size="small" leftIcon={<Icon name="download" size={13} />} onClick={() => setExportCtx({ scope: "filtered", count: filtered.length, filteredCount: filtered.length })}>
            导出当前结果
          </Button>
        }
      >
        <Table
          columns={columns}
          dataset={filtered}
          keyIndex={0}
          enableLoading={loading}
          emptyTableMsg="暂无数据集"
          enableCheckBox
          checkType="multi"
          preserveCheckedRows
          checkedRows={selectedKeys}
          onRowCheck={(_row, checkedRows) => setSelectedKeys(checkedRows)}
          onHeaderCheck={(checkedRows) => setSelectedKeys(checkedRows)}
          onRowClick={(row) => setDetail(row)}
          enableRowExpand
          onRowExpend={(row) => expandedRow(row)}
          enablePagination
          enableAutoPaging
          pagingProps={{ pageSize: 8, pageSizeOptions: [8, 20, 50] }}
        />
      </SectionCard>

      <DatasetFormModal open={createOpen} mode="create" onCancel={() => setCreateOpen(false)} onSubmit={handleCreate} />
      <DatasetFormModal open={!!editRecord} mode="edit" initial={editRecord} onCancel={() => setEditRecord(null)} onSubmit={handleEdit} />
      <ExportModal open={!!exportCtx} ctx={exportCtx} onClose={() => setExportCtx(null)} />
      <DetailDrawer
        record={detail}
        open={!!detail}
        onClose={() => setDetail(null)}
        onEdit={(r) => {
          setDetail(null);
          setEditRecord(r);
        }}
        onExport={(r) => {
          setDetail(null);
          setExportCtx({ scope: "single", count: 1, recordName: r.name, filteredCount: 1 });
        }}
        onOffline={offlineRecord}
      />

      <MessageDialog
        type={confirm?.type || "confirm"}
        isOpen={!!confirm}
        iconLocation="title"
        content={confirm?.content}
        onClose={() => setConfirm(null)}
        buttons={{
          cancel: { onClick: () => setConfirm(null) },
          ok: { text: confirm?.okText || "确定", status: confirm?.danger ? "risk" : "primary", focused: true, onClick: runConfirm },
        }}
      />
    </div>
  );

  function handleCreate(values) {
    const max = datasets.reduce((m, d) => Math.max(m, parseInt(d.id.slice(-4), 10) || 0), 0);
    const record = {
      id: `DS-2026-${String(max + 1).padStart(4, "0")}`,
      name: values.name,
      type: values.type,
      source: values.source,
      owner: values.owner,
      department: values.dept,
      records: 0,
      sizeMB: 0,
      quality: values.qualityTarget / 20,
      status: "draft",
      updated: now(),
      createdAt: dayjs().format("YYYY-MM-DD"),
      fields: values.fields,
      synced: false,
      views: 0,
      desc: values.desc,
      tags: [],
      access: values.access,
      isPublic: values.isPublic,
    };
    setDatasets((prev) => [record, ...prev]);
    setCreateOpen(false);
    notify("success", `数据集「${record.name}」创建成功，已加入草稿列表`);
  }

  function handleEdit(values) {
    setDatasets((prev) =>
      prev.map((d) =>
        d.id === editRecord.id
          ? {
              ...d,
              name: values.name,
              desc: values.desc,
              type: values.type,
              source: values.source,
              owner: values.owner,
              department: values.dept,
              fields: values.fields,
              access: values.access,
              isPublic: values.isPublic,
              quality: values.qualityTarget / 20,
              updated: now(),
            }
          : d
      )
    );
    setEditRecord(null);
    notify("success", `数据集「${values.name}」已更新`);
  }
}
