import dayjs from "dayjs";

// Layer 2: 设备监控域 mock 数据(确定性伪随机,保证每次构建数据一致)

function createRandom(seed) {
  let s = seed >>> 0;
  return function next() {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t = (t + Math.imul(t ^ (t >>> 7), t | 61)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const REGIONS = ["华北", "华东", "华南", "西南", "西北", "东北"];

export const STATUS_LIST = [
  { key: "running", label: "运行中", tone: "success", icon: "circle-check-big" },
  { key: "alarm", label: "告警", tone: "error", icon: "triangle-alert" },
  { key: "stopped", label: "停机", tone: "critical", icon: "power" },
  { key: "offline", label: "离线", tone: "neutral", icon: "wifi-off" }
];

export const STATUS_MAP = STATUS_LIST.reduce((acc, item) => {
  acc[item.key] = item;
  return acc;
}, {});

export const DEVICE_TYPES = [
  { key: "wind", label: "风机", icon: "wind" },
  { key: "pv", label: "光伏逆变器", icon: "sun" },
  { key: "ess", label: "储能装置", icon: "battery-charging" },
  { key: "env", label: "环境监测仪", icon: "thermometer" },
  { key: "camera", label: "视频监控", icon: "video" }
];

export const DEVICE_TYPE_MAP = DEVICE_TYPES.reduce((acc, item) => {
  acc[item.key] = item;
  return acc;
}, {});

const SITES = {
  华北: ["华北风电场", "京北光伏电站"],
  华东: ["华东储能电站", "申城光伏基地"],
  华南: ["岭南风电场", "深圳湾储能站"],
  西南: ["蜀山风电场", "蓉城光伏电站"],
  西北: ["戈壁风电基地", "敦煌光伏电站"],
  东北: ["松辽风电场", "长春光伏基地"]
};

const OWNERS = ["王建国", "李明", "张伟", "刘洋", "陈静", "赵磊", "孙悦", "周涛", "吴敏", "郑浩"];

// 固定状态配比:14 运行 / 6 告警 / 4 停机 / 4 离线,保证状态多样性
const STATUS_PLAN = [
  "running", "running", "alarm", "running", "stopped", "running", "offline", "running",
  "alarm", "running", "running", "stopped", "running", "alarm", "offline", "running",
  "running", "alarm", "running", "stopped", "running", "running", "alarm", "offline",
  "running", "running", "alarm", "running"
];

function buildDevices() {
  const rand = createRandom(20260923);
  const list = [];
  for (let i = 0; i < 28; i++) {
    const region = REGIONS[i % REGIONS.length];
    const type = DEVICE_TYPES[(i * 3 + 1) % DEVICE_TYPES.length];
    const site = SITES[region][i % 2];
    const unit = String.fromCharCode(65 + (i % 6)) + ((i % 9) + 1);
    const status = STATUS_PLAN[i % STATUS_PLAN.length];
    const statusMeta = STATUS_MAP[status];

    let loadRate = 0;
    if (status === "running") loadRate = Math.round((42 + rand() * 50) * 10) / 10;
    if (status === "alarm") loadRate = Math.round((58 + rand() * 36) * 10) / 10;

    let alarmCount = 0;
    if (status === "alarm") alarmCount = 2 + Math.floor(rand() * 8);
    else if (status === "running" && rand() < 0.3) alarmCount = 1;

    const maintainDays = 5 + Math.floor(rand() * 120);

    list.push({
      deviceCode: "DEV-" + (1001 + i),
      deviceName: site + " " + unit + " 机组",
      region: region,
      deviceType: type.key,
      status: status,
      statusLabel: statusMeta.label,
      loadRate: loadRate,
      alarmCount: alarmCount,
      owner: OWNERS[i % OWNERS.length],
      lastMaintain: dayjs().subtract(maintainDays, "day").format("YYYY-MM-DD")
    });
  }
  return list;
}

export const DEVICES = buildDevices();

// —— 联动统计 ——

export function countByStatus(devices) {
  return STATUS_LIST.map((item) => ({
    key: item.key,
    label: item.label,
    value: devices.filter((d) => d.status === item.key).length
  }));
}

export function countByRegion(devices) {
  return REGIONS.map((region) => ({
    region: region,
    value: devices.filter((d) => d.region === region).length
  }));
}

// —— 趋势数据 ——

export function getRecentDayLabels() {
  const labels = [];
  for (let i = 6; i >= 0; i--) {
    labels.push(dayjs().subtract(i, "day").format("MM-DD"));
  }
  return labels;
}

export function getOverallTrend() {
  const rand = createRandom(70301);
  return getRecentDayLabels().map((day) => ({
    日期: day,
    平均负载率: Math.round((52 + rand() * 12) * 10) / 10,
    峰值负载率: Math.round((78 + rand() * 16) * 10) / 10
  }));
}

export function getDeviceTrend(device) {
  const seed = parseInt(device.deviceCode.replace("DEV-", ""), 10) * 97;
  const rand = createRandom(seed);
  return getRecentDayLabels().map((day) => {
    let value = 0;
    if (device.status === "running") {
      value = Math.round((55 + rand() * 28) * 10) / 10;
    } else if (device.status === "alarm") {
      // 告警设备:偶发负载尖峰
      const spike = rand() < 0.3;
      value = Math.round((spike ? 88 + rand() * 8 : 60 + rand() * 22) * 10) / 10;
    } else {
      value = Math.round(rand() * 4 * 10) / 10;
    }
    return { 日期: day, 负载率: value };
  });
}
