// Layer 2: 目录树 mock 数据
export const treeData = [
  {
    title: "华东数据中心",
    key: "east",
    icon: "server",
    children: [
      {
        title: "上海机房",
        key: "east-sh",
        children: [
          { title: "机柜 A-01", key: "east-sh-a01" },
          { title: "机柜 A-02", key: "east-sh-a02" },
          { title: "机柜 B-01", key: "east-sh-b01" },
        ],
      },
      {
        title: "杭州机房",
        key: "east-hz",
        children: [
          { title: "机柜 C-01", key: "east-hz-c01" },
          { title: "机柜 C-02", key: "east-hz-c02" },
        ],
      },
    ],
  },
  {
    title: "华南数据中心",
    key: "south",
    icon: "server",
    children: [
      {
        title: "深圳机房",
        key: "south-sz",
        children: [
          { title: "机柜 D-01", key: "south-sz-d01" },
          { title: "机柜 D-02", key: "south-sz-d02" },
        ],
      },
    ],
  },
  {
    title: "华北数据中心",
    key: "north",
    icon: "server",
    children: [
      {
        title: "北京机房",
        key: "north-bj",
        children: [
          { title: "机柜 E-01", key: "north-bj-e01" },
          { title: "机柜 E-02", key: "north-bj-e02" },
        ],
      },
    ],
  },
];
