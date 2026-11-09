import TablePro from "eview-ui/TablePro";
import Tag from "eview-ui/Tag";
import Icon from "@/shared/Icon";
import SectionCard from "../../components/section-card/index.jsx";
import { CHANGES } from "../../mock/monitor.js";
import "./index.css";

const RESULT_TAG = {
  success: { color: "success", label: "成功" },
  failed: { color: "danger", label: "失败" },
  rollback: { color: "warning", label: "回滚" },
};

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
      render: (res) => {
        const t = RESULT_TAG[res];
        return (
          <Tag type="status" color={t.color} className="change-result-tag">
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
      <TablePro
        size="normal"
        rowKey="id"
        columns={columns}
        dataset={CHANGES}
        columnResizable={false}
        pagination={false}
        expansion={{
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
