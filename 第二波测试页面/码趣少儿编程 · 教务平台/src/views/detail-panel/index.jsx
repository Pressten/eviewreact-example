import { Timeline, Button, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { userMap, shareMeta, typeMeta, activityTemplates, activityTimes } from "../../mock/drive.js";
import FileTypeIcon from "../../components/file-type-icon/index.jsx";
import ShareStatusTag from "../../components/share-status-tag/index.jsx";
import AvatarStack from "../../components/avatar-stack/index.jsx";
import "./index.css";

export default function DetailPanel({ file, onShare }) {
  if (!file) {
    return (
      <aside className="detail-panel detail-panel--empty">
        <div className="detail-empty">
          <Icon name="mouse-pointer" size="2rem" color="#AEAEAE" />
          <p>选择左侧文件查看详情</p>
        </div>
      </aside>
    );
  }

  const u = userMap[file.updaterId];
  const meta = typeMeta[file.type] || typeMeta.doc;
  const activities = activityTemplates.map((t, i) => {
    const uid = file.collaborators[i % file.collaborators.length];
    return { user: userMap[uid], action: t.action, icon: t.icon, time: activityTimes[i] };
  });

  return (
    <aside className="detail-panel">
      {/* 预览卡 */}
      <div className="detail-preview">
        <div className="detail-preview-icon">
          <FileTypeIcon type={file.type} size="2.5rem" />
        </div>
        <div className="detail-preview-name" title={`${file.name}.${file.ext}`}>
          {file.name}
          <span className="file-ext">.{file.ext}</span>
        </div>
        <div className="detail-preview-tags">
          <ShareStatusTag status={file.shareStatus} />
          <span className="detail-type-badge">{meta.label}</span>
        </div>
        <div className="detail-preview-actions">
          <Button size="small" onClick={() => message.success(`正在打开「${file.name}.${file.ext}」`)}>
            <Icon name="external-link" size="0.875rem" />
            打开
          </Button>
          <Button size="small" onClick={() => message.success(`正在下载「${file.name}.${file.ext}」`)}>
            <Icon name="download" size="0.875rem" />
            下载
          </Button>
          <Button size="small" type="primary" onClick={() => onShare(file)}>
            <Icon name="share-2" size="0.875rem" />
            分享
          </Button>
        </div>
      </div>

      {/* 基本信息 */}
      <div className="detail-section">
        <div className="detail-section-title">基本信息</div>
        <dl className="detail-info">
          <div className="info-row"><dt>大小</dt><dd>{file.sizeText}</dd></div>
          <div className="info-row"><dt>类型</dt><dd>{meta.label}（.{file.ext}）</dd></div>
          <div className="info-row"><dt>更新人</dt><dd>{u ? u.name : "—"}</dd></div>
          <div className="info-row"><dt>更新时间</dt><dd>{file.updateTime}</dd></div>
          <div className="info-row"><dt>所在空间</dt><dd>{spaceLabel(file.spacePath)}</dd></div>
        </dl>
      </div>

      {/* 协作成员 */}
      <div className="detail-section">
        <div className="detail-section-title">
          <span>协作成员</span>
          <a className="detail-link" onClick={(e) => { e.preventDefault(); message.info("邀请成员协作"); }} href="#">邀请</a>
        </div>
        <div className="detail-collab">
          <AvatarStack userIds={file.collaborators} max={6} size={28} />
          <span className="collab-count">{file.collaborators.length} 人协作</span>
        </div>
      </div>

      {/* 最近动态（时间轴） */}
      <div className="detail-section">
        <div className="detail-section-title">最近动态</div>
        <Timeline
          className="detail-timeline"
          items={activities.map((a) => ({
            dot: (
              <span className="tl-dot">
                <Icon name={a.icon} size="0.75rem" />
              </span>
            ),
            children: (
              <div className="tl-content">
                <span className="tl-actor">{a.user.name}</span>
                <span className="tl-action">{a.action}</span>
                <span className="tl-time">{a.time}</span>
              </div>
            ),
          }))}
        />
      </div>
    </aside>
  );
}

function spaceLabel(spacePath) {
  const map = {
    company: "公司文档", "company-rules": "规章制度", "company-notice": "公告通知",
    "company-report": "年度报告", "company-report-2023": "2023年度", "company-report-2024": "2024年度",
    dept: "部门空间", "dept-rd": "研发部", "rd-spec": "技术规范", "rd-project": "项目文档", "rd-review": "代码评审",
    "dept-pd": "产品部", "pd-req": "需求文档", "pd-design": "设计稿",
    "dept-mk": "市场部", "mk-event": "活动方案", "mk-case": "客户案例",
    "dept-hr": "人力资源部", "hr-policy": "人事制度",
    project: "项目空间", "proj-park": "智慧园区项目", "park-req": "需求", "park-design": "设计", "park-test": "测试",
    "proj-data": "数据中台", "data-doc": "文档", "proj-mobile": "移动端重构", "mobile-src": "源码",
    shared: "共享与我", "shared-review": "季度复盘", "shared-plan": "产品规划",
  };
  return spacePath.map((k) => map[k] || k).join(" / ");
}
