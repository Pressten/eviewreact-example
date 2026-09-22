import { useState } from "react";
import dayjs from "dayjs";
import Button from "@nce/eview-react/Button";
import Drawer from "@nce/eview-react/Drawer";
import Table from "@nce/eview-react/Table";
import Tab, { TabItem } from "@nce/eview-react/Tab";
import Tag from "@nce/eview-react/Tag";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { useNotice } from "../../components/notice/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { accessLabels, changeLogs, fieldSchema, relatedTasks } from "../../mock/dataset.js";

const fieldColumns = [
  { title: "字段名", key: "fieldName", width: 150, render: (v) => <code className="dw-code">{v}</code> },
  { title: "类型", key: "fieldType", width: 110, allowSort: false, render: (v) => <Tag>{v}</Tag> },
  {
    title: "必填",
    key: "required",
    width: 70,
    allowSort: false,
    render: (v) => (v ? <span className="dw-req">必填</span> : <span className="dw-opt">可选</span>),
  },
  { title: "说明", key: "comment", allowSort: false },
];

// 手写进度条（antd Progress 无对应）
function SimpleProgress({ percent, status }) {
  const p = Math.min(100, Math.max(0, percent));
  const color = status === "exception" ? "var(--error)" : status === "success" ? "var(--success)" : "var(--primary)";
  return (
    <div className="dw-progress">
      <div className="dw-progress-track">
        <div className="dw-progress-fill" style={{ width: `${p}%`, background: color }} />
      </div>
    </div>
  );
}

const TAB_KEYS = ["fields", "logs", "tasks"];

export default function DetailDrawer({ record, open, onClose, onEdit, onExport, onOffline }) {
  const { setActiveMenu } = useApp();
  const { notify } = useNotice();
  const [tab, setTab] = useState(0);

  const fmtRecords = (v) => (v >= 10000 ? `${(v / 10000).toFixed(v % 10000 === 0 ? 0 : 1)} 万` : v.toLocaleString("zh-CN"));
  const fmtSize = (v) => (v >= 1024 ? `${(v / 1024).toFixed(1)} GB` : `${v} MB`);

  const title = record ? (
    <div className="dw-title">
      <span className="dw-title-name">{record.name}</span>
      <StatusTag status={record.status} />
    </div>
  ) : null;

  return (
    <Drawer
      title={title}
      visible={open}
      width={620}
      destroyOnClose
      onClose={onClose}
    >
      {record ? (
        <div className="dw-body">
          {record ? (
            <div className="dw-extra">
              <Button
                size="small"
                leftIcon={<Icon name="copy" size={13} />}
                onClick={() => {
                  if (navigator.clipboard) navigator.clipboard.writeText(record.id).catch(() => {});
                  notify("success", `已复制 ID：${record.id}`);
                }}
              >
                复制 ID
              </Button>
              <Button size="small" leftIcon={<Icon name="download" size={13} />} onClick={() => onExport(record)}>
                导出
              </Button>
            </div>
          ) : null}
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
          <div className="dw-section-title">基本信息</div>
          <div className="dw-desc">
            <div className="dw-desc-row dw-desc-full">
              <span>数据集 ID</span>
              <b><code className="dw-code">{record.id}</code></b>
            </div>
            <div className="dw-desc-row">
              <span>数据类型</span>
              <b><span className="type-chip">{record.type}</span></b>
            </div>
            <div className="dw-desc-row">
              <span>数据来源</span>
              <b>{record.source}</b>
            </div>
            <div className="dw-desc-row">
              <span>负责人</span>
              <b>{record.owner}</b>
            </div>
            <div className="dw-desc-row">
              <span>所属部门</span>
              <b>{record.department}</b>
            </div>
            <div className="dw-desc-row">
              <span>同步状态</span>
              <b>{record.synced ? <Tag color="success">已启用自动同步</Tag> : <Tag>未启用</Tag>}</b>
            </div>
            <div className="dw-desc-row">
              <span>更新时间</span>
              <b>{record.updated}</b>
            </div>
            <div className="dw-desc-row">
              <span>创建时间</span>
              <b>{record.createdAt}</b>
            </div>
            <div className="dw-desc-row dw-desc-full">
              <span>访问权限</span>
              <b>
                {(record.access || ["read"]).map((a) => (
                  <Tag key={a} style={{ marginRight: 6 }}>
                    {accessLabels[a] || a}
                  </Tag>
                ))}
              </b>
            </div>
            <div className="dw-desc-row dw-desc-full">
              <span>数据描述</span>
              <b>{record.desc}</b>
            </div>
          </div>
          <Tab
            selectedIndex={tab}
            draggable={false}
            onClick={(index) => setTab(index)}
            className="dw-tabs"
          >
            <TabItem
              title={
                <span className="dw-tab">
                  <Icon name="layers" size={13} />
                  字段结构
                </span>
              }
            >
              <Table
                columns={fieldColumns}
                dataset={fieldSchema}
                keyIndex={0}
                enableZebraCrossing={false}
                maxHeight={300}
              />
            </TabItem>
            <TabItem
              title={
                <span className="dw-tab">
                  <Icon name="list-checks" size={13} />
                  变更记录
                </span>
              }
            >
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
            <TabItem
              title={
                <span className="dw-tab">
                  <Icon name="refresh-cw" size={13} />
                  关联任务
                </span>
              }
            >
              <div className="dw-tasks">
                {relatedTasks.map((t) => (
                  <div className="dw-task" key={t.name}>
                    <div className="dw-task-head">
                      <span>{t.name}</span>
                      <StatusTag status={t.status} />
                    </div>
                    <SimpleProgress
                      percent={t.progress}
                      status={t.status === "failed" ? "exception" : t.status === "done" ? "success" : "active"}
                    />
                  </div>
                ))}
                <Button
                  status="text"
                  size="small"
                  onClick={() => {
                    onClose();
                    setActiveMenu("sync");
                  }}
                >
                  前往任务中心查看
                </Button>
              </div>
            </TabItem>
          </Tab>
          <p className="dw-hint">
            <Icon name="info" size={13} />
            抽屉宽度 620px · 最后同步于 {dayjs().format("YYYY-MM-DD HH:mm")}
          </p>
        </div>
      ) : null}
      {record ? (
        <div className="dw-footer">
          <Button status="risk" leftIcon={<Icon name="x" size={14} />} onClick={() => onOffline(record)}>
            下线数据集
          </Button>
          <div className="dw-footer-right">
            <Button status="primary" leftIcon={<Icon name="pencil" size={14} />} onClick={() => onEdit(record)}>
              编辑数据集
            </Button>
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}
