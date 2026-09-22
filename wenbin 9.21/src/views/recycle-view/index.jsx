import { useMemo, useState } from "react";
import dayjs from "dayjs";
import DivMessage from "@nce/eview-react/DivMessage";
import Button from "@nce/eview-react/Button";
import SearchInput from "@nce/eview-react/SearchInput";
import Select from "@nce/eview-react/Select";
import Table from "@nce/eview-react/Table";
import Tag from "@nce/eview-react/Tag";
import MessageDialog from "@nce/eview-react/MessageDialog";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { useNotice } from "../../components/notice/index.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { typeIcons, typeOptions } from "../../mock/dataset.js";
import "./index.css";

// 手写头像（antd Avatar 无对应）
function OwnerAvatar({ name, variant }) {
  const bg = variant === "muted" ? "var(--surface-variant)" : "var(--primary-container)";
  const color = variant === "muted" ? "var(--on-surface-variant)" : "var(--primary-fixed)";
  return (
    <span className="rc-avatar" style={{ background: bg, color }} aria-hidden="true">
      {name.slice(0, 1)}
    </span>
  );
}

export default function RecycleView() {
  const { recycleItems, setRecycleItems, setDatasets } = useApp();
  const { notify } = useNotice();
  const [kw, setKw] = useState("");
  const [type, setType] = useState("all");
  const [confirm, setConfirm] = useState(null);

  const filtered = useMemo(
    () =>
      recycleItems.filter((r) => {
        const k = kw.trim().toLowerCase();
        if (k && !(r.dataset.name.toLowerCase().includes(k) || r.id.toLowerCase().includes(k))) return false;
        if (type !== "all" && r.dataset.type !== type) return false;
        return true;
      }),
    [recycleItems, kw, type]
  );

  const totalMB = recycleItems.reduce((a, r) => a + r.sizeMB, 0);

  const restore = (r) => {
    setRecycleItems((prev) => prev.filter((x) => x.id !== r.id));
    setDatasets((prev) => [
      { ...r.dataset, status: "offline", updated: dayjs().format("YYYY-MM-DD HH:mm") },
      ...prev,
    ]);
    notify("success", `「${r.dataset.name}」已恢复，状态为已下线，可重新发布`);
  };

  const destroy = (r) => {
    setConfirm({
      type: "risk",
      content: `「${r.dataset.name}」将被彻底删除且不可恢复，确定继续吗？`,
      okText: "彻底删除",
      danger: true,
      onOk: () => {
        setRecycleItems((prev) => prev.filter((x) => x.id !== r.id));
        notify("warn", `「${r.dataset.name}」已彻底删除`);
      },
    });
  };

  const clearAll = () => {
    setConfirm({
      type: "risk",
      content: `回收站内共 ${recycleItems.length} 项数据将被彻底删除且不可恢复，确定清空吗？`,
      okText: "清空回收站",
      danger: true,
      onOk: () => {
        setRecycleItems([]);
        notify("warn", "回收站已清空");
      },
    });
  };

  const runConfirm = () => {
    if (confirm && confirm.onOk) confirm.onOk();
    setConfirm(null);
  };

  const columns = [
    { title: "ID", key: "id", display: false },
    {
      title: "数据集",
      key: "name",
      render: (v, r) => (
        <div className="mg-name">
          <span className="rc-name">{v}</span>
          <span className="mg-name-meta">
            {r.id} · 删除原因：{r.reason}
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
    { title: "存储量", key: "sizeMB", width: 110, allowSort: false, render: (v) => (v >= 1024 ? `${(v / 1024).toFixed(1)} GB` : `${v} MB`) },
    {
      title: "删除人",
      key: "deletedBy",
      width: 130,
      allowSort: false,
      render: (v) => (
        <div className="mg-owner">
          <OwnerAvatar name={v} variant="muted" />
          <span className="rc-owner">{v}</span>
        </div>
      ),
    },
    { title: "删除时间", key: "deletedAt", width: 150, allowSort: false },
    {
      title: "保留期限",
      key: "daysLeft",
      width: 110,
      allowSort: false,
      render: (v) => (v <= 7 ? <Tag color="danger">仅剩 {v} 天</Tag> : <Tag>剩余 {v} 天</Tag>),
    },
    {
      title: "操作",
      key: "actions",
      width: 180,
      allowSort: false,
      render: (_v, r) => {
        const item = recycleItems.find((x) => x.id === r.id);
        return (
          <div className="mg-actions">
            <Button size="small" status="text" leftIcon={<Icon name="rotate-ccw" size={13} />} onClick={() => item && restore(item)}>
              恢复
            </Button>
            <Button size="small" status="text" leftIcon={<Icon name="x" size={13} />} onClick={() => item && destroy(item)}>
              彻底删除
            </Button>
          </div>
        );
      },
    },
  ];

  const rows = filtered.map((r) => ({
    id: r.id,
    name: r.dataset.name,
    type: r.dataset.type,
    reason: r.reason,
    sizeMB: r.sizeMB,
    deletedBy: r.deletedBy,
    deletedAt: r.deletedAt,
    daysLeft: r.daysLeft,
  }));

  return (
    <div className="rc-page">
      <div className="page-head">
        <div>
          <h2>回收站</h2>
          <p>共 {recycleItems.length} 项数据 · 占用 {(totalMB / 1024).toFixed(2)} GB · 到期后自动彻底删除</p>
        </div>
        <div className="page-head-actions">
          <Button status="risk" disabled={recycleItems.length === 0} leftIcon={<Icon name="trash-2" size={14} />} onClick={clearAll}>
            清空回收站
          </Button>
        </div>
      </div>

      <DivMessage
        display
        type="default"
        text="回收站内的数据将保留 30 天，到期后自动彻底删除；恢复的数据集将回到「已下线」状态。"
        enableDisposeTimeOut={false}
        className="rc-alert"
      />

      <SectionCard icon="trash-2" title="已删除数据" subtitle={`共 ${filtered.length} 条结果`}>
        <div className="rc-toolbar">
          <SearchInput
            style={{ width: 260 }}
            placeholder="搜索数据集名称 / ID"
            value={kw}
            onChange={(v) => setKw(v)}
            onClear={() => setKw("")}
          />
          <Select
            selectStyle={{ width: 150 }}
            value={type}
            onChange={(v) => setType(v)}
            options={[{ value: "all", text: "全部类型" }, ...typeOptions.map((v) => ({ value: v, text: v }))]}
          />
        </div>
        <Table
          columns={columns}
          dataset={rows}
          keyIndex={0}
          emptyTableMsg="回收站为空"
          enablePagination
          enableAutoPaging
          pagingProps={{ pageSize: 8, pageSizeOptions: [8, 20, 50] }}
        />
      </SectionCard>

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
}
