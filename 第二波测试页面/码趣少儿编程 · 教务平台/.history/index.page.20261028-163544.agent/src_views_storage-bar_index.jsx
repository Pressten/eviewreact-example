import { Progress, Button } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { storage } from "../../mock/drive.js";
import "./index.css";

export default function StorageBar({ onExpand }) {
  const pct = Math.round((storage.used / storage.total) * 100);
  const overLimit = pct >= 80;
  const status = overLimit ? "exception" : "normal";

  return (
    <footer className={`storage-bar${overLimit ? " storage-bar--warn" : ""}`}>
      <div className="storage-info">
        <Icon name="hard-drive" size="1rem" />
        <span className="storage-label">空间用量</span>
        {overLimit && (
          <span className="storage-warn">
            <Icon name="triangle-alert" size="0.875rem" />
            存储空间已超过 80%，建议扩容或清理
          </span>
        )}
      </div>

      <div className="storage-meter">
        <Progress
          percent={pct}
          status={status}
          strokeColor={overLimit ? "#F4840C" : "#0067D1"}
          trailColor="#DFDFDF"
          showInfo={false}
        />
        <span className="storage-usage">
          <strong>{storage.used}</strong> / {storage.total} {storage.unit}
          <em className="storage-pct">（{pct}%）</em>
        </span>
      </div>

      <Button onClick={onExpand} icon={<Icon name="hard-drive-download" size="0.875rem" />}>
        扩容
      </Button>
    </footer>
  );
}
