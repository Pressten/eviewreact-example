import { useMemo, useState } from "react";
import { IconPlusIcPublicEllipsis, IconPlusIcPublicInfo, IconPlusIcPublicBrush, IconPlusIcPublicPause, IconPlusIcPublicPlayCircle, IconPlusIcDigitalPowerDpMove, IconPlusIcPublicKey, IconPlusIcPublicTeams } from '@hui/icon-plus';
import Table from "@nce/eview-react/Table";
import PopUpMenu from "@nce/eview-react/PopUpMenu";
import Tag from "@/shared/Tag";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import { useApp } from "../../context.jsx";
import RoleTag from "../../components/role-tag/index.jsx";
import StatusDot from "../../components/status-dot/index.jsx";
import { orgNodeMap } from "../../mock/organization.js";
import "./index.css";

// 操作列菜单项 — 编辑 / 停用 / 转移 / 重置密码
function rowMenuOptions(member) {
  return [
    { id: "edit", text: "编辑", serialno: "edit", iconUrl: <IconPlusIcPublicBrush iconSize="0.875rem" iconColor={['currentcolor']} /> },
    {
      id: "toggle",
      text: member.status === "active" ? "停用" : "启用",
      serialno: "toggle",
      iconUrl: member.status === "active" ? <IconPlusIcPublicPause iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicPlayCircle iconSize="0.875rem" iconColor={['currentcolor']} />,
    },
    { id: "transfer", text: "转移", serialno: "transfer", iconUrl: <IconPlusIcDigitalPowerDpMove iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { id: "reset", text: "重置密码", serialno: "reset", iconUrl: <IconPlusIcPublicKey iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { id: "detail", text: "查看详情", serialno: "detail", iconUrl: <IconPlusIcPublicInfo iconSize="0.875rem" iconColor={['currentcolor']} /> },
  ];
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

  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // 表格筛选区
  const filters = (
    <div className="member-table__filters">
      <TextField
        placeholder="搜索姓名或工号"
        style={{ width: "14rem" }}
      />
      <Select
        defaultLabel="角色"
        enableClear
        value={roleFilter}
        onChange={(v) => setRoleFilter(v)}
        style={{ width: "9rem" }}
        options={[
          { value: "", text: "全部" },
          ...Object.entries(roleConfig).map(([k, v]) => ({ value: k, text: v.label })),
        ]}
      />
      <Select
        defaultLabel="状态"
        enableClear
        value={statusFilter}
        onChange={(v) => setStatusFilter(v)}
        style={{ width: "8rem" }}
        options={[
          { value: "", text: "全部" },
          { value: "active", text: "在职" },
          { value: "suspended", text: "停用" },
          { value: "left", text: "离职" },
        ]}
      />
    </div>
  );

  const columns = useMemo(
    () => [
      {
        title: "姓名",
        key: "name",
        width: 200,
        render: (cell, rowData, options, row) => {
          const r = row?.rawData;
          if (!r) return null;
          return (
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
          );
        },
      },
      { title: "工号", key: "employeeId", width: 120 },
      {
        title: "角色",
        key: "role",
        width: 120,
        allowSort: false,
        render: (cell) => <RoleTag role={cell} />,
      },
      { title: "直属上级", key: "supervisor", width: 140 },
      {
        title: "状态",
        key: "status",
        width: 100,
        allowSort: false,
        render: (cell) => <StatusDot status={cell} />,
      },
      { title: "最近活跃", key: "lastActive", width: 160 },
      {
        title: "操作",
        key: "action",
        width: 72,
        align: "left",
        allowSort: false,
        render: (cell, rowData, options, row) => {
          const r = row?.rawData;
          if (!r) return null;
          return (
            <PopUpMenu
              options={rowMenuOptions(r)}
              onClick={(evt) => {
                const key = evt.value;
                if (key === "detail" || key === "edit") setDrawerMemberId(r.id);
                else if (key === "transfer") setModal("transfer");
              }}
            >
              <button type="button" className="member-table__action-btn" title="更多操作">
                <IconPlusIcPublicEllipsis iconSize="1rem" iconColor={['var(--on-surface-variant)']} />
              </button>
            </PopUpMenu>
          );
        },
      },
    ],
    [setDrawerMemberId, setModal]
  );

  // 勾选行序号派生自 selectedRowKeys（member id 数组）
  const checkedIndexes = useMemo(() => {
    return currentMembers
      .map((m, i) => (selectedRowKeys.includes(m.id) ? i : -1))
      .filter((i) => i >= 0);
  }, [selectedRowKeys, currentMembers]);

  const handleCheck = (row, checkedRows) => {
    setSelectedRowKeys(checkedRows.map((i) => currentMembers[i]?.id).filter(Boolean));
  };
  const handleHeaderCheck = (checkedRows) => {
    setSelectedRowKeys(checkedRows.map((i) => currentMembers[i]?.id).filter(Boolean));
  };

  return (
    <div className="member-table">
      <div className="member-table__head">
        <div className="member-table__head-left">
          <h3 className="member-table__title">
            <IconPlusIcPublicTeams iconSize="1.25rem" iconColor={['currentcolor']} />
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
          columns={columns}
          dataset={currentMembers}
          enableColumnCompareUpdate
          enableZebraCrossing={false}
          width="unset"
          enablePagination
          enableAutoPaging
          pageSizeOptions={[10, 20, 50]}
          {...(viewMode === "admin"
            ? {
                enableCheckBox: true,
                checkType: "multi",
                checkedRows: checkedIndexes,
                onRowCheck: handleCheck,
                onHeaderCheck: handleHeaderCheck,
              }
            : {})}
          onDoubleClick={(evtRow, evtCell, e) => setDrawerMemberId(evtRow?.rawData?.id)}
        />
      </div>
    </div>
  );
}
