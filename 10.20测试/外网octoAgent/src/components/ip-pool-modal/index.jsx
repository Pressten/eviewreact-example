import { useState, useEffect } from "react";
import Dialog from "@nce/eview-react/Dialog";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import Button from "@nce/eview-react/Button";
import "./index.css";

const maskOptions = [
  { text: "255.255.255.0 (/24)", value: "255.255.255.0" },
  { text: "255.255.255.128 (/25)", value: "255.255.255.128" },
  { text: "255.255.255.192 (/26)", value: "255.255.255.192" },
  { text: "255.255.255.252 (/30)", value: "255.255.255.252" },
  { text: "255.255.255.254 (/31)", value: "255.255.255.254" },
  { text: "255.255.0.0 (/16)", value: "255.255.0.0" },
  { text: "255.0.0.0 (/8)", value: "255.0.0.0" },
];

export default function IpPoolModal({ open, onClose, onConfirm, tabLabel }) {
  const [startIp, setStartIp] = useState("");
  const [endIp, setEndIp] = useState("");
  const [mask, setMask] = useState("255.255.255.0");

  useEffect(() => {
    if (open) {
      setStartIp("");
      setEndIp("");
      setMask("255.255.255.0");
    }
  }, [open]);

  const handleConfirm = () => {
    if (!startIp || !endIp) return;
    onConfirm({ startIp, endIp, mask });
  };

  const title = "添加" + (tabLabel || "IP池");

  return (
    <Dialog
      title={title}
      isOpen={open}
      onClose={onClose}
      size={[520, "auto"]}
      destroyOnClose
      buttons={[
        { text: "取消", onClick: onClose },
        { text: "确定", status: "primary", onClick: handleConfirm },
      ]}
    >
      <div className="ip-modal-body">
        <div className="ip-modal-desc">
          请输入IP地址范围和子网掩码，添加到当前{tabLabel || "IP池"}中。
        </div>
        <div className="ip-modal-form-row">
          <label className="ip-modal-label required">开始IP</label>
          <TextField
            className="ip-modal-input"
            placeholder="例如：192.168.1.10"
            size="small"
            value={startIp}
            onChange={(value) => setStartIp(value)}
          />
        </div>
        <div className="ip-modal-form-row">
          <label className="ip-modal-label required">结束IP</label>
          <TextField
            className="ip-modal-input"
            placeholder="例如：192.168.1.100"
            size="small"
            value={endIp}
            onChange={(value) => setEndIp(value)}
          />
        </div>
        <div className="ip-modal-form-row">
          <label className="ip-modal-label required">掩码</label>
          <Select
            className="ip-modal-input"
            options={maskOptions}
            size="small"
            value={mask}
            onChange={setMask}
          />
        </div>
      </div>
    </Dialog>
  );
}
