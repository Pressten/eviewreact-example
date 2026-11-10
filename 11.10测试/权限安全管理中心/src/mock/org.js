// Layer 2 mock — 组织架构与成员数据
// 语义化字段：orgId / deptId / deptName / teamId / teamName / userName / roleId / phone / joinDate / status

export const ORG_INFO = { orgId: "org-xltech-001", orgName: "星联科技有限公司" };

export const ROOT_NODE_KEY = "org-root";

export const DEPTS = [
  {
    deptId: "dept-tech",
    deptName: "技术研发部",
    teams: [
      { teamId: "team-fe", teamName: "前端组" },
      { teamId: "team-be", teamName: "后端组" },
      { teamId: "team-qa", teamName: "测试组" },
    ],
  },
  {
    deptId: "dept-ops",
    deptName: "运营部",
    teams: [
      { teamId: "team-ug", teamName: "用户运营组" },
      { teamId: "team-ag", teamName: "活动运营组" },
      { teamId: "team-cs", teamName: "客服组" },
    ],
  },
  {
    deptId: "dept-fin",
    deptName: "财务部",
    teams: [
      { teamId: "team-acct", teamName: "会计核算组" },
      { teamId: "team-treas", teamName: "资金管理组" },
    ],
  },
  {
    deptId: "dept-mkt",
    deptName: "市场部",
    teams: [
      { teamId: "team-brand", teamName: "品牌推广组" },
      { teamId: "team-ch", teamName: "渠道合作组" },
    ],
  },
  {
    deptId: "dept-hr",
    deptName: "人力资源部",
    teams: [
      { teamId: "team-recruit", teamName: "招聘组" },
      { teamId: "team-train", teamName: "培训发展组" },
    ],
  },
  {
    deptId: "dept-legal",
    deptName: "法务合规部",
    teams: [
      { teamId: "team-comp", teamName: "合规审查组" },
      { teamId: "team-risk", teamName: "风控审计组" },
    ],
  },
];

// teamId → { teamName, deptId, deptName } 索引，用于成员与部门联查
export const TEAM_INDEX = DEPTS.reduce((acc, dept) => {
  dept.teams.forEach((team) => {
    acc[team.teamId] = { teamName: team.teamName, deptId: dept.deptId, deptName: dept.deptName };
  });
  return acc;
}, {});

