import { useState, useEffect } from "react";
import { IconPlusIcDigitalPowerDpCheck, IconPlusIcPublicCopy, IconPlusIcPublicShare } from '@hui/icon-plus';
import Dialog from "@nce/eview-react/Dialog";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import Toggle from "@nce/eview-react/Toggle";
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import { shareMeta } from "../../mock/drive.jsx";
import ShareStatusTag from "../../components/share-status-tag/index.jsx";
import "./index.css";

const VALIDITY_OPTIONS = [
  { value: "7", text: "7 天有效" },
  { value: "30", text: "30 天有效" },
  { value: "forever", text: "永久有效" },
];

export default function ShareModal({ open, file, onClose }) {
  const [validity, setValidity] = useState("30");
  const [pwdOn, setPwdOn] = useState(false);
  const [pwd, setPwd] = useState("");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState(null);

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
    setNotice({ type: "success", text: "分享链接已复制到剪贴板" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      title={
        <div className="share-modal-title">
          <IconPlusIcPublicShare iconSize="1rem" iconColor={['currentcolor']} />
          <span>分享文件</span>
        </div>
      }
      isOpen={open}
      onClose={onClose}
      size={[460, "auto"]}
      buttons={[
        { text: "取消", onClick: onClose },
        { text: "完成", status: "primary", onClick: onClose },
      ]}
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
              <TextField value={link} readOnly className="share-link-input" />
              <Button
                status={copied ? "default" : "primary"}
                onClick={handleCopy}
                leftIcon={copied ? <IconPlusIcDigitalPowerDpCheck iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicCopy iconSize="0.875rem" iconColor={['currentcolor']} />}
                text={copied ? "已复制" : "复制"}
              />
            </div>
          </div>

          <div className="share-field">
            <label className="share-label">有效期</label>
            <Select
              value={validity}
              onChange={(value) => setValidity(value)}
              data={VALIDITY_OPTIONS}
              style={{ width: "100%" }}
            />
          </div>

          <div className="share-field share-field--row">
            <div className="share-pwd-info">
              <label className="share-label">访问密码</label>
              <span className="share-pwd-hint">开启后访问需输入密码</span>
            </div>
            <Toggle toggled={pwdOn} onToggle={(value) => setPwdOn(value)} data={[false, true]} />
          </div>

          {pwdOn && (
            <div className="share-field">
              <TextField
                type="password"
                isAllowToModifyPasswordByProps
                placeholder="请设置 4-8 位访问密码"
                value={pwd}
                onChange={(value) => setPwd(value)}
              />
            </div>
          )}

          {notice ? (
            <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
              <DivMessage
                key={notice.text}
                display
                type={notice.type}
                text={notice.text}
                onClose={() => setNotice(null)}
              />
            </div>
          ) : null}
        </div>
      )}
    </Dialog>
  );
}
