// 组织架构数据 — 4 层（公司 → 事业部 → 部门 → 小组），共 33 节点
// count 字段表示直接归属该节点的成员数（叶子小组 + 部门级管理者）

export const orgTreeData = [
  {
    key: "org-root",
    title: "星辰科技",
    parentKey: null,
    level: 0,
    count: 3,
    children: [
      {
        key: "org-tech",
        title: "技术研发事业部",
        parentKey: "org-root",
        level: 1,
        count: 2,
        children: [
          {
            key: "org-tech-rd",
            title: "技术研发部",
            parentKey: "org-tech",
            level: 2,
            count: 13,
            children: [
              { key: "org-tech-rd-fe", title: "前端组", parentKey: "org-tech-rd", level: 3, count: 8 },
              { key: "org-tech-rd-be", title: "后端组", parentKey: "org-tech-rd", level: 3, count: 11 },
              { key: "org-tech-rd-mob", title: "移动端组", parentKey: "org-tech-rd", level: 3, count: 6 },
            ],
          },
          {
            key: "org-tech-infra",
            title: "基础架构部",
            parentKey: "org-tech",
            level: 2,
            count: 5,
            children: [
              { key: "org-tech-infra-ops", title: "运维组", parentKey: "org-tech-infra", level: 3, count: 6 },
              { key: "org-tech-infra-sec", title: "安全组", parentKey: "org-tech-infra", level: 3, count: 4 },
            ],
          },
          {
            key: "org-tech-qa",
            title: "测试质量部",
            parentKey: "org-tech",
            level: 2,
            count: 4,
            children: [
              { key: "org-tech-qa-func", title: "功能测试组", parentKey: "org-tech-qa", level: 3, count: 7 },
              { key: "org-tech-qa-perf", title: "性能测试组", parentKey: "org-tech-qa", level: 3, count: 5 },
            ],
          },
        ],
      },
      {
        key: "org-product",
        title: "产品设计事业部",
        parentKey: "org-root",
        level: 1,
        count: 2,
        children: [
          {
            key: "org-product-pm",
            title: "产品部",
            parentKey: "org-product",
            level: 2,
            count: 5,
            children: [
              { key: "org-product-pm-ur", title: "用户研究组", parentKey: "org-product-pm", level: 3, count: 4 },
              { key: "org-product-pm-rp", title: "需求规划组", parentKey: "org-product-pm", level: 3, count: 6 },
            ],
          },
          {
            key: "org-product-design",
            title: "设计部",
            parentKey: "org-product",
            level: 2,
            count: 3,
            children: [
              { key: "org-product-design-vis", title: "视觉设计组", parentKey: "org-product-design", level: 3, count: 5 },
              { key: "org-product-design-ux", title: "交互设计组", parentKey: "org-product-design", level: 3, count: 4 },
            ],
          },
        ],
      },
      {
        key: "org-market",
        title: "市场运营事业部",
        parentKey: "org-root",
        level: 1,
        count: 2,
        children: [
          {
            key: "org-market-mk",
            title: "市场部",
            parentKey: "org-market",
            level: 2,
            count: 4,
            children: [
              { key: "org-market-mk-brand", title: "品牌推广组", parentKey: "org-market-mk", level: 3, count: 5 },
              { key: "org-market-mk-content", title: "内容营销组", parentKey: "org-market-mk", level: 3, count: 6 },
            ],
          },
          {
            key: "org-market-op",
            title: "运营部",
            parentKey: "org-market",
            level: 2,
            count: 3,
            children: [
              { key: "org-market-op-user", title: "用户运营组", parentKey: "org-market-op", level: 3, count: 7 },
              { key: "org-market-op-data", title: "数据分析组", parentKey: "org-market-op", level: 3, count: 5 },
            ],
          },
        ],
      },
      {
        key: "org-admin",
        title: "行政人事事业部",
        parentKey: "org-root",
        level: 1,
        count: 2,
        children: [
          {
            key: "org-admin-hr",
            title: "人力资源部",
            parentKey: "org-admin",
            level: 2,
            count: 4,
            children: [
              { key: "org-admin-hr-rec", title: "招聘组", parentKey: "org-admin-hr", level: 3, count: 6 },
              { key: "org-admin-hr-tr", title: "培训组", parentKey: "org-admin-hr", level: 3, count: 4 },
            ],
          },
          {
            key: "org-admin-ga",
            title: "行政事务部",
            parentKey: "org-admin",
            level: 2,
            count: 3,
            children: [
              { key: "org-admin-ga-log", title: "后勤组", parentKey: "org-admin-ga", level: 3, count: 5 },
              { key: "org-admin-ga-fin", title: "财务组", parentKey: "org-admin-ga", level: 3, count: 6 },
            ],
          },
        ],
      },
    ],
  },
];

// 扁平化节点映射 — 用于按 key 快速查找节点信息
export const orgNodeMap = (() => {
  const map = {};
  const walk = (nodes) => {
    nodes.forEach((n) => {
      map[n.key] = n;
      if (n.children) walk(n.children);
    });
  };
  walk(orgTreeData);
  return map;
})();

// 部门路径文案 — 拼接祖先 title
export function getDeptPath(key) {
  const path = [];
  let cur = orgNodeMap[key];
  while (cur) {
    path.unshift(cur.title);
    cur = cur.parentKey ? orgNodeMap[cur.parentKey] : null;
  }
  return path.join(" / ");
}

// 用于新建部门 Modal 的父级层级下拉数据（仅 0/1/2 层可选为父级，3 层为叶子）
export const parentLevelOptions = [
  {
    value: "org-root",
    label: "星辰科技（公司）",
    level: 0,
    children: [
      {
        value: "org-tech",
        label: "技术研发事业部",
        level: 1,
        children: [
          { value: "org-tech-rd", label: "技术研发部", level: 2 },
          { value: "org-tech-infra", label: "基础架构部", level: 2 },
          { value: "org-tech-qa", label: "测试质量部", level: 2 },
        ],
      },
      {
        value: "org-product",
        label: "产品设计事业部",
        level: 1,
        children: [
          { value: "org-product-pm", label: "产品部", level: 2 },
          { value: "org-product-design", label: "设计部", level: 2 },
        ],
      },
      {
        value: "org-market",
        label: "市场运营事业部",
        level: 1,
        children: [
          { value: "org-market-mk", label: "市场部", level: 2 },
          { value: "org-market-op", label: "运营部", level: 2 },
        ],
      },
      {
        value: "org-admin",
        label: "行政人事事业部",
        level: 1,
        children: [
          { value: "org-admin-hr", label: "人力资源部", level: 2 },
          { value: "org-admin-ga", label: "行政事务部", level: 2 },
        ],
      },
    ],
  },
];
