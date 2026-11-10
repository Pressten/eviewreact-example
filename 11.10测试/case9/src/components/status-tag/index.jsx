import { Tag } from "antd";
import "./index.css";

// Layer 3 公共组件 — 状态标签族
//   LevelTag      告警级别（P0/P1/P2/P3，实心色块）
//   AlarmStatusTag 告警状态（触发中/已认领/已静默/已恢复，软底色）
//   ResultTag     处置/发布结果（成功/失败/已回滚/跟进中，软底色分色）
const LEVEL_CLASS = { P0: "noc-lvl-p0", P1: "noc-lvl-p1", P2: "noc-lvl-p2", P3: "noc-lvl-p3" };
const LEVEL_LABEL = { P0: "P0 严重", P1: "P1 高危", P2: "P2 一般", P3: "P3 提示" };
const STATUS_CLASS = { firing: "noc-st-firing", claimed: "noc-st-claimed", silenced: "noc-st-silenced", resolved: "noc-st-resolved" };
const STATUS_LABEL = { firing: "触发中", claimed: "已认领", silenced: "已静默", resolved: "已恢复" };
const RESULT_CLASS = { success: "noc-rs-success", failed: "noc-rs-failed", rollback: "noc-rs-rollback", ongoing: "noc-rs-ongoing" };
const RESULT_LABEL = { success: "成功", failed: "失败", rollback: "已回滚", ongoing: "跟进中" };

export function LevelTag({ level }) {
  return <Tag className={`noc-tag ${LEVEL_CLASS[level] || "noc-lvl-p3"}`}>{LEVEL_LABEL[level] || level}</Tag>;
}

export function AlarmStatusTag({ status }) {
  return <Tag className={`noc-tag ${STATUS_CLASS[status] || "noc-st-silenced"}`}>{STATUS_LABEL[status] || status}</Tag>;
}

export function ResultTag({ result }) {
  return <Tag className={`noc-tag ${RESULT_CLASS[result] || "noc-rs-ongoing"}`}>{RESULT_LABEL[result] || result}</Tag>;
}
