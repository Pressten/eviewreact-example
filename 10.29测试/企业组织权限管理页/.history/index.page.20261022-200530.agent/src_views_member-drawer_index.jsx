import { Drawer, Tag, Timeline, Button, Divider } from "antd";
import { useApp } from "../../context.jsx";
import RoleTag from "../../components/role-tag/index.jsx";
import StatusDot from "../../components/status-dot/index.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import { orgNodeMap, getDeptPath } from "../../mock/organization.js";
import "./index.css";

// 成员详情抽屉 — 基本信息 / 所属部门 / 权限摘要 / 最近操作
export default function MemberDrawer() {
  const { drawerMemberId, setDrawerMemberId, drawerMember, permissionGroups, getMemberPermissions, setModal } = useApp();

  const onClose = () => setDrawerMemberId(null);

  if (!drawerMember) return null;

  const dept = orgNodeMap[drawerMember.deptKey];
  const deptPath = getDeptPath(drawerMember.deptKey);
  const perms = getMemberPermissions(drawerMember.id);
  const grantedPerms = permissionGroups.map((g) => {
    const granted = g.items.filter((i) => perms.has(i.key));
    return { group: g.groupLabel, granted: granted.length, total: g.items.length, labels: granted.map((i) => i.label) };
  });
  const totalGranted = grantedPerms.reduce((acc, g) => acc + g.granted, 0);
  const totalAll = grantedPerms.reduce((acc, g) => acc + g.total, 0);

  return (
    <Drawer
      title={
        <div className="member-drawer__title">
          <img src={drawerMember.avatar} alt="" className="member-drawer__avatar" />
          <div>
            <div className="member-drawer__name-row">
              <span>{drawerMember.name}</span>
              <RoleTag role={drawerMember.role} />
              <StatusDot status={drawerMember.status} />
            </div>
            <p className="member-drawer__sub">{drawerMember.title} · {drawerMember.employeeId}</p>
          </div>
        </div>
      }
      open={!!drawerMemberId}
      onClose={onClose}
      width={560}
      placement="right"
      extra={
        <div className="member-drawer__actions">
          <Button size="small" onClick={() => { onClose(); setModal("transfer"); }}>
            <Icon name="move-right" size="0.875rem" />
            转移
          </Button>
          <Button size="small" type="primary" onClick={onClose}>
            <Icon name="pencil" size="0.875rem" />
            编辑
          </Button>
        </div>
      }
    >
      <div className="member-drawer__body">
        {/* 基本信息 */}
        <section className="member-drawer__section">
          <h3 className="member-drawer__section-title">
            <Icon name="id-card" size="0.875rem" /> 基本信息
          </h3>
          <dl className="member-drawer__grid">
            <div><dt>姓名</dt><dd>{drawerMember.name}</dd></div>
            <div><dt>工号</dt><dd>{drawerMember.employeeId}</dd></div>
            <div><dt>职位</dt><dd>{drawerMember.title}</dd></div>
            <div><dt>角色</dt><dd><RoleTag role={drawerMember.role} /></dd></div>
            <div><dt>直属上级</dt><dd>{drawerMember.supervisor}</dd></div>
            <div><dt>状态</dt><dd><StatusDot status={drawerMember.status} /></dd></div>
            <div><dt>邮箱</dt><dd className="member-drawer__email">{drawerMember.email}</dd></div>
            <div><dt>电话</dt><dd>{drawerMember.phone}</dd></div>
            <div><dt>入职日期</dt><dd>{drawerMember.joinDate}</dd></div>
            <div><dt>最近活跃</dt><dd>{drawerMember.lastActive}</dd></div>
          </dl>
        </section>

        <Divider style={{ margin: "0.5rem 0" }} />

        {/* 所属部门 */}
        <section className="member-drawer__section">
          <h3 className="member-drawer__section-title">
            <Icon name="folder-tree" size="0.875rem" /> 所属部门
          </h3>
          <div className="member-drawer__dept-path">
            {deptPath.split(" / ").map((seg, i, arr) => (
              <span key={i} className={`member-drawer__dept-seg ${i === arr.length - 1 ? "is-current" : ""}`}>
                {seg}
                {i < arr.length - 1 && <Icon name="chevron-right" size="0.75rem" color="var(--on-surface-variant)" />}
              </span>
            ))}
          </div>
          <p className="member-drawer__dept-meta">
            当前归属：<strong>{dept?.title}</strong> · 层级 {dept?.level + 1} · 直接归属成员 {dept?.count} 人
          </p>
        </section>

        <Divider style={{ margin: "0.5rem 0" }} />

        {/* 权限摘要 */}
        <section className="member-drawer__section">
          <h3 className="member-drawer__section-title">
            <Icon name="shield-check" size="0.875rem" /> 权限摘要
            <Tag bordered={false} color="blue" className="member-drawer__perm-count">{totalGranted} / {totalAll}</Tag>
          </h3>
          <ul className="member-drawer__perm-list">
            {grantedPerms.map((g) => (
              <li key={g.group} className="member-drawer__perm-group">
                <div className="member-drawer__perm-head">
                  <span className="member-drawer__perm-group-name">{g.group}</span>
                  <span className={`member-drawer__perm-stat ${g.granted === 0 ? "is-zero" : g.granted === g.total ? "is-full" : "is-part"}`}>
                    {g.granted} / {g.total}
                  </span>
                </div>
                <div className="member-drawer__perm-items">
                  {g.labels.length > 0 ? (
                    g.labels.map((l) => (
                      <Tag key={l} bordered={false} color="green" className="member-drawer__perm-tag">{l}</Tag>
                    ))
                  ) : (
                    <span className="member-drawer__perm-none">无授权</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <Divider style={{ margin: "0.5rem 0" }} />

        {/* 最近操作 */}
        <section className="member-drawer__section">
          <h3 className="member-drawer__section-title">
            <Icon name="rotate-ccw-clock" size="0.875rem" /> 最近操作
          </h3>
          <Timeline
            items={[
              { color: "green", children: <span className="member-drawer__op"><strong>登录系统</strong> · {drawerMember.lastActive}</span> },
              { color: "blue", children: <span className="member-drawer__op"><strong>编辑个人资料</strong> · 2026-10-19 14:22</span> },
              { color: "blue", children: <span className="member-drawer__op"><strong>查看部门权限矩阵</strong> · 2026-10-18 09:15</span> },
              { color: "gray", children: <span className="member-drawer__op"><strong>修改密码</strong> · 2026-10-12 18:30</span> },
              { color: "gray", children: <span className="member-drawer__op"><strong>登录系统</strong> · 2026-10-11 08:50</span> },
            ]}
          />
        </section>
      </div>
    </Drawer>
  );
}
