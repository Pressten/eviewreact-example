// Layer 4: 学员详情抽屉（上课记录 / 作品集 / 老师点评）
import { Drawer, Tabs, Tag, Rate, Progress, Button, Timeline, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { RENEWAL_THRESHOLD } from "../../mock/student.js";
import "./index.css";

const STATUS_COLOR = { 在读: "success", 请假: "warning", 结业: "default" };

export default function StudentDrawer({ student, onClose }) {
  const open = !!student;
  const isLow =
    student &&
    student.remainingHours < RENEWAL_THRESHOLD &&
    student.status !== "结业";

  const attRate = student
    ? Math.round(
        (student.classRecords.filter((r) => r.attendance !== "请假").length /
          student.classRecords.length) *
          100
      )
    : 0;

  const tabItems = student
    ? [
        {
          key: "records",
          label: "上课记录",
          children: (
            <div className="drawer-tab-pane">
              <TimelineView records={student.classRecords} />
            </div>
          ),
        },
        {
          key: "works",
          label: "作品集",
          children: (
            <div className="drawer-tab-pane">
              <WorkGrid works={student.works} />
            </div>
          ),
        },
        {
          key: "comments",
          label: "老师点评",
          children: (
            <div className="drawer-tab-pane">
              <CommentList comments={student.comments} />
            </div>
          ),
        },
      ]
    : [];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={720}
      destroyOnClose
      title={
        student ? (
          <div className="drawer-title">
            <img className="drawer-title__avatar" src={student.avatar} alt="" />
            <div>
              <div className="drawer-title__name">{student.name}</div>
              <div className="drawer-title__id">
                {student.id} · {student.gender} · {student.age}岁
              </div>
            </div>
          </div>
        ) : null
      }
      extra={
        student ? (
          <div className="drawer-tags">
            <Tag color={STATUS_COLOR[student.status] || "default"}>{student.status}</Tag>
            {isLow && <Tag color="error">待续费</Tag>}
          </div>
        ) : null
      }
      footer={
        <div className="drawer-footer">
          <Button onClick={onClose}>关闭</Button>
          {isLow && (
            <Button
              type="primary"
              icon={<Icon name="bell-ring" size="0.875rem" />}
              onClick={() => message.success("续费提醒已发送给 " + student.parentName)}
            >
              发送续费提醒
            </Button>
          )}
        </div>
      }
    >
      {student && (
        <div className="student-drawer">
          <div className="drawer-info">
            <InfoItem label="所属校区" value={student.campusLabel} />
            <InfoItem label="所在班级" value={student.classLabel} />
            <InfoItem label="所学课程" value={student.courseLabel} />
            <InfoItem label="入学日期" value={student.enrolledDate} />
            <InfoItem label="家长联系人" value={student.parentName} />
            <InfoItem label="联系电话" value={student.parentPhone} />
          </div>

          <div className="drawer-stats">
            <div className="drawer-stat">
              <div className={"drawer-stat__value" + (isLow ? " is-low" : "")}>
                {student.remainingHours}
                <span className="drawer-stat__sub">/ {student.totalHours}</span>
              </div>
              <div className="drawer-stat__label">剩余课时</div>
            </div>
            <div className="drawer-stat">
              <div className="drawer-stat__value">{student.progress}<span className="drawer-stat__sub">%</span></div>
              <div className="drawer-stat__label">学习进度</div>
            </div>
            <div className="drawer-stat">
              <div className="drawer-stat__value">{attRate}<span className="drawer-stat__sub">%</span></div>
              <div className="drawer-stat__label">出勤率</div>
            </div>
          </div>

          <Progress
            percent={student.progress}
            status={student.progress >= 100 ? "success" : "active"}
          />

          <Tabs defaultActiveKey="records" items={tabItems} className="drawer-tabs" />
        </div>
      )}
    </Drawer>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="drawer-info__item">
      <span className="drawer-info__label">{label}</span>
      <span className="drawer-info__value">{value}</span>
    </div>
  );
}

function TimelineView({ records }) {
  const items = records
    .slice()
    .reverse()
    .map((r) => ({
      color: r.attendance === "请假" ? "gray" : r.attendance === "补课" ? "blue" : "green",
      children: (
        <div className="rec-item">
          <div className="rec-item__head">
            <span className="rec-item__topic">{r.topic}</span>
            <Tag
              color={
                r.attendance === "请假" ? "warning" : r.attendance === "补课" ? "processing" : "success"
              }
            >
              {r.attendance}
            </Tag>
          </div>
          <div className="rec-item__meta">
            <span className="rec-item__date">{r.date}</span>
            <Rate disabled value={r.rating} className="rec-item__rate" />
          </div>
          <p className="rec-item__summary">{r.summary}</p>
        </div>
      ),
    }));
  return <Timeline items={items} />;
}

function WorkGrid({ works }) {
  return (
    <div className="work-grid">
      {works.map((w) => (
        <div className="work-card" key={w.title + w.date}>
          <div className="work-card__img">
            <img src={w.image} alt={w.title} />
          </div>
          <div className="work-card__body">
            <div className="work-card__title">{w.title}</div>
            <div className="work-card__date">{w.date}</div>
            <Rate disabled value={w.rating} />
            <p className="work-card__desc">{w.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentList({ comments }) {
  return (
    <div className="comment-list">
      {comments.map((c, i) => (
        <div className="comment-card" key={i}>
          <img className="comment-card__avatar" src="./assets/uploads/user.png" alt={c.teacher} />
          <div className="comment-card__body">
            <div className="comment-card__head">
              <span className="comment-card__teacher">{c.teacher}</span>
              <span className="comment-card__date">{c.date}</span>
            </div>
            <Rate disabled value={c.rating} />
            <p className="comment-card__content">{c.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}


