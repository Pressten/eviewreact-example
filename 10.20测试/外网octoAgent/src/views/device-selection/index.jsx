import { useState, useEffect, useRef } from "react";
import { IconPlusIcIctBulkEdit, IconPlusIcPublicAlert, IconPlusIcPublicDownload, IconPlusIcPublicGenericFile, IconPlusIcPublicSearch, IconPlusIcPublicTrash } from '@hui/icon-plus';
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
  { title: "设备名称", key: "deviceName", width: 96, allowSort: false },
  { title: "设备角色", key: "deviceRole", width: 88, allowSort: false },
  { title: "ZTP层级", key: "ztpLevel", width: 88, allowSort: false },
  { title: "设备序列号", key: "deviceSerial", width: 196, allowSort: false },
  { title: "设备位置", key: "deviceLocation", width: 132, allowSort: false },
  { title: "管理IPv4地址", key: "mgmtIpv4", width: 122, allowSort: false },
  { title: "VTEP IPv4", key: "vtepIpv4", width: 106, allowSort: false },
  { title: "Bypass IPv4互联地址", key: "bypassIpv4", width: 128, allowSort: false },
  { title: "Bypass IPv6互联地址", key: "bypassIpv6", width: 128, allowSort: false },
  { title: "VxlanByPass IPv4", key: "vxlanBypassIpv4", width: 112, allowSort: false },
  { title: "VTEP MAC", key: "vtepMac", width: 180, allowSort: false },
  { title: "EBGP AS number", key: "ebgpAsNumber", width: 140, allowSort: false },
  { title: "BGP Router ID", key: "bgpRouterId", width: 134, allowSort: false },
  { title: "设备软件版本", key: "softwareVersion", width: 124, allowSort: false },
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
  { title: "设备名称", key: "deviceName", allowSort: false },
  { title: "设备ESN", key: "deviceEsn", allowSort: false },
  { title: "是否有激活码", key: "hasActivationCode", allowSort: false },
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
  const [modalCheckedCount, setModalCheckedCount] = useState(0);
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
    <div className="ds-action-group" style={{ display: "flex", gap: "8px" }}>
      {deployMode && (
        <IconPlusIcPublicGenericFile
          iconSize="0.875rem"
          iconColor={['currentcolor']}
          className="ds-action-icon"
          title="查看"
        />
      )}
      <IconPlusIcIctBulkEdit
        iconSize="0.875rem"
        iconColor={['currentcolor']}
        className="ds-action-icon"
        title="编辑"
      />
      <IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} className="ds-action-icon" title="删除" />
    </div>
  );

  const deviceColumns = [
    {
      title: "操作",
      key: "action",
      width: 108,
      allowSort: false,
      render: renderActions,
    },
    {
      title: "上线状态",
      key: "onlineStatus",
      width: 96,
      allowSort: false,
      render: (cell, rowData, options, row) => {
        if (!deployMode) {
          return <Tag>待上线</Tag>;
        }
        if (row?.rawData?.id <= deploySuccessCount) {
          return <Tag className="ds-tag-ok">已上线</Tag>;
        }
        return <Tag className="ds-tag-progress">上线中 (20%)</Tag>;
      },
    },
    {
      title: "设备名称",
      key: "deviceName",
      width: 140,
      allowSort: false,
    },
    {
      title: "管理IPv4地址",
      key: "mgmtIpv4",
      width: 130,
      allowSort: false,
    },
    {
      title: "设备角色",
      key: "deviceRole",
      width: 96,
      allowSort: false,
    },
    {
      title: "ZTP层级",
      key: "ztpLevel",
      width: 88,
      allowSort: false,
    },
    {
      title: "VTEP IPv4",
      key: "vtepIpv4",
      width: 120,
      allowSort: false,
    },
    {
      title: "BGP Router ID",
      key: "bgpRouterId",
      width: 116,
      allowSort: false,
    },
    {
      title: "设备软件版本",
      key: "softwareVersion",
      width: 110,
      allowSort: false,
    },
  ];

  const linkColumns = [
    {
      title: "操作",
      key: "action",
      width: 108,
      allowSort: false,
      render: renderActions,
    },
    {
      title: "链路ID",
      key: "linkId",
      width: 90,
      allowSort: false,
    },
    {
      title: "源设备",
      key: "srcDevice",
      width: 100,
      allowSort: false,
    },
    {
      title: "源端口",
      key: "srcPort",
      width: 110,
      allowSort: false,
    },
    {
      title: "目的设备",
      key: "dstDevice",
      width: 100,
      allowSort: false,
    },
    {
      title: "目的端口",
      key: "dstPort",
      width: 110,
      allowSort: false,
    },
    {
      title: "链路类型",
      key: "linkType",
      width: 100,
      allowSort: false,
    },
    {
      title: "链路状态",
      key: "linkStatus",
      width: 90,
      allowSort: false,
      render: (cell) => (
        <Tag className={cell === "Up" ? "ds-tag-ok" : "ds-tag-fail"}>
          {cell}
        </Tag>
      ),
    },
  ];

  const interconnectColumns = [
    {
      title: "操作",
      key: "action",
      width: 108,
      allowSort: false,
      render: renderActions,
    },
    {
      title: "源设备",
      key: "srcDevice",
      width: 100,
      allowSort: false,
    },
    {
      title: "目的设备",
      key: "dstDevice",
      width: 100,
      allowSort: false,
    },
    {
      title: "互联类型",
      key: "connType",
      width: 90,
      allowSort: false,
    },
    {
      title: "本端IP地址",
      key: "localIp",
      width: 110,
      allowSort: false,
    },
    {
      title: "对端IP地址",
      key: "remoteIp",
      width: 110,
      allowSort: false,
    },
    {
      title: "互联状态",
      key: "connStatus",
      width: 90,
      allowSort: false,
      render: (cell) => (
        <Tag
          className={
            cell === "已建立"
              ? "ds-tag-ok"
              : cell === "建立中"
              ? "ds-tag-progress"
              : "ds-tag-fail"
          }
        >
          {cell}
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

  const hasSidebarPagination = deployMode || sidebarDataSource.length > 0;

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
    setModalCheckedCount(0);
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
                ? "./assets/uploads/bg-four.png"
                : "./assets/uploads/bg-three.png"
              : sidebarDevices.length > 0
              ? "./assets/uploads/bg-two.png"
              : "./assets/uploads/bg-one.png"
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
          tabContentStyle={{ display: "none" }}
          className="ds-tabs"
        >
          {deviceTabs.map((t) => (
            <TabItem key={t.key} title={t.label} />
          ))}
        </Tab>
        <div className="ds-toolbar">
          <div className="ds-search-wrap" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <TextField
              size="small"
              value={keyword}
              onChange={(value) => setKeyword(value)}
              placeholder="请输入搜索内容"
            />
            <IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />
          </div>
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
          <Table
            columns={sidebarColumns}
            dataset={sidebarDataSource}
            enableCheckBox
            checkType="multi"
            checkedRows={selectedRowKeys}
            onRowCheck={(row, checkedRows) => setSelectedRowKeys(checkedRows)}
            onHeaderCheck={(checkedRows) => setSelectedRowKeys(checkedRows)}
            enablePagination={hasSidebarPagination}
            enableAutoPaging={hasSidebarPagination}
            pageSizeOptions={[10, 20, 50]}
            emptyTableMsg={activeTab === "device" ? "暂无数据，请添加" : "暂无数据"}
          />
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
        buttons={[
          { text: "取消", onClick: () => setAddModalOpen(false) },
          { text: "确定", status: "primary", onClick: handleModalConfirm },
        ]}
      >
        <div className="ds-modal-body">
          <div className="ds-modal-tabs-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Tab
              selectedIndex={deviceTabs.findIndex((t) => t.key === modalTab)}
              draggable={false}
              onClick={(index) => setModalTab(deviceTabs[index].key)}
              tabContentStyle={{ display: "none" }}
              className="ds-modal-tabs"
            >
              {deviceTabs.map((t) => (
                <TabItem key={t.key} title={t.label} />
              ))}
            </Tab>
            <a className="ds-modal-export">
              <IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />
              导出
            </a>
          </div>
          <div className="ds-search-wrap" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <TextField
              size="small"
              className="ds-modal-search"
              value={modalKeyword}
              onChange={(value) => setModalKeyword(value)}
              placeholder="请输入搜索内容"
            />
            <IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />
          </div>
          {modalCheckedCount > 0 && (
            <div style={{ marginBottom: "8px", color: "var(--on-surface-variant)" }}>
              总计：{modalDeviceData.length}　已选：{modalCheckedCount}
            </div>
          )}
          <Table
            ref={modalTableRef}
            columns={modalDeviceColumns}
            dataset={modalDeviceData}
            enableCheckBox
            checkType="multi"
            preserveCheckedRows
            checkedRows={modalSelectedRowKeys}
            onRowCheck={(row, checkedRows) => {
              setModalSelectedRowKeys(checkedRows);
              setModalCheckedCount(checkedRows.length);
            }}
            onHeaderCheck={(checkedRows) => {
              setModalSelectedRowKeys(checkedRows);
              setModalCheckedCount(checkedRows.length);
            }}
            enablePagination
            enableAutoPaging
            pageSizeOptions={[10, 20, 50]}
            emptyTableMsg="暂无数据"
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
            emptyTableMsg="暂无数据"
          />
        </div>
      </Dialog>

      <Dialog
        className="ds-online-modal"
        title="确认上线"
        isOpen={confirmOnlineModalOpen}
        onClose={() => setConfirmOnlineModalOpen(false)}
        size={[640, "auto"]}
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
              ，否则可能导致设备上线失败或互联配置及peerlink口配置下发失败。
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
