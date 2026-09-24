import { useState } from "react";
import dayjs from "dayjs";
import { Button, Descriptions, Drawer, Progress, Table, Tabs, Tag, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { accessLabels, changeLogs, fieldSchema, relatedTasks } from "../../mock/dataset.js";

const fieldColumns = [
  { title: "字段名", dataIndex: "fieldName", width: 150, render: (v) => <code className="dw-code">{v}</code> },
  { title: "类型", dataIndex: "fieldType", width: 110, render: (v) => <Tag>{v}</Tag> },
  {
    title: "必填",
    dataIndex: "required",
    width: 70,
    render: (v) => (v ? <span className="dw-req">必填</span> : <span className="dw-opt">可选</span>),
  },
  { title: "说明", dataIndex: "comment" },
];

export default function DetailDrawer({ record, open, onClose, onEdit, onExport, onOffline }) {
  const { setActiveMenu } = useApp();
  const [tab, setTab] = useState("fields");

  const fmtRecords = (v) => (v >= 10000 ? `${(v / 10000).toFixed(v % 10000 === 0 ? 0 : 1)} 万` : v.toLocaleString("zh-CN"));
  const fmtSize = (v) => (v >= 1024 ? `${(v / 1024).toFixed(1)} GB` : `${v} MB`);

  return (
    <Drawer
      open={open}
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
      extra={
        record ? (
          <div className="dw-extra">
            <Button
              size="small"
              icon={<Icon name="copy" size={13} />}
              onClick={() => {
                if (navigator.clipboard) navigator.clipboard.writeText(record.id).catch(() => {});
                message.success(`已复制 ID：${record.id}`);
              }}
            >
              复制 ID
            </Button>
            <Button size="small" icon={<Icon name="download" size={13} />} onClick={() => onExport(record)}>
              导出
            </Button>
          </div>
        ) : null
      }
      footer={
        record ? (
          <div className="dw-footer">
            <Button danger icon={<Icon name="x" size={14} />} onClick={() => onOffline(record)}>
              下线数据集
            </Button>
            <div className="dw-footer-right">
              <Button type="primary" icon={<Icon name="pencil" size={14} />} onClick={() => onEdit(record)}>
                编辑数据集
              </Button>
            </div>
          </div>
        ) : null
      }
    >
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
          <Descriptions bordered size="small" column={2} className="dw-desc" title="基本信息">
            <Descriptions.Item label="数据集 ID" span={2}>
              <code className="dw-code">{record.id}</code>
            </Descriptions.Item>
            <Descriptions.Item label="数据类型">
              <span className="type-chip">
                {record.type}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="数据来源">{record.source}</Descriptions.Item>
            <Descriptions.Item label="负责人">{record.owner}</Descriptions.Item>
            <Descriptions.Item label="所属部门">{record.department}</Descriptions.Item>
            <Descriptions.Item label="同步状态">
              {record.synced ? <Tag color="success">已启用自动同步</Tag> : <Tag>未启用</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">{record.updated}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{record.createdAt}</Descriptions.Item>
            <Descriptions.Item label="访问权限" span={2}>
              {(record.access || ["read"]).map((a) => (
                <Tag key={a}>{accessLabels[a] || a}</Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="数据描述" span={2}>
              {record.desc}
            </Descriptions.Item>
          </Descriptions>
          <Tabs
            activeKey={tab}
            onChange={setTab}
            className="dw-tabs"
            items={[
              {
                key: "fields",
                label: (
                  <span className="dw-tab">
                    <Icon name="layers" size={13} />
                    字段结构
                  </span>
                ),
                children: (
                  <Table
                    size="small"
                    rowKey="fieldName"
                    columns={fieldColumns}
                    dataSource={fieldSchema}
                    pagination={false}
                    scroll={{ y: 300 }}
                  />
                ),
              },
              {
                key: "logs",
                label: (
                  <span className="dw-tab">
                    <Icon name="list-checks" size={13} />
                    变更记录
                  </span>
                ),
                children: (
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
                ),
              },
              {
                key: "tasks",
                label: (
                  <span className="dw-tab">
                    <Icon name="refresh-cw" size={13} />
                    关联任务
                  </span>
                ),
                children: (
                  <div className="dw-tasks">
                    {relatedTasks.map((t) => (
                      <div className="dw-task" key={t.name}>
                        <div className="dw-task-head">
                          <span>{t.name}</span>
                          <StatusTag status={t.status} />
                        </div>
                        <Progress
                          percent={t.progress}
                          size="small"
                          status={t.status === "failed" ? "exception" : t.status === "done" ? "success" : "active"}
                        />
                      </div>
                    ))}
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        onClose();
                        setActiveMenu("sync");
                      }}
                    >
                      前往任务中心查看
                    </Button>
                  </div>
                ),
              },
            ]}
          />
          <p className="dw-hint">
            <Icon name="info" size={13} />
            抽屉宽度 620px · 最后同步于 {dayjs().format("YYYY-MM-DD HH:mm")}
          </p>
        </div>
      ) : null}
    </Drawer>
  );
}
