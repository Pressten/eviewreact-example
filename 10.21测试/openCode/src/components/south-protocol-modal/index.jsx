import { useState } from "react";
import Dialog from "@nce/eview-react/Dialog";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import Toggle from "@nce/eview-react/Toggle";
import Button from "@nce/eview-react/Button";
import {
  callhomeAuthOptions,
  snmpAuthProtocolOptions,
  snmpEncryptOptions,
} from "../../mock/network.js";
import "./index.css";

export default function SouthProtocolModal({ open, onClose, onConfirm }) {
  const [netconfOpen, setNetconfOpen] = useState(true);
  const [snmpOpen, setSnmpOpen] = useState(true);

  return (
    <Dialog
      title="配置南向协议"
      isOpen={open}
      onClose={() => onClose()}
      size={[560, "auto"]}
      buttons={[
        { text: "取消", onClick: () => onClose() },
        { text: "确定", status: "primary", onClick: onConfirm },
      ]}
    >
      <div className="modal-body-inner">
        <div
          className="modal-section-header"
          onClick={() => setNetconfOpen((o) => !o)}
          role="button"
          tabIndex={0}
        >
          <span className={"modal-section-arrow" + (netconfOpen ? "" : " collapsed")}>
            ▾
          </span>
          <span className="modal-section-title">Netconf账户</span>
        </div>
        {netconfOpen && (
          <div className="modal-section-body">
            <div className="modal-form-row">
              <label className="modal-form-label required">用户名</label>
              <TextField className="modal-form-input" placeholder="请输入" />
            </div>
            <div className="modal-form-row">
              <label className="modal-form-label required">密码</label>
              <TextField className="modal-form-input" placeholder="请输入" />
            </div>
            <div className="modal-form-row">
              <label className="modal-form-label required">转发器端口号</label>
              <TextField className="modal-form-input" placeholder="请输入" />
            </div>
            <div className="modal-form-row">
              <label className="modal-form-label required">Callhome认证方式</label>
              <Select
                className="modal-form-input"
                options={callhomeAuthOptions}
                defaultValue="cert"
              />
            </div>
            <div className="modal-form-row">
              <label className="modal-form-label required">自定义证书模式</label>
              <Toggle data={[false, true]} />
            </div>
            <div className="modal-form-row">
              <label className="modal-form-label required">设备证书ESN校验</label>
              <Toggle data={[false, true]} toggled={true} />
            </div>
          </div>
        )}

        <div
          className="modal-section-header"
          onClick={() => setSnmpOpen((o) => !o)}
          role="button"
          tabIndex={0}
        >
          <span className={"modal-section-arrow" + (snmpOpen ? "" : " collapsed")}>
            ▾
          </span>
          <span className="modal-section-title">SNMP账户</span>
        </div>
        {snmpOpen && (
          <div className="modal-section-body">
            <div className="modal-form-row">
              <label className="modal-form-label required">用户名</label>
              <TextField className="modal-form-input" placeholder="请输入" />
            </div>
            <div className="modal-form-row">
              <label className="modal-form-label required">端口</label>
              <TextField className="modal-form-input" placeholder="请输入" />
            </div>
            <div className="modal-form-row">
              <label className="modal-form-label required">鉴定协议</label>
              <Select
                className="modal-form-input"
                options={snmpAuthProtocolOptions}
                defaultValue="sha256"
              />
            </div>
            <div className="modal-form-row">
              <label className="modal-form-label required">鉴权密钥</label>
              <TextField className="modal-form-input" placeholder="请输入" />
            </div>
            <div className="modal-form-row">
              <label className="modal-form-label required">加密算法</label>
              <Select
                className="modal-form-input"
                options={snmpEncryptOptions}
                defaultValue="sha256"
              />
            </div>
            <div className="modal-form-row">
              <label className="modal-form-label required">加密密钥</label>
              <TextField className="modal-form-input" placeholder="请输入" />
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
