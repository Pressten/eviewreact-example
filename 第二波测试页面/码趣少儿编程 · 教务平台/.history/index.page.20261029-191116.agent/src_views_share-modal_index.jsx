import { useState, useEffect } from "react";
import { Modal, Input, Select, Switch, Button, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { shareMeta } from "../../mock/drive.js";
import ShareStatusTag from "../../components/share-status-tag/index.jsx";
import "./index.css";

const VALIDITY_OPTIONS = [
  { value: "7", label: "7 天有效" },
  { value: "30", label: "30 天有效" },
  { value: "forever", label: "永久有效" },
];

export default function ShareModal({ open, file, onClose }) {
  const [validity, setValidity] = useState("30");
  const [pwdOn, setPwdOn] = useState(false);
  const [pwd, setPwd] = useState("");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && file) {
      setLink(`https://cloud.zhipan.com/s/${file.id}-${Math.random().toString(36).slice(2, 8)}`);
      setValidity("30");
      setPwdOn(false);
      setPwd("");
      setCopied(false);
    }
  }, [open, file]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      }
    } catch (e) {
      /* 静默降级 */
    }
    setCopied(true);
    message.success("分享链接已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      title={
        <div className="share-modal-title">
          <Icon name="share-2" size="1rem" />
          <span>分享文件</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={460}
      footer={
        <div className="share-modal-foot">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={onClose}>完成</Button>
        </div>
      }
    >
      {file && (
        <div className="share-modal-body">
          <div className="share-file-row">
            <span className="share-file-name" title={`${file.name}.${file.ext}`}>
              {file.name}
              <span className="file-ext">.{file.ext}</span>
            </span>
            <ShareStatusTag status={file.shareStatus} />
          </div>

          <div className="share-field">
            <label className="share-label">分享链接</label>
            <div className="share-link-row">
              <Input value={link} readOnly className="share-link-input" />
              <Button
                type={copied ? "default" : "primary"}
                onClick={handleCopy}
                icon={<Icon name={copied ? "check" : "copy"} size="0.875rem" />}
              >
                {copied ? "已复制" : "复制"}
              </Button>
            </div>
          </div>

          <div className="share-field">
            <label className="share-label">有效期</label>
            <Select
              value={validity}
              onChange={setValidity}
              options={VALIDITY_OPTIONS}
              style={{ width: "100%" }}
            />
          </div>

          <div className="share-field share-field--row">
            <div className="share-pwd-info">
              <label className="share-label">访问密码</label>
              <span className="share-pwd-hint">开启后访问需输入密码</span>
            </div>
            <Switch checked={pwdOn} onChange={setPwdOn} />
          </div>

          {pwdOn && (
            <div className="share-field">
              <Input.Password
                placeholder="请设置 4-8 位访问密码"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
