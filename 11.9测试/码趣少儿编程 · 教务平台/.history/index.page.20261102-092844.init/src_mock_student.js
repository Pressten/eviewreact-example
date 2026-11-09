// Layer 2: 学员管理 Mock 数据
// 校区 / 课程 / 班级 / 学员（含上课记录、作品集、老师点评）
import dayjs from "dayjs";

export const CAMPUSES = [
  { value: "cy", label: "朝阳校区" },
  { value: "hd", label: "海淀校区" },
  { value: "xc", label: "西城校区" },
  { value: "pd", label: "浦东校区" },
  { value: "ns", label: "南山校区" },
];

export const COURSES = [
  { value: "scratch", label: "Scratch 图形化", short: "Scratch" },
  { value: "python", label: "Python 编程", short: "Python" },
  { value: "cpp", label: "C++ 算法", short: "C++" },
  { value: "robot", label: "机器人编程", short: "机器人" },
  { value: "noi", label: "信息学奥赛", short: "奥赛" },
];

export const CLASSES = [
  { value: "s-a1", label: "Scratch 启蒙A1", course: "scratch" },
  { value: "s-b2", label: "Scratch 进阶B2", course: "scratch" },
  { value: "s-c3", label: "Scratch 创意C3", course: "scratch" },
  { value: "p-1", label: "Python 基础P1", course: "python" },
  { value: "p-2", label: "Python 进阶P2", course: "python" },
  { value: "p-3", label: "Python 项目P3", course: "python" },
  { value: "c-g1", label: "C++ 算法G1", course: "cpp" },
  { value: "c-g2", label: "C++ 竞赛G2", course: "cpp" },
  { value: "r-1", label: "机器人 机械R1", course: "robot" },
  { value: "r-2", label: "机器人 智能R2", course: "robot" },
  { value: "n-1", label: "奥赛 提高班", course: "noi" },
  { value: "n-2", label: "奥赛 冲刺班", course: "noi" },
];

export const RENEWAL_THRESHOLD = 8;

export function courseLabel(value) {
  const c = COURSES.find((x) => x.value === value);
  return c ? c.label : value;
}
export function campusLabel(value) {
  const c = CAMPUSES.find((x) => x.value === value);
  return c ? c.label : value;
}
export function classLabel(value) {
  const c = CLASSES.find((x) => x.value === value);
  return c ? c.label : value;
}

const FAMILY = [
  "李", "王", "张", "刘", "陈", "杨", "黄", "周", "吴", "徐",
  "孙", "马", "朱", "胡", "郭", "何", "高", "林", "罗", "郑",
  "梁", "谢", "宋", "唐", "许", "韩",
];
const GIVEN_M = [
  "子涵", "睿哲", "博文", "浩然", "俊杰", "宇航", "梓轩", "明轩",
  "皓宇", "峻熙", "天佑", "嘉懿", "煜祺", "雨泽", "弘文",
];
const GIVEN_F = [
  "梓萱", "思琪", "雨桐", "心怡", "诗涵", "欣怡", "梦琪", "佳琪",
  "紫萱", "若熙", "语桐", "雅静", "可馨", "子瑜", "楚楚",
];

const TEACHERS = [
  "王明慧", "李建国", "张晓彤", "赵志强", "陈雅芳",
  "刘海波", "孙丽娜", "周文博",
];

const TOPICS = {
  scratch: ["角色动画工坊", "迷宫探险设计", "打地鼠小游戏", "故事连环画", "星空大战", "弹球大冒险", "音乐会舞台"],
  python: ["海龟绘图入门", "条件与循环", "函数初体验", "猜数字游戏", "数据图表绘制", "简易爬虫", "文字冒险"],
  cpp: ["变量与输入输出", "分支结构", "循环嵌套", "数组与排序", "递归初探", "枚举与贪心"],
  robot: ["马达与车轮", "传感器感知", "循迹小车", "机械臂抓取", "避障巡逻", "对战竞技"],
  noi: ["枚举与模拟", "二分查找", "贪心策略", "图论基础", "树与并查集", "动态规划入门"],
};

