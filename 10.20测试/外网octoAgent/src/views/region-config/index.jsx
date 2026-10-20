import { useState } from "react";
import Tab, { TabItem } from "@nce/eview-react/Tab";
import Spinner from "@/shared/Spinner";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import Toggle from "@nce/eview-react/Toggle";
import InfoBanner from "../../components/info-banner/index.jsx";
import CollapseSection from "../../components/collapse-section/index.jsx";
import IpInput from "../../shared/ip-input.jsx";
import {
  fabricMgmtOptions,
  networkTypeOptions,
  underlayProtocolOptions,
} from "../../mock/network.js";
import "./index.css";

const toTextOptions = (opts) => opts.map((o) => ({ text: o.label, value: o.value }));

export default function RegionConfig() {
  const [fabricMgmt, setFabricMgmt] = useState("new");
  const [ospfProcess, setOspfProcess] = useState(1);
  const [dhcpOn, setDhcpOn] = useState(true);
  const [syslogOn, setSyslogOn] = useState(false);
  const [stelnetOn, setStelnetOn] = useState(false);
  const [importDevicePackage, setImportDevicePackage] = useState(false);

  return (
    <div className="region-config">
      <div className="rc-banner-area">
        <InfoBanner type="info">
          网络规划 &amp; 区域配置全部完成提交后，任务创建成功；网络规划数据不做单独保存，请退出前完成区域配置提交。
        </InfoBanner>
      </div>

      <CollapseSection title="基础配置" className="section-basic">
        <div className="form-row">
          <label className="form-label required">Fabric管理</label>
          <Tab
            selectedIndex={fabricMgmtOptions.findIndex((o) => o.value === fabricMgmt)}
            draggable={false}
            onClick={(index) => setFabricMgmt(fabricMgmtOptions[index].value)}
            tabContentStyle={{ display: "none" }}
          >
            {fabricMgmtOptions.map((o) => (
              <TabItem key={o.value} title={o.label} />
            ))}
          </Tab>
        </div>

        <div className="form-subsection">
          <div className="form-subsection-row">
            <div className="form-subsection-item">
              <label className="form-label narrow required">Fabric名称</label>
              <TextField placeholder="请输入内容" size="small" style={{ width: "17.5rem" }} />
            </div>
            <div className="form-subsection-item">
              <label className="form-label narrow required">组网类型</label>
              <Select
                options={toTextOptions(networkTypeOptions)}
                defaultValue="distributed"
                size="small"
                style={{ width: "17.5rem" }}
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <label className="form-label required">使用内置DHCP</label>
          <Toggle
            data={[false, true]}
            toggled={dhcpOn}
            onToggle={setDhcpOn}
          />
        </div>

        {dhcpOn && (
          <div className="form-subsection">
            <div className="form-subsection-row">
              <div className="form-subsection-item">
                <label className="form-label narrow required">DHCP网段</label>
                <TextField defaultValue="425.639.0/24" size="small" style={{ width: "17.5rem" }} />
              </div>
              <div className="form-subsection-item">
                <label className="form-label wide required">IP地址（源-目的）</label>
                <div className="ip-range-group">
                  <IpInput value="192.168.1.1" />
                  <span className="ip-range-dash">—</span>
                  <IpInput value="192.168.1.1" />
                </div>
              </div>
              <div className="form-subsection-item">
                <label className="form-label narrow required">默认网关</label>
                <IpInput value="192.168.1.1" />
              </div>
            </div>
          </div>
        )}

        <div className="form-row">
          <label className="form-label required">Syslog使能开关</label>
          <Toggle
            data={[false, true]}
            toggled={syslogOn}
            onToggle={setSyslogOn}
          />
        </div>

        {syslogOn && (
          <div className="form-subsection">
            <div className="form-subsection-row">
              <div className="form-subsection-item">
                <label className="form-label narrow required">端口号</label>
                <TextField placeholder="请输入内容" size="small" style={{ width: "17.5rem" }} />
              </div>
            </div>
          </div>
        )}

        <div className="form-row">
          <label className="form-label required">配置stelnet账户</label>
          <Toggle
            data={[false, true]}
            toggled={stelnetOn}
            onToggle={setStelnetOn}
          />
        </div>

        {stelnetOn && (
          <div className="form-subsection">
            <div className="form-subsection-row">
              <div className="form-subsection-item">
                <label className="form-label narrow required">用户名</label>
                <TextField placeholder="请输入内容" size="small" style={{ width: "17.5rem" }} />
              </div>
              <div className="form-subsection-item">
                <label className="form-label narrow required">密码</label>
                <TextField placeholder="请输入内容" size="small" style={{ width: "17.5rem" }} />
              </div>
              <div className="form-subsection-item">
                <label className="form-label narrow required">确认密码</label>
                <TextField placeholder="请输入内容" size="small" style={{ width: "17.5rem" }} />
              </div>
            </div>
          </div>
        )}

        <div className="form-row">
          <label className="form-label required">配置串口密码</label>
          <TextField placeholder="请输入内容" size="small" style={{ width: "17.5rem" }} />
        </div>

        <div className="form-row">
          <label className="form-label required">确认密码</label>
          <TextField placeholder="请输入内容" size="small" style={{ width: "17.5rem" }} />
        </div>

        <div className="form-row">
          <label className="form-label required">导入设备包</label>
          <Toggle
            data={[false, true]}
            toggled={importDevicePackage}
            onToggle={setImportDevicePackage}
          />
        </div>
      </CollapseSection>

      <CollapseSection title="Underlay配置" defaultOpen={false}>
        <div className="form-row">
          <label className="form-label required">Underlay协议类型</label>
          <Select
            options={toTextOptions(underlayProtocolOptions)}
            defaultValue="ospf"
            size="small"
            style={{ width: "17.5rem" }}
          />
        </div>
        <div className="form-row">
          <label className="form-label required">OSPF进程号</label>
          <Spinner
            value={ospfProcess}
            onChange={(v) => setOspfProcess(v || 0)}
            min={0}
            size="small"
            style={{ width: "6rem" }}
          />
        </div>
        <div className="form-row">
          <label className="form-label required">OSPF区域ID</label>
          <IpInput value="0.0.0.0" />
        </div>
        <div className="form-row">
          <label className="form-label required">Overlay IBGP AS号</label>
          <TextField defaultValue="100" size="small" style={{ width: "17.5rem" }} />
        </div>
        <div className="form-row">
          <label className="form-label required">VTEP接口</label>
          <TextField defaultValue="LoopBack0" size="small" style={{ width: "17.5rem" }} />
        </div>
        <div className="form-row">
          <label className="form-label required">BGP Router ID接口</label>
          <TextField defaultValue="LoopBack1" size="small" style={{ width: "17.5rem" }} />
        </div>
      </CollapseSection>
    </div>
  );
}
