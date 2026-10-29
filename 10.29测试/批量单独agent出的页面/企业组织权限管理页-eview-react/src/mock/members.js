// 成员数据 — 主要归属「技术研发部」（默认选中），其他节点亦填充数名
// role: super_admin | dept_admin | editor | member
// status: active | suspended | left

export const memberList = [
  // —— 技术研发部 直接归属（13 人，默认选中节点） ——
  { id: "M001", name: "王立群", avatar: "/uploads/user.png", employeeId: "EMP10001", deptKey: "org-tech-rd", role: "super_admin", supervisor: "—（CEO）", status: "active", lastActive: "2026-10-21 09:42", email: "wanglq@xingchen.com", phone: "138-0010-0001", joinDate: "2018-03-12", title: "技术副总裁" },
  { id: "M002", name: "张明远", avatar: "/uploads/user.png", employeeId: "EMP10002", deptKey: "org-tech-rd", role: "dept_admin", supervisor: "王立群", status: "active", lastActive: "2026-10-21 09:30", email: "zhangmy@xingchen.com", phone: "138-0010-0002", joinDate: "2018-06-04", title: "技术研发部经理" },
  { id: "M003", name: "郑雪松", avatar: "/uploads/user.png", employeeId: "EMP10005", deptKey: "org-tech-rd", role: "dept_admin", supervisor: "王立群", status: "active", lastActive: "2026-10-21 07:55", email: "zhengxs@xingchen.com", phone: "138-0010-0005", joinDate: "2019-02-18", title: "架构师" },
  { id: "M004", name: "李思雨", avatar: "/uploads/user.png", employeeId: "EMP10012", deptKey: "org-tech-rd", role: "editor", supervisor: "张明远", status: "active", lastActive: "2026-10-20 18:11", email: "lisy@xingchen.com", phone: "138-0010-0012", joinDate: "2020-07-22", title: "高级工程师" },
  { id: "M005", name: "陈志强", avatar: "/uploads/user.png", employeeId: "EMP10018", deptKey: "org-tech-rd", role: "editor", supervisor: "张明远", status: "active", lastActive: "2026-10-21 09:15", email: "chenzq@xingchen.com", phone: "138-0010-0018", joinDate: "2020-09-08", title: "高级工程师" },
  { id: "M006", name: "赵静雯", avatar: "/uploads/user.png", employeeId: "EMP10024", deptKey: "org-tech-rd", role: "editor", supervisor: "张明远", status: "active", lastActive: "2026-10-21 08:30", email: "zhaojw@xingchen.com", phone: "138-0010-0024", joinDate: "2021-01-15", title: "工程师" },
  { id: "M007", name: "周梦琪", avatar: "/uploads/user.png", employeeId: "EMP10031", deptKey: "org-tech-rd", role: "editor", supervisor: "张明远", status: "active", lastActive: "2026-10-20 16:48", email: "zhoumq@xingchen.com", phone: "138-0010-0031", joinDate: "2021-04-20", title: "工程师" },
  { id: "M008", name: "黄雅琪", avatar: "/uploads/user.png", employeeId: "EMP10039", deptKey: "org-tech-rd", role: "editor", supervisor: "张明远", status: "active", lastActive: "2026-10-21 02:08", email: "huangyq@xingchen.com", phone: "138-0010-0039", joinDate: "2021-08-11", title: "工程师" },
  { id: "M009", name: "刘海洋", avatar: "/uploads/user.png", employeeId: "EMP10044", deptKey: "org-tech-rd", role: "member", supervisor: "张明远", status: "active", lastActive: "2026-10-21 06:35", email: "liuhy@xingchen.com", phone: "138-0010-0044", joinDate: "2022-03-01", title: "初级工程师" },
  { id: "M010", name: "吴俊杰", avatar: "/uploads/user.png", employeeId: "EMP10050", deptKey: "org-tech-rd", role: "member", supervisor: "张明远", status: "active", lastActive: "2026-10-21 03:22", email: "wujj@xingchen.com", phone: "138-0010-0050", joinDate: "2022-06-14", title: "初级工程师" },
  { id: "M011", name: "林子涵", avatar: "/uploads/user.png", employeeId: "EMP10057", deptKey: "org-tech-rd", role: "member", supervisor: "张明远", status: "active", lastActive: "2026-10-20 21:50", email: "linzh@xingchen.com", phone: "138-0010-0057", joinDate: "2022-09-05", title: "初级工程师" },
  { id: "M012", name: "高文博", avatar: "/uploads/user.png", employeeId: "EMP10063", deptKey: "org-tech-rd", role: "member", supervisor: "张明远", status: "active", lastActive: "2026-10-20 09:18", email: "gaowb@xingchen.com", phone: "138-0010-0063", joinDate: "2023-02-27", title: "初级工程师" },
  { id: "M013", name: "孙浩天", avatar: "/uploads/user.png", employeeId: "EMP10068", deptKey: "org-tech-rd", role: "member", supervisor: "张明远", status: "suspended", lastActive: "2026-10-14 11:30", email: "sunht@xingchen.com", phone: "138-0010-0068", joinDate: "2023-05-19", title: "初级工程师" },
  { id: "M014", name: "苏文昊", avatar: "/uploads/user.png", employeeId: "EMP10071", deptKey: "org-tech-rd", role: "editor", supervisor: "张明远", status: "active", lastActive: "2026-10-21 09:08", email: "suwh@xingchen.com", phone: "138-0010-0071", joinDate: "2021-11-30", title: "高级工程师" },
  { id: "M015", name: "沈梦辰", avatar: "/uploads/user.png", employeeId: "EXT20001", deptKey: "org-tech-rd", role: "external_collaborator", supervisor: "冯思源", status: "active", lastActive: "2026-10-21 08:42", email: "shenmc@vendor.com", phone: "139-0020-0001", joinDate: "2024-04-15", title: "外部前端工程师" },
  { id: "M016", name: "何嘉欣", avatar: "/uploads/user.png", employeeId: "EXT20002", deptKey: "org-tech-rd", role: "external_collaborator", supervisor: "张明远", status: "active", lastActive: "2026-10-20 19:15", email: "hejx@vendor.com", phone: "139-0020-0002", joinDate: "2024-06-20", title: "外部UI设计师" },
  { id: "M017", name: "朱梓辰", avatar: "/uploads/user.png", employeeId: "EMP10075", deptKey: "org-tech-rd", role: "member", supervisor: "张明远", status: "active", lastActive: "2026-10-21 05:50", email: "zhuzc@xingchen.com", phone: "138-0010-0075", joinDate: "2024-07-08", title: "实习生" },
  { id: "M018", name: "范雨欣", avatar: "/uploads/user.png", employeeId: "EXT20003", deptKey: "org-tech-rd", role: "external_collaborator", supervisor: "张明远", status: "suspended", lastActive: "2026-10-10 14:30", email: "fanyx@vendor.com", phone: "139-0020-0003", joinDate: "2024-08-12", title: "外部测试工程师" },
  { id: "M019", name: "谢明远", avatar: "/uploads/user.png", employeeId: "EMP10079", deptKey: "org-tech-rd", role: "editor", supervisor: "张明远", status: "active", lastActive: "2026-10-21 07:22", email: "xiemy@xingchen.com", phone: "138-0010-0079", joinDate: "2022-11-14", title: "高级工程师" },

  // —— 前端组（8 人） ——
  { id: "M101", name: "冯思源", avatar: "/uploads/user.png", employeeId: "EMP10102", deptKey: "org-tech-rd-fe", role: "editor", supervisor: "张明远", status: "active", lastActive: "2026-10-21 09:48", email: "fengsy@xingchen.com", phone: "138-0010-0102", joinDate: "2020-10-12", title: "前端组长" },
  { id: "M102", name: "蒋雨萱", avatar: "/uploads/user.png", employeeId: "EMP10103", deptKey: "org-tech-rd-fe", role: "editor", supervisor: "冯思源", status: "active", lastActive: "2026-10-21 09:25", email: "jiangyx@xingchen.com", phone: "138-0010-0103", joinDate: "2021-03-08", title: "前端工程师" },
  { id: "M103", name: "韩明轩", avatar: "/uploads/user.png", employeeId: "EMP10104", deptKey: "org-tech-rd-fe", role: "member", supervisor: "冯思源", status: "active", lastActive: "2026-10-20 22:14", email: "hanmx@xingchen.com", phone: "138-0010-0104", joinDate: "2022-04-15", title: "前端工程师" },
  { id: "M104", name: "宋佳怡", avatar: "/uploads/user.png", employeeId: "EMP10105", deptKey: "org-tech-rd-fe", role: "member", supervisor: "冯思源", status: "active", lastActive: "2026-10-21 08:50", email: "songjy@xingchen.com", phone: "138-0010-0105", joinDate: "2022-07-22", title: "前端工程师" },
  { id: "M105", name: "邓子墨", avatar: "/uploads/user.png", employeeId: "EMP10106", deptKey: "org-tech-rd-fe", role: "member", supervisor: "冯思源", status: "active", lastActive: "2026-10-21 04:11", email: "dengzm@xingchen.com", phone: "138-0010-0106", joinDate: "2023-01-10", title: "前端工程师" },
  { id: "M106", name: "曾雅琳", avatar: "/uploads/user.png", employeeId: "EMP10107", deptKey: "org-tech-rd-fe", role: "member", supervisor: "冯思源", status: "active", lastActive: "2026-10-20 19:33", email: "zengyl@xingchen.com", phone: "138-0010-0107", joinDate: "2023-04-18", title: "前端工程师" },
  { id: "M107", name: "彭浩然", avatar: "/uploads/user.png", employeeId: "EMP10108", deptKey: "org-tech-rd-fe", role: "member", supervisor: "冯思源", status: "active", lastActive: "2026-10-20 15:20", email: "penghr@xingchen.com", phone: "138-0010-0108", joinDate: "2023-08-30", title: "前端工程师" },
  { id: "M108", name: "蔡沐辰", avatar: "/uploads/user.png", employeeId: "EMP10109", deptKey: "org-tech-rd-fe", role: "member", supervisor: "冯思源", status: "suspended", lastActive: "2026-10-09 14:22", email: "caimc@xingchen.com", phone: "138-0010-0109", joinDate: "2024-02-14", title: "前端工程师" },

  // —— 后端组（11 人） ——
  { id: "M201", name: "魏国栋", avatar: "/uploads/user.png", employeeId: "EMP10201", deptKey: "org-tech-rd-be", role: "dept_admin", supervisor: "张明远", status: "active", lastActive: "2026-10-21 09:51", email: "weigd@xingchen.com", phone: "138-0010-0201", joinDate: "2019-05-20", title: "后端组长" },
  { id: "M202", name: "罗紫宁", avatar: "/uploads/user.png", employeeId: "EMP10202", deptKey: "org-tech-rd-be", role: "editor", supervisor: "魏国栋", status: "active", lastActive: "2026-10-21 08:18", email: "luozn@xingchen.com", phone: "138-0010-0202", joinDate: "2020-11-03", title: "高级后端工程师" },
  { id: "M203", name: "汪子睿", avatar: "/uploads/user.png", employeeId: "EMP10203", deptKey: "org-tech-rd-be", role: "editor", supervisor: "魏国栋", status: "active", lastActive: "2026-10-21 07:42", email: "wangzr@xingchen.com", phone: "138-0010-0203", joinDate: "2021-06-15", title: "后端工程师" },
  { id: "M204", name: "石雨泽", avatar: "/uploads/user.png", employeeId: "EMP10204", deptKey: "org-tech-rd-be", role: "editor", supervisor: "魏国栋", status: "active", lastActive: "2026-10-20 23:55", email: "shiyz@xingchen.com", phone: "138-0010-0204", joinDate: "2021-09-28", title: "后端工程师" },
  { id: "M205", name: "熊若曦", avatar: "/uploads/user.png", employeeId: "EMP10205", deptKey: "org-tech-rd-be", role: "editor", supervisor: "魏国栋", status: "active", lastActive: "2026-10-20 17:30", email: "xiongrx@xingchen.com", phone: "138-0010-0205", joinDate: "2022-02-11", title: "后端工程师" },
  { id: "M206", name: "马君浩", avatar: "/uploads/user.png", employeeId: "EMP10206", deptKey: "org-tech-rd-be", role: "member", supervisor: "魏国栋", status: "active", lastActive: "2026-10-21 05:08", email: "majh@xingchen.com", phone: "138-0010-0206", joinDate: "2022-05-19", title: "后端工程师" },
  { id: "M207", name: "邱芷涵", avatar: "/uploads/user.png", employeeId: "EMP10207", deptKey: "org-tech-rd-be", role: "member", supervisor: "魏国栋", status: "active", lastActive: "2026-10-21 01:45", email: "qiuzh@xingchen.com", phone: "138-0010-0207", joinDate: "2022-10-08", title: "后端工程师" },
  { id: "M208", name: "孟锦程", avatar: "/uploads/user.png", employeeId: "EMP10208", deptKey: "org-tech-rd-be", role: "member", supervisor: "魏国栋", status: "active", lastActive: "2026-10-20 20:12", email: "mengjc@xingchen.com", phone: "138-0010-0208", joinDate: "2023-03-22", title: "后端工程师" },
  { id: "M209", name: "尹梓萱", avatar: "/uploads/user.png", employeeId: "EMP10209", deptKey: "org-tech-rd-be", role: "member", supervisor: "魏国栋", status: "active", lastActive: "2026-10-20 14:55", email: "yinzx@xingchen.com", phone: "138-0010-0209", joinDate: "2023-07-04", title: "后端工程师" },
  { id: "M210", name: "潘宇凡", avatar: "/uploads/user.png", employeeId: "EMP10210", deptKey: "org-tech-rd-be", role: "member", supervisor: "魏国栋", status: "active", lastActive: "2026-10-20 11:38", email: "panyf@xingchen.com", phone: "138-0010-0210", joinDate: "2024-01-16", title: "后端工程师" },
  { id: "M211", name: "范子瑜", avatar: "/uploads/user.png", employeeId: "EMP10211", deptKey: "org-tech-rd-be", role: "member", supervisor: "魏国栋", status: "left", lastActive: "2026-09-30 18:00", email: "fanzy@xingchen.com", phone: "138-0010-0211", joinDate: "2024-05-20", title: "后端工程师" },

  // —— 移动端组（6 人） ——
  { id: "M301", name: "于晓东", avatar: "/uploads/user.png", employeeId: "EMP10301", deptKey: "org-tech-rd-mob", role: "editor", supervisor: "张明远", status: "active", lastActive: "2026-10-21 09:36", email: "yuxd@xingchen.com", phone: "138-0010-0301", joinDate: "2020-12-08", title: "移动端组长" },
  { id: "M302", name: "严慕白", avatar: "/uploads/user.png", employeeId: "EMP10302", deptKey: "org-tech-rd-mob", role: "editor", supervisor: "于晓东", status: "active", lastActive: "2026-10-21 08:55", email: "yanmb@xingchen.com", phone: "138-0010-0302", joinDate: "2021-05-22", title: "移动端工程师" },
  { id: "M303", name: "史凌薇", avatar: "/uploads/user.png", employeeId: "EMP10303", deptKey: "org-tech-rd-mob", role: "member", supervisor: "于晓东", status: "active", lastActive: "2026-10-21 06:48", email: "shilw@xingchen.com", phone: "138-0010-0303", joinDate: "2022-08-30", title: "移动端工程师" },
  { id: "M304", name: "康嘉树", avatar: "/uploads/user.png", employeeId: "EMP10304", deptKey: "org-tech-rd-mob", role: "member", supervisor: "于晓东", status: "active", lastActive: "2026-10-20 22:10", email: "kangjs@xingchen.com", phone: "138-0010-0304", joinDate: "2023-04-11", title: "移动端工程师" },
  { id: "M305", name: "白若溪", avatar: "/uploads/user.png", employeeId: "EMP10305", deptKey: "org-tech-rd-mob", role: "member", supervisor: "于晓东", status: "active", lastActive: "2026-10-20 16:25", email: "bairx@xingchen.com", phone: "138-0010-0305", joinDate: "2024-01-22", title: "移动端工程师" },
  { id: "M306", name: "景子谦", avatar: "/uploads/user.png", employeeId: "EMP10306", deptKey: "org-tech-rd-mob", role: "member", supervisor: "于晓东", status: "suspended", lastActive: "2026-10-12 13:18", email: "jingzq@xingchen.com", phone: "138-0010-0306", joinDate: "2024-06-18", title: "移动端工程师" },

  // —— 技术研发事业部 直接归属（2 人，事业部级管理者） ——
  { id: "M401", name: "邵文渊", avatar: "/uploads/user.png", employeeId: "EMP10000", deptKey: "org-tech", role: "super_admin", supervisor: "—（CEO）", status: "active", lastActive: "2026-10-21 09:58", email: "shaowy@xingchen.com", phone: "138-0010-0000", joinDate: "2017-08-01", title: "事业部总经理" },
  { id: "M402", name: "钱雅蓉", avatar: "/uploads/user.png", employeeId: "EMP10003", deptKey: "org-tech", role: "dept_admin", supervisor: "邵文渊", status: "active", lastActive: "2026-10-21 09:20", email: "qianyr@xingchen.com", phone: "138-0010-0003", joinDate: "2018-10-15", title: "事业部运营经理" },

  // —— 公司总部 直接归属（3 人，高管层） ——
  { id: "M501", name: "方承洲", avatar: "/uploads/user.png", employeeId: "EMP00001", deptKey: "org-root", role: "super_admin", supervisor: "—（董事会）", status: "active", lastActive: "2026-10-21 09:48", email: "fangcz@xingchen.com", phone: "138-0000-0001", joinDate: "2016-01-01", title: "首席执行官" },
  { id: "M502", name: "姚念慈", avatar: "/uploads/user.png", employeeId: "EMP00002", deptKey: "org-root", role: "dept_admin", supervisor: "方承洲", status: "active", lastActive: "2026-10-21 09:35", email: "yaonc@xingchen.com", phone: "138-0000-0002", joinDate: "2016-05-20", title: "首席运营官" },
  { id: "M503", name: "董昭阳", avatar: "/uploads/user.png", employeeId: "EMP00003", deptKey: "org-root", role: "dept_admin", supervisor: "方承洲", status: "active", lastActive: "2026-10-21 09:12", email: "dongzy@xingchen.com", phone: "138-0000-0003", joinDate: "2017-02-14", title: "首席财务官" },

  // —— 基础架构部 直接归属（5 人） ——
  { id: "M601", name: "阮思琪", avatar: "/uploads/user.png", employeeId: "EMP10401", deptKey: "org-tech-infra", role: "dept_admin", supervisor: "邵文渊", status: "active", lastActive: "2026-10-21 09:28", email: "ruansq@xingchen.com", phone: "138-0010-0401", joinDate: "2019-04-12", title: "基础架构部经理" },
  { id: "M602", name: "唐梓豪", avatar: "/uploads/user.png", employeeId: "EMP10402", deptKey: "org-tech-infra", role: "editor", supervisor: "阮思琪", status: "active", lastActive: "2026-10-21 08:42", email: "tangzh@xingchen.com", phone: "138-0010-0402", joinDate: "2020-06-08", title: "高级架构师" },
  { id: "M603", name: "雷嘉懿", avatar: "/uploads/user.png", employeeId: "EMP10403", deptKey: "org-tech-infra", role: "editor", supervisor: "阮思琪", status: "active", lastActive: "2026-10-20 21:15", email: "leijy@xingchen.com", phone: "138-0010-0403", joinDate: "2021-03-25", title: "架构师" },
  { id: "M604", name: "尹乐康", avatar: "/uploads/user.png", employeeId: "EMP10404", deptKey: "org-tech-infra", role: "member", supervisor: "阮思琪", status: "active", lastActive: "2026-10-21 03:50", email: "yinlk@xingchen.com", phone: "138-0010-0404", joinDate: "2022-09-19", title: "运维工程师" },
  { id: "M605", name: "潘雅韶", avatar: "/uploads/user.png", employeeId: "EMP10405", deptKey: "org-tech-infra", role: "member", supervisor: "阮思琪", status: "suspended", lastActive: "2026-10-08 16:40", email: "panyz@xingchen.com", phone: "138-0010-0405", joinDate: "2023-05-30", title: "运维工程师" },

  // —— 产品设计事业部 直接归属（2 人） ——
  { id: "M701", name: "钟慕白", avatar: "/uploads/user.png", employeeId: "EMP20000", deptKey: "org-product", role: "dept_admin", supervisor: "方承洲", status: "active", lastActive: "2026-10-21 09:44", email: "zhongmb@xingchen.com", phone: "138-0020-0001", joinDate: "2018-04-10", title: "事业部总经理" },
  { id: "M702", name: "汪诗韵", avatar: "/uploads/user.png", employeeId: "EMP20003", deptKey: "org-product", role: "editor", supervisor: "钟慕白", status: "active", lastActive: "2026-10-21 08:50", email: "wangsy@xingchen.com", phone: "138-0020-0003", joinDate: "2019-09-22", title: "事业部运营经理" },
];

// 按部门 key 分组（仅直接归属）
export const membersByDept = memberList.reduce((acc, m) => {
  if (!acc[m.deptKey]) acc[m.deptKey] = [];
  acc[m.deptKey].push(m);
  return acc;
}, {});

// 角色枚举与显示配置（5 色 Tag，含外部协作）
export const roleConfig = {
  super_admin: { label: "超级管理员", color: "red", desc: "拥有企业全部功能权限，可管理所有部门、成员与角色配置，仅授予核心高管。" },
  dept_admin: { label: "部门管理员", color: "orange", desc: "管理本部门成员与权限，可邀请与停用部门成员，无法跨部门操作。" },
  editor: { label: "编辑", color: "green", desc: "可创建与编辑业务内容，具备日常作业所需的读写权限。" },
  external_collaborator: { label: "外部协作", color: "purple", desc: "外部顾问与外包人员，仅授予特定应用模块的查看与配置权限，有效期受合同约束。" },
  member: { label: "普通成员", color: "default", desc: "仅查看权限，适用于实习、外包与一般职员。" },
};