const WORK_TITLES = {
  scratch: ["我的恐龙乐园", "海底寻宝记", "飞行大作战", "太空探险", "欢乐农场", "宠物养成记"],
  python: ["BMI 计算器", "随机密码器", "简易计算器", "成绩分析图", "文字冒险游戏", "天气查询器"],
  cpp: ["高精度运算", "贪吃蛇模拟", "括号匹配", "走迷宫最短路", "数字金字塔", "成绩排名"],
  robot: ["智能风扇", "自动感应门", "跳舞机器人", "分拣机械臂", "巡线快递车", "避障小车"],
  noi: ["背包问题", "最短路径", "连通块计数", "区间合并", "数列求和", "排列组合"],
};

const COMMENT_TEMPLATES = [
  (n, t) => `${n}本节课专注度很高，对${t}的理解到位，能够独立完成作品，期待后续在算法优化上更进一步。`,
  (n, t) => `${n}思维活跃、乐于助人，本节${t}掌握扎实，建议课后多练习巩固，保持良好的学习节奏。`,
  (n, t) => `${n}课堂互动积极，对${t}的拓展问题表现出浓厚兴趣，作品完成度较高，综合表现优秀。`,
  (n, t) => `${n}本节${t}学习认真，但在复杂逻辑拆解上还需加强，建议结合生活实例多思考多动手。`,
  (n, t) => `${n}近期进步明显，${t}相关练习正确率稳步提升，希望继续保持，向竞赛方向努力。`,
];

const ATT_TAGS = ["出勤", "出勤", "出勤", "出勤", "请假", "补课"];

const NOTES = [
  "学习主动性强，逻辑思维清晰，建议参加编程竞赛培优。",
  "课堂参与度高，作品创意丰富，可适当增加难度挑战。",
  "基础扎实，动手能力出色，近期因事请假较多需关注进度。",
  "理解力强但需提升专注度，建议家长配合督促课后练习。",
  "进步显著，对算法兴趣浓厚，具备向奥赛方向培养的潜力。",
  "性格开朗乐于助人，团队协作佳，编程细节把控待加强。",
];

const SCHEDULE_TIMES = ["09:00-10:30", "10:45-12:15", "14:00-15:30", "16:00-17:30"];

function genStudents() {
  const list = [];
  const total = 26;
  for (let i = 0; i < total; i++) {
    const course = COURSES[i % COURSES.length];
    const campus = CAMPUSES[i % CAMPUSES.length];
    const courseClasses = CLASSES.filter((c) => c.course === course.value);
    const cls = courseClasses[i % courseClasses.length];
    const totalHoursArr = [48, 96, 144];
    const totalHours = totalHoursArr[i % 3];

    const lowPool = [3, 5, 6, 7, 2, 4, 1];
    const normalPool = [12, 18, 24, 30, 36, 15, 20, 28, 42, 48];
    let remainingHours;
    if (i % 4 === 0) {
      remainingHours = lowPool[(i * 3) % lowPool.length];
    } else {
      remainingHours = normalPool[(i * 5) % normalPool.length];
    }
    const progress = Math.round(((totalHours - remainingHours) / totalHours) * 100);
    const status = i % 13 === 0 ? "请假" : i % 19 === 0 ? "结业" : "在读";

    const isGirl = i % 2 === 1;
    const fam = FAMILY[i % FAMILY.length];
    const giv = isGirl ? GIVEN_F[i % GIVEN_F.length] : GIVEN_M[i % GIVEN_M.length];
    const name = fam + giv;
    const age = 6 + (i % 9);
    const enrolled = dayjs().subtract(180 + i * 6, "day");

    const topics = TOPICS[course.value];
    const records = [];
    const recCount = 7;
    for (let r = 0; r < recCount; r++) {
      const d = dayjs().subtract((recCount - r) * 7, "day");
      const att = ATT_TAGS[(i + r) % ATT_TAGS.length];
      const rating = 3 + ((i + r) % 3);
      records.push({
        date: d.format("YYYY-MM-DD"),
        topic: topics[r % topics.length],
        attendance: att,
        rating,
        summary: COMMENT_TEMPLATES[r % COMMENT_TEMPLATES.length](name, topics[r % topics.length]),
      });
    }

    const titles = WORK_TITLES[course.value];
    const works = [];
    for (let w = 0; w < 6; w++) {
      const d = dayjs().subtract(108 - w * 16, "day");
      works.push({
        title: titles[w % titles.length],
        image: "./assets/uploads/image.jpg",
        date: d.format("YYYY-MM-DD"),
        rating: 4 + ((i + w) % 2),
        desc: `本作品结合${topics[w % topics.length]}知识点，由 ${name} 独立构思并实现，展现了对编程逻辑与创意表达的综合运用。`,
      });
    }

    const cmts = [];
    for (let c = 0; c < 4; c++) {
      const d = dayjs().subtract(60 - c * 15, "day");
      cmts.push({
        date: d.format("YYYY-MM-DD"),
        teacher: TEACHERS[(i + c) % TEACHERS.length],
        rating: 4 + ((i + c) % 2),
        content: COMMENT_TEMPLATES[(i + c) % COMMENT_TEMPLATES.length](name, topics[c % topics.length]),
      });
    }

    const schedule = [];
    for (let s = 0; s < 3; s++) {
      const d = dayjs().add(s * 7 + 3, "day");
      schedule.push({
        date: d.format("YYYY-MM-DD"),
        time: SCHEDULE_TIMES[(i + s) % SCHEDULE_TIMES.length],
        topic: topics[(records.length + s) % topics.length],
        teacher: TEACHERS[(i + s) % TEACHERS.length],
        room: campus.label.replace("校区", "教室") + " " + (100 + i + s),
      });
    }

    list.push({
      id: "STU" + (1001 + i),
      key: "STU" + (1001 + i),
      name,
      age,
      gender: isGirl ? "女" : "男",
      avatar: "./assets/uploads/user.png",
      campus: campus.value,
      campusLabel: campus.label,
      course: course.value,
      courseLabel: course.label,
      classId: cls.value,
      classLabel: cls.label,
      totalHours,
      remainingHours,
      progress,
      status,
      enrolledDate: enrolled.format("YYYY-MM-DD"),
      parentName: fam + (isGirl ? "女士" : "先生"),
      parentPhone: "138" + String(10000000 + i * 137).slice(0, 8),
      notes: NOTES[i % NOTES.length],
      classRecords: records,
      works,
      comments: cmts,
      schedule,
    });
  }
  return list;
}

