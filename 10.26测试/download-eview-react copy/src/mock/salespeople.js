// 销售团队(每大区 6 人,共 18 人)
export const salespeople = [
  // 华东
  { id: "s1", name: "张明远", team: "huadong", dept: "ind-1", deptName: "行业一部", target: 3200, avgCycle: 42, rankChange: 2,  color: "#0067D1", initials: "张" },
  { id: "s2", name: "李思雨", team: "huadong", dept: "ind-2", deptName: "行业二部", target: 2800, avgCycle: 38, rankChange: -1, color: "#7B61FF", initials: "李" },
  { id: "s3", name: "王志强", team: "huadong", dept: "ind-1", deptName: "行业一部", target: 2400, avgCycle: 45, rankChange: 0,  color: "#00A8A8", initials: "王" },
  { id: "s4", name: "陈晓彤", team: "huadong", dept: "ind-2", deptName: "行业二部", target: 2400, avgCycle: 50, rankChange: 1,  color: "#F4840C", initials: "陈" },
  { id: "s5", name: "刘建国", team: "huadong", dept: "gov",   deptName: "政企部",   target: 2400, avgCycle: 55, rankChange: -2, color: "#E02128", initials: "刘" },
  { id: "s6", name: "赵敏华", team: "huadong", dept: "gov",   deptName: "政企部",   target: 2000, avgCycle: 48, rankChange: 0,  color: "#FCC800", initials: "赵" },
  // 华南
  { id: "s7",  name: "孙伟杰", team: "huanan", dept: "ind-1", deptName: "行业一部", target: 2600, avgCycle: 40, rankChange: 1,  color: "#0067D1", initials: "孙" },
  { id: "s8",  name: "周晓彤", team: "huanan", dept: "ind-2", deptName: "行业二部", target: 2400, avgCycle: 44, rankChange: -1, color: "#7B61FF", initials: "周" },
  { id: "s9",  name: "吴海燕", team: "huanan", dept: "ind-1", deptName: "行业一部", target: 2200, avgCycle: 46, rankChange: 2,  color: "#00A8A8", initials: "吴" },
  { id: "s10", name: "郑文博", team: "huanan", dept: "ind-2", deptName: "行业二部", target: 2400, avgCycle: 52, rankChange: 0,  color: "#F4840C", initials: "郑" },
  { id: "s11", name: "黄俊豪", team: "huanan", dept: "gov",   deptName: "政企部",   target: 2200, avgCycle: 58, rankChange: -2, color: "#E02128", initials: "黄" },
  { id: "s12", name: "林芳",   team: "huanan", dept: "gov",   deptName: "政企部",   target: 1800, avgCycle: 49, rankChange: 0,  color: "#FCC800", initials: "林" },
  // 华北
  { id: "s13", name: "徐凯",   team: "huabei", dept: "ind-1", deptName: "行业一部", target: 2400, avgCycle: 42, rankChange: 1,  color: "#0067D1", initials: "徐" },
  { id: "s14", name: "何静",   team: "huabei", dept: "ind-2", deptName: "行业二部", target: 2000, avgCycle: 45, rankChange: -1, color: "#7B61FF", initials: "何" },
  { id: "s15", name: "罗志强", team: "huabei", dept: "ind-1", deptName: "行业一部", target: 2200, avgCycle: 48, rankChange: 1,  color: "#00A8A8", initials: "罗" },
  { id: "s16", name: "梁雅婷", team: "huabei", dept: "ind-2", deptName: "行业二部", target: 2200, avgCycle: 50, rankChange: 0,  color: "#F4840C", initials: "梁" },
  { id: "s17", name: "蔡文胜", team: "huabei", dept: "gov",   deptName: "政企部",   target: 1800, avgCycle: 54, rankChange: -1, color: "#E02128", initials: "蔡" },
  { id: "s18", name: "邓丽娟", team: "huabei", dept: "gov",   deptName: "政企部",   target: 1600, avgCycle: 60, rankChange: 0,  color: "#FCC800", initials: "邓" },
];

export const ownerMap = Object.fromEntries(salespeople.map((s) => [s.id, s]));
