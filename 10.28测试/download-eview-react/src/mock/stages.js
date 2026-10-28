// 销售漏斗 5 阶段
export const stages = [
  { key: "contact",   label: "初步接触", shortLabel: "接触", color: "#2070F3", order: 0 },
  { key: "confirm",   label: "需求确认", shortLabel: "确认", color: "#7B61FF", order: 1 },
  { key: "proposal",  label: "方案报价", shortLabel: "报价", color: "#00A8A8", order: 2 },
  { key: "negotiate", label: "商务谈判", shortLabel: "谈判", color: "#F4840C", order: 3 },
  { key: "signing",   label: "签约中",   shortLabel: "签约", color: "#09AA71", order: 4 },
];

export const stageMap = Object.fromEntries(stages.map((s) => [s.key, s]));

// 商机下一步动作类型
export const actionTypes = {
  call:     { label: "电话", color: "#2070F3" },
  visit:    { label: "拜访", color: "#7B61FF" },
  proposal: { label: "方案", color: "#00A8A8" },
  contract: { label: "合同", color: "#09AA71" },
};

export const productLineOptions = [
  { value: "all",       text: "全部产品线" },
  { value: "cloud",     text: "云服务" },
  { value: "hardware",  text: "智能硬件" },
  { value: "solution",  text: "行业解决方案" },
  { value: "software",  text: "软件订阅" },
];

export const productLineMap = {
  cloud: "云服务",
  hardware: "智能硬件",
  solution: "行业解决方案",
  software: "软件订阅",
};

export const deptOptions = [
  { value: "all",   text: "全部部门" },
  { value: "ind-1", text: "行业一部" },
  { value: "ind-2", text: "行业二部" },
  { value: "gov",   text: "政企部" },
];

export const timeRangeOptions = [
  { value: "quarter", text: "本季度" },
  { value: "month",   text: "本月" },
  { value: "week",    text: "本周" },
];

export const timeRangeMap = {
  quarter: "本季度",
  month: "本月",
  week: "本周",
};
