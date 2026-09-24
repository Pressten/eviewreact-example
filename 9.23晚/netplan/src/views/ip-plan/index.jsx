import { useState } from "react";
import { Tabs, Table, Button, Switch } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import NoticeBar from "../../components/notice-bar/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import EmptyBlock from "../../components/empty-block/index.jsx";
import TableToolbar from "../../components/table-toolbar/index.jsx";
import { ipTabs } from "../../mock/ip.js";
import "./index.css";

// Layer 4: IP规划 —— 精细规划开关 + 6 个明细 Tab（告警块 + 表格）
function UsageCell({ value }) {
  const tone = value >= 85 ? "is-high" : value >= 60 ? "is-mid" : "is-low";
  return (
    <span className={"usage-cell " + tone}>
      <span className="usage-value">{value}%</span>
      <span className="usage-track">
        <span className="usage-fill" style={{ width: value + "%" }} />
      </span>
    </span>
  );
}

function RowActions() {
  return (
    <div className="row-actions">
      <Button size="small" shape="circle" icon={<Icon name="pencil" size={14} />} />
      <Button size="small" shape="circle" icon={<Icon name="copy" size={14} />} />
      <Button size="small" shape="circle" icon={<Icon name="trash-2" size={14} />} />
    </div>
  );
}

function nameLink(value) {
  return <Button type="link">{value}</Button>;
}

function joinCells(value) {
  return value === undefined || value === null ? "-" : value;
}

const columnsByTab = {
  segment: [
    { title: "网段编号", dataIndex: "code", width: 110, render: joinCells },
    { title: "网段名称", dataIndex: "name", width: 230, render: nameLink },
    { title: "网段地址", dataIndex: "cidr", width: 160 },
    { title: "子网掩码", dataIndex: "mask", width: 140 },
    { title: "可用地址", dataIndex: "usable", width: 110, align: "right", render: (value) => value.toLocaleString("zh-CN") },
    { title: "已分配", dataIndex: "allocated", width: 100, align: "right", render: (value) => value.toLocaleString("zh-CN") },
    { title: "使用率", dataIndex: "usage", width: 150, render: (value) => <UsageCell value={value} /> },
    { title: "归属区域", dataIndex: "region", width: 130 },
    { title: "状态", dataIndex: "status", width: 110, render: (value) => <StatusTag status={value} /> },
    { title: "操作", key: "action", width: 120, fixed: "right", render: () => <RowActions /> },
  ],
  subnet: [
    { title: "子网名称", dataIndex: "name", width: 250, render: nameLink },
    { title: "所属网段", dataIndex: "parentCidr", width: 160 },
    { title: "子网地址", dataIndex: "cidr", width: 180 },
    { title: "掩码长度", dataIndex: "prefix", width: 110, align: "right", render: (value) => "/" + value },
    { title: "网关地址", dataIndex: "gateway", width: 160 },
    { title: "VLAN ID", dataIndex: "vlanId", width: 100, align: "right" },
    { title: "可用地址", dataIndex: "usable", width: 110, align: "right" },
    { title: "状态", dataIndex: "status", width: 110, render: (value) => <StatusTag status={value} /> },
    { title: "操作", key: "action", width: 120, fixed: "right", render: () => <RowActions /> },
  ],
  vlan: [
    { title: "VLAN ID", dataIndex: "vlanId", width: 100, align: "right" },
    { title: "VLAN 名称", dataIndex: "name", width: 250, render: nameLink },
    { title: "关联网段", dataIndex: "cidr", width: 180 },
    { title: "网关地址", dataIndex: "gateway", width: 160 },
    { title: "用途", dataIndex: "purpose", width: 130 },
    { title: "所在站点", dataIndex: "site", width: 170 },
    { title: "状态", dataIndex: "status", width: 110, render: (value) => <StatusTag status={value} /> },
    { title: "操作", key: "action", width: 120, fixed: "right", render: () => <RowActions /> },
  ],
  pool: [
    { title: "地址池名称", dataIndex: "name", width: 250, render: nameLink },
    { title: "关联网段", dataIndex: "cidr", width: 180 },
    { title: "分配方式", dataIndex: "mode", width: 130 },
    { title: "地址总数", dataIndex: "total", width: 110, align: "right" },
    { title: "已使用", dataIndex: "used", width: 110, align: "right" },
    { title: "租期", dataIndex: "lease", width: 120 },
    { title: "状态", dataIndex: "status", width: 110, render: (value) => <StatusTag status={value} /> },
    { title: "操作", key: "action", width: 120, fixed: "right", render: () => <RowActions /> },
  ],
  static: [
    { title: "IP 地址", dataIndex: "ip", width: 150 },
    { title: "MAC 地址", dataIndex: "mac", width: 190 },
    { title: "绑定设备", dataIndex: "device", width: 260, render: nameLink },
    { title: "设备型号", dataIndex: "vendor", width: 180 },
    { title: "所属部门", dataIndex: "dept", width: 150 },
    { title: "分配时间", dataIndex: "assignedAt", width: 170 },
    { title: "状态", dataIndex: "status", width: 110, render: (value) => <StatusTag status={value} /> },
    { title: "操作", key: "action", width: 120, fixed: "right", render: () => <RowActions /> },
  ],
  reserved: [
    { title: "保留地址", dataIndex: "ip", width: 160 },
    { title: "保留类型", dataIndex: "type", width: 150 },
    { title: "所属网段", dataIndex: "cidr", width: 180 },
    { title: "关联设备", dataIndex: "device", width: 240, render: nameLink },
    { title: "生效时间", dataIndex: "effectiveAt", width: 170 },
    { title: "备注", dataIndex: "remark", width: 200 },
    { title: "状态", dataIndex: "status", width: 110, render: (value) => <StatusTag status={value} /> },
    { title: "操作", key: "action", width: 120, fixed: "right", render: () => <RowActions /> },
  ],
};

