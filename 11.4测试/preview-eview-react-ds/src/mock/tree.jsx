// Layer 2: 目录树 mock 数据
import { IconPlusIcIctServers } from '@hui/icon-plus';

export const treeData = [
  {
    text: "华东数据中心",
    id: "east",
    icon: <IconPlusIcIctServers iconSize="1rem" iconColor={['currentcolor']} />,
    children: [
      {
        text: "上海机房",
        id: "east-sh",
        children: [
          { text: "机柜 A-01", id: "east-sh-a01" },
          { text: "机柜 A-02", id: "east-sh-a02" },
          { text: "机柜 B-01", id: "east-sh-b01" },
        ],
      },
      {
        text: "杭州机房",
        id: "east-hz",
        children: [
          { text: "机柜 C-01", id: "east-hz-c01" },
          { text: "机柜 C-02", id: "east-hz-c02" },
        ],
      },
    ],
  },
  {
    text: "华南数据中心",
    id: "south",
    icon: <IconPlusIcIctServers iconSize="1rem" iconColor={['currentcolor']} />,
    children: [
      {
        text: "深圳机房",
        id: "south-sz",
        children: [
          { text: "机柜 D-01", id: "south-sz-d01" },
          { text: "机柜 D-02", id: "south-sz-d02" },
        ],
      },
    ],
  },
  {
    text: "华北数据中心",
    id: "north",
    icon: <IconPlusIcIctServers iconSize="1rem" iconColor={['currentcolor']} />,
    children: [
      {
        text: "北京机房",
        id: "north-bj",
        children: [
          { text: "机柜 E-01", id: "north-bj-e01" },
          { text: "机柜 E-02", id: "north-bj-e02" },
        ],
      },
    ],
  },
];
