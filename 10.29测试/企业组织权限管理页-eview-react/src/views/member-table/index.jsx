import { useMemo, useState } from "react";
import { IconPlusIcDigitalPowerDpMove, IconPlusIcDigitalPowerDpUserCluster, IconPlusIcPublicBrush, IconPlusIcPublicEllipsis, IconPlusIcPublicInfo, IconPlusIcPublicKey, IconPlusIcPublicPause, IconPlusIcPublicPlayCircle, IconPlusIcPublicSearch } from '@hui/icon-plus';
import Table from "@nce/eview-react/Table";
import Tag from "@/shared/Tag";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import Checkbox from "@nce/eview-react/Checkbox";
import ActionMenu from "../../components/action-menu/index.jsx";
import { useApp } from "../../context.jsx";
import RoleTag from "../../components/role-tag/index.jsx";
import StatusDot from "../../components/status-dot/index.jsx";

import { orgNodeMap } from "../../mock/organization.js";
import "./index.css";

// 鎿嶄綔鍒楄彍鍗曢」 鈥?缂栬緫 / 鍋滅敤 / 杞Щ / 閲嶇疆瀵嗙爜
function makeRowMenu(member, ctx) {
  const { setDrawerMemberId, setModal } = ctx;
  const items = [
    { key: "edit", label: "缂栬緫", icon: <IconPlusIcPublicBrush iconSize="0.875rem" iconColor={['currentcolor']} /> },
    {
      key: "toggle",
      label: member.status === "active" ? "鍋滅敤" : "鍚敤",
      icon: member.status === "active" ? <IconPlusIcPublicPause iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicPlayCircle iconSize="0.875rem" iconColor={['currentcolor']} />,
    },
    { key: "transfer", label: "杞Щ", icon: <IconPlusIcDigitalPowerDpMove iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { key: "reset", label: "閲嶇疆瀵嗙爜", icon: <IconPlusIcPublicKey iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { type: "divider" },
    { key: "detail", label: "鏌ョ湅璇︽儏", icon: <IconPlusIcPublicInfo iconSize="0.875rem" iconColor={['currentcolor']} /> },
  ];
  return {
    items,
    onMenuClick: (key) => {
      if (key === "detail" || key === "edit") setDrawerMemberId(member.id);
      else if (key === "transfer") setModal("transfer");
    },
  };
}

export default function MemberTable() {
  const roleFilterOptions = Object.entries(roleConfig).map(([k, v]) => ({ text: v.label, value: k }));
  const statusFilterOptions = [
    { text: "在职", value: "active" },
    { text: "停用", value: "suspended" },
    { text: "离职", value: "left" },
  ];
  const [roleFilter, setRoleFilter] = useState(roleFilterOptions[0] && roleFilterOptions[0].value);
  const [statusFilter, setStatusFilter] = useState(statusFilterOptions[0].value);
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

  // 琛ㄦ牸绛涢€夊尯
  const filters = (
    <div className="member-table__filters">
      <TextField
        placeholder="鎼滅储濮撳悕鎴栧伐鍙?
        suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />}
        style={{ width: "14rem" }}
      />
      <Select
        defaultLabel="瑙掕壊"
        enableClear
        style={{ width: "9rem" }}
        value={roleFilter}
        onChange={(v) => setRoleFilter(v)}
        options={roleFilterOptions}
      />
      <Select
        defaultLabel="鐘舵€?
        enableClear
        style={{ width: "8rem" }}
        value={statusFilter}
        onChange={(v) => setStatusFilter(v)}
        options={statusFilterOptions}
      />
    </div>
  );

  const columns = useMemo(
    () => [
      {
        title: "濮撳悕",
        key: "name",
        width: 200,
        allowSort: true,
        render: (cell, _rowData, _opts, row) => {
          const r = row && row.rawData;
          return (
            <a
              className="member-table__name"
              onClick={(e) => {
                e.preventDefault();
                setDrawerMemberId(r && r.id);
              }}
            >
              <img src={r && r.avatar} alt="" className="member-table__avatar" />
              <span className="member-table__name-text">{r && r.name}</span>
              <span className="member-table__title-sub">{r && r.title}</span>
            </a>
          );
        },
      },
      { title: "宸ュ彿", key: "employeeId", width: 120, allowSort: true },
      {
        title: "瑙掕壊",
        key: "role",
        width: 120,
        allowSort: false,
        render: (v) => <RoleTag role={v} />,
      },
      { title: "鐩村睘涓婄骇", key: "supervisor", width: 140, allowSort: true },
      {
        title: "鐘舵€?,
        key: "status",
        width: 100,
        allowSort: false,
        render: (v) => <StatusDot status={v} />,
      },
      { title: "鏈€杩忔椿璺?", key: "lastActive", width: 160, allowSort: true },
      {
        title: "鎿嶄綔",
        key: "action",
        width: 72,
        align: "left",
        allowSort: false,
        render: (cell, _rowData, _opts, row) => {
          const r = row && row.rawData;
          const menu = makeRowMenu(r, { setDrawerMemberId, setModal });
          return (
            <ActionMenu items={menu.items} onMenuClick={menu.onMenuClick} placement="bottomRight">
              <button type="button" className="member-table__action-btn" title="鏇村鎿嶄綏">
                <IconPlusIcPublicEllipsis iconSize="1rem" iconColor={['var(--on-surface-variant)']} />
              </button>
            </ActionMenu>
          );
        },
      },
    ],
    [roleConfig, setDrawerMemberId, setModal]
  );

  const pagingProps = {
    pageSize: 10,
    pageSizeOptions: [10, 20, 50],
  };

  // eview Table check uses row indexes; derive from selectedRowKeys (member ids).
  const checkedIndexes = viewMode === "admin" ? selectedRowKeys.map((id) => currentMembers.findIndex((m) => m.id === id)).filter((i) => i >= 0) : [];
  const disableCheckboxIds = viewMode === "admin" ? currentMembers.filter((m) => m.status === "left").map((m) => m.id) : [];

  return (
    <div className="member-table">
      <div className="member-table__head">
        <div className="member-table__head-left">
          <h3 className="member-table__title">
            <IconPlusIcDigitalPowerDpUserCluster iconSize="1.25rem" iconColor={['currentcolor']} />
            鎴愬憳鍒楄〃
          </h3>
          <span className="member-table__count">
            <Tag bordered={false} color="blue">{currentDept?.title || "鈥?}</Tag>
            <span className="member-table__count-text">鍏?{currentMembers.length} 浜?/span>
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
          disableCheckboxIds={disableCheckboxIds}
          onRowCheck={(_row, checkedRows) => setSelectedRowKeys(checkedRows.map((i) => currentMembers[i] && currentMembers[i].id).filter(Boolean))}
          onHeaderCheck={(checkedRows) => setSelectedRowKeys(checkedRows.map((i) => currentMembers[i] && currentMembers[i].id).filter(Boolean))}
          enablePagination
          enableAutoPaging
          pagingProps={pagingProps}
          enableZebraCrossing={false}
          enableColumnCompareUpdate
          emptyTableMsg="鏆傛棤鎴愬憳"
          width="unset"
          onRowClick={(row) => { if (row && row.rawData && row.rawData.id) setDrawerMemberId(row.rawData.id); }}
        />
      </div>
    </div>
  );
}
