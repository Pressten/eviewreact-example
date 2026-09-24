import { useState } from "react";
import Tab, { TabItem } from "@nce/eview-react/Tab";
import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import Toggle from "@nce/eview-react/Toggle";
import { Icon } from "../../shared/icon.jsx";
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
      <IconButton iconName={<Icon name="pencil" size={14} />} tipText="编辑" />
      <IconButton iconName={<Icon name="copy" size={14} />} tipText="复制" />
      <IconButton iconName={<Icon name="trash-2" size={14} />} tipText="删除" />
    </div>
  );
}

function nameLink(value) {
  return <Button status="text" text={value} />;
}

function joinCells(value) {
  return value === undefined || value === null ? "-" : value;
}

const columnsByTab = {
  segment: [
    { title: "网段编号", key: "code", width: 110, render: joinCells },
    { title: "网段名称", key: "name", width: 230, render: nameLink },
    { title: "网段地址", key: "cidr", width: 160 },
    { title: "子网掩码", key: "mask", width: 140 },
    { title: "可用地址", key: "usable", width: 110, align: "right", render: (value) => value.toLocaleString("zh-CN") },
    { title: "已分配", key: "allocated", width: 100, align: "right", render: (value) => value.toLocaleString("zh-CN") },
    { title: "使用率", key: "usage", width: 150, render: (value) => <UsageCell value={value} /> },
    { title: "归属区域", key: "region", width: 130 },
    { title: "状态", key: "status", width: 110, render: (value) => <StatusTag status={value} /> },
    { title: "操作", key: "action", width: 120, freezeCol: true, render: () => <RowActions /> },
  ],
  subnet: [
    { title: "子网名称", key: "name", width: 250, render: nameLink },
    { title: "所属网段", key: "parentCidr", width: 160 },
    { title: "子网地址", key: "cidr", width: 180 },
    { title: "掩码长度", key: "prefix", width: 110, align: "right", render: (value) => "/" + value },
    { title: "网关地址", key: "gateway", width: 160 },
    { title: "VLAN ID", key: "vlanId", width: 100, align: "right" },
    { title: "可用地址", key: "usable", width: 110, align: "right" },
    { title: "状态", key: "status", width: 110, render: (value) => <StatusTag status={value} /> },
    { title: "操作", key: "action", width: 120, freezeCol: true, render: () => <RowActions /> },
  ],
  vlan: [
    { title: "VLAN ID", key: "vlanId", width: 100, align: "right" },
    { title: "VLAN 名称", key: "name", width: 250, render: nameLink },
    { title: "关联网段", key: "cidr", width: 180 },
    { title: "网关地址", key: "gateway", width: 160 },
    { title: "用途", key: "purpose", width: 130 },
    { title: "所在站点", key: "site", width: 170 },
    { title: "状态", key: "status", width: 110, render: (value) => <StatusTag status={value} /> },
    { title: "操作", key: "action", width: 120, freezeCol: true, render: () => <RowActions /> },
  ],
  pool: [
    { title: "地址池名称", key: "name", width: 250, render: nameLink },
    { title: "关联网段", key: "cidr", width: 180 },
    { title: "分配方式", key: "mode", width: 130 },
    { title: "地址总数", key: "total", width: 110, align: "right" },
    { title: "已使用", key: "used", width: 110, align: "right" },
    { title: "租期", key: "lease", width: 120 },
    { title: "状态", key: "status", width: 110, render: (value) => <StatusTag status={value} /> },
    { title: "操作", key: "action", width: 120, freezeCol: true, render: () => <RowActions /> },
  ],
  static: [
    { title: "IP 地址", key: "ip", width: 150 },
    { title: "MAC 地址", key: "mac", width: 190 },
    { title: "绑定设备", key: "device", width: 260, render: nameLink },
    { title: "设备型号", key: "vendor", width: 180 },
    { title: "所属部门", key: "dept", width: 150 },
    { title: "分配时间", key: "assignedAt", width: 170 },
    { title: "状态", key: "status", width: 110, render: (value) => <StatusTag status={value} /> },
    { title: "操作", key: "action", width: 120, freezeCol: true, render: () => <RowActions /> },
  ],
  reserved: [
    { title: "保留地址", key: "ip", width: 160 },
    { title: "保留类型", key: "type", width: 150 },
    { title: "所属网段", key: "cidr", width: 180 },
    { title: "关联设备", key: "device", width: 240, render: nameLink },
    { title: "生效时间", key: "effectiveAt", width: 170 },
    { title: "备注", key: "remark", width: 200 },
    { title: "状态", key: "status", width: 110, render: (value) => <StatusTag status={value} /> },
    { title: "操作", key: "action", width: 120, freezeCol: true, render: () => <RowActions /> },
  ],
};

