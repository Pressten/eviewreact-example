// Layer 2: 各类选择器/下拉的 mock 数据
// 语义 key，贴近真实业务字段。
// 字段对齐 eview：扁平选项 { value, text }；树节点 { id, text, children? }。

// 单选 Select — 区域
export const regionOptions = [
  { value: "huabei", text: "华北" },
  { value: "huadong", text: "华东" },
  { value: "huanan", text: "华南" },
  { value: "huaxi", text: "华西" },
  { value: "huazhong", text: "华中" },
];

// 多选 Select — 工单标签
export const tagOptions = [
  { value: "urgent", text: "紧急" },
  { value: "normal", text: "常规" },
  { value: "low", text: "低优" },
  { value: "follow", text: "跟进中" },
  { value: "done", text: "已完成" },
  { value: "blocked", text: "阻塞" },
];

// inputSelect — 搜索类别前缀
export const categoryOptions = [
  { value: "name", text: "按名称" },
  { value: "id", text: "按 ID" },
  { value: "ip", text: "按 IP" },
];

// TreeSelect — 组织架构树（节点：{ id, text, children? }）
export const orgTreeData = [
  {
    id: "root",
    text: "总公司",
    children: [
      {
        id: "rd",
        text: "研发中心",
        children: [
          { id: "rd-fe", text: "前端组" },
          { id: "rd-be", text: "后端组" },
          { id: "rd-qa", text: "测试组" },
        ],
      },
      {
        id: "ops",
        text: "运维中心",
        children: [
          { id: "ops-net", text: "网络组" },
          { id: "ops-sec", text: "安全组" },
        ],
      },
      {
        id: "pd",
        text: "产品中心",
        children: [
          { id: "pd-req", text: "需求组" },
          { id: "pd-design", text: "设计组" },
        ],
      },
    ],
  },
];
