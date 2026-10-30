// Layer 4: 学员列表表格（含续费高亮、进度、状态、操作）
import Table from "@nce/eview-react/Table";
import { IconPlusIcPublicEye, IconPlusIcPublicAlert } from '@hui/icon-plus';
import Tag from "@/shared/Tag";
import { RENEWAL_THRESHOLD } from "../../mock/student.js";
import "./index.css";

const isLow = (r) => r.remainingHours < RENEWAL_THRESHOLD && r.status !== "结业";

const STATUS_COLOR = { 在读: "success", 请假: "warning", 结业: "default" };

// 简单进度条（手写，替代 antd Progress）
function SimpleProgress({ percent, status = "normal" }) {
  const color =
    status === "success"
      ? "var(--success, #62B42E)"
      : status === "active"
        ? "var(--primary, #0067D1)"
        : "var(--error, #E02128)";
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div className="simple-progress" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        className="simple-progress__track"
        style={{
          flex: 1,
          height: "8px",
          background: "var(--hover, rgba(0,0,0,0.05))",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          className="simple-progress__fill"
          style={{ width: `${p}%`, height: "100%", background: color, transition: "width .2s" }}
        />
      </div>
      <span className="simple-progress__text" style={{ minWidth: "40px", textAlign: "right" }}>
        {p}%
      </span>
    </div>
  );
}

function buildColumns(onView) {
  return [
    {
      title: "学员",
      key: "name",
      render: (_cell, _rd, _opt, row) => {
        const r = row?.rawData || {};
        return (
          <div className="student-cell">
            <img className="student-cell__avatar" src={r.avatar} alt="" />
            <div className="student-cell__info">
              <a className="student-cell__name" onClick={() => onView(r)}>{r.name}</a>
              <span className="student-cell__sub">{r.id} · {r.parentPhone}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "年龄",
      key: "age",
      width: 72,
      align: "right",
    },
    {
      title: "课程",
      key: "course",
      allowSort: false,
    },
    {
      title: "班级",
      key: "class",
      allowSort: false,
    },
    {
      title: "剩余课时",
      key: "hours",
      width: 120,
      align: "right",
      render: (_cell, _rd, _opt, row) => {
        const r = row?.rawData || {};
        return (
          <div className="hours-cell">
            <span className={"hours-cell__num" + (isLow(r) ? " is-low" : "")}>{r.remainingHours}</span>
            <span className="hours-cell__total">/ {r.totalHours}</span>
            {isLow(r) && <Tag color="error" className="hours-cell__tag">待续费</Tag>}
          </div>
        );
      },
    },
    {
      title: "学习进度",
      key: "progress",
      width: 168,
      render: (_cell, _rd, _opt, row) => {
        const r = row?.rawData || {};
        return (
          <SimpleProgress percent={r.progress} status={r.progress >= 100 ? "success" : "active"} />
        );
      },
    },
    {
      title: "状态",
      key: "status",
      width: 88,
      allowSort: false,
      render: (v) => <Tag color={STATUS_COLOR[v] || "default"}>{v}</Tag>,
    },
    {
      title: "操作",
      key: "action",
      width: 72,
      allowSort: false,
      render: (_cell, _rd, _opt, row) => {
        const r = row?.rawData || {};
        return <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['currentcolor']} className="student-action" />;
      },
    },
  ];
}

export default function StudentTable({ students, onView }) {
  const lowCount = students.filter(isLow).length;

  return (
    <div className="table-card">
      <div className="table-card__head">
        <span className="table-card__title">学员列表</span>
        {lowCount > 0 && (
          <span className="table-card__hint">
            <IconPlusIcPublicAlert iconSize="0.875rem" iconColor={['currentcolor']} /> {lowCount} 名学员课时不足，需提醒续费
          </span>
        )}
      </div>
      <Table
        className="stu-table"
        size="large"
        columns={buildColumns(onView)}
        dataset={students}
        enableZebraCrossing={false}
        width="unset"
        enableColumnCompareUpdate
        enablePagination
        enableAutoPaging
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
}
