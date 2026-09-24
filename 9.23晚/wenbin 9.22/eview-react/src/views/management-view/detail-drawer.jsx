import { useState } from "react";
import dayjs from "dayjs";
import Button from "@nce/eview-react/Button";
import Drawer from "@nce/eview-react/Drawer";
import Table from "@nce/eview-react/Table";
import Tab, { TabItem } from "@nce/eview-react/Tab";
import Tag from "@nce/eview-react/Tag";
import KeyValueList from "../../components/key-value-list.jsx";
import SimpleProgress from "../../components/simple-progress.jsx";
import { Icon } from "../../shared/icon.jsx";
import { message } from "../../shared/toast.jsx";
import { useApp } from "../../context.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { accessLabels, changeLogs, fieldSchema, relatedTasks } from "../../mock/dataset.js";

const fieldColumns = [
  { title: "字段名", key: "fieldName", width: 150, render: (v) => <code className="dw-code">{v}</code> },
  { title: "类型", key: "fieldType", width: 110, render: (v) => <Tag>{v}</Tag> },
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
  const [tabIdx, setTabIdx] = useState(0);

  const fmtRecords = (v) => (v >= 10000 ? `${(v / 10000).toFixed(v % 10000 === 0 ? 0 : 1)} 万` : v.toLocaleString("zh-CN"));
  const fmtSize = (v) => (v >= 1024 ? `${(v / 1024).toFixed(1)} GB` : `${v} MB`);

  return (
    <Drawer
      visible={open}
      onClose={onClose}
      width={620}
      title={
        record ? (
          <div className="dw-title">
            <span className="dw-title-name">{record.name}</span>
            <StatusTag status={record.status} />
          </div>
        ) : null
      }
    >
      {record ? (
        <div className="dw-body">
          <div className="dw-extra">
            <Button
              size="small"
              leftIcon={<Icon name="copy" size={13} />}
              onClick={() => {
                if (navigator.clipboard) navigator.clipboard.writeText(record.id).catch(() => {});
                message.success(`已复制 ID：${record.id}`);
              }}
            >
              复制 ID
            </Button>
            <Button size="small" leftIcon={<Icon name="download" size={13} />} onClick={() => onExport(record)}>
              导出
            </Button>
          </div>
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
            title="基本信息"
            column={2}
            bordered
            size="small"
            items={[
              { label: "数据集 ID", value: <code className="dw-code">{record.id}</code>, span: 2 },
              { label: "数据类型", value: <span className="type-chip">{record.type}</span> },
              { label: "数据来源", value: record.source },
              { label: "负责人", value: record.owner },
              { label: "所属部门", value: record.department },
              { label: "同步状态", value: record.synced ? <Tag color="success">已启用自动同步</Tag> : <Tag>未启用</Tag> },
              { label: "更新时间", value: record.updated },
              { label: "创建时间", value: record.createdAt },
              {
                label: "访问权限",
                value: (
                  <span className="dw-tags">
                    {(record.access || ["read"]).map((a) => (
                      <Tag key={a}>{accessLabels[a] || a}</Tag>
                    ))}
                  </span>
                ),
                span: 2,
              },
              { label: "数据描述", value: record.desc, span: 2 },
            ]}
          />
          <Tab selectedIndex={tabIdx} draggable={false} onClick={(i) => setTabIdx(i)} className="dw-tabs">
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
                      size="small"
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
        </div>
      ) : null}
    </Drawer>
  );
}
