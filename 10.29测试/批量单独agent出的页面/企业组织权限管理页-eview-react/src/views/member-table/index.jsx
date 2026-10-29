import { useMemo } from "react";
import { IconPlusIcIctMoveLeftAndRight, IconPlusIcPublicEllipsis, IconPlusIcPublicInfo, IconPlusIcPublicPauseCircle, IconPlusIcPublicPlayCircle, IconPlusIcPublicKeyRound, IconPlusIcPublicPencil, IconPlusIcPublicSearch, IconPlusIcPublicUsers } from '@hui/icon-plus';
import Table from "@nce/eview-react/Table";
import Tag from "@/shared/Tag";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import DropdownMenu from "../../components/dropdown-menu/index.jsx";
import { useApp } from "../../context.jsx";
import RoleTag from "../../components/role-tag/index.jsx";
import StatusDot from "../../components/status-dot/index.jsx";
import { orgNodeMap } from "../../mock/organization.js";
import "./index.css";

// 操作列菜单项 — 编辑 / 停用 / 转移 / 重置密码
function makeRowMenu(member, ctx) {
  const { setDrawerMemberId, setModal } = ctx;
  const items = [
    { key: "edit", label: "编辑", icon: <IconPlusIcPublicPencil iconSize="0.875rem" iconColor={['currentcolor']} /> },
    {
      key: "toggle",
      label: member.status === "active" ? "停用" : "启用",
      icon: member.status === "active"
        ? <IconPlusIcPublicPauseCircle iconSize="0.875rem" iconColor={['currentcolor']} />
        : <IconPlusIcPublicPlayCircle iconSize="0.875rem" iconColor={['currentcolor']} />,
    },
    { key: "transfer", label: "转移", icon: <IconPlusIcIctMoveLeftAndRight iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { key: "reset", label: "重置密码", icon: <IconPlusIcPublicKeyRound iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { type: "divider" },
    { key: "detail", label: "查看详情", icon: <IconPlusIcPublicInfo iconSize="0.875rem" iconColor={['currentcolor']} /> },
  ];
  return {
    items,
    onSelect: (key) => {
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
      <TextField
        enableClear
        placeholder="搜索姓名或工号"
        suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />}
        style={{ width: "14rem" }}
      />
      <Select
        defaultLabel="角色"
        enableClear
        style={{ width: "9rem" }}
        data={Object.entries(roleConfig).map(([k, v]) => ({ value: k, text: v.label }))}
      />
      <Select
        defaultLabel="状态"
        enableClear
        style={{ width: "8rem" }}
        data={[
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
        sorter: (a, b) => String(a?.name).localeCompare(String(b?.name), "zh"),
        render: (cell, _rowData, _opts, row) => {
          const r = row?.rawData;
          return (
            <a
              className="member-table__name"
              onClick={(e) => {
                e.preventDefault();
                if (r?.id) setDrawerMemberId(r.id);
              }}
            >
              <img src={r?.avatar} alt="" className="member-table__avatar" />
              <span className="member-table__name-text">{r?.name}</span>
              <span className="member-table__title-sub">{r?.title}</span>
            </a>
          );
        },
      },
      { title: "工号", key: "employeeId", width: 120, sorter: (a, b) => String(a?.employeeId).localeCompare(String(b?.employeeId)) },
      {
        title: "角色",
        key: "role",
        width: 120,
        allowSort: false,
        render: (cell) => <RoleTag role={cell} />,
      },
      { title: "直属上级", key: "supervisor", width: 140, sorter: (a, b) => String(a?.supervisor).localeCompare(String(b?.supervisor)) },
      {
        title: "状态",
        key: "status",
        width: 100,
        allowSort: false,
        render: (cell) => <StatusDot status={cell} />,
      },
      { title: "最近活跃", key: "lastActive", width: 160, sorter: (a, b) => String(a?.lastActive).localeCompare(String(b?.lastActive)) },
      {
        title: "操作",
        key: "action",
        width: 72,
        align: "left",
        allowSort: false,
        render: (cell, _rowData, _opts, row) => {
          const r = row?.rawData;
          if (!r) return null;
          const menu = makeRowMenu(r, { setDrawerMemberId, setModal });
          return (
            <DropdownMenu items={menu.items} onSelect={menu.onSelect} placement="bottomRight">
              <button type="button" className="member-table__action-btn" title="更多操作">
                <IconPlusIcPublicEllipsis iconSize="1rem" iconColor={['var(--on-surface-variant)']} />
              </button>
            </DropdownMenu>
          );
        },
      },
    ],
    [roleConfig, setDrawerMemberId, setModal]
  );

  // 选中行（成员 id）↔ 行序号的换算
  const checkedIndexes = useMemo(
    () => selectedRowKeys.map((id) => currentMembers.findIndex((m) => m.id === id)).filter((i) => i >= 0),
    [selectedRowKeys, currentMembers]
  );
  const onCheckChange = (checkedRows) => {
    setSelectedRowKeys(checkedRows.map((i) => currentMembers[i]?.id).filter(Boolean));
  };

  return (
    <div className="member-table">
      <div className="member-table__head">
        <div className="member-table__head-left">
          <h3 className="member-table__title">
            <IconPlusIcPublicUsers iconSize="1.25rem" iconColor={['currentcolor']} />
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
          enableCheckBox={viewMode === "admin"}
          checkType="multi"
          checkedRows={checkedIndexes}
          onRowCheck={(_row, checkedRows) => onCheckChange(checkedRows)}
          onHeaderCheck={(checkedRows) => onCheckChange(checkedRows)}
          enablePagination
          enableAutoPaging
          pageSize={10}
          pageSizeOptions={[10, 20, 50]}
          enableZebraCrossing={false}
          enableColumnCompareUpdate
          width="unset"
          onDoubleClick={(row) => {
            const id = row?.rawData?.id;
            if (id) setDrawerMemberId(id);
          }}
        />
      </div>
    </div>
  );
}
