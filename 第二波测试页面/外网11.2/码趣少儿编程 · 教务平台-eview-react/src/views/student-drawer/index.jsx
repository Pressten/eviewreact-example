// Layer 4: 学员详情抽屉（成长曲线 + 上课记录 / 作品集 / 老师点评 / 课程安排）
import { useState } from "react";
import { IconPlusIcCarUser, IconPlusIcPublicMessage, IconPlusIcPublicSortUp, IconPlusIcPublicBellClock, IconPlusIcPublicCalendar, IconPlusIcPublicMappinOnMap } from '@hui/icon-plus';
import Drawer from "@nce/eview-react/Drawer";
import Tab, { TabItem } from "@nce/eview-react/Tab";
import Tag from "@/shared/Tag";
import Rating from "@nce/eview-react/Rating";
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import Chart from "@nce/eview-react/Chart";
import { useApp } from "../../context.jsx";
import { RENEWAL_THRESHOLD } from "../../mock/student.js";
import "./index.css";

const STATUS_COLOR = { 在读: "success", 请假: "warning", 结业: "default" };
const ATT_TAG_COLOR = { 出勤: "success", 请假: "warning", 补课: "processing" };
const ATT_DOT_COLOR = { 出勤: "green", 请假: "gray", 补课: "blue" };

function avg(arr) {
  if (!arr.length) return "0.0";
  return (arr.reduce((a, x) => a + x.rating, 0) / arr.length).toFixed(1);
}

export default function StudentDrawer({ student, onClose }) {
  const { isDark } = useApp();
  const [notice, setNotice] = useState(null);
  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };
  const open = !!student;
  const isLow = student && student.remainingHours < RENEWAL_THRESHOLD && student.status !== "结业";

  const attRate = student
    ? Math.round(
        (student.classRecords.filter((r) => r.attendance !== "请假").length /
          student.classRecords.length) *
          100
      )
    : 0;
  const completedHours = student ? student.totalHours - student.remainingHours : 0;
  const attCount = student ? student.classRecords.filter((r) => r.attendance === "出勤").length : 0;
  const leaveCount = student ? student.classRecords.filter((r) => r.attendance === "请假").length : 0;
  const makeupCount = student ? student.classRecords.filter((r) => r.attendance === "补课").length : 0;

  const chartOption = student
    ? {
        ...chartBase,
        data: student.classRecords.map((r, idx) => ({
          课次: `第${idx + 1}次`,
          课堂评分: r.rating,
        })),
        xAxis: { data: "课次", name: "课次" },
        yAxisTitle: "课堂评分（星级）",
        smooth: true,
        markLine: { bottom: 3 },
      }
    : { ...chartBase };

  const stats = student
    ? [
        { value: student.remainingHours, sub: "/ " + student.totalHours, label: "剩余课时", low: isLow },
        { value: completedHours, sub: "节", label: "已完成课时" },
        { value: student.progress, sub: "%", label: "学习进度" },
        { value: attRate, sub: "%", label: "出勤率" },
        { value: student.works.length, sub: "件", label: "累计作品" },
        { value: student.comments.length, sub: "条", label: "累计点评" },
      ]
    : [];

  const tabItems = student
    ? [
        {
          key: "records",
          label: "上课记录",
          children: (
            <div className="drawer-tab-pane">
              <div className="rec-summary">
                <span className="rec-summary__item">共 {student.classRecords.length} 次</span>
                <span className="rec-summary__item rec-summary__item--ok">出勤 {attCount}</span>
                <span className="rec-summary__item rec-summary__item--warn">请假 {leaveCount}</span>
                <span className="rec-summary__item rec-summary__item--info">补课 {makeupCount}</span>
              </div>
              <TimelineView records={student.classRecords} />
            </div>
          ),
        },
        {
          key: "works",
          label: "作品集",
          children: (
            <div className="drawer-tab-pane">
              <div className="section-head">
                共 {student.works.length} 件作品 · 平均评分 {avg(student.works)} ★
              </div>
              <WorkGrid works={student.works} />
            </div>
          ),
        },
        {
          key: "comments",
          label: "老师点评",
          children: (
            <div className="drawer-tab-pane">
              <div className="section-head">
                平均评分 {avg(student.comments)} ★ · 共 {student.comments.length} 条点评
              </div>
              <CommentList comments={student.comments} />
            </div>
          ),
        },
        {
          key: "schedule",
          label: "课程安排",
          children: (
            <div className="drawer-tab-pane">
              <div className="section-head">未来 {student.schedule.length} 节预约课程</div>
              <ScheduleList schedule={student.schedule} />
            </div>
          ),
        },
      ]
    : [];

  return (
    <Drawer
      visible={open}
      onClose={onClose}
      width={720}
      destroyOnClose
      className="student-drawer-root"
      title={
        student ? (
          <div className="drawer-title">
            <img className="drawer-title__avatar" src={student.avatar} alt="" />
            <div className="drawer-title__text">
              <div className="drawer-title__name">{student.name}</div>
              <div className="drawer-title__id">
                {student.id} · {student.gender} · {student.age}岁 · {student.classLabel}
              </div>
              <div className="drawer-title__tags">
                <Tag color={STATUS_COLOR[student.status] || "default"}>{student.status}</Tag>
                <Tag color="blue">{student.courseLabel}</Tag>
                {isLow && <Tag color="error">待续费</Tag>}
              </div>
            </div>
          </div>
        ) : null
      }
    >
      {student && (
        <div className="student-drawer">
          {notice && (
            <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1050 }}>
              <DivMessage
                key={notice.key}
                display
                type={notice.type}
                text={notice.text}
                enableDisposeTimeOut={notice.type !== "error"}
                onClose={() => setNotice(null)}
              />
            </div>
          )}
          <div className="drawer-notes">
            <IconPlusIcPublicMessage iconSize="0.875rem" iconColor={['#0067D1']} />
            <span>{student.notes}</span>
          </div>

          <div className="drawer-info">
            <InfoItem label="所属校区" value={student.campusLabel} />
            <InfoItem label="所学课程" value={student.courseLabel} />
            <InfoItem label="所在班级" value={student.classLabel} />
            <InfoItem label="入学日期" value={student.enrolledDate} />
            <InfoItem label="家长联系人" value={student.parentName} />
            <InfoItem label="联系电话" value={student.parentPhone} />
          </div>

          <div className="drawer-stats">
            {stats.map((s, idx) => (
              <div className="drawer-stat" key={idx}>
                <div className={"drawer-stat__value" + (s.low ? " is-low" : "")}>
                  {s.value}
                  <span className="drawer-stat__sub">{s.sub}</span>
                </div>
                <div className="drawer-stat__label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="drawer-chart">
            <div className="drawer-chart__head">
              <span className="drawer-chart__title">
                <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} /> 学习成长曲线
              </span>
              <span className="drawer-chart__hint">近 {student.classRecords.length} 次课堂评分趋势</span>
            </div>
            <Chart name="LineChart" option={chartOption} style={{ height: "13rem" }} />
          </div>

          <Tab selectedIndex={0} draggable={false} className="drawer-tabs">
            {tabItems.map((item, idx) => (
              <TabItem key={item.key} title={item.label}>{item.children}</TabItem>
            ))}
          </Tab>
          <div className="drawer-footer" style={{ position: 'absolute', right: 0, bottom: 0, width: '100%', padding: '0.75rem 1rem', textAlign: 'right' }}>
            <Button text="关闭" onClick={onClose} />
            {isLow && (
              <Button status="primary" leftIcon={<IconPlusIcPublicBellClock iconSize="0.875rem" iconColor={['currentcolor']} />} text="发送续费提醒" onClick={() => setNotice({ type: "success", text: "续费提醒已发送给 " + student.parentName, key: Date.now() })} style={{ marginLeft: '0.5rem' }} />
            )}
          </div>
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
      color: ATT_DOT_COLOR[r.attendance] || "green",
      children: (
        <div className="rec-item">
          <div className="rec-item__head">
            <span className="rec-item__topic">{r.topic}</span>
            <Tag color={ATT_TAG_COLOR[r.attendance] || "success"}>{r.attendance}</Tag>
          </div>
          <div className="rec-item__meta">
            <span className="rec-item__date">{r.date}</span>
            <Rating disabled value={r.rating} className="rec-item__rate" />
          </div>
          <p className="rec-item__summary">{r.summary}</p>
        </div>
      ),
    }));
  return <SimpleTimeline items={items} />;
}

