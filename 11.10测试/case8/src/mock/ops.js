// Layer 2: 气象与流量 / 不正常事件 mock —— 按基地机场
// 等级口径(气象预警 / 流量控制 / 不正常事件共用): urgent 紧急 / major 重要 / minor 一般
export const LEVEL_META = {
  urgent: { label: "紧急" },
  major: { label: "重要" },
  minor: { label: "一般" },
};

const t = (s) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));

// ---------------------------------------------------------------------------
// 本场天气 + 生效气象预警(条数与①顶部运行栏 Badge 联动)
// ---------------------------------------------------------------------------
export const WEATHER = {
  PEK: {
    weatherVis: "3,200 米",
    windDir: "320° / 12 m/s",
    windGust: "阵风 18 m/s",
    phenomenon: "雷暴伴短时强降水",
    temp: "18 ℃",
    qnh: "1002 hPa",
    alerts: [
      { level: "major", title: "雷雨警报", detail: "本场及终端区雷雨，预计持续至 18:00" },
      { level: "minor", title: "大风警报", detail: "侧风阵风 18 m/s，注意起降标准" },
      { level: "minor", title: "低能见度预警", detail: "短时 RVR 低于 1,500 米" },
    ],
  },
  PKX: {
    weatherVis: "5,000 米",
    windDir: "290° / 8 m/s",
    windGust: "无明显阵风",
    phenomenon: "多云",
    temp: "20 ℃",
    qnh: "1009 hPa",
    alerts: [
      { level: "major", title: "雷雨警报", detail: "终端区西北侧雷雨带东移，关注 17:00 后趋势" },
      { level: "minor", title: "低能见度预警", detail: "午后轻雾，RVR 短时 2,000 米" },
    ],
  },
  PVG: {
    weatherVis: "2,200 米",
    windDir: "150° / 14 m/s",
    windGust: "阵风 20 m/s",
    phenomenon: "中雨伴低云",
    temp: "21 ℃",
    qnh: "1004 hPa",
    alerts: [
      { level: "urgent", title: "台风外围预警", detail: "台风『海燕』外围螺旋雨带影响，预计 20:00 后增强" },
      { level: "major", title: "大风警报", detail: "侧风阵风 20 m/s，注意双跑道运行标准" },
      { level: "major", title: "低能见度预警", detail: "RVR 间歇低于 1,200 米" },
      { level: "minor", title: "雷雨警报", detail: "短时雷雨，伴中度颠簸" },
    ],
  },
};

// 流量控制 3 条 —— 内容 / 生效时段 / 影响等级
export const FLOW_CONTROLS = {
  PEK: [
    { content: "京沪航路 XMN-01 扇区容量限制", period: "15:00 – 18:00", level: "urgent" },
    { content: "虹桥机场进港航班削减 20%", period: "14:30 – 20:00", level: "major" },
    { content: "SZX 进港排序间隔加大", period: "16:00 – 19:00", level: "minor" },
  ],
  PKX: [
    { content: "大兴—虹桥走廊流量限制", period: "14:00 – 19:30", level: "major" },
    { content: "HGH 进港间隔 12 分钟", period: "13:30 – 18:00", level: "major" },
    { content: "SZX 出港排序放行", period: "16:30 – 21:00", level: "minor" },
  ],
  PVG: [
    { content: "沪蓉航路 W45 限制，绕飞计划受理", period: "15:00 – 22:00", level: "urgent" },
    { content: "浦东双跑道起降率下调 15%", period: "14:00 – 21:00", level: "major" },
    { content: "CSX 进港间隔加大", period: "17:00 – 20:00", level: "minor" },
  ],
};

