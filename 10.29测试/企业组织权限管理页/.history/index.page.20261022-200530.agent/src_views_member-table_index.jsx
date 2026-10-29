import { useMemo } from "react";
import { Table, Dropdown, Tag, Input, Select, Checkbox } from "antd";
import { useApp } from "../../context.jsx";
import RoleTag from "../../components/role-tag/index.jsx";
import StatusDot from "../../components/status-dot/index.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import { orgNodeMap } from "../../mock/organization.js";
import "./index.css";

// 操作列菜单项 — 编辑 / 停用 / 转移 / 重置密码
function makeRowMenu(member, ctx) {
  const { setDrawerMemberId, setModal } = ctx;
  const items = [
    { key: "edit", label: "编辑", icon: <Icon name="pencil" size="0.875rem" /> },
    {
      key: "toggle",
      label: member.status === "active" ? "停用" : "启用",
      icon: <Icon name={member.status === "active" ? "circle-pause" : "circle-play"} size="0.875rem" />,
    },
    { key: "transfer", label: "转移", icon: <Icon name="move-right" size="0.875rem" /> },
    { key: "reset", label: "重置密码", icon: <Icon name="key-round" size="0.875rem" /> },
    { type: "divider" },
    { key: "detail", label: "查看详情", icon: <Icon name="info" size="0.875rem" /> },
  ];
  return {
    items,
    onClick: ({ key }) => {
      if (key === "detail" || key === "edit") setDrawerMemberId(member.id);
      else if (key === "transfer") setModal("transfer");
    },
  };
}

export default function MemberTable() {
  const {
    currentMembers,
    currentDept,
    selectedDeptKey,
    selectedRowKeys,
    setSelectedRowKeys,
    setDrawerMemberId,
    setModal,
    roleConfig,
    viewMode,
  } = useApp();

  // 表格筛选区
  const filters = (
    <div className="member-table__filters">
      <Input
        allowClear
        placeholder="搜索姓名或工号"
        suffix={<Icon name="search" size="0.875rem" color="var(--on-surface-variant)" />}
        style={{ width: "14rem" }}
      />
      <Select
        placeholder="角色"
        allowClear
        style={{ width: "9rem" }}
        options={Object.entries(roleConfig).map(([k, v]) => ({ value: k, label: v.label }))}
      />
      <Select
        placeholder="状态"
        allowClear
        style={{ width: "8rem" }}
        options={[
          { value: "active", label: "在职" },
          { value: "suspended", label: "停用" },
          { value: "left", label: "离职" },
        ]}
      />
    </div>
  );

  const columns = useMemo(
    () => [
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
        width: 200,
        sorter: (a, b) => a.name.localeCompare(b.name, "zh"),
        render: (_, r) => (
          <a
            className="member-table__name"
            onClick={(e) => {
              e.preventDefault();
              setDrawerMemberId(r.id);
            }}
          >
            <img src={r.avatar} alt="" className="member-table__avatar" />
            <span className="member-table__name-text">{r.name}</span>
            <span className="member-table__title-sub">{r.title}</span>
          </a>
        ),
      },
      { title: "工号", dataIndex: "employeeId", key: "employeeId", width: 120, sorter: (a, b) => a.employeeId.localeCompare(b.employeeId) },
      {
        title: "角色",
        dataIndex: "role",
        key: "role",
        width: 120,
        filters: Object.entries(roleConfig).map(([k, v]) => ({ text: v.label, value: k })),
        onFilter: (val, r) => r.role === val,
        render: (v) => <RoleTag role={v} />,
      },
      { title: "直属上级", dataIndex: "supervisor", key: "supervisor", width: 140, sorter: (a, b) => a.supervisor.localeCompare(b.supervisor) },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: 100,
        filters: [
          { text: "在职", value: "active" },
          { text: "停用", value: "suspended" },
          { text: "离职", value: "left" },
        ],
        onFilter: (v, r) => r.status === v,
        render: (v) => <StatusDot status={v} />,
      },
      { title: "最近活跃", dataIndex: "lastActive", key: "lastActive", width: 160, sorter: (a, b) => a.lastActive.localeCompare(b.lastActive) },
      {
        title: "操作",
        key: "action",
        width: 72,
        align: "left",
        fixed: "right",
        render: (_, r) => (
          <Dropdown menu={makeRowMenu(r, { setDrawerMemberId, setModal })} placement="bottomRight" trigger={["click"]}>
            <button type="button" className="member-table__action-btn" title="更多操作">
              <Icon name="ellipsis" size="1rem" color="var(--on-surface-variant)" />
            </button>
          </Dropdown>
        ),
      },
    ],
    [roleConfig, setDrawerMemberId, setModal]
  );

  const pagination = {
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: { goButton: "跳转" },
    showTotal: (total, range) =>
      selectedRowKeys.length > 0
        ? `总记录数：${total} 已选中行数：${selectedRowKeys.length}`
        : `总记录数：${total}`,
  };

  // 审计员视角：禁用行选择与编辑入口
  const rowSelection =
    viewMode === "admin"
      ? {
          selectedRowKeys,
          onChange: setSelectedRowKeys,
          getCheckboxProps: (r) => ({ disabled: r.status === "left" }),
        }
      : null;

  return (
    <div className="member-table">
      <div className="member-table__head">
        <div className="member-table__head-left">
          <h3 className="member-table__title">
            <Icon name="users" size="1.25rem" />
            成员列表
          </h3>
          <span className="member-table__count">
            <Tag bordered={false} color="blue">{currentDept?.title || "—"}</Tag>
            <span className="member-table__count-text">共 {currentMembers.length} 人</span>
          </span>
        </div>
        {filters}
      </div>
      <div className="member-table__body">
        <Table
          size="large"
          rowKey="id"
          columns={columns}
          dataSource={currentMembers}
          rowSelection={rowSelection}
          pagination={pagination}
          sortDirections={["ascend", "descend", "ascend"]}
          showSorterTooltip={false}
          scroll={{ x: 920 }}
          onRow={(r) => ({ onDoubleClick: () => setDrawerMemberId(r.id) })}
        />
      </div>
    </div>
  );
}
