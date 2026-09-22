import { useState } from "react";
import dayjs from "dayjs";
import Button from "@nce/eview-react/Button";
import Drawer from "@nce/eview-react/Drawer";
import Table from "@nce/eview-react/Table";
import Tab, { TabItem } from "@nce/eview-react/Tab";
import Tag from "@nce/eview-react/Tag";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import KeyValueList from "../../components/key-value-list.jsx";
import SimpleProgress from "../../components/simple-progress.jsx";
import { message } from "../../shared/message.jsx";
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

const TAB_KEYS = ["fields", "logs", "tasks"];

export default function DetailDrawer({ record, open, onClose, onEdit, onExport, onOffline }) {
  const { setActiveMenu } = useApp();
  const [tabIdx, setTabIdx] = useState(0);

  const fmtRecords = (v) => (v >= 10000 ? `${(v / 10000).toFixed(v % 10000 === 0 ? 0 : 1)} 万` : v.toLocaleString("zh-CN"));
  const fmtSize = (v) => (v >= 1024 ? `${(v / 1024).toFixed(1)} GB` : `${v} MB`);

  return (
    <Drawer
      visible={open}
      onClose={() => onClose(false)}
      width={620}
      destroyOnClose
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
              leftIcon={<Icon name="copy" size={13} />}
              text="复制 ID"
              onClick={() => {
                if (navigator.clipboard) navigator.clipboard.writeText(record.id).catch(() => {});
                message.success(`已复制 ID：${record.id}`);
              }}
            />
            <Button leftIcon={<Icon name="download" size={13} />} text="导出" onClick={() => onExport(record)} />
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
            bordered
            columns={2}
            title="基本信息"
            className="dw-desc"
            items={[
              { label: "数据集 ID", value: <code className="dw-code">{record.id}</code>, span: 2 },
              { label: "数据类型", value: <span className="type-chip">{record.type}</span> },
              { label: "数据来源", value: record.source },
              { label: "负责人", value: record.owner },
              { label: "所属部门", value: record.department },
              { label: "同步状态", value: record.synced ? <Tag color="success">已启用自动同步</Tag> : <Tag>未启用</Tag> },
              { label: "更新时间", value: record.updated },
              { label: "创建时间", value: record.createdAt },
              { label: "访问权限", value: (record.access || ["read"]).map((a) => <Tag key={a}>{accessLabels[a] || a}</Tag>), span: 2 },
              { label: "数据描述", value: record.desc, span: 2 },
            ]}
          />
          <Tab
            selectedIndex={tabIdx}
            draggable={false}
            onClick={(i) => setTabIdx(i)}
            className="dw-tabs"
          >
            <TabItem title="字段结构" icon={<Icon name="layers" size={13} />}>
              <Table
                columns={fieldColumns}
                dataset={fieldSchema}
                keyIndex={0}
                maxHeight={300}
                emptyTableMsg="暂无字段"
              />
            </TabItem>
            <TabItem title="变更记录" icon={<Icon name="list-checks" size={13} />}>
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
            <TabItem title="关联任务" icon={<Icon name="refresh-cw" size={13} />}>
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
                  text="前往任务中心查看"
                  onClick={() => {
                    onClose(false);
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
        </div>
      ) : null}
      {record ? (
        <div className="dw-footer">
          <Button status="risk" leftIcon={<Icon name="x" size={14} />} text="下线数据集" onClick={() => onOffline(record)} />
          <div className="dw-footer-right">
            <Button status="primary" leftIcon={<Icon name="pencil" size={14} />} text="编辑数据集" onClick={() => onEdit(record)} />
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}
