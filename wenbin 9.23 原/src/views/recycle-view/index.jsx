import { useMemo, useState } from "react";
import dayjs from "dayjs";
import DivMessage from "@nce/eview-react/DivMessage";
import Button from "@nce/eview-react/Button";
import TextField from "@nce/eview-react/TextField";
import MessageDialog from "@nce/eview-react/MessageDialog";
import Select from "@nce/eview-react/Select";
import Table from "@nce/eview-react/Table";
import Tag from "@nce/eview-react/Tag";
import { Icon } from "../../shared/icon.jsx";
import AppAvatar from "../../components/app-avatar/index.jsx";
import { useApp } from "../../context.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { typeIcons, typeOptions } from "../../mock/dataset.js";
import "./index.css";

export default function RecycleView() {
  const { recycleItems, setRecycleItems, setDatasets } = useApp();
  const [kw, setKw] = useState("");
  const [type, setType] = useState("all");
  const [confirm, setConfirm] = useState(null);
  const [notice, setNotice] = useState(null);
  const notify = (t, text) => setNotice({ key: Date.now(), type: t, text });

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
      content: `回收站内共 ${recycleItems.length} 项数据将被彻底删除且不可恢复，确定清空吗？`,
      okText: "清空回收站",
      danger: true,
      onOk: () => {
        setRecycleItems([]);
        notify("warn", "回收站已清空");
      },
    });
  };

  const columns = [
    {
      title: "数据集",
      key: "id",
      render: (v, r) => (
        <div className="mg-name">
          <span className="rc-name">{r.dataset.name}</span>
          <span className="mg-name-meta">
            {v} · 删除原因：{r.reason}
          </span>
        </div>
      ),
    },
    {
      title: "类型",
      key: "datasetType",
      width: 120,
      render: (_v, r) => {
        const v = r.dataset.type;
        return (
          <span className="type-chip">
            <Icon name={typeIcons[v]} size={13} />
            {v}
          </span>
        );
      },
    },
    { title: "存储量", key: "sizeMB", width: 110, render: (v) => (v >= 1024 ? `${(v / 1024).toFixed(1)} GB` : `${v} MB`) },
    {
      title: "删除人",
      key: "deletedBy",
      width: 130,
      render: (v) => (
        <div className="mg-owner">
          <AppAvatar
            text={v.slice(0, 1)}
            size={26}
            style={{ background: "var(--surface-variant)", color: "var(--on-surface-variant)", fontSize: 12 }}
          />
          <span className="rc-owner">{v}</span>
        </div>
      ),
    },
    { title: "删除时间", key: "deletedAt", width: 150 },
    {
      title: "保留期限",
      key: "daysLeft",
      width: 110,
      render: (v) => (v <= 7 ? <Tag color="danger">仅剩 {v} 天</Tag> : <Tag color="default">剩余 {v} 天</Tag>),
    },
    {
      title: "操作",
      key: "actions",
      width: 180,
      render: (_v, r) => (
        <div className="mg-actions">
          <Button size="small" status="text" text="恢复" leftIcon={<Icon name="rotate-ccw" size={13} />} onClick={() => restore(r)} />
          <Button size="small" status="risk" text="彻底删除" leftIcon={<Icon name="x" size={13} />} onClick={() => destroy(r)} />
        </div>
      ),
    },
  ];

  return (
    <div className="rc-page">
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={3000}
          onClose={() => setNotice(null)}
          style={{ position: "fixed", top: 56, right: 16, zIndex: 200, maxWidth: 360 }}
        />
      ) : null}
      <div className="page-head">
        <div>
          <h2>回收站</h2>
          <p>共 {recycleItems.length} 项数据 · 占用 {(totalMB / 1024).toFixed(2)} GB · 到期后自动彻底删除</p>
        </div>
        <div className="page-head-actions">
          <Button status="risk" disabled={recycleItems.length === 0} leftIcon={<Icon name="trash-2" size={14} />} text="清空回收站" onClick={clearAll} />
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
          <TextField
            value={kw}
            onChange={(value) => setKw(value)}
            leftIcon={<Icon name="search" size={14} />}
            placeholder="搜索数据集名称 / ID"
            style={{ width: 260 }}
          />
          <Select
            style={{ width: 150 }}
            value={type}
            onChange={(value) => setType(value)}
            options={[{ value: "all", text: "全部类型" }, ...typeOptions.map((v) => ({ value: v, text: v }))]}
          />
        </div>
        <Table
          columns={columns}
          dataset={filtered}
          keyIndex={0}
          enablePagination
          enableAutoPaging
          pageSize={8}
        />
      </SectionCard>

      <MessageDialog
        type={confirm?.danger ? "risk" : "confirm"}
        isOpen={!!confirm}
        iconLocation="title"
        content={confirm?.content}
        onClose={() => setConfirm(null)}
        buttons={{
          cancel: { text: "取消", onClick: () => setConfirm(null) },
          ok: {
            text: confirm?.okText || "确定",
            focused: true,
            onClick: () => {
              confirm?.onOk?.();
              setConfirm(null);
            },
          },
        }}
      />
    </div>
  );
}
