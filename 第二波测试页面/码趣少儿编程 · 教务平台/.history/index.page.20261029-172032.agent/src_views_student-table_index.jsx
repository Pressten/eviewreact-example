// Layer 4: 学员列表表格（含续费高亮、进度、状态、操作）
import { Table, Tag, Progress } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { RENEWAL_THRESHOLD } from "../../mock/student.js";
import "./index.css";

const isLow = (r) => r.remainingHours < RENEWAL_THRESHOLD && r.status !== "结业";

const STATUS_COLOR = { 在读: "success", 请假: "warning", 结业: "default" };

function buildColumns(onView) {
  return [
    {
      title: "学员",
      dataIndex: "name",
      key: "name",
      render: (_, r) => (
        <div className="student-cell">
          <img className="student-cell__avatar" src={r.avatar} alt="" />
          <div className="student-cell__info">
            <a className="student-cell__name" onClick={() => onView(r)}>{r.name}</a>
            <span className="student-cell__sub">{r.id} · {r.parentPhone}</span>
          </div>
        </div>
      ),
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
      width: 72,
      align: "right",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "课程",
      dataIndex: "courseLabel",
      key: "course",
    },
    {
      title: "班级",
      dataIndex: "classLabel",
      key: "class",
    },
    {
      title: "剩余课时",
      dataIndex: "remainingHours",
      key: "hours",
      width: 120,
      align: "right",
      sorter: (a, b) => a.remainingHours - b.remainingHours,
      render: (_, r) => (
        <div className="hours-cell">
          <div className="hours-cell__main">
            <span className={"hours-cell__num" + (isLow(r) ? " is-low" : "")}>{r.remainingHours}</span>
            <span className="hours-cell__total">/ {r.totalHours}</span>
          </div>
          {isLow(r) && <Tag color="error" className="hours-cell__tag">待续费</Tag>}
        </div>
      ),
    },
    {
      title: "学习进度",
      dataIndex: "progress",
      key: "progress",
      width: 168,
      sorter: (a, b) => a.progress - b.progress,
      render: (_, r) => (
        <Progress percent={r.progress} size="small" status={r.progress >= 100 ? "success" : "active"} />
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 88,
      render: (v) => <Tag color={STATUS_COLOR[v] || "default"}>{v}</Tag>,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 72,
      render: (_, r) => (
        <Icon name="eye" size="0.875rem" className="student-action" title="查看详情" onClick={() => onView(r)} />
      ),
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
            <Icon name="triangle-alert" size="0.875rem" /> {lowCount} 名学员课时不足，需提醒续费
          </span>
        )}
      </div>
      <Table
        className="stu-table"
        size="large"
        rowKey="id"
        columns={buildColumns(onView)}
        dataSource={students}
        sortDirections={["ascend", "descend", "ascend"]}
        showSorterTooltip={false}
        pagination={{
          showTotal: (total, range) => `总记录数：${total}`,
          showSizeChanger: true,
          showQuickJumper: { goButton: "跳转" },
          pageSize: 10,
          pageSizeOptions: [10, 20, 50],
        }}
      />
    </div>
  );
}
