import Button from "@nce/eview-react/Button";
import { IconPlusIcPublicDisk, IconPlusIcPublicAlert, IconPlusIcPublicDownload } from '@hui/icon-plus';
import { storage } from "../../mock/drive.jsx";
import "./index.css";

// 简单进度条（手写，替代 antd Progress）
function SimpleProgress({ percent, strokeColor, trailColor }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div className="simple-progress__track" style={{ height: "8px", background: trailColor, borderRadius: "4px", overflow: "hidden" }}>
      <div
        className="simple-progress__fill"
        style={{ width: `${p}%`, height: "100%", background: strokeColor, transition: "width .2s" }}
      />
    </div>
  );
}

export default function StorageBar({ onExpand }) {
  const pct = Math.round((storage.used / storage.total) * 100);
  const overLimit = pct >= 80;

  return (
    <footer className={`storage-bar${overLimit ? " storage-bar--warn" : ""}`}>
      <div className="storage-info">
        <IconPlusIcPublicDisk iconSize="1rem" iconColor={['currentcolor']} />
        <span className="storage-label">空间用量</span>
        {overLimit && (
          <span className="storage-warn">
            <IconPlusIcPublicAlert iconSize="0.875rem" iconColor={['currentcolor']} />
            存储空间已超过 80%，建议扩容或清理
          </span>
        )}
      </div>

      <div className="storage-meter">
        <SimpleProgress
          percent={pct}
          strokeColor={overLimit ? "#F4840C" : "#0067D1"}
          trailColor="#DFDFDF"
        />
        <span className="storage-usage">
          <strong>{storage.used}</strong> / {storage.total} {storage.unit}
          <em className="storage-pct">（{pct}%）</em>
        </span>
      </div>

      <Button onClick={onExpand} leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} text="扩容" />
    </footer>
  );
}
