import { useMemo, useState } from "react";
import dayjs from "dayjs";
import Button from "@nce/eview-react/Button";
import TextField from "@nce/eview-react/TextField";
import Select from "@nce/eview-react/Select";
import Table from "@nce/eview-react/Table";
import Tag from "@nce/eview-react/Tag";
import AppAvatar from "../../components/avatar.jsx";
import { Icon } from "../../shared/icon.jsx";
import { message } from "../../shared/toast.jsx";
import { useConfirm } from "../../shared/useConfirm.jsx";
import { useApp } from "../../context.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { typeIcons, typeOptions } from "../../mock/dataset.js";
import "./index.css";

export default function RecycleView() {
  const { recycleItems, setRecycleItems, setDatasets } = useApp();
  const [kw, setKw] = useState("");
  const [type, setType] = useState("all");
  const [confirm, confirmDialog] = useConfirm();

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
    message.success(`「${r.dataset.name}」已恢复，状态为已下线，可重新发布`);
  };

  const destroy = (r) => {
    confirm({
      title: "彻底删除",
      icon: <Icon name="triangle-alert" size={18} color="var(--error)" />,
      content: `「${r.dataset.name}」将被彻底删除且不可恢复，确定继续吗？`,
      okText: "彻底删除",
      okButtonProps: { danger: true },
      onOk: () => {
        setRecycleItems((prev) => prev.filter((x) => x.id !== r.id));
        message.warning(`「${r.dataset.name}」已彻底删除`);
      },
    });
  };

  const clearAll = () => {
    confirm({
      title: "清空回收站",
      icon: <Icon name="triangle-alert" size={18} color="var(--error)" />,
      content: `回收站内共 ${recycleItems.length} 项数据将被彻底删除且不可恢复，确定清空吗？`,
      okText: "清空回收站",
      okButtonProps: { danger: true },
      onOk: () => {
        setRecycleItems([]);
        message.warning("回收站已清空");
      },
    });
  };

  const findRow = (row) => filtered.find((it) => it.id === row.id) || row;

  const columns = [
    {
      title: "数据集",
      key: "id",
      render: (_v, _r, _o, row) => {
        const r = findRow(row);
        return (
          <div className="mg-name">
            <span className="rc-name">{r.dataset.name}</span>
            <span className="mg-name-meta">
              {r.id} · 删除原因：{r.reason}
            </span>
          </div>
        );
      },
    },
    {
      title: "类型",
      key: "dataset",
      width: 120,
      render: (ds) => (
        <span className="type-chip">
          <Icon name={typeIcons[ds.type]} size={13} />
          {ds.type}
        </span>
      ),
    },
    { title: "存储量", key: "sizeMB", width: 110, render: (v) => (v >= 1024 ? `${(v / 1024).toFixed(1)} GB` : `${v} MB`) },
    {
      title: "删除人",
      key: "deletedBy",
      width: 130,
      render: (v) => (
        <div className="mg-owner">
          <AppAvatar size={26} style={{ background: "var(--surface-variant)", color: "var(--on-surface-variant)", fontSize: 12 }}>
            {v.slice(0, 1)}
          </AppAvatar>
          <span className="rc-owner">{v}</span>
        </div>
      ),
    },
    { title: "删除时间", key: "deletedAt", width: 150 },
    {
      title: "保留期限",
      key: "daysLeft",
      width: 110,
      render: (v) => (v <= 7 ? <Tag color="danger">仅剩 {v} 天</Tag> : <Tag>剩余 {v} 天</Tag>),
    },
    {
      title: "操作",
      key: "op",
      width: 180,
      render: (_v, _r, _o, row) => {
        const r = findRow(row);
        return (
          <div className="mg-actions">
            <Button size="small" status="text" leftIcon={<Icon name="rotate-ccw" size={13} />} onClick={() => restore(r)}>
              恢复
            </Button>
            <Button size="small" status="risk" leftIcon={<Icon name="x" size={13} />} onClick={() => destroy(r)}>
              彻底删除
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="rc-page">
      {confirmDialog}
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

      <div className="rc-alert app-alert app-alert-info">
        <span className="app-alert-icon">
          <Icon name="info" size={16} color="var(--info)" />
        </span>
        <span className="app-alert-text">回收站内的数据将保留 30 天，到期后自动彻底删除；恢复的数据集将回到「已下线」状态。</span>
      </div>

      <SectionCard icon="trash-2" title="已删除数据" subtitle={`共 ${filtered.length} 条结果`}>
        <div className="rc-toolbar">
          <TextField
            style={{ width: 260 }}
            value={kw}
            onChange={(v) => setKw(v)}
            placeholder="搜索数据集名称 / ID"
          />
          <Select
            style={{ width: 150 }}
            value={type}
            onChange={(v) => setType(v)}
            options={[{ value: "all", text: "全部类型" }, ...typeOptions.map((v) => ({ value: v, text: v }))]}
          />
        </div>
        <Table
          columns={columns}
          dataset={filtered}
          keyIndex={0}
          enablePagination
          enableAutoPaging
          pageSizeOptions={[8, 20]}
        />
      </SectionCard>
    </div>
  );
}
