export const navItems = ["概览", "部署", "资源池", "物理资源", "对接"];

export const wizardSteps = [
  { title: "网络规划" },
  { title: "区域配置" },
  { title: "选择设备" },
  { title: "设备上线" },
];

export const planningTypes = [
  { label: "经典配置规划", value: "classic" },
  { label: "自定义规划", value: "custom" },
];

export const managementOptions = [
  { label: "带外管理网", value: "outband" },
  { label: "带内管理网", value: "inband" },
];

export const networkShapeOptions = [
  { label: "M-LAG", value: "mlag" },
  { label: "VXLAN", value: "vxlan" },
];

export const ipPoolTabs = [
  { key: "interconnect", label: "互联IP池" },
  { key: "vtep", label: "Vtep IP池" },
  { key: "bgppeer", label: "BGP PEER IP池" },
  { key: "vtepmac", label: "Vtep MAC池" },
  { key: "staticroute", label: "静态路由" },
  { key: "vxlanbypass", label: "Vxlan-ByPass-IP池" },
];

export const ipPoolDataMap = {
  interconnect: [
    { id: 1, startIp: "192.168.1.10", endIp: "192.168.1.50", mask: "255.255.255.0" },
    { id: 2, startIp: "192.168.1.60", endIp: "192.168.1.100", mask: "255.255.255.0" },
    { id: 3, startIp: "10.1.1.10", endIp: "10.1.1.40", mask: "255.255.255.128" },
    { id: 4, startIp: "10.1.1.50", endIp: "10.1.1.80", mask: "255.255.255.128" },
    { id: 5, startIp: "172.16.0.10", endIp: "172.16.0.60", mask: "255.255.255.0" },
    { id: 6, startIp: "172.16.1.10", endIp: "172.16.1.60", mask: "255.255.255.0" },
  ],
  vtep: [],
  bgppeer: [
    { id: 1, startIp: "10.10.0.10", endIp: "10.10.0.20", mask: "255.255.255.252" },
    { id: 2, startIp: "10.10.0.30", endIp: "10.10.0.40", mask: "255.255.255.252" },
  ],
  vtepmac: [],
  staticroute: [],
  vxlanbypass: [],
};

export const fabricMgmtOptions = [
  { label: "新建", value: "new" },
  { label: "已有", value: "existing" },
  { label: "不绑定Fabric", value: "unbound" },
];

export const networkTypeOptions = [
  { label: "分布式", value: "distributed" },
  { label: "集中式", value: "centralized" },
];

export const underlayProtocolOptions = [
  { label: "OSPF", value: "ospf" },
  { label: "IS-IS", value: "isis" },
  { label: "BGP", value: "bgp" },
];

export const callhomeAuthOptions = [
  { label: "证书认证", value: "cert" },
  { label: "密码认证", value: "password" },
];

export const snmpAuthProtocolOptions = [
  { label: "HMAC_SHA2_256", value: "sha256" },
  { label: "HMAC_SHA1", value: "sha1" },
];

export const snmpEncryptOptions = [
  { label: "HMAC_SHA2_256", value: "sha256" },
  { label: "AES256", value: "aes256" },
];

export const deviceTabs = [
  { key: "device", label: "设备" },
  { key: "link", label: "链路" },
  { key: "interconnect", label: "互联" },
];