export const STUDENTS = genStudents();

// 概览统计（基于全量数据，不受筛选影响）
export const OVERVIEW = {
  totalEnrolled: STUDENTS.filter((s) => s.status === "在读").length,
  weekNew: 5,
  renewalAlert: STUDENTS.filter((s) => s.remainingHours < RENEWAL_THRESHOLD && s.status !== "结业").length,
  weekLessons: 38,
};

// ── 数据看板聚合 ──
export const COURSE_DIST = COURSES.map((c) => ({
  name: c.label,
  value: STUDENTS.filter((s) => s.course === c.value).length,
}));

export const CAMPUS_DIST = CAMPUSES.map((c) => ({
  校区: c.label.replace("校区", ""),
  学员数: STUDENTS.filter((s) => s.campus === c.value).length,
}));

export const WEEKLY_NEW = [1, 2, 2, 3, 2, 4, 3, 5].map((n, i) => ({
  周: `W${i + 1}`,
  新增: n,
}));

export const TOTAL_STUDENTS = STUDENTS.length;

// ── 待续费学员列表 ──
export const RENEWAL_LIST = STUDENTS.filter(
  (s) => s.remainingHours < RENEWAL_THRESHOLD && s.status !== "结业"
);

// ── 近期课堂动态（聚合各学员最新上课记录） ──
export const RECENT_ACTIVITY = STUDENTS
  .flatMap((s) =>
    s.classRecords.map((r) => ({
      date: r.date,
      studentName: s.name,
      studentId: s.id,
      courseLabel: s.courseLabel,
      topic: r.topic,
      attendance: r.attendance,
      rating: r.rating,
    }))
  )
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .slice(0, 8);

// ── 优秀作品墙（高分作品聚合） ──
export const OUTSTANDING_WORKS = STUDENTS
  .flatMap((s) =>
    s.works.map((w) => ({
      studentName: s.name,
      courseLabel: s.courseLabel,
      title: w.title,
      image: w.image,
      date: w.date,
      rating: w.rating,
    }))
  )
  .filter((w) => w.rating >= 5)
  .slice(0, 8);
