// 排片优化建议 — 内容与影城 A 网格数据对应
export const suggestions = [
  {
    suggestionId: "S01",
    type: "add",
    icon: "trending-up",
    title: "《星际远征》黄金时段加场",
    content: "《星际远征》1 号厅 16:50 场次上座率达 96%，黄金档需求旺盛。建议 1 号厅 19:30 加排一场 IMAX 版本，预计新增票房约 2.8 万元。",
    affectedShowtimes: ["ST-1-4"],
    affectedHalls: [1],
  },
  {
    suggestionId: "S02",
    type: "reduce",
    icon: "trending-down",
    title: "《幽灵密码》低上座率减场",
    content: "《幽灵密码》连排 3 场上座率均不足 20%（4 号厅 19%、5 号厅 19%、6 号厅 18%），排片密度过高。建议减少 6 号厅晚间场次，释放排片资源给高需求影片。",
    affectedShowtimes: ["ST-4-3", "ST-5-1", "ST-6-5"],
    affectedHalls: [4, 5, 6],
  },
  {
    suggestionId: "S03",
    type: "conflict",
    icon: "triangle-alert",
    title: "3 号厅场次间隔不足",
    content: "3 号厅 12:58 场次与上一场（11:10-12:48）间隔仅 10 分钟，清洁与散场时间不足。建议将该场次推迟至 13:10，留足 20 分钟清洁时间。",
    affectedShowtimes: ["ST-3-3"],
    affectedHalls: [3],
  },
];
