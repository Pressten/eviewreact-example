import { useState, useEffect, useRef } from "react";
import { IconPlusIcIctBulkEdit, IconPlusIcPublicAlert, IconPlusIcPublicSearch, IconPlusIcPublicTxtFileTextured, IconPlusIcPublicTrash } from '@hui/icon-plus';
import Tab, { TabItem } from "@nce/eview-react/Tab";
import TextField from "@/shared/TextField";
import Button from "@nce/eview-react/Button";
import Table from "@nce/eview-react/Table";
import Dialog from "@nce/eview-react/Dialog";
import Tag from "@/shared/Tag";
import InfoBanner from "../../components/info-banner/index.jsx";
import DeploymentStatus from "../../components/deployment-status/index.jsx";
import { useApp } from "../../context.jsx";
import {
  deviceTabs,
  deviceSelectionList,
  unactivatedDevices,
  deviceLinkList,
  deviceInterconnectList,
} from "../../mock/network.js";
import "./index.css";

const modalDeviceColumns = [
  { title: "设备名称", key: "deviceName", width: 96 },
  { title: "设备角色", key: "deviceRole", width: 88 },
  { title: "ZTP层级", key: "ztpLevel", width: 88 },
  { title: "设备序列号", key: "deviceSerial", width: 196 },
  { title: "设备位置", key: "deviceLocation", width: 132 },
  { title: "管理IPv4地址", key: "mgmtIpv4", width: 122 },
  { title: "VTEP IPv4", key: "vtepIpv4", width: 106 },
  { title: "Bypass IPv4互联地址", key: "bypassIpv4", width: 128 },
  { title: "Bypass IPv6互联地址", key: "bypassIpv6", width: 128 },
  { title: "VxlanByPass IPv4", key: "vxlanBypassIpv4", width: 112 },
  { title: "VTEP MAC", key: "vtepMac", width: 180 },
  { title: "EBGP AS number", key: "ebgpAsNumber", width: 140 },
  { title: "BGP Router ID", key: "bgpRouterId", width: 134 },
  { title: "设备软件版本", key: "softwareVersion", width: 124 },
];

/* 3 pages × 10 rows: every page shows the same 10 devices */
const modalDeviceData = [
  ...deviceSelectionList,
  ...deviceSelectionList,
  ...deviceSelectionList,
].map((item, idx) => ({ ...item, id: idx + 1 }));

/* Step-4 table always shows these 8 devices to match the stat counters */
const deployDeviceData = deviceSelectionList
  .slice(0, 8)
  .map((item, idx) => ({ ...item, id: idx + 1 }));

const confirmColumns = [
  { title: "设备名称", key: "deviceName" },
  { title: "设备ESN", key: "deviceEsn" },
  { title: "是否有激活码", key: "hasActivationCode" },
];

