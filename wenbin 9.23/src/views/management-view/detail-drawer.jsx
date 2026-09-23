import { useState } from "react";
import dayjs from "dayjs";
import Drawer from "@nce/eview-react/Drawer";
import Button from "@nce/eview-react/Button";
import Table from "@nce/eview-react/Table";
import Tab, { TabItem } from "@nce/eview-react/Tab";
import Tag from "@nce/eview-react/Tag";
import { Icon } from "../../shared/icon.jsx";
import { useToast } from "../../shared/feedback.jsx";
import { useApp } from "../../context.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { accessLabels, changeLogs, fieldSchema, relatedTasks } from "../../mock/dataset.js";

function SimpleProgress({ percent, status = "normal", showInfo = true, style }) {
  const color = status === "error"
    ? "var(--error, #E02128)"
    : status === "success"
      ? "var(--success, #62B42E)"
      : "var(--primary, #0067D1)";
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, ...style }}>
      <div style={{ flex: 1, height: 8, background: "var(--hover, rgba(0,0,0,0.05))", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${p}%`, height: "100%", background: color, transition: "width .2s" }} />
      </div>
      {showInfo ? (
        <span style={{ color: "var(--on-surface-variant, #777)", minWidth: 40, textAlign: "right" }}>{p}%</span>
      ) : null}
    </div>
  );
}

function KeyValueList({ items, columns = 2, bordered, title, className }) {
  return (
    <div className={className}>
      {title ? (
        <div style={{ font: "var(--font-body-m)", fontWeight: "var(--font-weight-semibold)", color: "var(--on-surface)", marginBottom: 8 }}>{title}</div>
      ) : null}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 0,
        border: bordered ? "1px solid var(--divider, #e0e0e0)" : "none",
        borderRadius: bordered ? 4 : 0,
        overflow: "hidden",
      }}>
        {items.map((it, i) => (
          <div key={i} style={{
            gridColumn: it.span ? `span ${it.span}` : undefined,
            display: "flex",
            borderBottom: "1px solid var(--divider, #e0e0e0)",
            borderRight: "1px solid var(--divider, #e0e0e0)",
            minHeight: 30,
          }}>
            <span style={{
              flex: "0 0 96px",
              padding: "6px 10px",
              background: "var(--surface-container, #f5f5f5)",
              color: "var(--on-surface-variant, #777)",
              fontSize: 13,
              borderRight: "1px solid var(--divider, #e0e0e0)",
              whiteSpace: "nowrap",
            }}>{it.label}</span>
            <span style={{
              flex: 1,
              padding: "6px 10px",
              color: "var(--on-surface, #191919)",
              fontSize: 13,
            }}>{it.value ?? "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const fieldColumns = [
  { title: "字段名", key: "fieldName", width: 150, render: (v) => <code className="dw-code">{v}</code> },
  { title: "类型", key: "fieldType", width: 110, render: (v) => <Tag color="default">{v}</Tag> },
  {
    title: "必填",
    key: "required",
    width: 70,
    render: (v) => (v ? <span className="dw-req">必填</span> : <span className="dw-opt">可选</span>),
  },
  { title: "说明", key: "comment" },
];

export default function DetailDrawer({ record, open, onClose, onEdit, onExport, onOffline }) {
  const { setActiveMenu } = useApp();
  const [tab, setTab] = useState(0);
  const [toastNode, notify] = useToast();

  const fmtRecords = (v) => (v >= 10000 ? `${(v / 10000).toFixed(v % 10000 === 0 ? 0 : 1)} 万` : v.toLocaleString("zh-CN"));
  const fmtSize = (v) => (v >= 1024 ? `${(v / 1024).toFixed(1)} GB` : `${v} MB`);

  const copyId = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(record.id).catch(() => {});
    notify.success(`已复制 ID：${record.id}`);
  };

  return (
    <Drawer
      visible={open}
      onClose={() => onClose()}
      width={620}
      title={
        record ? (
          <div className="dw-title">
            <span className="dw-title-name">{record.name}</span>
            <StatusTag status={record.status} />
            <div className="dw-extra" style={{ marginLeft: "auto" }}>
              <Button size="small" leftIcon={<Icon name="copy" size={13} />} text="复制 ID" onClick={copyId} />
              <Button size="small" leftIcon={<Icon name="download" size={13} />} text="导出" onClick={() => onExport(record)} />
            </div>
          </div>
        ) : null
      }
    >
      {toastNode}
      {record ? (
        <div className="dw-body">
          <div className="dw-stats">
            <div>
              <Icon name="boxes" size={16} />
              <b>{fmtRecords(record.records)}</b>
              <span>记录数</span>
            </div>
            <div>
              <Icon name="hard-drive" size={16} />
              <b>{fmtSize(record.sizeMB)}</b>
              <span>存储量</span>
            </div>
            <div>
              <Icon name="layers" size={16} />
              <b>{record.fields}</b>
              <span>字段数</span>
            </div>
            <div>
              <Icon name="star" size={16} />
              <b>{record.quality.toFixed(1)}</b>
              <span>质量分</span>
            </div>
          </div>
          <KeyValueList
            bordered
            columns={2}
            className="dw-desc"
            title="基本信息"
            items={[
              { label: "数据集 ID", span: 2, value: <code className="dw-code">{record.id}</code> },
              { label: "数据类型", value: <span className="type-chip">{record.type}</span> },
              { label: "数据来源", value: record.source },
              { label: "负责人", value: record.owner },
              { label: "所属部门", value: record.department },
              { label: "同步状态", value: record.synced ? <Tag color="success">已启用自动同步</Tag> : <Tag color="default">未启用</Tag> },
              { label: "更新时间", value: record.updated },
              { label: "创建时间", value: record.createdAt },
              { label: "访问权限", span: 2, value: (record.access || ["read"]).map((a) => <Tag key={a} color="default">{accessLabels[a] || a}</Tag>) },
              { label: "数据描述", span: 2, value: record.desc },
            ]}
          />
          <Tab
            className="dw-tabs"
            selectedIndex={tab}
            draggable={false}
            onClick={(index) => setTab(index)}
          >
            <TabItem icon={<Icon name="layers" size={13} />} title="字段结构">
              <Table
                columns={fieldColumns}
                dataset={fieldSchema}
                keyIndex={0}
                maxHeight={300}
              />
            </TabItem>
            <TabItem icon={<Icon name="list-checks" size={13} />} title="变更记录">
              <div className="dw-logs">
                {changeLogs.map((l, i) => (
                  <div className="dw-log" key={i}>
                    <span className={`dw-log-dot tone-${l.tone}`} />
                    <div className="dw-log-main">
                      <p>{l.title}</p>
                      <span>{l.desc}</span>
                      <i>{l.time}</i>
                    </div>
                  </div>
                ))}
              </div>
            </TabItem>
            <TabItem icon={<Icon name="refresh-cw" size={13} />} title="关联任务">
              <div className="dw-tasks">
                {relatedTasks.map((t) => (
                  <div className="dw-task" key={t.name}>
                    <div className="dw-task-head">
                      <span>{t.name}</span>
                      <StatusTag status={t.status} />
                    </div>
                    <SimpleProgress
                      percent={t.progress}
                      status={t.status === "failed" ? "error" : t.status === "done" ? "success" : "normal"}
                    />
                  </div>
                ))}
                <Button
                  status="text"
                  size="small"
                  text="前往任务中心查看"
                  onClick={() => {
                    onClose();
                    setActiveMenu("sync");
                  }}
                />
              </div>
            </TabItem>
          </Tab>
          <p className="dw-hint">
            <Icon name="info" size={13} />
            抽屉宽度 620px · 最后同步于 {dayjs().format("YYYY-MM-DD HH:mm")}
          </p>
          <div style={{ height: 56 }} />
        </div>
      ) : null}
      {record ? (
        <div className="dw-footer" style={{ position: "absolute", left: 0, bottom: 0, width: "100%" }}>
          <Button status="risk" leftIcon={<Icon name="x" size={14} />} text="下线数据集" onClick={() => onOffline(record)} />
          <div className="dw-footer-right">
            <Button status="primary" leftIcon={<Icon name="pencil" size={14} />} text="编辑数据集" onClick={() => onEdit(record)} />
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}