function WorkGrid({ works }) {
  return (
    <div className="work-grid">
      {works.map((w) => (
        <div className="work-card" key={w.title + w.date}>
          <div className="work-card__img">
            <img src={w.image} alt={w.title} />
            <span className="work-card__badge">{w.rating}★</span>
          </div>
          <div className="work-card__body">
            <div className="work-card__title">{w.title}</div>
            <div className="work-card__date">{w.date}</div>
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
          <img className="comment-card__avatar" src="/uploads/user.png" alt={c.teacher} />
          <div className="comment-card__body">
            <div className="comment-card__head">
              <span className="comment-card__teacher">{c.teacher}</span>
              <span className="comment-card__date">{c.date}</span>
            </div>
            <Rating disabled value={c.rating} />
            <p className="comment-card__content">{c.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScheduleList({ schedule }) {
  return (
    <div className="schedule-list">
      {schedule.map((s, i) => (
        <div className="schedule-item" key={i}>
          <div className="schedule-item__date">
            <IconPlusIcPublicCalendar iconSize="0.875rem" iconColor={['#0067D1']} />
            <span className="schedule-item__day">{s.date}</span>
            <span className="schedule-item__time">{s.time}</span>
          </div>
          <div className="schedule-item__body">
            <div className="schedule-item__topic">{s.topic}</div>
            <div className="schedule-item__meta">
              <span><IconPlusIcCarUser iconSize="0.75rem" iconColor={['currentcolor']} /> {s.teacher}</span>
              <span><IconPlusIcPublicMappinOnMap iconSize="0.75rem" iconColor={['currentcolor']} /> {s.room}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SimpleTimeline({ items, className }) {
  return (
    <div className={className} style={{ position: 'relative', paddingLeft: '1.5rem' }}>
      <div style={{ position: 'absolute', left: '0.375rem', top: '0.5rem', bottom: '0.5rem', width: '2px', background: '#e0e0e0' }} />
      {items.map((item, idx) => (
        <div key={idx} style={{ position: 'relative', paddingBottom: '1rem' }}>
          <div style={{ position: 'absolute', left: '-1.125rem', top: '0.25rem', width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: 'var(--primary, #0067D1)', border: '2px solid #fff' }} />
          {item.children}
        </div>
      ))}
    </div>
  );
}