// ---------------------------------------------------------------------------
// 不正常事件 6 条/机场 —— 机械故障/旅客疾病/鸟击/备降/超售/行李延误
// status: handling 处置中 / closed 已闭环；records 处置记录(点击展开)
// ---------------------------------------------------------------------------
export const EVENTS = {
  PEK: [
    {
      id: "PEV1", type: "备降", icon: "plane-landing", level: "urgent", status: "handling",
      flightId: "PK14", time: 942,
      summary: "HY1483 KMG→PEK 因首都雷雨备降天津，机上旅客 218 人",
      records: [
        { time: 942, text: "机组决定备降天津滨海机场，落地正常" },
        { time: 950, text: "签派协调天津地服，安排旅客下客休息" },
        { time: 965, text: "启动旅客改签：HY1620 转运 46 人，其余候补明日航班" },
        { time: 990, text: "加注航油并重新放行，预计 19:05 返京" },
      ],
    },
    {
      id: "PEV2", type: "机械故障", icon: "wrench", level: "major", status: "handling",
      flightId: "PK6", time: 800,
      summary: "HY1835 出港前 APU 指示故障，机务排故后放行，延误 70 分钟",
      records: [
        { time: 800, text: "APU 启动指示异常，MEL 评估" },
        { time: 825, text: "按 MEL 放行，地面气源车保障" },
        { time: 850, text: "舱单复核完毕，通知登机口推迟登机" },
      ],
    },
    {
      id: "PEV3", type: "旅客疾病", icon: "heart-pulse", level: "major", status: "closed",
      flightId: "PK10", time: 580,
      summary: "HY1721 机上旅客突发心悸，优先落地送医，体征平稳",
      records: [
        { time: 580, text: "机组报告 32C 旅客胸闷心悸，机上医生旅客协助" },
        { time: 615, text: "协调优先落地，地面救护车待命" },
        { time: 635, text: "落地后旅客送医，生命体征平稳，事件闭环" },
      ],
    },
    {
      id: "PEV4", type: "鸟击", icon: "bird", level: "minor", status: "closed",
      flightId: "PK12", time: 835,
      summary: "HY1626 西安落地后雷达罩鸟击残留，检查无损伤放行",
      records: [
        { time: 835, text: "机务绕机检查发现雷达罩鸟击残留" },
        { time: 855, text: "损伤评估无超标，清洁后正常放行" },
      ],
    },
    {
      id: "PEV5", type: "超售", icon: "ticket", level: "minor", status: "handling",
      flightId: "PK15", time: 830,
      summary: "HY1267 超售 3 人，正在征集自愿改签旅客",
      records: [
        { time: 830, text: "值机报告超售 3 人（V 舱超售）" },
        { time: 845, text: "广播征集自愿改签 HY1359，补偿 400 元" },
        { time: 870, text: "已改签 1 人，剩余 2 人候补中" },
      ],
    },
    {
      id: "PEV6", type: "行李延误", icon: "luggage", level: "major", status: "handling",
      flightId: "PK11", time: 760,
      summary: "HY1798 香港始发 12 件行李未同机到达，HY1797 带回",
      records: [
        { time: 760, text: "装卸报告 12 件行李滞留香港" },
        { time: 775, text: "通知旅客并登记配送地址，发放生活用品赔付" },
        { time: 800, text: "HY1797 预计 18:30 落地，行李 20:00 前送达" },
      ],
    },
  ],
  PKX: [
    {
      id: "KEV1", type: "备降", icon: "plane-landing", level: "urgent", status: "handling",
      flightId: "KX14", time: 912,
      summary: "HY2850 HRB→PKX 因大兴侧风超限备降石家庄，机上旅客 173 人",
      records: [
        { time: 912, text: "侧风超运行标准，机组决定备降石家庄正定" },
        { time: 925, text: "协调石家庄地服，旅客下客休息" },
        { time: 945, text: "气象会商：侧风预计 17:00 前回落至标准内" },
        { time: 985, text: "维持备降等待，17:30 前决定返场或取消" },
      ],
    },
    {
      id: "KEV2", type: "机械故障", icon: "wrench", level: "major", status: "handling",
      flightId: "KX2", time: 780,
      summary: "HY2531 起飞前起落架传感器故障，更换后放行，延误 55 分钟",
      records: [
        { time: 780, text: "起落架收上传感器信号异常" },
        { time: 810, text: "更换传感器并完成测试" },
        { time: 835, text: "放行签署完成，通知登机口恢复登机" },
      ],
    },
    {
      id: "KEV3", type: "旅客疾病", icon: "heart-pulse", level: "major", status: "closed",
      flightId: "KX10", time: 600,
      summary: "HY2821 机上旅客突发晕厥，提前通知急救，落地送医闭环",
      records: [
        { time: 600, text: "机组报告 18A 旅客晕厥，机上广播寻找医生" },
        { time: 625, text: "客舱吸氧观察，联系目的地优先着陆" },
        { time: 675, text: "落地送医，旅客恢复意识，事件闭环" },
      ],
    },
    {
      id: "KEV4", type: "鸟击", icon: "bird", level: "minor", status: "closed",
      flightId: "KX13", time: 685,
      summary: "HY2835 三亚起飞爬升阶段遭遇鸟群，落地检查无损伤",
      records: [
        { time: 685, text: "机组报告起飞爬升阶段穿越鸟群" },
        { time: 905, text: "落地后机务孔探检查，叶片无损伤放行" },
      ],
    },
    {
      id: "KEV5", type: "超售", icon: "ticket", level: "minor", status: "handling",
      flightId: "KX15", time: 840,
      summary: "HY2912 超售 2 人，征集自愿改签明日早班",
      records: [
        { time: 840, text: "值机报告超售 2 人（含 1 名金卡）" },
        { time: 855, text: "金卡旅客升舱解决，剩余 1 人改签评估中" },
      ],
    },
    {
      id: "KEV6", type: "行李延误", icon: "luggage", level: "major", status: "handling",
      flightId: "KX11", time: 770,
      summary: "HY2868 厦门 8 件行李未装机，货运协调 HY2869 带回",
      records: [
        { time: 770, text: "装卸交接单据确认 8 件行李滞留 XMN" },
        { time: 790, text: "通知旅客登记信息，发放临时用品" },
        { time: 815, text: "HY2869 预计 21:00 落地，行李当晚配送" },
      ],
    },
  ],
  PVG: [
    {
      id: "GEV1", type: "备降", icon: "plane-landing", level: "urgent", status: "handling",
      flightId: "PG13", time: 838,
      summary: "HY3654 SYX→PVG 因浦东雷雨备降杭州，机上旅客 233 人",
      records: [
        { time: 838, text: "浦东雷雨超出燃油余度，机组决定备降杭州萧山" },
        { time: 850, text: "协调杭州地服安排旅客下客休息" },
        { time: 865, text: "启动中转旅客保护：36 人改签 HO 航班" },
        { time: 890, text: "天气窗口 17:20，加注航油待放行返沪" },
      ],
    },
    {
      id: "GEV2", type: "机械故障", icon: "wrench", level: "major", status: "handling",
      flightId: "PG6", time: 780,
      summary: "HY3512 液压渗漏告警，检查后限速放行，延误 58 分钟",
      records: [
        { time: 780, text: "液压 B 系统渗漏告警，滑回机位检查" },
        { time: 805, text: "按 MEL 限速放行，重新制作性能计划" },
        { time: 830, text: "机务签署放行，重新组织登机" },
      ],
    },
    {
      id: "GEV3", type: "旅客疾病", icon: "heart-pulse", level: "major", status: "closed",
      flightId: "PG11", time: 690,
      summary: "HY3688 广州—浦东旅客突发腹痛，落地送医后闭环",
      records: [
        { time: 690, text: "乘务报告 21C 旅客持续腹痛，机上医疗协助" },
        { time: 715, text: "通知浦东急救提前待命" },
        { time: 755, text: "落地送医，诊断为急性肠胃炎，事件闭环" },
      ],
    },
    {
      id: "GEV4", type: "鸟击", icon: "bird", level: "minor", status: "closed",
      flightId: "PG12", time: 745,
      summary: "HY3715 哈尔滨起飞后遭遇鸟击，落地检查无损伤",
      records: [
        { time: 745, text: "机组报告离地后疑似鸟击，参数正常" },
        { time: 905, text: "落地后检查发动机叶片与雷达罩，无损伤放行" },
      ],
    },
    {
      id: "GEV5", type: "超售", icon: "ticket", level: "minor", status: "handling",
      flightId: "PG18", time: 915,
      summary: "HY3901 超售 4 人（含 2 名无陪），改签评估中",
      records: [
        { time: 915, text: "值机报告超售 4 人，含 2 名无陪儿童" },
        { time: 935, text: "无陪旅客优先保障本班成行" },
        { time: 955, text: "剩余 2 人征集中，备选 HY3905 改签" },
      ],
    },
    {
      id: "GEV6", type: "行李延误", icon: "luggage", level: "major", status: "handling",
      flightId: "PG14", time: 975,
      summary: "HY3826 昆明 15 件行李滞留，HY3827 当晚带回",
      records: [
        { time: 975, text: "昆明装卸确认 15 件行李未装机" },
        { time: 990, text: "通知旅客并登记，发放洗漱包与赔付券" },
        { time: 1010, text: "HY3827 预计 23:30 落地，行李次日 09:00 前送达" },
      ],
    },
  ],
};
