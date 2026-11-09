// Layer 2 — 企业网盘文档管理页 mock 数据
// 语义化字段：文件名、类型、大小、共享状态、空间归属、协作成员

// 用户（更新人 / 协作成员）
export const users = [
  { id: "u1", name: "林晚秋", initials: "林", color: 1 },
  { id: "u2", name: "陈思远", initials: "陈", color: 2 },
  { id: "u3", name: "苏雨晴", initials: "苏", color: 3 },
  { id: "u4", name: "王浩然", initials: "王", color: 4 },
  { id: "u5", name: "赵子墨", initials: "赵", color: 1 },
  { id: "u6", name: "李清辞", initials: "李", color: 2 },
  { id: "u7", name: "周以安", initials: "周", color: 3 },
];

export const userMap = users.reduce((m, u) => ((m[u.id] = u), m), {});

export const currentUser = { id: "u0", name: "夏知行", role: "知识管理员" };

// 企业文档空间树（≥3 层 ≥25 节点）
// shared: 是否共享空间；count: 子树文件数（mock 统计）
export const treeRaw = [
  {
    key: "company", name: "公司文档", shared: false, count: 48,
    children: [
      { key: "company-rules", name: "规章制度", shared: false, count: 12 },
      { key: "company-notice", name: "公告通知", shared: false, count: 8 },
      {
        key: "company-report", name: "年度报告", shared: false, count: 6,
        children: [
          { key: "company-report-2023", name: "2023年度", shared: false, count: 3 },
          { key: "company-report-2024", name: "2024年度", shared: true, count: 3 },
        ],
      },
    ],
  },
  {
    key: "dept", name: "部门空间", shared: true, count: 126,
    children: [
      {
        key: "dept-rd", name: "研发部", shared: true, count: 42,
        children: [
          { key: "rd-spec", name: "技术规范", shared: true, count: 15 },
          { key: "rd-project", name: "项目文档", shared: true, count: 18 },
          { key: "rd-review", name: "代码评审", shared: false, count: 9 },
        ],
      },
      {
        key: "dept-pd", name: "产品部", shared: true, count: 35,
        children: [
          { key: "pd-req", name: "需求文档", shared: true, count: 20 },
          { key: "pd-design", name: "设计稿", shared: true, count: 15 },
        ],
      },
      {
        key: "dept-mk", name: "市场部", shared: true, count: 28,
        children: [
          { key: "mk-event", name: "活动方案", shared: false, count: 16 },
          { key: "mk-case", name: "客户案例", shared: true, count: 12 },
        ],
      },
      {
        key: "dept-hr", name: "人力资源部", shared: true, count: 21,
        children: [
          { key: "hr-policy", name: "人事制度", shared: false, count: 21 },
        ],
      },
    ],
  },
  {
    key: "project", name: "项目空间", shared: true, count: 64,
    children: [
      {
        key: "proj-park", name: "智慧园区项目", shared: true, count: 24,
        children: [
          { key: "park-req", name: "需求", shared: true, count: 8 },
          { key: "park-design", name: "设计", shared: true, count: 9 },
          { key: "park-test", name: "测试", shared: false, count: 7 },
        ],
      },
      {
        key: "proj-data", name: "数据中台", shared: true, count: 22,
        children: [
          { key: "data-doc", name: "文档", shared: true, count: 22 },
        ],
      },
      {
        key: "proj-mobile", name: "移动端重构", shared: true, count: 18,
        children: [
          { key: "mobile-src", name: "源码", shared: false, count: 18 },
        ],
      },
    ],
  },
  {
    key: "shared", name: "共享与我", shared: true, count: 19,
    children: [
      { key: "shared-review", name: "季度复盘", shared: true, count: 7 },
      { key: "shared-plan", name: "产品规划", shared: true, count: 12 },
    ],
  },
];

// 文件类型 → 图标 + 分类色（数据分类，consistent mapping）
export const typeMeta = {
  doc: { icon: "file-text", label: "文档" },
  sheet: { icon: "file-spreadsheet", label: "表格" },
  slide: { icon: "presentation", label: "演示" },
  pdf: { icon: "file-text", label: "PDF" },
  image: { icon: "file-image", label: "图片" },
  archive: { icon: "file-archive", label: "压缩包" },
};

