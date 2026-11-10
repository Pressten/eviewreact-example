// 在映影片库 — 8 部影片，按累计票房降序排列
export const films = [
  { filmId: "F01", filmName: "星际远征", duration: 142, genre: "科幻/冒险", distributor: "环宇影业",
    releaseDate: "2026-10-15", daysInRelease: 15, cumulativeBoxOffice: 38.62, avgOccupancy: 72,
    supportedVersions: ["2D", "3D", "IMAX", "激光"], posterColor: "#2070f3" },
  { filmId: "F02", filmName: "暗夜追踪", duration: 128, genre: "动作/犯罪", distributor: "光影传媒",
    releaseDate: "2026-10-22", daysInRelease: 8, cumulativeBoxOffice: 22.35, avgOccupancy: 65,
    supportedVersions: ["2D", "IMAX"], posterColor: "#62B42E" },
  { filmId: "F03", filmName: "江湖儿女", duration: 118, genre: "剧情/武侠", distributor: "华夏发行",
    releaseDate: "2026-10-18", daysInRelease: 12, cumulativeBoxOffice: 18.78, avgOccupancy: 58,
    supportedVersions: ["2D"], posterColor: "#715AFB" },
  { filmId: "F04", filmName: "深海奇遇", duration: 105, genre: "动画/冒险", distributor: "蓝鲸动画",
    releaseDate: "2026-10-25", daysInRelease: 5, cumulativeBoxOffice: 15.20, avgOccupancy: 68,
    supportedVersions: ["3D", "激光", "2D"], posterColor: "#2CB8C9" },
  { filmId: "F05", filmName: "末日防线", duration: 132, genre: "动作/科幻", distributor: "环宇影业",
    releaseDate: "2026-10-20", daysInRelease: 10, cumulativeBoxOffice: 12.88, avgOccupancy: 54,
    supportedVersions: ["IMAX", "2D", "激光"], posterColor: "#F69E39" },
  { filmId: "F06", filmName: "星河往事", duration: 110, genre: "爱情/剧情", distributor: "新视野影业",
    releaseDate: "2026-10-26", daysInRelease: 4, cumulativeBoxOffice: 6.45, avgOccupancy: 41,
    supportedVersions: ["2D"], posterColor: "#5CA2E9" },
  { filmId: "F07", filmName: "幽灵密码", duration: 122, genre: "悬疑/惊悚", distributor: "暗线工作室",
    releaseDate: "2026-10-24", daysInRelease: 6, cumulativeBoxOffice: 4.82, avgOccupancy: 35,
    supportedVersions: ["2D", "激光"], posterColor: "#BF68FA" },
  { filmId: "F08", filmName: "童话王国", duration: 98, genre: "动画/家庭", distributor: "蓝鲸动画",
    releaseDate: "2026-10-28", daysInRelease: 2, cumulativeBoxOffice: 2.36, avgOccupancy: 48,
    supportedVersions: ["2D", "3D"], posterColor: "#ED448A" },
];

export const filmMap = {};
films.forEach(function (f) { filmMap[f.filmId] = f; });
