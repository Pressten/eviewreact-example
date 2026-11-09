import Tag from "eview-ui/Tag";
import { shareMeta } from "../../mock/drive.js";
import "./index.css";

const STATUS_COLOR = { private: "default", shared: "primary", public: "success" };

export default function ShareStatusTag({ status }) {
  const meta = shareMeta[status] || shareMeta.private;
  return <Tag type="status" color={STATUS_COLOR[status] || meta.color}>{meta.label}</Tag>;
}