// 隐藏 key 列参与 keyIndex（行主键），不展示
function buildColumns(tabKey) {
  return [{ title: "", key: "key", display: false }].concat(columnsByTab[tabKey] || []);
}

export default function IpPlan() {
  const [fineGrained, setFineGrained] = useState(true);
  const [activeTab, setActiveTab] = useState("segment");
  const [searchMap, setSearchMap] = useState({});
  const [selectedMap, setSelectedMap] = useState({});

  const activeIndex = Math.max(0, ipTabs.findIndex((t) => t.key === activeTab));

  return (
    <SectionCard title="IP规划" subtitle="按网段、子网、VLAN 与地址粒度完成整网 IP 资源规划，可与拓扑规划结果联动">
      <div className="ip-toggle-row">
        <div className="ip-toggle-text">
          <p className="ip-toggle-title">精细规划IP地址</p>
          <p className="ip-toggle-desc">
            开启后可逐层精细分配网段、子网与地址；关闭时由系统按网段自动分配，明细仅供查看。
          </p>
        </div>
        <Toggle data={[false, true]} toggled={fineGrained} onToggle={(value) => setFineGrained(value)} />
      </div>

      {fineGrained ? null : (
        <NoticeBar
          type="info"
          title="已关闭精细规划IP地址"
          desc="当前地址由系统按网段自动分配，下表明细暂不支持编辑，开启开关后可手动调整。"
        />
      )}

      <Tab
        className="ip-tabs"
        selectedIndex={activeIndex}
        draggable={false}
        onClick={(index) => setActiveTab(ipTabs[index].key)}
      >
        {ipTabs.map((tab) => {
          const columns = buildColumns(tab.key);
          const keyword = (searchMap[tab.key] || "").trim().toLowerCase();
          const selectedKeys = selectedMap[tab.key] || [];
          const source = keyword
            ? tab.rows.filter((row) =>
                Object.keys(row).some((field) => String(row[field]).toLowerCase().indexOf(keyword) > -1)
              )
            : tab.rows;
          const isEmpty = tab.rows.length === 0;

          const actions = [
            <Button key="refresh" leftIcon={<Icon name="refresh-cw" size={14} />} />,
            <Button key="export" leftIcon={<Icon name="download" size={14} />} text="导出" />,
            <Button key="create" status="primary" leftIcon={<Icon name="plus" size={14} />} text={tab.createLabel} />,
          ];

          return (
            <TabItem
              key={tab.key}
              title={tab.label}
              titleExtraContent={isEmpty ? null : <span className="ip-tab-count">{tab.rows.length}</span>}
            >
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
                {isEmpty ? (
                  <EmptyBlock
                    compact
                    title={tab.emptyTitle || "暂无数据"}
                    desc={tab.emptyDesc}
                    actionText={tab.createLabel}
                  />
                ) : (
                  <Table
                    className="ip-table"
                    columns={columns}
                    dataset={source}
                    keyIndex={0}
                    freezeColPosition="right"
                    enableCheckBox
                    checkType="multi"
                    checkedRows={selectedKeys}
                    onRowCheck={(row, checkedRows) =>
                      setSelectedMap((prev) => Object.assign({}, prev, { [tab.key]: checkedRows }))
                    }
                    onHeaderCheck={(checkedRows) =>
                      setSelectedMap((prev) => Object.assign({}, prev, { [tab.key]: checkedRows }))
                    }
                    enablePagination
                    enableAutoPaging
                    pagingProps={{ pageSize: 10, pageSizeOptions: [10] }}
                    emptyTableMsg="未找到匹配数据"
                  />
                )}
              </div>
            </TabItem>
          );
        })}
      </Tab>
    </SectionCard>
  );
}
