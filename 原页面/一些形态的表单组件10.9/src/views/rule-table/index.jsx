import { useMemo, useState } from "react";
import { Table, Input, Select, Tag, Button, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import LevelTag from "../../components/level-tag/index.jsx";
import { rules, alarmLevels, channels } from "../../mock/rule.js";
import "./index.css";

const levelText = (v) => alarmLevels.find((l) => l.value === v)?.label || v;

// Layer 4: 视图 — 规则列表表格
export default function RuleTable() {
  const [keyword, setKeyword] = useState("");
  const [levelFilter, setLevelFilter] = useState(undefined);
  const [channelFilter, setChannelFilter] = useState(undefined);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const data = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return rules.filter((r) => {
      const hitKw =
        !kw ||
        r.name.toLowerCase().includes(kw) ||
        r.id.toLowerCase().includes(kw) ||
        r.target.toLowerCase().includes(kw);
      const hitLevel = !levelFilter || r.level === levelFilter;
      const hitChannel = !channelFilter || r.channels.includes(channelFilter);
      return hitKw && hitLevel && hitChannel;
    });
  }, [keyword, levelFilter, channelFilter]);

  const columns = [
    {
      title: "规则名称",
      dataIndex: "name",
      key: "name",
      width: "18rem",
      render: (text, row) => (
        <a className="cell-link" title={text} onClick={() => messageApi.info(`查看规则：${row.id}`)}>
          {text}
        </a>
      ),
    },
    { title: "监控对象", dataIndex: "target", key: "target", width: "8rem" },
    { title: "适用区域", dataIndex: "regionLabel", key: "regionLabel", width: "15rem" },
    {
      title: "告警级别",
      dataIndex: "level",
      key: "level",
      width: "7rem",
      render: (v) => <LevelTag level={v} />,
    },
    {
      title: "触发阈值",
      dataIndex: "threshold",
      key: "threshold",
      width: "8rem",
      align: "right",
      render: (text, row) => (
        <span className="cell-metric">
          {row.metric} {text}
        </span>
      ),
    },
    {
      title: "通知渠道",
      dataIndex: "channelLabels",
      key: "channelLabels",
      width: "13rem",
      render: (labels) => labels.join("、"),
    },
    {
      title: "状态",
      dataIndex: "enabled",
      key: "enabled",
      width: "6rem",
      render: (enabled) =>
        enabled ? (
          <Tag color="success">已启用</Tag>
        ) : (
          <Tag color="default">已停用</Tag>
        ),
    },
    { title: "更新时间", dataIndex: "updatedAt", key: "updatedAt", width: "10rem" },
    {
      title: "操作",
      key: "action",
      width: "9rem",
      align: "left",
      render: (_, row) => (
        <div className="row-actions">
          <Icon
            name="pencil"
            size="0.875rem"
            title="编辑规则"
            onClick={() => messageApi.info(`编辑规则：${row.id}`)}
          />
          <Icon
            name="copy"
            size="0.875rem"
            title="复制规则"
            onClick={() => messageApi.info(`复制规则：${row.id}`)}
          />
          <Icon
            name="trash-2"
            size="0.875rem"
            title="删除规则"
            onClick={() => messageApi.warning(`删除规则：${row.id}`)}
          />
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: (keys) => setSelectedKeys(keys),
  };

  return (
    <section className="rule-table card">
      {contextHolder}
      <header className="card-head">
        <div className="card-head__title">
          <h2 className="card-title">告警规则列表</h2>
          <p className="card-sub">
            共 {data.length} 条规则，其中已启用 {data.filter((r) => r.enabled).length} 条
          </p>
        </div>
      </header>

      <div className="table-toolbar">
        <div className="table-toolbar__filters">
          <Input
            style={{ width: "17rem" }}
            size="small"
            placeholder="搜索规则名称、编号或监控对象"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
            suffix={<Icon name="search" size="0.875rem" />}
          />
          <Select
            style={{ width: "9rem" }}
            size="small"
            placeholder="告警级别"
            value={levelFilter}
            onChange={setLevelFilter}
            options={alarmLevels.map((l) => ({ value: l.value, label: levelText(l.value) }))}
            allowClear
          />
          <Select
            style={{ width: "9rem" }}
            size="small"
            placeholder="通知渠道"
            value={channelFilter}
            onChange={setChannelFilter}
            options={channels}
            allowClear
          />
        </div>
        <div className="table-toolbar__actions">
          {selectedKeys.length > 0 && (
            <span className="table-toolbar__count">
              已选 <em>{selectedKeys.length}</em> 项
            </span>
          )}
          <Button
            size="small"
            icon={<Icon name="refresh-cw" size="0.875rem" />}
            onClick={() => {
              setKeyword("");
              setLevelFilter(undefined);
              setChannelFilter(undefined);
              setSelectedKeys([]);
              messageApi.success("已刷新列表");
            }}
          >
            刷新
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<Icon name="plus" size="0.875rem" />}
            onClick={() => messageApi.info("前往上方表单新建规则")}
          >
            新建规则
          </Button>
        </div>
      </div>

      <Table
        rowKey="id"
        size="middle"
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        scroll={{ x: 1180 }}
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </section>
  );
}
