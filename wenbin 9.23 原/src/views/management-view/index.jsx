import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import Button from "@nce/eview-react/Button";
import TextField from "@nce/eview-react/TextField";
import Select from "@nce/eview-react/Select";
import DatePicker from "@nce/eview-react/DatePicker";
import Toggle from "@nce/eview-react/Toggle";
import DragInput from "@nce/eview-react/DragInput";
import Spinner from "@nce/eview-react/Spinner";
import Rating from "@nce/eview-react/Rating";
import Table from "@nce/eview-react/Table";
import Tag from "@nce/eview-react/Tag";
import TipBox from "@nce/eview-react/TipBox";
import SelectCard from "@nce/eview-react/SelectCard";
import DivMessage from "@nce/eview-react/DivMessage";
import MessageDialog from "@nce/eview-react/MessageDialog";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import Progress from "../../components/progress/index.jsx";
import AppAvatar from "../../components/app-avatar/index.jsx";
import KeyValueList from "../../components/key-value-list/index.jsx";
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

export default function ManagementView() {
  const { datasets, setDatasets, setRecycleItems, globalKeyword } = useApp();
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
  const [notice, setNotice] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

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

  const recycleOne = (r) => {
    setConfirm({
      content: `数据集「${r.name}」将被移入回收站，30 天内可恢复。`,
      okText: "移入回收站",
      danger: true,
      onOk: () => moveToRecycle([r]),
    });
  };

  const batchOnline = () => {
    const targets = datasets.filter((d) => selectedKeys.includes(d.id) && d.status !== "published");
    setConfirm({
      content: `选中的 ${selectedKeys.length} 个数据集中，${targets.length} 个将发布上线，其余保持已发布状态。`,
      okText: "确认上线",
      danger: false,
      onOk: () => {
        setDatasets((prev) => prev.map((d) => (selectedKeys.includes(d.id) && d.status !== "published" ? { ...d, status: "published", updated: now() } : d)));
        setSelectedKeys([]);
        notify("success", `${targets.length} 个数据集已发布上线`);
      },
    });
  };

  const batchRecycle = () => {
    const rows = datasets.filter((d) => selectedKeys.includes(d.id));
    setConfirm({
      content: `选中的 ${rows.length} 个数据集将移入回收站，30 天内可恢复。`,
      okText: "移入回收站",
      danger: true,
      onOk: () => moveToRecycle(rows),
    });
  };

  const offlineRecord = (r) => {
    setConfirm({
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

  const renderMoreMenu = (r) => (
    <TipBox
      trigger="click"
      direction="bottomLeft"
      isMouseLeaveClose
      content={
        <div className="mg-more-menu">
          <button type="button" className="mg-more-item" onClick={() => copyId(r)}>
            <Icon name="copy" size={14} />
            <span>复制数据集 ID</span>
          </button>
          <button type="button" className="mg-more-item" onClick={() => setExportCtx({ scope: "single", count: 1, recordName: r.name, filteredCount: 1 })}>
            <Icon name="download" size={14} />
            <span>导出数据</span>
          </button>
          <hr className="mg-more-divider" />
          <button type="button" className="mg-more-item" onClick={() => toggleStatus(r)}>
            <Icon name={r.status === "published" ? "x" : "check"} size={14} />
            <span>{r.status === "published" ? "下线数据集" : "发布上线"}</span>
          </button>
          <button type="button" className="mg-more-item mg-more-danger" onClick={() => recycleOne(r)}>
            <Icon name="trash-2" size={14} />
            <span>移入回收站</span>
          </button>
        </div>
      }
    >
      <Button status="text" size="small" leftIcon={<Icon name="ellipsis" size={14} />} />
    </TipBox>
  );

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
            <Progress percent={v} size="small" showInfo={false} />
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
          <AppAvatar text={v.slice(0, 1)} size={26} style={{ background: "var(--primary-container)", color: "var(--primary-fixed)", fontSize: 12 }} />
          <div className="mg-owner-text">
            <span>{v}</span>
            <i>{r.department}</i>
          </div>
        </div>
      ),
    },
    { title: "记录数", key: "records", width: 110, allowSort: true, render: (v) => fmtRecords(v) },
    { title: "存储量", key: "sizeMB", width: 100, allowSort: true, render: (v) => fmtSize(v) },
    {
      title: "质量评分",
      key: "quality",
      width: 155,
      allowSort: true,
      render: (v) => (
        <TipBox trigger="hover" direction="top" title="质量评分构成" content={qDetail({ quality: v })}>
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
    { title: "更新时间", key: "updated", width: 150, allowSort: true, sort: "desc" },
    {
      title: "操作",
      key: "actions",
      width: 175,
      allowSort: false,
      render: (cell, r) => (
        <div className="mg-actions">
          <TipBox type="simple" content="查看详情" direction="top">
            <Button size="small" status="text" leftIcon={<Icon name="eye" size={14} />} text="详情" onClick={() => setDetail(r)} />
          </TipBox>
          <TipBox type="simple" content="编辑" direction="top">
            <Button size="small" status="text" leftIcon={<Icon name="pencil" size={14} />} text="编辑" onClick={() => setEditRecord(r)} />
          </TipBox>
          {renderMoreMenu(r)}
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
            <Tag key={t}>{t}</Tag>
          ))}
          {(r.tags || []).length === 0 ? <i>暂无标签</i> : null}
        </div>
      </div>
      <KeyValueList
        items={[
          { label: "创建时间", value: r.createdAt },
          { label: "数据来源", value: r.source },
          { label: "同步状态", value: r.synced ? "已启用自动同步" : "未启用" },
          { label: "累计访问", value: `${r.views.toLocaleString("zh-CN")} 次` },
        ]}
        columns={1}
        className="mg-exp-meta"
      />
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
      {notice ? (
        <DivMessage key={notice.key} display type={notice.type} text={notice.text} disposeTimeOut={3000} onClose={() => setNotice(null)} />
      ) : null}
      <div className="page-head">
        <div>
          <h2>数据管理</h2>
          <p>
            共 {datasets.length} 个数据集，已发布 {published} 个 · 点击名称或双击行查看详情
          </p>
        </div>
        <div className="page-head-actions">
          <Button leftIcon={<Icon name="rotate-cw" size={14} />} text="刷新" onClick={refresh} />
          <Button status="primary" leftIcon={<Icon name="plus" size={14} />} text="新建数据集" onClick={() => setCreateOpen(true)} />
        </div>
      </div>

      <SectionCard
        className="mg-filter"
        icon="sliders-horizontal"
        title="筛选查询"
        subtitle="支持关键词、类型、负责人、状态与更新时间组合筛选"
        extra={
          <Button status="text" size="small" text={advOpen ? "收起高级筛选" : "展开高级筛选"} rightIcon={<Icon name={advOpen ? "chevron-down" : "chevron-right"} size={13} />} onClick={() => setAdvOpen((v) => !v)} />
        }
      >
        <div className="mg-filter-row">
          <div className="mg-f-item mg-fw">
            <label>关键词</label>
            <TextField
              style={{ width: 320 }}
              value={draft.keyword}
              onChange={(value) => set({ keyword: value })}
              leftIcon={<Icon name="search" size={14} />}
              placeholder="数据集名称 / ID / 负责人 / 标签"
            />
          </div>
          <div className="mg-f-item">
            <label>数据类型</label>
            <Select
              style={{ width: 150 }}
              value={draft.type}
              defaultLabel="全部类型"
              onChange={(v) => set({ type: v })}
              options={[{ value: "all", text: "全部类型" }, ...typeOptions.map((v) => ({ value: v, text: v }))]}
            />
          </div>
          <div className="mg-f-item">
            <label>负责人</label>
            <Select
              style={{ width: 140 }}
              value={draft.owner}
              defaultLabel="全部负责人"
              onChange={(v) => set({ owner: v })}
              options={[{ value: "all", text: "全部负责人" }, ...ownerOptions.map((v) => ({ value: v, text: v }))]}
            />
          </div>
          <div className="mg-f-item">
            <label>更新时间</label>
            <DatePicker
              type="date"
              format="yyyy-MM-dd"
              range={[]}
              style={{ width: 260 }}
              onOkClick={(obj) => {
                if (obj && obj.fromDateObj && obj.toDateObj) {
                  const from = dayjs(obj.fromDateObj).format("YYYY-MM-DD");
                  const to = dayjs(obj.toDateObj).format("YYYY-MM-DD");
                  setTimeout(() => set({ range: [from, to] }), 100);
                } else {
                  setTimeout(() => set({ range: null }), 100);
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
              text="重置"
              onClick={() => {
                setDraft({ ...emptyFilter });
                setApplied({ ...emptyFilter });
                setChips([]);
                notify("default", "筛选条件已重置");
              }}
            />
            <Button status="primary" leftIcon={<Icon name="search" size={14} />} text="查询" onClick={() => setApplied({ ...draft })} />
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
                onChange={(v) => set({ minQuality: v[0] })}
              />
            </div>
            <div className="mg-f-item">
              <label>最小记录数</label>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Spinner
                  min={0}
                  step={10000}
                  value={draft.minRecords}
                  onChange={(v) => set({ minRecords: v || 0 })}
                  style={{ width: 130 }}
                />
                <span style={{ font: "var(--font-body-s)", color: "var(--on-surface-variant)" }}>条</span>
              </div>
            </div>
            <div className="mg-f-item">
              <label>数据来源</label>
              <Select
                style={{ width: 150 }}
                value={draft.source}
                defaultLabel="全部来源"
                onChange={(v) => set({ source: v })}
                options={[{ value: "all", text: "全部来源" }, ...sourceOptions.map((v) => ({ value: v, text: v }))]}
              />
            </div>
            <div className="mg-f-item">
              <label>热门标签（即时生效）</label>
              <div className="mg-chips">
                {hotTags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`app-checkable-tag${chips.includes(t) ? " active" : ""}`}
                    onClick={() => setChips((prev) => (chips.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))}
                  >
                    {t}
                  </button>
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
          <Button size="small" leftIcon={<Icon name="download" size={13} />} text="批量导出" onClick={() => setExportCtx({ scope: "selection", count: selectedKeys.length, filteredCount: filtered.length })} />
          <Button size="small" leftIcon={<Icon name="check" size={13} />} text="批量上线" onClick={batchOnline} />
          <Button size="small" status="risk" leftIcon={<Icon name="trash-2" size={13} />} text="移入回收站" onClick={batchRecycle} />
          <Button size="small" status="text" text="取消选择" onClick={() => setSelectedKeys([])} />
        </div>
      )}

      <SectionCard
        className="mg-table-card"
        icon="database"
        title="数据集列表"
        subtitle={`共 ${filtered.length} 条结果`}
        extra={
          <Button size="small" leftIcon={<Icon name="download" size={13} />} text="导出当前结果" onClick={() => setExportCtx({ scope: "filtered", count: filtered.length, filteredCount: filtered.length })} />
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
          checkedRows={selectedKeys}
          onRowCheck={(row, checkedRows) => setSelectedKeys(checkedRows)}
          onHeaderCheck={(checkedRows) => setSelectedKeys(checkedRows)}
          enableRowExpand
          onRowExpend={expandedRow}
          onDoubleClick={(row) => setDetail(row)}
          enablePagination
          enableAutoPaging
          pageSizeOptions={[8, 20, 50]}
          maxHeight={600}
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
        type={confirm?.danger ? "risk" : "confirm"}
        isOpen={!!confirm}
        iconLocation="title"
        content={confirm?.content}
        onClose={() => setConfirm(null)}
        buttons={{
          cancel: { text: "取消", onClick: () => setConfirm(null) },
          ok: { text: confirm?.okText || "确定", focused: true, onClick: () => { confirm?.onOk?.(); setConfirm(null); } },
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
