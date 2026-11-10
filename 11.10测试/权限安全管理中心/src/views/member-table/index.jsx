import { useMemo, useState } from "react";
import { Table, Tag, Badge, Select, Modal, Drawer, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { TEAM_INDEX, DEPTS, maskPhone } from "../../mock/org.js";
import { AUDIT_LOGS, ACTION_TAG_COLOR } from "../../mock/audit.js";
import "./index.css";

export default function MemberTable() {
  const {
    members, roles, activeRoleId, selectedDeptId,
    adjustMemberRole, removeMember,
  } = useApp();

  const [adjustTarget, setAdjustTarget] = useState(null); // 单个调整角色
  const [targetRoleId, setTargetRoleId] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [batchOpen, setBatchOpen] = useState(false); // 批量调整角色
  const [batchRoleId, setBatchRoleId] = useState(undefined);
  const [detailMember, setDetailMember] = useState(null); // 成员详情抽屉

  const activeRole = roles.find((r) => r.roleId === activeRoleId) || roles[0];

  const selectedNodeName = useMemo(() => {
    if (!selectedDeptId) return "";
    const dept = DEPTS.find((d) => d.deptId === selectedDeptId);
    if (dept) return dept.deptName;
    return TEAM_INDEX[selectedDeptId] ? TEAM_INDEX[selectedDeptId].teamName : "";
  }, [selectedDeptId]);

  const visibleMembers = useMemo(
    () =>
      members.filter((m) => {
        if (m.roleId !== activeRole.roleId) return false;
        if (!selectedDeptId) return true;
        const info = TEAM_INDEX[m.teamId];
        return info && (info.deptId === selectedDeptId || m.teamId === selectedDeptId);
      }),
    [members, activeRole.roleId, selectedDeptId]
  );

  // 当前可见且被勾选的成员（翻页/筛选后批量操作仅作用于可见勾选项）
  const selectedMembers = visibleMembers.filter((m) => selectedRowKeys.includes(m.memberId));

  const confirmRemove = (member) => {
    Modal.confirm({
      title: `确认移除成员「${member.userName}」？`,
      content: "移除后该成员将立即失去所有系统访问权限，组织架构人数同步扣减；如需恢复请重新邀请加入。",
      okText: "确认移除",
      okButtonProps: { danger: true },
      cancelText: "取消",
      onOk: () => {
        removeMember(member.memberId);
        message.success(`已移除成员「${member.userName}」，保存后正式生效`);
      },
    });
  };

  const confirmAdjust = () => {
    if (!adjustTarget || !targetRoleId) return;
    const role = roles.find((r) => r.roleId === targetRoleId);
    adjustMemberRole(adjustTarget.memberId, targetRoleId);
    message.success(`已将「${adjustTarget.userName}」调整为「${role.roleName}」，保存后正式生效`);
    setAdjustTarget(null);
    setTargetRoleId(undefined);
  };

  const confirmBatchRemove = () => {
    const names = selectedMembers.map((m) => m.userName);
    Modal.confirm({
      title: `确认批量移除 ${names.length} 名成员？`,
      content: `将移除：${names.join("、")}。移除后这些成员将失去所有系统访问权限，组织架构人数同步扣减。`,
      okText: "确认移除",
      okButtonProps: { danger: true },
      cancelText: "取消",
      onOk: () => {
        selectedMembers.forEach((m) => removeMember(m.memberId));
        setSelectedRowKeys([]);
        message.success(`已批量移除 ${names.length} 名成员，保存后正式生效`);
      },
    });
  };

  const confirmBatchAdjust = () => {
    if (!batchRoleId) return;
    const role = roles.find((r) => r.roleId === batchRoleId);
    selectedMembers.forEach((m) => adjustMemberRole(m.memberId, batchRoleId));
    setSelectedRowKeys([]);
    setBatchOpen(false);
    message.success(`已将 ${selectedMembers.length} 名成员批量调整为「${role.roleName}」，保存后正式生效`);
  };

  const memberAudits = useMemo(
    () => (detailMember ? AUDIT_LOGS.filter((a) => a.userName === detailMember.userName).slice(0, 5) : []),
    [detailMember]
  );

  const columns = [
    {
      title: "成员",
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName, "zh"),
      render: (name, record) => (
        <div className="member-cell">
          <img className="member-avatar" src="./assets/uploads/user.png" alt="" />
          <a onClick={() => setDetailMember(record)} title="查看成员详情">
            {name}
          </a>
        </div>
      ),
    },
    {
      title: "部门",
      key: "dept",
      filters: DEPTS.map((d) => ({ text: d.deptName, value: d.deptId })),
      onFilter: (value, record) => TEAM_INDEX[record.teamId] && TEAM_INDEX[record.teamId].deptId === value,
      render: (_, record) => {
        const info = TEAM_INDEX[record.teamId];
        return info ? `${info.deptName} / ${info.teamName}` : "-";
      },
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => <span className="mono-text">{maskPhone(phone)}</span>,
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "加入时间",
      dataIndex: "joinDate",
      key: "joinDate",
      width: 112,
      sorter: (a, b) => a.joinDate.localeCompare(b.joinDate),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 84,
      filters: [
        { text: "在职", value: "active" },
        { text: "停用", value: "disabled" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (status === "active" ? <Tag color="success">在职</Tag> : <Tag>停用</Tag>),
    },
    {
      title: "操作",
      key: "ops",
      width: 80,
      render: (_, record) => (
        <>
          <Icon
            name="user-cog"
            size="0.875rem"
            className="tbl-op"
            title="调整角色"
            onClick={(e) => {
              e.stopPropagation && e.stopPropagation();
              setAdjustTarget(record);
              setTargetRoleId(undefined);
            }}
          />
          <Icon
            name="trash-2"
            size="0.875rem"
            className="tbl-op"
            title="移除"
            onClick={(e) => {
              e.stopPropagation && e.stopPropagation();
              confirmRemove(record);
            }}
          />
        </>
      ),
    },
  ];

  const detailRoleName = detailMember ? (roles.find((r) => r.roleId === detailMember.roleId) || {}).roleName : "";
  const detailDept = detailMember ? TEAM_INDEX[detailMember.teamId] : null;

  return (
    <section className="pc-card member-card">
      <div className="section-head">
        <span className="section-icon"><Icon name="users" size="1.125rem" /></span>
        <div>
          <div className="section-title">
            角色成员 · {activeRole.roleName}
            <Badge
              className="member-count-badge"
              count={visibleMembers.length}
              overflowCount={999}
              style={{ backgroundColor: "var(--primary)" }}
            />
          </div>
          <div className="section-sub">
            {selectedDeptId
              ? `已按组织节点「${selectedNodeName}」筛选（点击左侧组织树节点可切换或清除筛选）`
              : "勾选成员可批量调整角色或移除，点击姓名查看成员详情与操作记录"}
          </div>
        </div>
      </div>

      {selectedMembers.length > 0 && (
        <div className="batch-bar">
          <span className="batch-count">
            已选 <b>{selectedMembers.length}</b> 项
          </span>
          <a onClick={() => { setBatchOpen(true); setBatchRoleId(undefined); }}>批量调整角色</a>
          <a className="danger-link" onClick={confirmBatchRemove}>批量移除</a>
          <a className="muted-link" onClick={() => setSelectedRowKeys([])}>取消选择</a>
        </div>
      )}

      <Table
        className="member-table"
        size="middle"
        rowKey="memberId"
        columns={columns}
        dataSource={visibleMembers}
        sortDirections={["ascend", "descend", "ascend"]}
        showSorterTooltip={false}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: { goButton: "跳转" },
          showTotal: (total) => `总记录数：${total} 已选中行数：${selectedRowKeys.length}`,
        }}
      />

      {/* 单个调整角色 */}
      <Modal
        open={!!adjustTarget}
        title={adjustTarget ? `调整「${adjustTarget.userName}」的角色` : "调整角色"}
        okText="确认调整"
        cancelText="取消"
        width={440}
        onOk={confirmAdjust}
        onCancel={() => {
          setAdjustTarget(null);
          setTargetRoleId(undefined);
        }}
        okButtonProps={{ disabled: !targetRoleId }}
      >
        <div className="adjust-form">
          <div className="adjust-meta">
            <Icon name="user-cog" size="1rem" className="adjust-icon" />
            当前角色：
            <Tag color="blue">{activeRole.roleName}</Tag>
            调整后将离开当前成员列表并计入目标角色人数。
          </div>
          <div className="rm-field">
            <label className="form-label required" htmlFor="adjust-role">目标角色</label>
            <Select
              id="adjust-role"
              value={targetRoleId}
              placeholder="请选择要调整到的角色"
              style={{ width: "100%" }}
              options={roles
                .filter((r) => r.roleId !== activeRole.roleId)
                .map((r) => ({ value: r.roleId, label: `${r.roleName}（${r.description.slice(0, 10)}…）` }))}
              onChange={setTargetRoleId}
            />
          </div>
        </div>
      </Modal>

      {/* 批量调整角色 */}
      <Modal
        open={batchOpen}
        title={`批量调整 ${selectedMembers.length} 名成员的角色`}
        okText="确认批量调整"
        cancelText="取消"
        width={440}
        onOk={confirmBatchAdjust}
        onCancel={() => setBatchOpen(false)}
        okButtonProps={{ disabled: !batchRoleId }}
      >
        <div className="adjust-form">
          <div className="adjust-meta">
            <Icon name="users" size="1rem" className="adjust-icon" />
            将批量调整：{selectedMembers.map((m) => m.userName).join("、")}，调整后立即计入目标角色人数。
          </div>
          <div className="rm-field">
            <label className="form-label required" htmlFor="batch-role">目标角色</label>
            <Select
              id="batch-role"
              value={batchRoleId}
              placeholder="请选择要调整到的角色"
              style={{ width: "100%" }}
              options={roles
                .filter((r) => r.roleId !== activeRole.roleId)
                .map((r) => ({ value: r.roleId, label: r.roleName }))}
              onChange={setBatchRoleId}
            />
          </div>
        </div>
      </Modal>

      {/* 成员详情抽屉 */}
      <Drawer
        open={!!detailMember}
        onClose={() => setDetailMember(null)}
        title={detailMember ? "成员详情" : ""}
        width={420}
      >
        {detailMember && (
          <div className="member-drawer">
            <div className="md-profile">
              <img className="md-avatar" src="./assets/uploads/user.png" alt="" />
              <div className="md-head">
                <div className="md-name">
                  {detailMember.userName}
                  {detailMember.status === "active" ? <Tag color="success">在职</Tag> : <Tag>停用</Tag>}
                </div>
                <div className="md-sub">
                  {detailMember.memberId} · {detailRoleName}
                </div>
              </div>
            </div>
            <div className="md-grid">
              <div className="md-item"><span className="md-label">所属部门</span><span>{detailDept ? `${detailDept.deptName} / ${detailDept.teamName}` : "-"}</span></div>
              <div className="md-item"><span className="md-label">手机号</span><span className="mono-text">{maskPhone(detailMember.phone)}</span></div>
              <div className="md-item"><span className="md-label">加入时间</span><span>{detailMember.joinDate}</span></div>
              <div className="md-item"><span className="md-label">当前角色</span><span>{detailRoleName}</span></div>
            </div>
            <div className="md-section-title">最近操作记录</div>
            {memberAudits.length > 0 ? (
              <div className="md-audit-list">
                {memberAudits.map((a) => (
                  <div className="md-audit-row" key={a.auditId}>
                    <span className="mono-text md-audit-time">{a.time}</span>
                    <Tag color={ACTION_TAG_COLOR[a.auditAction]}>{a.auditAction}</Tag>
                    <span className="md-audit-module">{a.permModule}</span>
                    {a.result === "失败" ? <Tag color="error">失败</Tag> : <Tag color="success">成功</Tag>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="md-empty">近 7 天暂无该成员的操作记录</div>
            )}
          </div>
        )}
      </Drawer>
    </section>
  );
}
