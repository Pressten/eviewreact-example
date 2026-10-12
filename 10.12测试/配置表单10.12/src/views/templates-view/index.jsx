import { useState } from "react";
import { Table, Button, Input, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { useApp } from "../../context.jsx";
import { TEMPLATES, SCENES, PRIORITIES } from "../../mock/packages.js";
import "./index.css";

const PRIORITY_TAG = {
  high: { text: "高", type: "error" },
  mid: { text: "中", type: "processing" },
  low: { text: "低", type: "default" },
};

export default function TemplatesView() {
  const { setPrefill, setActiveTab } = useApp();
  const [keyword, setKeyword] = useState("");

  const data = TEMPLATES.filter((t) => `${t.name}${t.scene}`.toLowerCase().includes(keyword.toLowerCase()));

  const apply = (tpl) => {
    setPrefill({
      scene: SCENES.find((s) => s.label === tpl.scene)?.value,
      bandwidth: tpl.bandwidth,
      priority: tpl.priority,
      cycle: tpl.cycle,
      count: 1,
    });
    setActiveTab("config");
    message.success(`已套用模板「${tpl.name}」，请完善表单后生成清单`);
  };

  const columns = [
    {
      title: "模板名称",
      dataIndex: "name",
      width: 200,
      render: (v, row) => <a className="cell-link" onClick={() => apply(row)}>{v}</a>,
    },
    { title: "适用业务", dataIndex: "scene", width: 150 },
    { title: "默认带宽", dataIndex: "bandwidth", width: 110 },
    { title: "计费周期", dataIndex: "cycle", width: 110 },
    {
      title: "默认优先级",
      dataIndex: "priority",
      width: 120,
      filters: PRIORITIES.map((p) => ({ text: p.label, value: p.value })),
      onFilter: (v, r) => r.priority === v,
      render: (v) => <StatusTag value={v} map={PRIORITY_TAG} />,
    },
    { title: "更新人", dataIndex: "owner", width: 100 },
    { title: "更新时间", dataIndex: "updatedAt", width: 170 },
    {
      title: "操作",
      key: "action",
      width: 140,
      align: "left",
      render: (_, row) => (
        <div className="row-actions">
          <a className="cell-link" onClick={() => apply(row)}>套用</a>
          <Icon name="square-pen" size="0.875rem" title="编辑模板" className="row-action" onClick={() => message.info("编辑模板（示例）")} />
          <Icon name="trash-2" size="0.875rem" title="删除模板" className="row-action row-action-danger" onClick={() => message.info("删除模板（示例）")} />
        </div>
      ),
    },
  ];

  return (
    <div className="tpl-view">
      <div className="tpl-toolbar">
        <Input
          size="small"
          allowClear
          style={{ width: "16rem" }}
          placeholder="搜索模板名称或业务场景"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          suffix={<Icon name="search" size="0.875rem" color="var(--on-surface-variant)" />}
        />
        <Button size="small" type="primary" icon={<Icon name="plus" size="0.875rem" />} onClick={() => message.info("新建模板（示例）")}>新建模板</Button>
      </div>
      <Table rowKey="id" size="middle" columns={columns} dataSource={data} pagination={false} scroll={{ x: 1100 }} />
    </div>
  );
}
