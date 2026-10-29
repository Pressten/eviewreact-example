export const teams = [
  { key: "huadong", name: "华东大区", code: "HD", color: "#0067D1", pending: 1850, lead: "张明远" },
  { key: "huanan",  name: "华南大区", code: "HN", color: "#09AA71", pending: 1420, lead: "孙伟杰" },
  { key: "huabei",  name: "华北大区", code: "HB", color: "#F4840C", pending: 980,  lead: "徐凯" },
];

export const teamMap = Object.fromEntries(teams.map((t) => [t.key, t]));
