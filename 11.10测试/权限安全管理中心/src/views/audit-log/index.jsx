import { useState } from "react";
import { Table, Tag, Drawer } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { AUDIT_LOGS, AUDIT_ACTIONS, AUDIT_RESULTS, ACTION_TAG_COLOR } from "../../mock/audit.js";
import { PERM_MODULES } from "../../mock/perm.js";
import "./index.css";

export default function AuditLog() {
  const [detail, setDetail] = useState(null);

  const columns = [
    {
      title: "时间",
      dataIndex: "time",
      key: "time",
      width: 164,
      sorter: (a, b) => a.time.localeCompare(b.time),
      defaultSortOrder: "descend",
      render: (time) => <span className="mono-text">{time}</span>,
    },
    {
      title: "操作人",
      dataIndex: "userName",
      key: "userName",
      width: 112,
      sorter: (a, b) => a.userName.localeCompare(b.userName, "zh"),
      render: (name) => (
        <div className="audit-user">
          <img className="audit-avatar" src="./assets/uploads/user.png" alt="" />
          <span>{name}</span>
        </div>
      ),
    },
    {
      title: "对象模块",
      dataIndex: "permModule",
      key: "permModule",
      filters: PERM_MODULES.map((m) => ({ text: m.moduleName, value: m.moduleName })),
      onFilter: (value, record) => record.permModule === value,
    },
    {
      title: "动作",
      dataIndex: "auditAction",
      key: "auditAction",
      width: 80,
      filters: AUDIT_ACTIONS.map((a) => ({ text: a, value: a })),
      onFilter: (value, record) => record.auditAction === value,
      render: (action) => <Tag color={ACTION_TAG_COLOR[action] || "default"}>{action}</Tag>,
    },
    {
      title: "IP 地址",
      dataIndex: "ip",
      key: "ip",
      width: 124,
      render: (ip) => <span className="mono-text">{ip}</span>,
    },
    {
      title: "结果",
      dataIndex: "result",
      key: "result",
      width: 84,
      filters: AUDIT_RESULTS.map((r) => ({ text: r, value: r })),
      onFilter: (value, record) => record.result === value,
      render: (result) => (result === "成功" ? <Tag color="success">成功</Tag> : <Tag color="error">失败</Tag>),
    },
  ];

  return (
    <section className="pc-card audit-card">
      <div className="section-head">
        <span className="section-icon"><Icon name="scroll-text" size="1.125rem" /></span>
        <div>
          <div className="section-title">操作审计日志</div>
          <div className="section-sub">2026-11-04 ~ 2026-11-09 关键操作回溯，点击行查看完整审计详情，失败记录以红色标识</div>
        </div>
      </div>
      <Table
        className="audit-table"
        size="middle"
        rowKey="auditId"
        columns={columns}
        dataSource={AUDIT_LOGS}
        sortDirections={["ascend", "descend", "ascend"]}
        showSorterTooltip={false}
        rowClassName={(record) => (record.result === "失败" ? "audit-row-fail row-click" : "row-click")}
        onRow={(record) => ({ onClick: () => setDetail(record) })}
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          showQuickJumper: { goButton: "跳转" },
          showTotal: (total) => `总记录数：${total}`,
        }}
      />
      <Drawer
        open={!!detail}
        onClose={() => setDetail(null)}
        title="审计详情"
        width={420}
      >
        {detail && (
          <div className="audit-drawer">
            <div className={"ad-head" + (detail.result === "失败" ? " fail" : "")}>
              <div className="ad-title">
                {detail.userName} · {detail.permModule}
              </div>
              <div className="ad-tags">
                <Tag color={ACTION_TAG_COLOR[detail.auditAction]}>{detail.auditAction}</Tag>
                {detail.result === "成功" ? <Tag color="success">成功</Tag> : <Tag color="error">失败</Tag>}
              </div>
            </div>
            <div className="md-grid">
              <div className="md-item"><span className="md-label">记录编号</span><span className="mono-text">{detail.auditId}</span></div>
              <div className="md-item"><span className="md-label">操作时间</span><span className="mono-text">{detail.time}</span></div>
              <div className="md-item"><span className="md-label">操作人</span><span>{detail.userName}</span></div>
              <div className="md-item"><span className="md-label">对象模块</span><span>{detail.permModule}</span></div>
              <div className="md-item"><span className="md-label">操作动作</span><span>{detail.auditAction}</span></div>
              <div className="md-item"><span className="md-label">来源 IP</span><span className="mono-text">{detail.ip}</span></div>
              <div className="md-item"><span className="md-label">执行结果</span><span>{detail.result}</span></div>
            </div>
            {detail.result === "失败" && (
              <div className="ad-note">
                <Icon name="circle-alert" size="0.875rem" className="ad-note-icon" />
                失败原因：目标对象处于锁定状态或操作人缺少对应操作权限，已记录并通知安全管理员复核。
              </div>
            )}
          </div>
        )}
      </Drawer>
    </section>
  );
}
