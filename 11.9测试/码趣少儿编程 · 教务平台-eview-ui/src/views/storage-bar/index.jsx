import ProgressBar from "eview-ui/ProgressBar";
import Button from "eview-ui/Button";
import Icon from "@/shared/Icon";
import { storage } from "../../mock/drive.js";
import "./index.css";

export default function StorageBar({ onExpand }) {
  const pct = Math.round((storage.used / storage.total) * 100);
  const overLimit = pct >= 80;

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
        <ProgressBar
          current={pct}
          barStyle={overLimit ? { background: "#F4840C" } : { background: "#0067D1" }}
        />
        <span className="storage-usage">
          <strong>{storage.used}</strong> / {storage.total} {storage.unit}
          <em className="storage-pct">（{pct}%）</em>
        </span>
      </div>

      <Button onClick={onExpand}>
        <Icon name="hard-drive-download" size="0.875rem" />
        <span style={{ marginLeft: "0.25rem" }}>扩容</span>
      </Button>
    </footer>
  );
}
