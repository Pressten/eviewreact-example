import Drawer from "@nce/eview-react/Drawer";
import { IconPlusIcDigitalPowerDpMove, IconPlusIcIctTree, IconPlusIcPublicBrush, IconPlusIcPublicHistoryInformation, IconPlusIcPublicIdcard, IconPlusIcPublicRightArrow, IconPlusIcPublicSecurity } from '@hui/icon-plus';
import Tag from "@/shared/Tag";
import Button from "@nce/eview-react/Button";
import Divider from "@nce/eview-react/Divider";
import { useApp } from "../../context.jsx";
import RoleTag from "../../components/role-tag/index.jsx";
import StatusDot from "../../components/status-dot/index.jsx";

import { orgNodeMap, getDeptPath } from "../../mock/organization.js";
import "./index.css";

// 鎴愬憳璇︽儏鎶藉眽 鈥?鍩烘湰淇℃伅 / 鎵€灞為儴闂?/ 鏉冮檺鎽樿 / 鏈€杩戞搷浣?export default function MemberDrawer() {
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
            <p className="member-drawer__sub">{drawerMember.title} 路 {drawerMember.employeeId}</p>
          </div>
        </div>
      }
      visible={!!drawerMemberId}
      onClose={onClose}
      width={560}
      placement="right"
    >
      <div className="member-drawer__body">
        <div className="member-drawer__actions">
          <Button size="small" onClick={() => { onClose(); setModal("transfer"); }} text="杞Щ leftIcon={<IconPlusIcDigitalPowerDpMove iconSize="0.875rem" iconColor={['currentcolor']} />} />
          <Button size="small" status="primary" onClick={onClose} text="缂栬緫" leftIcon={<IconPlusIcPublicBrush iconSize="0.875rem" iconColor={['currentcolor']} />} />
        </div>
        {/* 鍩烘湰淇℃伅 */}
        <section className="member-drawer__section">
          <h3 className="member-drawer__section-title">
            <IconPlusIcPublicIdcard iconSize="0.875rem" iconColor={['currentcolor']} /> 鍩烘湰淇℃伅
          </h3>
          <dl className="member-drawer__grid">
            <div><dt>濮撳悕</dt><dd>{drawerMember.name}</dd></div>
            <div><dt>宸ュ彿</dt><dd>{drawerMember.employeeId}</dd></div>
            <div><dt>鑱屼綅</dt><dd>{drawerMember.title}</dd></div>
            <div><dt>瑙掕壊</dt><dd><RoleTag role={drawerMember.role} /></dd></div>
            <div><dt>鐩村睘涓婄骇</dt><dd>{drawerMember.supervisor}</dd></div>
            <div><dt>鐘舵€?/dt><dd><StatusDot status={drawerMember.status} /></dd></div>
            <div><dt>閭</dt><dd className="member-drawer__email">{drawerMember.email}</dd></div>
            <div><dt>鐢佃瘽</dt><dd>{drawerMember.phone}</dd></div>
            <div><dt>鍏ヨ亴鏃ユ湡</dt><dd>{drawerMember.joinDate}</dd></div>
            <div><dt>鏈€杩戞椿璺?/dt><dd>{drawerMember.lastActive}</dd></div>
          </dl>
        </section>

        <Divider style={{ margin: "0.5rem 0" }} />

        {/* 鎵€灞為儴闂?*/}
        <section className="member-drawer__section">
          <h3 className="member-drawer__section-title">
            <IconPlusIcIctTree iconSize="0.875rem" iconColor={['currentcolor']} /> 鎵€灞為儴闂?          </h3>
          <div className="member-drawer__dept-path">
            {deptPath.split(" / ").map((seg, i, arr) => (
              <span key={i} className={`member-drawer__dept-seg ${i === arr.length - 1 ? "is-current" : ""}`}>
                {seg}
                {i < arr.length - 1 && <IconPlusIcPublicRightArrow iconSize="0.75rem" iconColor={['var(--on-surface-variant)']} />}
              </span>
            ))}
          </div>
          <p className="member-drawer__dept-meta">
            褰撳墠褰掑睘锛?strong>{dept?.title}</strong> 路 灞傜骇 {dept?.level + 1} 路 鐩存帴褰掑睘鎴愬憳 {dept?.count} 浜?          </p>
        </section>

        <Divider style={{ margin: "0.5rem 0" }} />

        {/* 鏉冮檺鎽樿 */}
        <section className="member-drawer__section">
          <h3 className="member-drawer__section-title">
            <IconPlusIcPublicSecurity iconSize="0.875rem" iconColor={['currentcolor']} /> 鏉冮檺鎽樿
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
                    <span className="member-drawer__perm-none">鏃犳巿鏉?/span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <Divider style={{ margin: "0.5rem 0" }} />

        {/* 鏈€杩戞搷浣?*/}
        <section className="member-drawer__section">
          <h3 className="member-drawer__section-title">
            <IconPlusIcPublicHistoryInformation iconSize="0.875rem" iconColor={['currentcolor']} /> 鏈€杩戞搷浣?          </h3>
          <ul className="member-drawer__timeline">
            {[
              { dot: "is-green", node: <span className="member-drawer__op"><strong>鐧诲綍绯荤粺</strong> 路 {drawerMember.lastActive}</span> },
              { dot: "is-blue", node: <span className="member-drawer__op"><strong>缂栬緫涓汉璧勬枡</strong> 路 2026-10-19 14:22</span> },
              { dot: "is-blue", node: <span className="member-drawer__op"><strong>鏌ョ湅閮ㄩ棬鏉冮檺鐭╅樀</strong> 路 2026-10-18 09:15</span> },
              { dot: "is-gray", node: <span className="member-drawer__op"><strong>淇敼瀵嗙爜</strong> 路 2026-10-12 18:30</span> },
              { dot: "is-gray", node: <span className="member-drawer__op"><strong>鐧诲綍绯荤粺</strong> 路 2026-10-11 08:50</span> },
            ].map((it, i) => (
              <li key={i} className={`member-drawer__timeline-item ${it.dot}`}>
                <span className="member-drawer__timeline-dot" />
                <span className="member-drawer__timeline-content">{it.node}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Drawer>
  );
}
