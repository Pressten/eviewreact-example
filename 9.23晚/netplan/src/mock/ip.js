// Layer 2: IP 规划 mock 数据（确定性伪随机，保证每次渲染一致）

function createRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return function next() {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

const rand = createRandom(20260922);

const REGIONS = ["总部园区", "华南分部", "华北分部", "西部数据中心", "华东研发中心", "海外分支"];
const PURPOSES = ["办公终端", "服务器区", "无线终端", "视频会议", "语音专线", "IoT 终端", "网络管理", "访客网络"];
const SITES = ["A 座核心机房", "B 座汇聚机房", "灾备机房", "边缘接入机房"];
const DEPTS = ["网络运维部", "信息安全部", "研发中心", "行政人事部", "财务共享中心", "客户服务中心"];
const VENDORS = ["S6730-H48X6C", "S5732-H24UM2CC", "AirEngine 5761-11", "S5735-L24T4X"];
const MASKS = {
  22: "255.255.252.0",
  23: "255.255.254.0",
  24: "255.255.255.0",
  25: "255.255.255.128",
};
const PREFIXES = [22, 23, 24, 25];

function hex(value) {
  return value.toString(16).toUpperCase().padStart(2, "0");
}

// —— 1. 网段规划 ——
function segmentStatus(index) {
  if (index % 9 === 3) return "冲突";
  if (index % 7 === 5) return "空闲";
  if (index % 7 === 2) return "待确认";
  if (index % 5 === 1) return "规划中";
  return "使用中";
}

export const segmentRows = Array.from({ length: 20 }, (_, index) => {
  const region = REGIONS[index % REGIONS.length];
  const purpose = PURPOSES[index % PURPOSES.length];
  const prefix = PREFIXES[index % PREFIXES.length];
  const usable = Math.pow(2, 32 - prefix) - 2;
  const status = segmentStatus(index);
  const allocated = status === "空闲" ? 0 : Math.round(usable * (0.12 + rand() * 0.78));
  return {
    key: "segment-" + (index + 1),
    code: "SGT-" + (1024 + index * 3),
    name: region + "-" + purpose + "-" + String(index + 1).padStart(2, "0"),
    cidr: "10." + (20 + (index % 6)) + "." + (8 + index * 4) + ".0/" + prefix,
    mask: MASKS[prefix],
    usable: usable,
    allocated: allocated,
    usage: Math.round((allocated / usable) * 100),
    region: region,
    purpose: purpose,
    status: status,
  };
});

// —— 2. 子网划分 ——
export const subnetRows = Array.from({ length: 18 }, (_, index) => {
  const region = REGIONS[index % REGIONS.length];
  const purpose = PURPOSES[(index + 3) % PURPOSES.length];
  const prefix = 24 + (index % 2);
  const third = 8 + (index % 10) * 4;
  const fourth = (index % 4) * 64;
  return {
    key: "subnet-" + (index + 1),
    name: region + "-" + purpose + "-SUB-" + String(index + 1).padStart(2, "0"),
    parentCidr: "10." + (20 + (index % 6)) + "." + third + ".0/22",
    cidr: "10." + (20 + (index % 6)) + "." + third + "." + fourth + "/" + prefix,
    prefix: prefix,
    gateway: "10." + (20 + (index % 6)) + "." + third + "." + (fourth + 1),
    vlanId: 100 + (index % 12) * 10,
    usable: Math.pow(2, 32 - prefix) - 2,
    status: index % 11 === 6 ? "待确认" : index % 8 === 4 ? "冲突" : index % 6 === 2 ? "规划中" : "使用中",
  };
});

// —— 3. VLAN 规划 ——
export const vlanRows = Array.from({ length: 20 }, (_, index) => {
  const region = REGIONS[index % REGIONS.length];
  const purpose = PURPOSES[(index + 5) % PURPOSES.length];
  const third = 16 + (index % 12) * 8;
  return {
    key: "vlan-" + (index + 1),
    vlanId: 100 + index * 10,
    name: region + "-" + purpose + "-VLAN",
    cidr: "10." + (20 + (index % 6)) + "." + third + ".0/24",
    gateway: "10." + (20 + (index % 6)) + "." + third + ".1",
    purpose: purpose,
    site: SITES[index % SITES.length],
    status: index % 10 === 7 ? "空闲" : index % 6 === 3 ? "待确认" : index % 5 === 2 ? "规划中" : "使用中",
  };
});

// —— 4. 静态地址分配 ——
export const staticRows = Array.from({ length: 16 }, (_, index) => {
  const region = REGIONS[index % REGIONS.length];
  return {
    key: "static-" + (index + 1),
    ip: "10." + (20 + (index % 6)) + "." + (8 + index * 4) + "." + (10 + index),
    mac: "A4-3B-1C-" + hex(16 + index) + "-" + hex(32 + index * 3) + "-" + hex(48 + index * 5),
    device: SITES[index % SITES.length] + " · " + region + "汇聚交换机",
    vendor: VENDORS[index % VENDORS.length],
    dept: DEPTS[index % DEPTS.length],
    assignedAt: "2026-0" + (5 + (index % 5)) + "-" + String(6 + ((index * 2) % 20)).padStart(2, "0") + " 09:" + String(10 + index * 3).padStart(2, "0"),
    status: index % 9 === 5 ? "冲突" : index % 7 === 3 ? "已释放" : index % 5 === 1 ? "待确认" : "已绑定",
  };
});

// —— Tab 元数据：告警块 + 表格 ——
export const ipTabs = [
  {
    key: "segment",
    label: "网段规划",
    rows: segmentRows,
    createLabel: "新增网段",
    notice: {
      type: "warning",
      title: "检测到 3 个网段存在地址冲突",
      desc: "冲突网段：总部园区-视频会议-04、西部数据中心-网络管理-13、海外分支-办公终端-16，请调整后重新提交规划。",
    },
  },
  {
    key: "subnet",
    label: "子网划分",
    rows: subnetRows,
    createLabel: "新增子网",
    notice: {
      type: "info",
      title: "子网划分建议保留 25% 地址余量",
      desc: "当前 18 个子网中有 5 个使用率已超过 75%，后续扩容可能触发重新划分，建议提前规划冗余地址。",
    },
  },
  {
    key: "vlan",
    label: "VLAN 规划",
    rows: vlanRows,
    createLabel: "新增 VLAN",
    notice: {
      type: "warning",
      title: "VLAN 2200 ~ 2290 尚未关联网段",
      desc: "未关联网段的 VLAN 无法下发至设备，请先在「网段规划」中完成地址分配后再关联。",
    },
  },
  {
    key: "pool",
    label: "地址池管理",
    rows: [],
    createLabel: "新增地址池",
    notice: {
      type: "info",
      title: "尚未配置 DHCP 地址池",
      desc: "地址池用于终端地址的自动分配，配置完成后可同步至各站点 DHCP 服务。",
    },
    emptyTitle: "暂无数据",
    emptyDesc: "尚未配置 DHCP 地址池，点击「新增地址池」开始规划",
  },
  {
    key: "static",
    label: "静态地址分配",
    rows: staticRows,
    createLabel: "新增绑定",
    notice: {
      type: "success",
      title: "静态地址绑定已同步至 3 台核心设备",
      desc: "最近同步时间 2026-09-20 09:42，同步成功率 100%，未发现绑定冲突。",
    },
  },
  {
    key: "reserved",
    label: "保留地址",
    rows: [],
    createLabel: "新增保留地址",
    notice: {
      type: "info",
      title: "保留地址用于网关、VRRP 虚地址与管理接口",
      desc: "保留地址不参与自动分配，当前保留规则较少，建议为核心设备补齐管理口地址。",
    },
    emptyTitle: "暂无数据",
    emptyDesc: "暂无保留地址，点击「新增保留地址」登记网关或虚地址",
  },
];