export default function IpPlan() {
  const [fineGrained, setFineGrained] = useState(true);
  const [activeTab, setActiveTab] = useState("segment");
  const [searchMap, setSearchMap] = useState({});
  const [selectedMap, setSelectedMap] = useState({});

  const items = ipTabs.map((tab) => {
    const columns = columnsByTab[tab.key] || [];
    const keyword = (searchMap[tab.key] || "").trim().toLowerCase();
    const selectedKeys = selectedMap[tab.key] || [];
    const source = keyword
      ? tab.rows.filter((row) =>
          Object.keys(row).some((field) => String(row[field]).toLowerCase().indexOf(keyword) > -1)
        )
      : tab.rows;
    const isEmpty = tab.rows.length === 0;

    const actions = [
      <Button key="refresh" icon={<Icon name="refresh-cw" size={14} />} />,
      <Button key="export" icon={<Icon name="download" size={14} />}>
        导出
      </Button>,
      <Button key="create" type="primary" icon={<Icon name="plus" size={14} />}>
        {tab.createLabel}
      </Button>,
    ];

    return {
      key: tab.key,
      label: (
        <span className="ip-tab-label">
          {tab.label}
          {isEmpty ? null : <span className="ip-tab-count">{tab.rows.length}</span>}
        </span>
      ),
      children: (
        <div className="ip-tab-panel">
          <NoticeBar type={tab.notice.type} title={tab.notice.title} desc={tab.notice.desc} />
          <TableToolbar
            searchValue={searchMap[tab.key] || ""}
            onSearchChange={(value) =>
              setSearchMap((prev) => Object.assign({}, prev, { [tab.key]: value }))
            }
            searchPlaceholder={"搜索" + tab.label}
            selectedCount={selectedKeys.length}
            onClearSelection={() =>
              setSelectedMap((prev) => Object.assign({}, prev, { [tab.key]: [] }))
            }
            actions={actions}
          />
          <Table
            className="ip-table"
            rowKey="key"
            columns={columns}
            dataSource={source}
            scroll={{ x: 1180 }}
            rowSelection={{
              selectedRowKeys: selectedKeys,
              onChange: (keys) =>
                setSelectedMap((prev) => Object.assign({}, prev, { [tab.key]: keys })),
            }}
            pagination={
              isEmpty
                ? false
                : { pageSize: 10, showSizeChanger: false, showTotal: (total) => "共 " + total + " 条" }
            }
            locale={{
              emptyText: (
                <EmptyBlock
                  compact
                  title={tab.emptyTitle || "暂无数据"}
                  desc={tab.emptyDesc}
                  actionText={tab.createLabel}
                />
              ),
            }}
          />
        </div>
      ),
    };
  });

  return (
    <SectionCard title="IP规划" subtitle="按网段、子网、VLAN 与地址粒度完成整网 IP 资源规划，可与拓扑规划结果联动">
      <div className="ip-toggle-row">
        <div className="ip-toggle-text">
          <p className="ip-toggle-title">精细规划IP地址</p>
          <p className="ip-toggle-desc">
            开启后可逐层精细分配网段、子网与地址；关闭时由系统按网段自动分配，明细仅供查看。
          </p>
        </div>
        <Switch checked={fineGrained} onChange={(checked) => setFineGrained(checked)} />
      </div>

      {fineGrained ? null : (
        <NoticeBar
          type="info"
          title="已关闭精细规划IP地址"
          desc="当前地址由系统按网段自动分配，下表明细暂不支持编辑，开启开关后可手动调整。"
        />
      )}

      <Tabs
        className="ip-tabs"
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        items={items}
      />
    </SectionCard>
  );
}
