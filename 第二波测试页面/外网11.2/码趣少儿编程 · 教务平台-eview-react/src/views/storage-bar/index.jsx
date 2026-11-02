import Button from "@nce/eview-react/Button";
import { IconPlusIcIctHardIsk, IconPlusIcPublicAlert, IconPlusIcPublicDownload } from '@hui/icon-plus';
import { storage } from "../../mock/drive.js";
import "./index.css";

function SimpleProgress({ percent, status = 'normal', strokeColor, trailColor, showInfo = true }) {
  const color = strokeColor || (status === 'exception' ? '#F4840C' : status === 'success' ? '#62B42E' : '#0067D1');
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, height: '8px', background: trailColor || 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${p}%`, height: '100%', background: color, transition: 'width .2s' }} />
      </div>
      {showInfo && <span style={{ minWidth: '40px', textAlign: 'right' }}>{p}%</span>}
    </div>
  );
}

export default function StorageBar({ onExpand }) {
  const pct = Math.round((storage.used / storage.total) * 100);
  const overLimit = pct >= 80;
  const status = overLimit ? "exception" : "normal";

  return (
    <footer className={`storage-bar${overLimit ? " storage-bar--warn" : ""}`}>
      <div className="storage-info">
        <IconPlusIcIctHardIsk iconSize="1rem" iconColor={['currentcolor']} />
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

      <Button text="扩容" leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={onExpand} />
    </footer>
  );
}
