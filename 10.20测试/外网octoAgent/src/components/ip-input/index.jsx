import TextField from "@/shared/TextField";
import "./index.css";

export default function IpInput({ withRange = false, defaultSegments = ["192", "168", "1", "1"] }) {
  const SegmentGroup = () => (
    <div className="ip-segment-group">
      {defaultSegments.map((seg, i) => (
        <span key={i} className="ip-segment-wrap">
          <TextField
            defaultValue={seg}
            className="ip-segment-input"
            size="small"
          />
          {i < defaultSegments.length - 1 && <span className="ip-dot">·</span>}
        </span>
      ))}
    </div>
  );

  return (
    <div className="ip-input-group">
      <SegmentGroup />
      {withRange && (
        <>
          <span className="ip-dash">—</span>
          <SegmentGroup />
        </>
      )}
    </div>
  );
}