// [userName, teamId, roleId, phone, joinDate, status]
const RAW_MEMBERS = [
  // 技术研发部 · 前端组
  ["陈志远", "team-fe", "role-super", "13902316688", "2021-03-15", "active"],
  ["周予安", "team-fe", "role-super", "13811759022", "2022-06-20", "active"],
  ["林晓彤", "team-fe", "role-ops", "15600372154", "2023-02-13", "active"],
  ["吴启明", "team-fe", "role-ops", "18701564093", "2023-09-04", "active"],
  // 技术研发部 · 后端组
  ["郭建豪", "team-be", "role-super", "13522908471", "2020-11-08", "active"],
  ["孙一鸣", "team-be", "role-super", "15910883264", "2021-08-16", "active"],
  ["郑天佑", "team-be", "role-super", "18612975035", "2022-04-25", "active"],
  ["何佳妮", "team-be", "role-ops-mgr", "17301642859", "2023-07-10", "active"],
  // 技术研发部 · 测试组
  ["罗永康", "team-qa", "role-super", "13161452908", "2021-12-06", "active"],
  ["许静文", "team-qa", "role-super", "13260135784", "2022-10-31", "active"],
  ["高志成", "team-qa", "role-ops", "15810674912", "2024-01-15", "active"],
  ["韩雪", "team-qa", "role-guest", "18603291750", "2024-05-20", "disabled"],
  // 运营部 · 用户运营组
  ["唐嘉懿", "team-ug", "role-super", "13910645237", "2020-07-13", "active"],
  ["冯思远", "team-ug", "role-ops-mgr", "13718360295", "2021-05-08", "active"],
  ["苏婉清", "team-ug", "role-ops-mgr", "15510728463", "2022-09-19", "active"],
  ["卢晓东", "team-ug", "role-ops", "17600351247", "2023-03-27", "active"],
  ["杜若溪", "team-ug", "role-ops", "18515063982", "2023-11-11", "active"],
  // 运营部 · 活动运营组
  ["江浩然", "team-ag", "role-ops-mgr", "13621087534", "2021-10-14", "active"],
  ["侯佳颖", "team-ag", "role-ops", "15901273648", "2022-08-02", "active"],
  ["曹志强", "team-ag", "role-ops", "18611940273", "2024-02-18", "active"],
  // 运营部 · 客服组
  ["白诗诗", "team-cs", "role-ops-mgr", "13426370195", "2022-01-23", "active"],
  ["顾长风", "team-cs", "role-ops", "17710682940", "2023-06-30", "active"],
  // 财务部 · 会计核算组
  ["秦淑芬", "team-acct", "role-fin", "13311584206", "2019-04-22", "active"],
  ["程雪", "team-acct", "role-fin", "15010673918", "2021-02-15", "active"],
  ["任正华", "team-acct", "role-fin", "13920246175", "2022-05-09", "active"],
  // 财务部 · 资金管理组
  ["石磊", "team-treas", "role-fin", "13661530847", "2020-09-07", "active"],
  ["姚美琳", "team-treas", "role-fin", "18810962432", "2023-04-16", "active"],
  ["潘俊铭", "team-treas", "role-fin", "15601249760", "2024-03-11", "disabled"],
  // 市场部 · 品牌推广组
  ["邵文静", "team-brand", "role-ops-mgr", "13552076814", "2021-01-18", "active"],
  ["尹浩宇", "team-brand", "role-ops-mgr", "18910635278", "2022-03-06", "active"],
  ["柳如烟", "team-brand", "role-ops", "15811369420", "2023-08-21", "active"],
  ["段飞", "team-brand", "role-ops", "17611580396", "2024-04-02", "active"],
  // 市场部 · 渠道合作组
  ["华志强", "team-ch", "role-super", "13011864579", "2020-05-25", "active"],
  ["阮清梅", "team-ch", "role-ops-mgr", "15701639284", "2021-09-13", "active"],
  ["康敏", "team-ch", "role-ops", "18612940875", "2023-01-30", "active"],
  ["贺子秋", "team-ch", "role-ops", "13391586042", "2023-12-25", "disabled"],
  // 人力资源部 · 招聘组
  ["龙美娟", "team-recruit", "role-super", "13501247698", "2020-03-16", "active"],
  ["马小玲", "team-recruit", "role-ops", "15910583726", "2022-11-07", "active"],
  ["宋雨桐", "team-recruit", "role-ops", "18701695340", "2024-06-14", "active"],
  // 人力资源部 · 培训发展组
  ["范明辉", "team-train", "role-super", "13120584763", "2021-06-28", "active"],
  ["董文丽", "team-train", "role-ops-mgr", "15610874092", "2022-02-17", "active"],
  ["邹凯", "team-train", "role-ops", "17601395287", "2023-10-09", "active"],
  ["金玲", "team-train", "role-guest", "13811650943", "2024-07-22", "active"],
  // 法务合规部 · 合规审查组
  ["严明", "team-comp", "role-super", "13661587420", "2020-08-10", "active"],
  ["沈亦非", "team-comp", "role-auditor", "13701648295", "2021-04-19", "active"],
  ["章含韵", "team-comp", "role-auditor", "15910863247", "2023-05-23", "active"],
  // 法务合规部 · 风控审计组
  ["聂海峰", "team-risk", "role-auditor", "18611953804", "2022-07-04", "active"],
  ["崔成杰", "team-risk", "role-guest", "15510749268", "2024-08-18", "active"],
];

export const INITIAL_MEMBERS = RAW_MEMBERS.map((row, index) => ({
  memberId: `M${String(index + 1).padStart(3, "0")}`,
  userName: row[0],
  teamId: row[1],
  roleId: row[2],
  phone: row[3],
  joinDate: row[4],
  status: row[5],
}));

// 手机号脱敏：139****6688
export function maskPhone(phone) {
  return phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
}
