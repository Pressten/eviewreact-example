// Layer 2 — 业务受理（企业专线开通）字典与模拟数据

export const customerTypeOptions = [
  { value: "enterprise", label: "企业客户" },
  { value: "government", label: "政府机构" },
  { value: "institution", label: "事业单位" },
  { value: "campus", label: "校园客户" },
  { value: "individual", label: "个体工商户" },
];

export const industryOptions = [
  { value: "manufacture", label: "制造业" },
  { value: "finance", label: "金融保险" },
  { value: "medical", label: "医疗卫生" },
  { value: "education", label: "教育培训" },
  { value: "internet", label: "互联网 / 软件" },
  { value: "public", label: "公共事业" },
  { value: "logistics", label: "交通物流" },
  { value: "other", label: "其他行业" },
];

export const certTypeOptions = [
  { value: "uscc", label: "统一社会信用代码" },
  { value: "license", label: "营业执照注册号" },
  { value: "org", label: "组织机构代码证" },
];

export const managerOptions = [
  { value: "m-zhaolei", label: "赵磊（华南大区）" },
  { value: "m-sunqian", label: "孙倩（华东大区）" },
  { value: "m-liwei", label: "李威（华北大区）" },
  { value: "m-chenyu", label: "陈宇（西南大区）" },
  { value: "m-zhoumin", label: "周敏（政企直营）" },
];

export const serviceTypeOptions = [
  { value: "leased", label: "专线接入" },
  { value: "broadband", label: "宽带接入" },
  { value: "cloud", label: "云网互联" },
];

export const productOptions = [
  { value: "p-unicom-100", label: "精品专线 100M 商务版" },
  { value: "p-unicom-200", label: "精品专线 200M 商务版" },
  { value: "p-unicom-500", label: "精品专线 500M 旗舰版" },
  { value: "p-cloud-1g", label: "云专线 1G 尊享版" },
  { value: "p-mpls-50", label: "MPLS-VPN 50M 组网套餐" },
  { value: "p-fiber-1000", label: "全光宽带 1000M 企业版" },
];

export const bandwidthOptions = [
  { value: "10M", label: "10 Mbps" },
  { value: "20M", label: "20 Mbps" },
  { value: "50M", label: "50 Mbps" },
  { value: "100M", label: "100 Mbps" },
  { value: "200M", label: "200 Mbps" },
  { value: "500M", label: "500 Mbps" },
  { value: "1G", label: "1 Gbps" },
  { value: "10G", label: "10 Gbps" },
];

export const accessModeOptions = [
  { value: "fiber", label: "光纤直连" },
  { value: "fiber-ont", label: "光纤 + 光猫" },
  { value: "wireless", label: "无线备份接入" },
  { value: "mpls", label: "MPLS 专网接入" },
];

export const contractOptions = [
  { value: "12", label: "12 个月" },
  { value: "24", label: "24 个月" },
  { value: "36", label: "36 个月" },
  { value: "60", label: "60 个月" },
];

export const slaOptions = [
  { value: "standard", label: "标准级（5×8 响应）" },
  { value: "platinum", label: "白金级（7×12 响应）" },
  { value: "diamond", label: "钻石级（7×24 专属）" },
];

export const surveyOptions = [
  { value: "need", label: "需要现场勘查" },
  { value: "no", label: "无需勘查，直接施工" },
];

export const appointSlotOptions = [
  { value: "am", label: "上午 09:00 - 12:00" },
  { value: "pm", label: "下午 13:00 - 18:00" },
];

export const invoiceTypeOptions = [
  { value: "special", label: "增值税专用发票" },
  { value: "general", label: "增值税普通发票" },
  { value: "electronic", label: "电子普通发票" },
];

export const provinceOptions = [
  { value: "gd", label: "广东省" },
  { value: "js", label: "江苏省" },
  { value: "zj", label: "浙江省" },
  { value: "sd", label: "山东省" },
  { value: "sc", label: "四川省" },
  { value: "bj", label: "北京市" },
];

const CITY_MAP = {
  gd: [
    { value: "gz", label: "广州市" },
    { value: "sz", label: "深圳市" },
    { value: "dg", label: "东莞市" },
    { value: "fs", label: "佛山市" },
  ],
  js: [
    { value: "nj", label: "南京市" },
    { value: "sz-js", label: "苏州市" },
    { value: "wx", label: "无锡市" },
  ],
  zj: [
    { value: "hz", label: "杭州市" },
    { value: "nb", label: "宁波市" },
    { value: "wz", label: "温州市" },
  ],
  sd: [
    { value: "jn", label: "济南市" },
    { value: "qd", label: "青岛市" },
    { value: "wf", label: "潍坊市" },
  ],
  sc: [
    { value: "cd", label: "成都市" },
    { value: "my", label: "绵阳市" },
    { value: "dy", label: "德阳市" },
  ],
  bj: [
    { value: "cy", label: "朝阳区" },
    { value: "hd", label: "海淀区" },
    { value: "dc", label: "东城区" },
  ],
};

export const roomOptions = [
  { value: "room-a1", label: "华南枢纽机房 A1" },
  { value: "room-a2", label: "华南汇聚机房 A2" },
  { value: "room-b3", label: "华东核心机房 B3" },
  { value: "room-c1", label: "华北接入机房 C1" },
];

export function getCities(province) {
  return CITY_MAP[province] || [];
}

export function labelOf(options, value) {
  const hit = options.find((o) => o.value === value);
  return hit ? hit.label : "";
}

export const draftOrders = [
  { id: "EB20261008031", name: "深圳市智联科技有限公司", product: "精品专线 500M", status: "review", statusLabel: "待审核", time: "10-08 16:20" },
  { id: "EB20261007028", name: "杭州云启信息技术有限公司", product: "云专线 1G", status: "survey", statusLabel: "勘察中", time: "10-07 11:05" },
  { id: "EB20261006017", name: "成都锦江智慧医疗中心", product: "MPLS-VPN 50M", status: "accepted", statusLabel: "已受理", time: "10-06 09:42" },
  { id: "EB20261005009", name: "南京工业大学科技园", product: "全光宽带 1000M", status: "draft", statusLabel: "草稿", time: "10-05 15:30" },
  { id: "EB20261004002", name: "青岛海联物流有限公司", product: "精品专线 200M", status: "draft", statusLabel: "草稿", time: "10-04 10:18" },
];