export const deviceSelectionList = [
  {
    deviceName: "Spine-01",
    deviceRole: "Spine",
    ztpLevel: "Underlay",
    deviceSerial: "2102351VNH10E5000017",
    deviceLocation: "DC1-R01-C03",
    mgmtIpv4: "10.1.1.11",
    vtepIpv4: "10.2.1.11",
    bypassIpv4: "10.3.1.11",
    bypassIpv6: "FC00::1011",
    vxlanBypassIpv4: "10.4.1.11",
    vtepMac: "04:F9:38:AD:10:11",
    ebgpAsNumber: "65001",
    bgpRouterId: "1.1.1.11",
    softwareVersion: "V800R021C00",
  },
  {
    deviceName: "Spine-02",
    deviceRole: "Spine",
    ztpLevel: "Underlay",
    deviceSerial: "2102351VNH10E5000018",
    deviceLocation: "DC1-R01-C04",
    mgmtIpv4: "10.1.1.12",
    vtepIpv4: "10.2.1.12",
    bypassIpv4: "10.3.1.12",
    bypassIpv6: "FC00::1012",
    vxlanBypassIpv4: "10.4.1.12",
    vtepMac: "04:F9:38:AD:10:12",
    ebgpAsNumber: "65001",
    bgpRouterId: "1.1.1.12",
    softwareVersion: "V800R021C00",
  },
  {
    deviceName: "Leaf-01",
    deviceRole: "Leaf",
    ztpLevel: "Overlay",
    deviceSerial: "2102351VNH10E5000019",
    deviceLocation: "DC1-R02-C01",
    mgmtIpv4: "10.1.1.13",
    vtepIpv4: "10.2.1.13",
    bypassIpv4: "10.3.1.13",
    bypassIpv6: "FC00::1013",
    vxlanBypassIpv4: "10.4.1.13",
    vtepMac: "04:F9:38:AD:10:13",
    ebgpAsNumber: "65002",
    bgpRouterId: "1.1.1.13",
    softwareVersion: "V800R021C00",
  },
  {
    deviceName: "Leaf-02",
    deviceRole: "Leaf",
    ztpLevel: "Overlay",
    deviceSerial: "2102351VNH10E5000020",
    deviceLocation: "DC1-R02-C02",
    mgmtIpv4: "10.1.1.14",
    vtepIpv4: "10.2.1.14",
    bypassIpv4: "10.3.1.14",
    bypassIpv6: "FC00::1014",
    vxlanBypassIpv4: "10.4.1.14",
    vtepMac: "04:F9:38:AD:10:14",
    ebgpAsNumber: "65002",
    bgpRouterId: "1.1.1.14",
    softwareVersion: "V800R021C00",
  },
  {
    deviceName: "Leaf-03",
    deviceRole: "Leaf",
    ztpLevel: "Overlay",
    deviceSerial: "2102351VNH10E5000021",
    deviceLocation: "DC1-R02-C03",
    mgmtIpv4: "10.1.1.15",
    vtepIpv4: "10.2.1.15",
    bypassIpv4: "10.3.1.15",
    bypassIpv6: "FC00::1015",
    vxlanBypassIpv4: "10.4.1.15",
    vtepMac: "04:F9:38:AD:10:15",
    ebgpAsNumber: "65002",
    bgpRouterId: "1.1.1.15",
    softwareVersion: "V800R022C00",
  },
  {
    deviceName: "Leaf-04",
    deviceRole: "Leaf",
    ztpLevel: "Overlay",
    deviceSerial: "2102351VNH10E5000022",
    deviceLocation: "DC1-R02-C04",
    mgmtIpv4: "10.1.1.16",
    vtepIpv4: "10.2.1.16",
    bypassIpv4: "10.3.1.16",
    bypassIpv6: "FC00::1016",
    vxlanBypassIpv4: "10.4.1.16",
    vtepMac: "04:F9:38:AD:10:16",
    ebgpAsNumber: "65002",
    bgpRouterId: "1.1.1.16",
    softwareVersion: "V800R022C00",
  },
  {
    deviceName: "Leaf-05",
    deviceRole: "Leaf",
    ztpLevel: "Overlay",
    deviceSerial: "2102351VNH10E5000023",
    deviceLocation: "DC1-R02-C05",
    mgmtIpv4: "10.1.1.17",
    vtepIpv4: "10.2.1.17",
    bypassIpv4: "10.3.1.17",
    bypassIpv6: "FC00::1017",
    vxlanBypassIpv4: "10.4.1.17",
    vtepMac: "04:F9:38:AD:10:17",
    ebgpAsNumber: "65002",
    bgpRouterId: "1.1.1.17",
    softwareVersion: "V800R022C00",
  },
  {
    deviceName: "Leaf-06",
    deviceRole: "Leaf",
    ztpLevel: "Overlay",
    deviceSerial: "2102351VNH10E5000024",
    deviceLocation: "DC1-R02-C06",
    mgmtIpv4: "10.1.1.18",
    vtepIpv4: "10.2.1.18",
    bypassIpv4: "10.3.1.18",
    bypassIpv6: "FC00::1018",
    vxlanBypassIpv4: "10.4.1.18",
    vtepMac: "04:F9:38:AD:10:18",
    ebgpAsNumber: "65002",
    bgpRouterId: "1.1.1.18",
    softwareVersion: "V800R022C00",
  },
  {
    deviceName: "Leaf-07",
    deviceRole: "Leaf",
    ztpLevel: "Overlay",
    deviceSerial: "2102351VNH10E5000025",
    deviceLocation: "DC1-R02-C07",
    mgmtIpv4: "10.1.1.19",
    vtepIpv4: "10.2.1.19",
    bypassIpv4: "10.3.1.19",
    bypassIpv6: "FC00::1019",
    vxlanBypassIpv4: "10.4.1.19",
    vtepMac: "04:F9:38:AD:10:19",
    ebgpAsNumber: "65002",
    bgpRouterId: "1.1.1.19",
    softwareVersion: "V800R022C00",
  },
  {
    deviceName: "Leaf-08",
    deviceRole: "Leaf",
    ztpLevel: "Overlay",
    deviceSerial: "2102351VNH10E5000026",
    deviceLocation: "DC1-R02-C08",
    mgmtIpv4: "10.1.1.20",
    vtepIpv4: "10.2.1.20",
    bypassIpv4: "10.3.1.20",
    bypassIpv6: "FC00::1020",
    vxlanBypassIpv4: "10.4.1.20",
    vtepMac: "04:F9:38:AD:10:20",
    ebgpAsNumber: "65002",
    bgpRouterId: "1.1.1.20",
    softwareVersion: "V800R022C00",
  },
];

