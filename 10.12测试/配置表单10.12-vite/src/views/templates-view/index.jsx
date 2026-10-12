import { useState } from "react";
import { IconPlusIcPublicEdit, IconPlusIcPublicPlus, IconPlusIcPublicSearch, IconPlusIcPublicTrash } from '@nce/icon-plus';
import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import TextField from "@/shared/TextField";
import { useNotice } from "../../components/notice/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { useApp } from "../../context.jsx";
import { TEMPLATES, SCENES, PRIORITIES } from "../../mock/packages.js";
import "./index.css";

const PRIORITY_TAG = {
  high: { text: "高", type: "error" },
  mid: { text: "中", type: "processing" },
  low: { text: "低", type: "default" },
};

const PRIORITY_FILTERS = PRIORITIES.map((p) => ({ text: p.label, value: p.value }));
void PRIORITY_FILTERS;

export default function TemplatesView() {
  const { setPrefill, setActiveTab } = useApp();
  const [keyword, setKeyword] = useState("");
  const { notify, noticeNode } = useNotice();
  // 保留命令式 message.xxx 调用点原样（含 <Icon onClick={()=>message.info}>），桥接到声明式 DivMessage
  const message = {
    info: (t) => notify("default", t),
    success: (t) => notify("success", t),
    warning: (t) => notify("warn", t),
    error: (t) => notify("error", t),
  };

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
    { title: "ID", key: "id", display: false },
    {
      title: "模板名称",
      key: "name",
      width: 200,
      allowSort: false,
      render: (v, _rd, _o, row) => <a className="cell-link" onClick={() => apply(row?.rawData)}>{v}</a>,
    },
    { title: "适用业务", key: "scene", width: 150, allowSort: false },
    { title: "默认带宽", key: "bandwidth", width: 110, allowSort: false },
    { title: "计费周期", key: "cycle", width: 110, allowSort: false },
    {
      title: "默认优先级",
      key: "priority",
      width: 120,
      allowSort: false,
      render: (v) => <StatusTag value={v} map={PRIORITY_TAG} />,
    },
    { title: "更新人", key: "owner", width: 100, allowSort: false },
    { title: "更新时间", key: "updatedAt", width: 170, allowSort: false },
    {
      title: "操作",
      key: "action",
      width: 140,
      align: "left",
      allowSort: false,
      render: (_v, _rd, _o, row) => (
        <div className="row-actions">
          <a className="cell-link" onClick={() => apply(row?.rawData)}>套用</a>
          <IconPlusIcPublicEdit iconSize="0.875rem" iconColor={['currentcolor']} title="编辑模板" className="row-action" onClick={() => message.info("编辑模板（示例）")} />
          <IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} title="删除模板" className="row-action row-action-danger" onClick={() => message.info("删除模板（示例）")} />
        </div>
      ),
    },
  ];

  return (
    <div className="tpl-view">
      <div className="tpl-toolbar">
        <TextField
          style={{ width: "16rem" }}
          placeholder="搜索模板名称或业务场景"
          value={keyword}
          onChange={(v) => setKeyword(v)}
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />}
        />
        <Button status="primary" text="新建模板" leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={() => message.info("新建模板（示例）")} />
      </div>
      <Table columns={columns} dataset={data} />
      {noticeNode}
    </div>
  );
}
