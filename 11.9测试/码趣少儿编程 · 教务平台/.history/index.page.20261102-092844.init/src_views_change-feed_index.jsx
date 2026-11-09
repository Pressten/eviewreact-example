import { Table, Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { CHANGES } from "../../mock/monitor.js";
import "./index.css";

const RESULT_TAG = {
  success: { color: "success", label: "成功" },
  failed: { color: "error", label: "失败" },
  rollback: { color: "warning", label: "回滚" },
};

// 区块⑧ 变更动态：今日 4 条发布；失败 / 回滚行可展开查看说明
export default function ChangeFeed() {
  const columns = [
    {
      title: "服务",
      dataIndex: "service",
      key: "service",
      render: (s) => <span className="change-service">{s}</span>,
    },
    {
      title: "版本号",
      dataIndex: "version",
      key: "version",
      render: (v) => <span className="change-version">{v}</span>,
    },
    {
      title: "负责人",
      dataIndex: "owner",
      key: "owner",
    },
    {
      title: "结果",
      dataIndex: "result",
      key: "result",
      filters: [
        { text: "成功", value: "success" },
        { text: "失败", value: "failed" },
        { text: "回滚", value: "rollback" },
      ],
      onFilter: (value, r) => r.result === value,
      render: (res) => {
        const t = RESULT_TAG[res];
        return (
          <Tag color={t.color} bordered={false} className="change-result-tag">
            {t.label}
          </Tag>
        );
      },
    },
    {
      title: "时间",
      dataIndex: "time",
      key: "time",
      width: 80,
    },
  ];

  return (
    <SectionCard title="变更动态" subtitle="今日 4 条发布" icon="git-pull-request">
      <Table
        size="middle"
        rowKey="id"
        columns={columns}
        dataSource={CHANGES}
        sortDirections={["ascend", "descend", "ascend"]}
        showSorterTooltip={false}
        pagination={false}
        expandable={{
          defaultExpandedRowKeys: ["C2"],
          rowExpandable: (r) => r.result === "failed" || r.result === "rollback",
          expandedRowRender: (r) => (
            <div className="change-expand">
              <div className="change-expand-head">
                <Icon name="rotate-ccw" size="0.875rem" />
                <span>{r.result === "failed" ? "失败说明与回滚处理" : "回滚说明"}</span>
              </div>
              <p className="change-reason">{r.rollbackReason}</p>
            </div>
          ),
        }}
      />
    </SectionCard>
  );
}