export const headerToolIcons = [
  { name: "share-2", title: "网络拓扑" },
  { name: "search", title: "搜索" },
  { name: "circle-alert", title: "告警" },
  { name: "eye", title: "监控" },
  { name: "user", title: "用户" },
];

/* Devices missing an activation code (start-onboarding confirmation modal) */
export const unactivatedDevices = [
  { id: 1, deviceName: "EN800", deviceEsn: "56823456123365", hasActivationCode: "无" },
  { id: 2, deviceName: "EN800", deviceEsn: "56823456123365", hasActivationCode: "无" },
  { id: 3, deviceName: "EN800", deviceEsn: "56823456123365", hasActivationCode: "无" },
  { id: 4, deviceName: "EN800", deviceEsn: "56823456123365", hasActivationCode: "无" },
  { id: 5, deviceName: "EN800", deviceEsn: "56823456123365", hasActivationCode: "无" },
];

/* Fabric links between devices (sidebar 链路 tab) */
export const deviceLinkList = [
  {
    id: 1,
    linkId: "L-0001",
    srcDevice: "Spine-01",
    srcPort: "10GE1/0/1",
    dstDevice: "Leaf-01",
    dstPort: "10GE1/0/1",
    linkType: "Underlay",
    linkStatus: "Up",
  },
  {
    id: 2,
    linkId: "L-0002",
    srcDevice: "Spine-01",
    srcPort: "10GE1/0/2",
    dstDevice: "Leaf-02",
    dstPort: "10GE1/0/1",
    linkType: "Underlay",
    linkStatus: "Up",
  },
  {
    id: 3,
    linkId: "L-0003",
    srcDevice: "Spine-01",
    srcPort: "10GE1/0/3",
    dstDevice: "Leaf-03",
    dstPort: "10GE1/0/1",
    linkType: "Underlay",
    linkStatus: "Up",
  },
  {
    id: 4,
    linkId: "L-0004",
    srcDevice: "Spine-02",
    srcPort: "10GE1/0/1",
    dstDevice: "Leaf-04",
    dstPort: "10GE1/0/1",
    linkType: "Underlay",
    linkStatus: "Down",
  },
  {
    id: 5,
    linkId: "L-0005",
    srcDevice: "Spine-02",
    srcPort: "10GE1/0/2",
    dstDevice: "Leaf-05",
    dstPort: "10GE1/0/1",
    linkType: "Underlay",
    linkStatus: "Up",
  },
  {
    id: 6,
    linkId: "L-0006",
    srcDevice: "Leaf-01",
    srcPort: "10GE1/0/47",
    dstDevice: "Leaf-02",
    dstPort: "10GE1/0/47",
    linkType: "PeerLink",
    linkStatus: "Up",
  },
];

/* BGP interconnections (sidebar 互联 tab) */
export const deviceInterconnectList = [
  {
    id: 1,
    srcDevice: "Leaf-01",
    dstDevice: "Spine-01",
    connType: "IBGP",
    localIp: "10.2.1.13",
    remoteIp: "10.2.1.11",
    connStatus: "已建立",
  },
  {
    id: 2,
    srcDevice: "Leaf-02",
    dstDevice: "Spine-01",
    connType: "IBGP",
    localIp: "10.2.1.14",
    remoteIp: "10.2.1.11",
    connStatus: "已建立",
  },
  {
    id: 3,
    srcDevice: "Leaf-03",
    dstDevice: "Spine-01",
    connType: "IBGP",
    localIp: "10.2.1.15",
    remoteIp: "10.2.1.11",
    connStatus: "建立中",
  },
  {
    id: 4,
    srcDevice: "Leaf-04",
    dstDevice: "Spine-02",
    connType: "IBGP",
    localIp: "10.2.1.16",
    remoteIp: "10.2.1.12",
    connStatus: "建立中",
  },
  {
    id: 5,
    srcDevice: "Leaf-05",
    dstDevice: "Spine-02",
    connType: "IBGP",
    localIp: "10.2.1.17",
    remoteIp: "10.2.1.12",
    connStatus: "已建立",
  },
  {
    id: 6,
    srcDevice: "Leaf-06",
    dstDevice: "Spine-02",
    connType: "IBGP",
    localIp: "10.2.1.18",
    remoteIp: "10.2.1.12",
    connStatus: "未建立",
  },
];
