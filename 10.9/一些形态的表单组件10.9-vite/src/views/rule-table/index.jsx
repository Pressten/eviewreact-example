import { useMemo, useState } from "react";
import { IconPlusIcIctBulkEdit, IconPlusIcPublicCopy, IconPlusIcPublicPlus, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicSearch, IconPlusIcPublicTrash } from '@nce/icon-plus';
import Table from "@nce/eview-react/Table";
import TextField from "@nce/eview-react/TextField";
import Select from "@nce/eview-react/Select";
import Tag from "@nce/eview-react/Tag";
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import LevelTag from "../../components/level-tag/index.jsx";
import { rules, alarmLevels, channels } from "../../mock/rule.js";
import "./index.css";

const levelText = (v) => alarmLevels.find((l) => l.value === v)?.text || v;

// Layer 4: 视图 — 规则列表表格
export default function RuleTable() {
  const [keyword, setKeyword] = useState("");
  const [levelFilter, setLevelFilter] = useState(undefined);
  const [channelFilter, setChannelFilter] = useState(undefined);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [notice, setNotice] = useState(null);
  const notify = (type, text) => setNotice({ type, text, key: Date.now() });

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
      key: "name",
      width: "18rem",
      render: (cell, rowData, options, row) => {
        const r = row?.rawData;
        return (
          <a className="cell-link" title={cell} onClick={() => notify("default", `查看规则：${r?.id}`)}>
            {cell}
          </a>
        );
      },
    },
    { title: "监控对象", key: "target", width: "8rem" },
    { title: "适用区域", key: "regionLabel", width: "15rem" },
    {
      title: "告警级别",
      key: "level",
      width: "7rem",
      render: (v) => <LevelTag level={v} />,
    },
    {
      title: "触发阈值",
      key: "threshold",
      width: "8rem",
      align: "right",
      render: (cell, rowData, options, row) => {
        const r = row?.rawData;
        return (
          <span className="cell-metric">
            {r?.metric} {cell}
          </span>
        );
      },
    },
    {
      title: "通知渠道",
      key: "channelLabels",
      width: "13rem",
      render: (cell) => (cell || []).join("、"),
    },
    {
      title: "状态",
      key: "enabled",
      width: "6rem",
      render: (enabled) =>
        enabled ? (
          <Tag color="success">已启用</Tag>
        ) : (
          <Tag color="default">已停用</Tag>
        ),
    },
    { title: "更新时间", key: "updatedAt", width: "10rem" },
    {
      title: "操作",
      key: "action",
      width: "9rem",
      align: "left",
      render: (cell, rowData, options, row) => {
        const r = row?.rawData;
        return (
          <div className="row-actions">
            <IconPlusIcIctBulkEdit iconSize="0.875rem" iconColor={['currentcolor']} title="编辑规则" onClick={() => notify("default", `编辑规则：${r?.id}`)} style={{ cursor: 'pointer' }} />
            <IconPlusIcPublicCopy iconSize="0.875rem" iconColor={['currentcolor']} title="复制规则" onClick={() => notify("default", `复制规则：${r?.id}`)} style={{ cursor: 'pointer' }} />
            <IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} title="删除规则" onClick={() => notify("warn", `删除规则：${r?.id}`)} style={{ cursor: 'pointer' }} />
          </div>
        );
      },
    },
  ];

  return (
    <section className="rule-table card">
      {notice && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage key={notice.key} display type={notice.type} text={notice.text} onClose={() => setNotice(null)} />
        </div>
      )}
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
          <TextField
            style={{ width: "17rem" }}
            placeholder="搜索规则名称、编号或监控对象"
            value={keyword}
            onChange={(value) => setKeyword(value)}
            suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />}
          />
          <Select
            style={{ width: "9rem" }}
            defaultLabel="告警级别"
            value={levelFilter}
            onChange={setLevelFilter}
            options={alarmLevels.map((l) => ({ value: l.value, text: levelText(l.value) }))}
            enableClear
          />
          <Select
            style={{ width: "9rem" }}
            defaultLabel="通知渠道"
            value={channelFilter}
            onChange={setChannelFilter}
            options={channels}
            enableClear
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
            leftIcon={<IconPlusIcPublicRefreshClockwise iconSize="0.875rem" iconColor={['currentcolor']} />}
            text="刷新"
            onClick={() => {
              setKeyword("");
              setLevelFilter(undefined);
              setChannelFilter(undefined);
              setSelectedKeys([]);
              notify("success", "已刷新列表");
            }}
          />
          <Button
            size="small"
            status="primary"
            leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />}
            text="新建规则"
            onClick={() => notify("default", "前往上方表单新建规则")}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataset={data}
        enableCheckBox
        checkType="multi"
        checkedRows={selectedKeys}
        onRowCheck={(row, checkedRows) => setSelectedKeys(checkedRows)}
        onHeaderCheck={(checkedRows) => setSelectedKeys(checkedRows)}
        enablePagination
        enableAutoPaging
        pageSize={8}
        pageSizeOptions={[8, 20, 50]}
      />
    </section>
  );
}