export default function DeviceSelection({ deployMode = false }) {
  const { setCurrentStep } = useApp();
  const [activeTab, setActiveTab] = useState("device");
  const [keyword, setKeyword] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("device");
  const [modalKeyword, setModalKeyword] = useState("");
  const [modalSelectedRowKeys, setModalSelectedRowKeys] = useState([]);
  const [sidebarDevices, setSidebarDevices] = useState([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmOnlineModalOpen, setConfirmOnlineModalOpen] = useState(false);
  const [deployProgress, setDeployProgress] = useState(36);
  const [deployCompleted, setDeployCompleted] = useState(false);
  const modalTableRef = useRef(null);

  /* Reset row selection when switching sidebar tabs */
  useEffect(() => {
    setSelectedRowKeys([]);
  }, [activeTab]);

  /* Action column: file icon (deploy mode) + edit + delete */
  const renderActions = () => (
    <span className="ds-action-group">
      {deployMode && (
        <IconPlusIcPublicTxtFileTextured iconSize="0.875rem" iconColor={['currentcolor']} className="ds-action-icon" title="查看" />
      )}
      <IconPlusIcIctBulkEdit iconSize="0.875rem" iconColor={['currentcolor']} className="ds-action-icon" title="编辑" />
      <IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} className="ds-action-icon" title="删除" />
    </span>
  );

  const deviceColumns = [
    {
      title: "操作",
      key: "action",
      width: 108,
      render: renderActions,
    },
    {
      title: "上线状态",
      key: "onlineStatus",
      width: 96,
      render: (cell, _rowData, _options, row) => {
        if (!deployMode) {
          return <Tag>待上线</Tag>;
        }
        /* Rows flip to 已上线 one by one as progress grows */
        if (row?.rawData?.id <= deploySuccessCount) {
          return <Tag className="ds-tag-ok">已上线</Tag>;
        }
        return <Tag className="ds-tag-progress">上线中 (20%)</Tag>;
      },
    },
    { title: "设备名称", key: "deviceName", width: 140 },
    { title: "管理IPv4地址", key: "mgmtIpv4", width: 130 },
    { title: "设备角色", key: "deviceRole", width: 96 },
    { title: "ZTP层级", key: "ztpLevel", width: 88 },
    { title: "VTEP IPv4", key: "vtepIpv4", width: 120 },
    { title: "BGP Router ID", key: "bgpRouterId", width: 116 },
    { title: "设备软件版本", key: "softwareVersion", width: 110 },
  ];

  const linkColumns = [
    { title: "操作", key: "action", width: 108, render: renderActions },
    { title: "链路ID", key: "linkId", width: 90 },
    { title: "源设备", key: "srcDevice", width: 100 },
    { title: "源端口", key: "srcPort", width: 110 },
    { title: "目的设备", key: "dstDevice", width: 100 },
    { title: "目的端口", key: "dstPort", width: 110 },
    { title: "链路类型", key: "linkType", width: 100 },
    {
      title: "链路状态",
      key: "linkStatus",
      width: 90,
      render: (text) => (
        <Tag className={text === "Up" ? "ds-tag-ok" : "ds-tag-fail"}>
          {text}
        </Tag>
      ),
    },
  ];

  const interconnectColumns = [
    { title: "操作", key: "action", width: 108, render: renderActions },
    { title: "源设备", key: "srcDevice", width: 100 },
    { title: "目的设备", key: "dstDevice", width: 100 },
    { title: "互联类型", key: "connType", width: 90 },
    { title: "本端IP地址", key: "localIp", width: 110 },
    { title: "对端IP地址", key: "remoteIp", width: 110 },
    {
      title: "互联状态",
      key: "connStatus",
      width: 90,
      render: (text) => (
        <Tag
          className={
            text === "已建立"
              ? "ds-tag-ok"
              : text === "建立中"
              ? "ds-tag-progress"
              : "ds-tag-fail"
          }
        >
          {text}
        </Tag>
      ),
    },
  ];

  const sidebarColumns =
    activeTab === "device"
      ? deviceColumns
      : activeTab === "link"
      ? linkColumns
      : interconnectColumns;

  const sidebarDataSource =
    activeTab === "device"
      ? deployMode
        ? deployDeviceData
        : sidebarDevices
      : activeTab === "link"
      ? deviceLinkList
      : deviceInterconnectList;

  /* Rows already online, growing with the deployment progress (36% -> 100%) */
  const deploySuccessCount = deployMode
    ? Math.round((8 * (deployProgress - 36)) / 64)
    : 0;

  /* Confirm: carry the checked rows (deduped by serial) into the sidebar table */
  const handleModalConfirm = () => {
    const picked = modalTableRef.current?.getCheckedRowsData() ?? [];
    setSidebarDevices((prev) => {
      const existingSerials = new Set(prev.map((d) => d.deviceSerial));
      const merged = [...prev];
      picked.forEach((item) => {
        if (!existingSerials.has(item.deviceSerial)) {
          merged.push({ ...item, onlineStatus: "待上线" });
        }
      });
      return merged;
    });
    setModalSelectedRowKeys([]);
    setAddModalOpen(false);
  };

  return (
    <div className="device-selection">
      <div className="ds-canvas">
        <img
          className="ds-canvas-bg"
          src={
            deployMode
              ? deployCompleted
                ? "/uploads/bg-four.png"
                : "/uploads/bg-three.png"
              : sidebarDevices.length > 0
              ? "/uploads/bg-two.png"
              : "/uploads/bg-one.png"
          }
          alt=""
        />
      </div>
      <aside className="ds-sidebar">
        <div className="ds-sidebar-title">设备选择</div>
        {deployMode && (
          <DeploymentStatus
            onProgress={(p) => setDeployProgress(p)}
            onComplete={() => setDeployCompleted(true)}
          />
        )}
        <Tab
          selectedIndex={deviceTabs.findIndex((t) => t.key === activeTab)}
          draggable={false}
          onClick={(index) => setActiveTab(deviceTabs[index].key)}
          className="ds-tabs"
        >
          {deviceTabs.map((t) => (
            <TabItem key={t.key} title={t.text} />
          ))}
        </Tab>
        <div className="ds-toolbar">
          <TextField
            value={keyword}
            onChange={(value) => setKeyword(value)}
            placeholder="请输入搜索内容"
            suffix={
              <IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />
            }
          />
          <div className="ds-toolbar-actions">
            {deployMode ? (
              <>
                <Button size="small">NETCONF通道信息</Button>
                <Button size="small">ZTP配置校验</Button>
                <Button size="small">刷新</Button>
              </>
            ) : (
              <>
                <Button size="small">删除</Button>
                <Button size="small">清空</Button>
                <Button
                  status="primary"
                  size="small"
                  onClick={() => setAddModalOpen(true)}
                >
                  添加
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="ds-table">
          {activeTab === "device" && !deployMode && sidebarDataSource.length === 0 ? (
            <div className="ds-empty">
              <img
                className="ds-empty-img"
                src="/uploads/empty.svg"
                alt=""
              />
              <div className="ds-empty-text">
                暂无数据，请
                <a
                  className="ds-empty-link"
                  onClick={() => setAddModalOpen(true)}
                >
                  添加
                </a>
              </div>
            </div>
          ) : (
            <Table
              columns={sidebarColumns}
              dataset={sidebarDataSource}
              enableCheckBox
              checkType="multi"
              checkedRows={selectedRowKeys}
              onRowCheck={(row, checkedRows) => setSelectedRowKeys(checkedRows)}
              enableZebraCrossing={false}
              enableSort={false}
              enablePagination
              enableAutoPaging
              pagingProps={{ pageSize: 10, pageSizeOptions: [10, 20, 50] }}
              emptyTableMsg="暂无数据"
            />
          )}
        </div>
        <div className="ds-sidebar-footer">
          {deployMode ? (
            deployCompleted ? (
              <Button size="small">完成</Button>
            ) : (
              <Button size="small">结束任务</Button>
            )
          ) : (
            <>
              <Button size="small">删除</Button>
              <Button
                status="primary"
                size="small"
                disabled={sidebarDevices.length === 0}
                onClick={() => setConfirmModalOpen(true)}
              >
                开始上线
              </Button>
            </>
          )}
        </div>
      </aside>

      <Dialog
        title="设备选择列表"
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        size={[1854, "auto"]}
        destroyOnClose
        buttons={[
          { text: "取消", onClick: () => setAddModalOpen(false) },
          { text: "确定", status: "primary", onClick: handleModalConfirm },
        ]}
      >
        <div className="ds-modal-body">
          <Tab
            selectedIndex={deviceTabs.findIndex((t) => t.key === modalTab)}
            draggable={false}
            onClick={(index) => setModalTab(deviceTabs[index].key)}
            className="ds-modal-tabs"
          >
            {deviceTabs.map((t) => (
              <TabItem key={t.key} title={t.text} />
            ))}
          </Tab>
          <TextField
            className="ds-modal-search"
            value={modalKeyword}
            onChange={(value) => setModalKeyword(value)}
            placeholder="请输入搜索内容"
            suffix={
              <IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />
            }
          />
          <Table
            ref={modalTableRef}
            columns={modalDeviceColumns}
            dataset={modalDeviceData}
            enableCheckBox
            checkType="multi"
            preserveCheckedRows
            checkedRows={modalSelectedRowKeys}
            onRowCheck={(row, checkedRows) => setModalSelectedRowKeys(checkedRows)}
            enableZebraCrossing={false}
            enableSort={false}
            enablePagination
            enableAutoPaging
            pagingProps={{ pageSize: 10, pageSizeOptions: [10, 20, 50] }}
          />
        </div>
      </Dialog>

      <Dialog
        className="ds-confirm-modal"
        title={
          <span className="ds-confirm-title">
            <IconPlusIcPublicAlert iconSize="1.25rem" iconColor={['var(--primary)']} />
            信息提示
          </span>
        }
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        size={[640, "auto"]}
        destroyOnClose
        buttons={[
          { text: "取消", onClick: () => setConfirmModalOpen(false) },
          {
            text: "已配置",
            status: "primary",
            onClick: () => {
              setConfirmModalOpen(false);
              setConfirmOnlineModalOpen(true);
            },
          },
        ]}
      >
        <div className="ds-confirm-body">
          <InfoBanner type="warning">
            以下5个设备暂未配置配置激活码，请完成前置条件：
            <a>eSight中心&gt;设备管理&gt;激活码录入</a>
          </InfoBanner>
          <Table
            columns={confirmColumns}
            dataset={unactivatedDevices}
            enableZebraCrossing={false}
            enableSort={false}
          />
        </div>
      </Dialog>

      <Dialog
        className="ds-online-modal"
        title="确认上线"
        isOpen={confirmOnlineModalOpen}
        onClose={() => setConfirmOnlineModalOpen(false)}
        size={[640, "auto"]}
        destroyOnClose
        buttons={[
          { text: "取消", onClick: () => setConfirmOnlineModalOpen(false) },
          {
            text: "确认",
            status: "primary",
            onClick: () => {
              setConfirmOnlineModalOpen(false);
              setCurrentStep(4);
            },
          },
        ]}
      >
        <div className="ds-online-body">
          <InfoBanner type="info" icon="circle-alert">
            上线前先检查相关设置，减少失败风险。
          </InfoBanner>
          <div className="ds-online-tips">
            <p>
              1.待上线MLAG设备组的上行<strong>端口范围需保持一致</strong>
              ，以及<strong>设备组件peerlink需保持一致</strong>
              ，否则可能导致设备上线失败或互联配置及互联配置下发失败。
            </p>
            <p>
              2.<strong>使用内置DHCP服务</strong>
              时，请确保组网环境中无其它DHCP服务器，否则设备可能会上线失败。
            </p>
            <p>3.对多层级设备ZTP上线，由于设备避退算法，推荐逐层对设备上电。</p>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