// 共享状态元数据 — color 走 antd Tag preset，皮肤映射 token、暗色自动跟随
export const shareMeta = {
  private: { label: "私有", color: "default" },
  shared: { label: "共享", color: "blue" },
  public: { label: "公开链接", color: "success" },
};

// 14 项文件（文件名+类型匹配、大小量级合理、3 种共享状态混合）
export const files = [
  { id: "f1", name: "合同_2024Q1", ext: "docx", type: "doc", size: 2516582, sizeText: "2.4 MB", updaterId: "u2", updateTime: "2024-10-26 14:32", updateTs: 1729930320, shareStatus: "private", space: "company-rules", spacePath: ["company", "company-rules"], collaborators: ["u2", "u3", "u5"] },
  { id: "f2", name: "设计稿_首页_v3", ext: "fig", type: "image", size: 9122611, sizeText: "8.7 MB", updaterId: "u3", updateTime: "2024-10-27 09:18", updateTs: 1729996680, shareStatus: "shared", space: "pd-design", spacePath: ["dept", "dept-pd", "pd-design"], collaborators: ["u3", "u2", "u4", "u6"] },
  { id: "f3", name: "数据表_客户名单", ext: "xlsx", type: "sheet", size: 1258291, sizeText: "1.2 MB", updaterId: "u4", updateTime: "2024-10-25 16:05", updateTs: 1729843500, shareStatus: "public", space: "mk-case", spacePath: ["dept", "dept-mk", "mk-case"], collaborators: ["u4", "u5", "u7"] },
  { id: "f4", name: "季度汇报_2024Q2", ext: "pptx", type: "slide", size: 7130317, sizeText: "6.8 MB", updaterId: "u5", updateTime: "2024-10-24 11:42", updateTs: 1729741320, shareStatus: "shared", space: "company-report-2024", spacePath: ["company", "company-report", "company-report-2024"], collaborators: ["u5", "u1", "u2", "u3"] },
  { id: "f5", name: "产品需求文档_PRD", ext: "docx", type: "doc", size: 552960, sizeText: "540 KB", updaterId: "u3", updateTime: "2024-10-27 15:50", updateTs: 1730017800, shareStatus: "shared", space: "pd-req", spacePath: ["dept", "dept-pd", "pd-req"], collaborators: ["u3", "u2", "u4"] },
  { id: "f6", name: "架构设计图", ext: "png", type: "image", size: 3355443, sizeText: "3.2 MB", updaterId: "u2", updateTime: "2024-10-23 10:27", updateTs: 1729655220, shareStatus: "public", space: "rd-spec", spacePath: ["dept", "dept-rd", "rd-spec"], collaborators: ["u2", "u3", "u7"] },
  { id: "f7", name: "接口规范_v2", ext: "pdf", type: "pdf", size: 1887437, sizeText: "1.8 MB", updaterId: "u2", updateTime: "2024-10-22 17:36", updateTs: 1729598160, shareStatus: "shared", space: "rd-spec", spacePath: ["dept", "dept-rd", "rd-spec"], collaborators: ["u2", "u7", "u6"] },
  { id: "f8", name: "测试用例集", ext: "xlsx", type: "sheet", size: 943718, sizeText: "920 KB", updaterId: "u6", updateTime: "2024-10-21 13:12", updateTs: 1729495920, shareStatus: "private", space: "park-test", spacePath: ["project", "proj-park", "park-test"], collaborators: ["u6", "u2", "u5"] },
  { id: "f9", name: "项目资料归档", ext: "zip", type: "archive", size: 47815065, sizeText: "45.6 MB", updaterId: "u7", updateTime: "2024-10-20 09:45", updateTs: 1729404300, shareStatus: "shared", space: "rd-project", spacePath: ["dept", "dept-rd", "rd-project"], collaborators: ["u7", "u2", "u3", "u4"] },
  { id: "f10", name: "培训视频脚本", ext: "docx", type: "doc", size: 389120, sizeText: "380 KB", updaterId: "u1", updateTime: "2024-10-19 16:20", updateTs: 1729340400, shareStatus: "public", space: "hr-policy", spacePath: ["dept", "dept-hr", "hr-policy"], collaborators: ["u1", "u5", "u4"] },
  { id: "f11", name: "财务报表_年度", ext: "xlsx", type: "sheet", size: 2202009, sizeText: "2.1 MB", updaterId: "u4", updateTime: "2024-10-18 08:55", updateTs: 1729232100, shareStatus: "private", space: "company-report-2023", spacePath: ["company", "company-report", "company-report-2023"], collaborators: ["u4", "u1", "u2"] },
  { id: "f12", name: "品牌Logo源文件", ext: "zip", type: "archive", size: 13002343, sizeText: "12.4 MB", updaterId: "u3", updateTime: "2024-10-17 14:08", updateTs: 1729154880, shareStatus: "public", space: "pd-design", spacePath: ["dept", "dept-pd", "pd-design"], collaborators: ["u3", "u4", "u5"] },
  { id: "f13", name: "会议纪要_周会", ext: "docx", type: "doc", size: 98304, sizeText: "96 KB", updaterId: "u5", updateTime: "2024-10-28 10:30", updateTs: 1730099400, shareStatus: "shared", space: "shared-review", spacePath: ["shared", "shared-review"], collaborators: ["u5", "u1", "u2", "u3", "u4"] },
  { id: "f14", name: "源码备份_前端", ext: "zip", type: "archive", size: 30298214, sizeText: "28.9 MB", updaterId: "u6", updateTime: "2024-10-16 19:33", updateTs: 1729085580, shareStatus: "private", space: "mobile-src", spacePath: ["project", "proj-mobile", "mobile-src"], collaborators: ["u6", "u2", "u7"] },
];

