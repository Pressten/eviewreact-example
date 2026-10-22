import { useState, useEffect } from "react";
import { IconPlusIcDigitalPowerDpExcelFile, IconPlusIcPublicInfo } from '@hui/icon-plus';
import SelectCard from "@nce/eview-react/SelectCard";
import Spinner from "@/shared/Spinner";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import Toggle from "@nce/eview-react/Toggle";
import Tab, { TabItem } from "@nce/eview-react/Tab";
import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import TipBox from "@nce/eview-react/TipBox";
import Empty from "@nce/eview-react/Empty";
import InfoBanner from "../../components/info-banner/index.jsx";
import CollapseSection from "../../components/collapse-section/index.jsx";
import DynamicInputRow from "../../components/dynamic-input-row/index.jsx";
import SouthProtocolModal from "../../components/south-protocol-modal/index.jsx";
import IpPoolModal from "../../components/ip-pool-modal/index.jsx";
import {
  planningTypes,
  managementOptions,
  networkShapeOptions,
  ipPoolTabs,
  ipPoolDataMap,
} from "../../mock/network.js";
import "./index.css";

export default function NetworkPlanning() {
  const [planningType, setPlanningType] = useState("classic");
  const [spineCount, setSpineCount] = useState(2);
  const [leafCount, setLeafCount] = useState(6);
  const [ipPlanningOn, setIpPlanningOn] = useState(false);
  const [activeIpTab, setActiveIpTab] = useState("interconnect");
  const [modalOpen, setModalOpen] = useState(false);
  const [southConfigured, setSouthConfigured] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [ipPoolModalOpen, setIpPoolModalOpen] = useState(false);
  const [ipPoolData, setIpPoolData] = useState(() => ({ ...ipPoolDataMap }));
  const [mgmtMode, setMgmtMode] = useState("outband");
  const [networkShape, setNetworkShape] = useState("mlag");
  const [cev3Leaf, setCev3Leaf] = useState(true);

  const [openKeys, setOpenKeys] = useState(["topo", "ip"]);
  const reveal = (key) =>
    setOpenKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
  const toggle = (key, open) =>
    setOpenKeys((prev) =>
      open ? (prev.includes(key) ? prev : [...prev, key]) : prev.filter((k) => k !== key)
    );

  const isClassic = planningType === "classic";

  useEffect(() => {
    setOpenKeys(["topo", "ip"]);
  }, [planningType]);

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [activeIpTab]);

  const currentIpPoolData = ipPoolData[activeIpTab] || [];
  const hasIpPoolData = currentIpPoolData.length > 0;

  const ipPoolColumns = [
    { title: "开始IP", key: "startIp", allowSort: false },
    { title: "结束IP", key: "endIp", allowSort: false },
    { title: "掩码", key: "mask", allowSort: false },
    {
      title: "操作",
      key: "action",
      allowSort: false,
      render: () => <a className="cell-link">删除</a>,
    },
  ];

  const keyAfterIp = isClassic ? "shape" : "global";

  return (
    <div className="network-planning">
      <div className="np-banner-area">
        <InfoBanner type="info">
          网络规划 &amp; 区域配置全部完成提交后，任务创建成功。网络规划数据不做单独保存，请退出前完成区域配置提交。
        </InfoBanner>
      </div>

      <CollapseSection
        title="拓扑规划"
        open={openKeys.includes("topo")}
        onToggle={(v) => toggle("topo", v)}
      >
        <div className="form-row">
          <label className="form-label required">拓扑规划</label>
          <SelectCard
            data={planningTypes}
            value={planningType}
            onChange={(v) => setPlanningType(v)}
            type="small"
          />
        </div>

        {isClassic ? (
          <div className="classic-fields">
            <div className="form-row">
              <label className="form-label required">Spine数量</label>
              <Spinner
                value={spineCount}
                onChange={(v) => setSpineCount(v || 0)}
                min={0}
                style={{ width: "6rem" }}
              />
            </div>
            <div className="form-row">
              <label className="form-label required">Leaf数量</label>
              <Spinner
                value={leafCount}
                onChange={(v) => setLeafCount(v || 0)}
                min={0}
                style={{ width: "6rem" }}
              />
            </div>
            <div className="form-row">
              <DynamicInputRow
                label={<label className="form-label required">Spine设备ESN</label>}
                initialValues={["SDFWSEFV44200000"]}
                placeholder="ESN"
              />
            </div>
            <div className="form-row">
              <label className="form-label required">组网管理方式</label>
              <Select
                options={managementOptions}
                value={mgmtMode}
                onChange={(value) => { setMgmtMode(value); reveal("ip"); }}
                style={{ width: "16.25rem" }}
              />
            </div>
          </div>
        ) : (
          <div className="custom-fields">
            <div className="form-row">
              <label className="form-label">下载模板</label>
              <a className="np-template-link">
                <IconPlusIcDigitalPowerDpExcelFile iconSize="1rem" iconColor={['var(--success)']} />
                模板.xlsx
              </a>
            </div>
            <div className="form-row">
              <label className="form-label">导入规划文件</label>
              <div className="np-import-group">
                <TextField
                  defaultValue="Source001"
                  readOnly
                  style={{ width: "18rem" }}
                />
                <Button size="small" text="导入" />
              </div>
            </div>
            <div className="form-row">
              <label className="form-label required">组网管理方式</label>
              <Select
                options={managementOptions}
                value={mgmtMode}
                onChange={(value) => { setMgmtMode(value); reveal("ip"); }}
                style={{ width: "16.25rem" }}
              />
            </div>
          </div>
        )}
      </CollapseSection>

      <CollapseSection
        title="IP规划"
        open={openKeys.includes("ip")}
        onToggle={(v) => toggle("ip", v)}
      >
        {!isClassic && (
          <div className="form-row">
            <TipBox type="simple" content="精细规划IP地址" direction="top">
              <label className="form-label required">精细规划IP地址</label>
            </TipBox>
            <Toggle
              data={[false, true]}
              toggled={ipPlanningOn}
              onToggle={(value) => {
                setIpPlanningOn(value);
                reveal(keyAfterIp);
              }}
            />
          </div>
        )}

        {!ipPlanningOn && (
          <div className="ip-planning-content">
            <Tab
              selectedIndex={ipPoolTabs.findIndex((t) => t.key === activeIpTab)}
              draggable={false}
              onClick={(index) => setActiveIpTab(ipPoolTabs[index].key)}
              className="ip-pool-tabs"
            >
              {ipPoolTabs.map((t) => (
                <TabItem key={t.key} title={t.label} />
              ))}
            </Tab>

            <div className="ip-pool-toolbar">
              <span className="ip-pool-desc">
                控制器交换机允许使用的BD范围，支持通过资源池实例管理这些BD资源，实现控制器自动配置BD，从而简化网络部署。
              </span>
              <div className="ip-pool-actions">
                {hasIpPoolData && selectedRowKeys.length > 0 && (
                  <span className="ip-pool-selected">
                    已选 {selectedRowKeys.length} 项
                  </span>
                )}
                {hasIpPoolData && <Button size="small" text="取消" />}
                <Button
                  status="primary"
                  size="small"
                  text="添加"
                  onClick={() => {
                    setIpPoolModalOpen(true);
                    reveal(keyAfterIp);
                  }}
                />
              </div>
            </div>

            <div className="ip-pool-table">
              {hasIpPoolData ? (
                <Table
                  columns={ipPoolColumns}
                  dataset={currentIpPoolData}
                  enableCheckBox
                  checkType="multi"
                  checkedRows={selectedRowKeys}
                  onRowCheck={(row, checkedRows) => setSelectedRowKeys(checkedRows)}
                  onHeaderCheck={(checkedRows) => setSelectedRowKeys(checkedRows)}
                  enableZebraCrossing={false}
                  width="unset"
                  enableColumnCompareUpdate
                  emptyTableMsg="暂无数据"
                />
              ) : (
                <div className="ip-pool-empty">
                  <Empty type="success" description="暂无数据" />
                </div>
              )}
            </div>
          </div>
        )}
      </CollapseSection>

      {isClassic && (
        <CollapseSection
          title="组网形态"
          open={openKeys.includes("shape")}
          onToggle={(v) => toggle("shape", v)}
        >
          <div className="form-row">
            <label className="form-label required">Leaf组网形态</label>
            <Select
              options={networkShapeOptions}
              value={networkShape}
              onChange={(value) => setNetworkShape(value)}
              style={{ width: "16.25rem" }}
            />
          </div>
          <div className="form-row">
            <label className="form-label required">CEV3 leaf</label>
            <Toggle
              data={[false, true]}
              toggled={cev3Leaf}
              onToggle={(value) => setCev3Leaf(value)}
            />
          </div>
          <div className="form-row">
            <label className="form-label required">DFS-Group密码</label>
            <TextField
              placeholder="请输入内容"
              style={{ width: "17.5rem" }}
            />
          </div>
          <div className="form-row">
            <DynamicInputRow
              label={<label className="form-label required">Spine上行口范围</label>}
              initialValues={["10GE1/0/0~10GE1/0/6"]}
              placeholder="10GE1/0/0~10GE1/0/6"
            />
          </div>
          <div className="form-row">
            <DynamicInputRow
              label={<label className="form-label required">Spine下行口范围</label>}
              initialValues={["10GE1/0/0~10GE1/0/6"]}
              placeholder="10GE1/0/0~10GE1/0/6"
            />
          </div>
          <div className="form-row">
            <DynamicInputRow
              label={<label className="form-label required">Leaf-Peer-link口范围</label>}
              initialValues={["10GE1/0/0~10GE1/0/6"]}
              placeholder="10GE1/0/0~10GE1/0/6"
              onChange={() => reveal("global")}
            />
          </div>
        </CollapseSection>
      )}

      <CollapseSection
        title="全局配置"
        open={openKeys.includes("global")}
        onToggle={(v) => toggle("global", v)}
      >
        <div className="form-row">
          <label className="form-label required">配置南向协议</label>
          <Button
            size="small"
            text={southConfigured ? "查看" : "编辑"}
            onClick={() => setModalOpen(true)}
          />
          <div className="np-global-tip">
            <IconPlusIcPublicInfo iconSize="1rem" iconColor={['var(--primary)']} />
            <span>
              {southConfigured
                ? "南向协议参数（Netconf、SNMP）为全局属性，当前已配置，可查看并进行配置。"
                : "南向协议参数（Netconf、SNMP）为全局属性，仅需配置一次。"}
            </span>
          </div>
        </div>
      </CollapseSection>

      <SouthProtocolModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          setSouthConfigured(true);
          setModalOpen(false);
        }}
      />

      <IpPoolModal
        open={ipPoolModalOpen}
        onClose={() => setIpPoolModalOpen(false)}
        tabLabel={ipPoolTabs.find((t) => t.key === activeIpTab)?.label}
        onConfirm={(entry) => {
          setIpPoolData((prev) => ({
            ...prev,
            [activeIpTab]: [
              ...(prev[activeIpTab] || []),
              { id: Date.now(), ...entry },
            ],
          }));
          setIpPoolModalOpen(false);
        }}
      />
    </div>
  );
}
