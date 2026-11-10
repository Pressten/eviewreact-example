import { useMemo } from "react";
import { Dropdown, Input, Table, Tag, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { LevelTag, AlarmStatusTag } from "../../components/status-tag/index.jsx";
import { fmtDur } from "../../mock/alarms.js";
import { SERVICES } from "../../mock/services.js";
import "./index.css";

const LEVEL_RANK = { P0: 0, P1: 1, P2: 2, P3: 3 };

const MORE_ACTIONS = [
  { key: "export", label: "导出筛选结果 CSV" },
  { key: "copy", label: "复制当前筛选条件" },
  { key: "runbook", label: "打开告警处置手册" },
];

// ⑥ 告警列表：级别/状态列筛选 + 策略名搜索 + 分页；认领 / 静默 / 跳转对象
export default function AlarmTable() {
  const app = useApp();

  const counts = useMemo(() => {
    const c = { firing: 0, claimed: 0, silenced: 0, resolved: 0 };
    app.alarms.forEach((a) => {
      c[a.status] = (c[a.status] || 0) + 1;
    });
    return c;
  }, [app.alarms]);

  const filtered = useMemo(() => {
    const kw = app.alarmQuery.trim().toLowerCase();
    return app.alarms.filter(
      (a) => !kw || a.strategyName.toLowerCase().includes(kw)
    );
  }, [app.alarms, app.alarmQuery]);

  const isService = (key) => SERVICES[app.env].some((s) => s.key === key);

  const jumpToTarget = (rec) => {
    if (isService(rec.targetKey)) app.setSelectedService(rec.targetKey);
    const el = document.getElementById("topology-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    message.info(`已跳转对象：${rec.targetName}（见服务拓扑）`);
  };

  const claim = (rec) => {
    app.setAlarms((list) =>
      list.map((a) => (a.id === rec.id ? { ...a, status: "claimed", claimBy: "张伟" } : a))
    );
    message.success(`已认领告警：${rec.strategyName}（${rec.targetName}）· 值班人 张伟`);
  };

  const silenceRow = (rec) => {
    app.openSilence(rec.targetKey);
  };

  const onMore = ({ key }) => {
    if (key === "export") message.success(`已导出 ${filtered.length} 条告警（CSV）`);
    if (key === "copy") message.success("筛选条件已复制到剪贴板");
    if (key === "runbook") message.info("已打开告警处置手册（新窗口）");
  };

  const columns = [
    {
      title: "级别",
      dataIndex: "level",
      key: "level",
      width: 104,
      sorter: (a, b) => LEVEL_RANK[a.level] - LEVEL_RANK[b.level],
      filters: [
        { text: "P0", value: "P0" },
        { text: "P1", value: "P1" },
        { text: "P2", value: "P2" },
        { text: "P3", value: "P3" },
      ],
      onFilter: (value, rec) => rec.level === value,
      render: (v) => <LevelTag level={v} />,
    },
    {
      title: "策略名",
      dataIndex: "strategyName",
      key: "strategyName",
      ellipsis: true,
      render: (v, rec) => (
        <a className="alarm-strategy-link" onClick={() => app.openAlarmDetail(rec)} title="查看告警详情">
          {v}
        </a>
      ),
    },
    {
      title: "告警对象",
      dataIndex: "targetName",
      key: "targetName",
      ellipsis: true,
      render: (v, rec) => (
        <a className="alarm-object" onClick={() => jumpToTarget(rec)}>
          {v}
        </a>
      ),
    },
    {
      title: "触发值 / 阈值",
      key: "values",
      width: 150,
      align: "right",
      render: (_, rec) => (
        <span className="alarm-values">
          <b className={`alarm-trigger lv-${rec.level}`}>{rec.triggerValue}</b>
          <span className="alarm-threshold"> / {rec.threshold}</span>
        </span>
      ),
    },
    {
      title: "持续时长",
      dataIndex: "durationMin",
      key: "durationMin",
      width: 110,
      align: "right",
      sorter: (a, b) => a.durationMin - b.durationMin,
      render: (v) => fmtDur(v),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 112,
      filters: [
        { text: "触发中", value: "firing" },
        { text: "已认领", value: "claimed" },
        { text: "已静默", value: "silenced" },
        { text: "已恢复", value: "resolved" },
      ],
      onFilter: (value, rec) => rec.status === value,
      render: (v, rec) => (
        <div className="alarm-status-cell">
          <AlarmStatusTag status={v} />
          {rec.claimBy && v !== "resolved" ? (
            <span className="alarm-claim-by">认领人：{rec.claimBy}</span>
          ) : null}
        </div>
      ),
    },
    {
      title: "操作",
      key: "actions",
      width: 128,
      render: (_, rec) => (
        <div className="alarm-actions">
          {rec.status === "firing" ? (
            <Icon name="user-check" size="0.875rem" className="alarm-act" title="认领" onClick={() => claim(rec)} />
          ) : (
            <Icon name="user-check" size="0.875rem" className="alarm-act is-disabled" title="当前状态无需认领" />
          )}
          {rec.status === "firing" || rec.status === "claimed" ? (
            <Icon name="volume-x" size="0.875rem" className="alarm-act" title="静默" onClick={() => silenceRow(rec)} />
          ) : (
            <Icon name="volume-x" size="0.875rem" className="alarm-act is-disabled" title="当前状态无需静默" />
          )}
          <Icon name="external-link" size="0.875rem" className="alarm-act" title="跳转对象" onClick={() => jumpToTarget(rec)} />
        </div>
      ),
    },
  ];

  return (
    <SectionCard
      id="alarm-section"
      icon="siren"
      title="告警列表"
      className="alarm-section"
      extra={
        <>
          <Tag className={app.env === "prod" ? "noc-tag env-chip env-prod" : "noc-tag env-chip env-staging"}>
            {app.env === "prod" ? "生产环境" : "预发环境"}
          </Tag>
          <span className="alarm-extra-caption">点击策略名查看详情 · 静默需确认并填写原因</span>
          <Dropdown menu={{ items: MORE_ACTIONS, onClick: onMore }} placement="bottomRight">
            <span className="alarm-more" title="更多操作">
              <Icon name="ellipsis" size="1rem" />
            </span>
          </Dropdown>
        </>
      }
    >
      <div className="alarm-table">
        <div className="alarm-toolbar">
          <Input
            className="alarm-search"
            suffix={<Icon name="search" size="0.875rem" />}
            allowClear
            placeholder="搜索策略名，如：错误率、慢查询"
            value={app.alarmQuery}
            onChange={(e) => app.setAlarmQuery(e.target.value)}
          />
          <div className="alarm-summary">
            <Tag className="noc-tag noc-st-firing">触发中 {counts.firing}</Tag>
            <Tag className="noc-tag noc-st-claimed">已认领 {counts.claimed}</Tag>
            <Tag className="noc-tag noc-st-silenced">已静默 {counts.silenced}</Tag>
            <Tag className="noc-tag noc-st-resolved">已恢复 {counts.resolved}</Tag>
          </div>
        </div>
        <Table
          rowKey="id"
          size="middle"
          columns={columns}
          dataSource={filtered}
          sortDirections={["ascend", "descend", "ascend"]}
          showSorterTooltip={false}
          pagination={{
            pageSize: 8,
            showTotal: (total, range) => `总记录数：${total}`,
            showSizeChanger: true,
            showQuickJumper: { goButton: "跳转" },
          }}
        />
      </div>
    </SectionCard>
  );
}
