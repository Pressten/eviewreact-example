// Layer 2: 各类选择器/下拉的 mock 数据
// 语义 key，贴近真实业务字段。

// 单选 Select — 区域
export const regionOptions = [
  { value: "huabei", label: "华北" },
  { value: "huadong", label: "华东" },
  { value: "huanan", label: "华南" },
  { value: "huaxi", label: "华西" },
  { value: "huazhong", label: "华中" },
];

// 多选 Select — 工单标签
export const tagOptions = [
  { value: "urgent", label: "紧急" },
  { value: "normal", label: "常规" },
  { value: "low", label: "低优" },
  { value: "follow", label: "跟进中" },
  { value: "done", label: "已完成" },
  { value: "blocked", label: "阻塞" },
];

// inputSelect — 搜索类别前缀
export const categoryOptions = [
  { value: "name", label: "按名称" },
  { value: "id", label: "按 ID" },
  { value: "ip", label: "按 IP" },
];

// TreeSelect — 组织架构树
export const orgTreeData = [
  {
    title: "总公司",
    value: "root",
    key: "root",
    children: [
      {
        title: "研发中心",
        value: "rd",
        key: "rd",
        children: [
          { title: "前端组", value: "rd-fe", key: "rd-fe" },
          { title: "后端组", value: "rd-be", key: "rd-be" },
          { title: "测试组", value: "rd-qa", key: "rd-qa" },
        ],
      },
      {
        title: "运维中心",
        value: "ops",
        key: "ops",
        children: [
          { title: "网络组", value: "ops-net", key: "ops-net" },
          { title: "安全组", value: "ops-sec", key: "ops-sec" },
        ],
      },
      {
        title: "产品中心",
        value: "pd",
        key: "pd",
        children: [
          { title: "需求组", value: "pd-req", key: "pd-req" },
          { title: "设计组", value: "pd-design", key: "pd-design" },
        ],
      },
    ],
  },
];