// 最近访问（6 条快速入口）
export const recentAccess = [
  { id: "f4", name: "季度汇报_2024Q2", ext: "pptx", time: "2小时前", space: "公司文档 / 年度报告" },
  { id: "f2", name: "设计稿_首页_v3", ext: "fig", time: "昨天", space: "部门空间 / 产品部" },
  { id: "f3", name: "数据表_客户名单", ext: "xlsx", time: "3天前", space: "部门空间 / 市场部" },
  { id: "f1", name: "合同_2024Q1", ext: "docx", time: "5天前", space: "公司文档 / 规章制度" },
  { id: "f9", name: "项目资料归档", ext: "zip", time: "上周", space: "部门空间 / 研发部" },
  { id: "f11", name: "财务报表_年度", ext: "xlsx", time: "上周", space: "公司文档 / 年度报告" },
];

// 存储用量（已用 168GB / 总量 200GB = 84%，超 80% 警示）
export const storage = { used: 168, total: 200, unit: "GB" };

// 搜索历史与热词
export const searchHistory = ["合同 2024", "设计稿 首页", "季度汇报", "客户名单"];
export const searchHot = ["年度报告", "PRD 模板", "设计规范", "客户名单", "架构图", "财务报表"];

// 最近动态模板（详情面板时间轴）
export const activityTemplates = [
  { action: "编辑了文档", icon: "pencil" },
  { action: "新增了评论", icon: "message-square" },
  { action: "分享了访问链接", icon: "share-2" },
];
export const activityTimes = ["2小时前", "昨天 16:20", "3天前"];

// 树路径查找：key → [{key, name}, ...]（含所有祖先）
export function getTreePath(key) {
  if (!key) return [{ key: "all", name: "全部文档" }];
  const path = [];
  const walk = (nodes) => {
    for (const n of nodes) {
      path.push({ key: n.key, name: n.name });
      if (n.key === key) return true;
      if (n.children && walk(n.children)) return true;
      path.pop();
    }
    return false;
  };
  walk(treeRaw);
  return path.length ? path : [{ key: "all", name: "全部文档" }];
}

// 节点显示名查找
export function getNodeName(key) {
  const path = getTreePath(key);
  return path[path.length - 1].name;
}
